import { apiFetch } from "./api";

export interface VMConnection {
  id: string;
  label: string;
  agent_url: string;
  agent_secret: string;
  is_default: boolean;
  status: "connected" | "disconnected" | "error";
  last_checked?: string;
}

export interface AppConfig {
  id: string;
  connection_id: string;
  name: string;
  repo_url?: string;
  deploy_path: string;
  domain?: string;
  port: number;
  build_cmd?: string;
  status: "running" | "deploying" | "stopped" | "failed" | "idle";
  last_deployed?: string;
  auto_deploy?: boolean;
  webhook_secret?: string;
  env_vars?: Record<string, string>;
  created_at: string;
}

export type DeploymentTarget = AppConfig;

export interface DatabaseConfig {
  id: string;
  connection_id: string;
  engine: "postgresql" | "mysql" | "mariadb" | "redis" | "mongodb";
  container_name: string;
  port: number;
  db_name: string;
  db_user: string;
  db_password: string;
  status: "active" | "inactive" | "error";
  container_id?: string;
  app_id?: string;
}

export interface DeployLogEntry {
  timestamp: string;
  trigger: string;
  status: "success" | "failed";
  steps?: string[];
  error?: string;
  duration: number;
}

// --- API-backed CRUD ---

export async function getConnections(): Promise<VMConnection[]> {
  return apiFetch<VMConnection[]>("/api/connections");
}

export async function saveConnection(conn: Partial<VMConnection> & { label: string; agent_url: string; agent_secret: string }): Promise<VMConnection> {
  return apiFetch<VMConnection>("/api/connections", { method: "POST", body: JSON.stringify(conn) });
}

export async function updateConnection(id: string, updates: Partial<VMConnection>): Promise<VMConnection> {
  return apiFetch<VMConnection>(`/api/connections/${id}`, { method: "PUT", body: JSON.stringify(updates) });
}

export async function deleteConnection(id: string): Promise<void> {
  await apiFetch(`/api/connections/${id}`, { method: "DELETE" });
}

export async function getDefaultConnection(): Promise<VMConnection | undefined> {
  const conns = await getConnections();
  return conns.find(c => c.is_default);
}

export async function getApps(): Promise<AppConfig[]> {
  return apiFetch<AppConfig[]>("/api/apps");
}

export async function createApp(app: Partial<AppConfig>): Promise<AppConfig> {
  return apiFetch<AppConfig>("/api/apps", { method: "POST", body: JSON.stringify(app) });
}

export async function updateApp(id: string, updates: Partial<AppConfig>): Promise<AppConfig> {
  return apiFetch<AppConfig>(`/api/apps/${id}`, { method: "PUT", body: JSON.stringify(updates) });
}

export async function deleteApp(id: string): Promise<void> {
  await apiFetch(`/api/apps/${id}`, { method: "DELETE" });
}

export async function getDatabases(): Promise<DatabaseConfig[]> {
  return apiFetch<DatabaseConfig[]>("/api/databases");
}

export async function createDatabase(db: Partial<DatabaseConfig>): Promise<DatabaseConfig> {
  return apiFetch<DatabaseConfig>("/api/databases", { method: "POST", body: JSON.stringify(db) });
}

export async function updateDatabase(id: string, updates: Partial<DatabaseConfig>): Promise<DatabaseConfig> {
  return apiFetch<DatabaseConfig>(`/api/databases/${id}`, { method: "PUT", body: JSON.stringify(updates) });
}

export async function deleteDatabase(id: string): Promise<void> {
  await apiFetch(`/api/databases/${id}`, { method: "DELETE" });
}

// --- Agent communication (still direct from browser to agent) ---

export async function agentFetch<T = unknown>(
  connection: VMConnection,
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${connection.agent_url.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-agent-secret": connection.agent_secret,
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Agent error ${res.status}`);
  }
  return res.json();
}

export async function testConnection(connection: VMConnection): Promise<boolean> {
  try {
    const url = `${connection.agent_url.replace(/\/$/, '')}/health`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchDeployLogs(connection: VMConnection, appName: string): Promise<DeployLogEntry[]> {
  const result = await agentFetch<{ logs: DeployLogEntry[] }>(connection, `/deploy-log/${encodeURIComponent(appName)}`);
  return result.logs;
}

export async function fetchAppLogs(connection: VMConnection, appName: string, lines = 100): Promise<string> {
  const result = await agentFetch<{ logs: string }>(connection, `/apps/${encodeURIComponent(appName)}/logs?lines=${lines}`);
  return result.logs;
}

export async function fetchAppStatus(connection: VMConnection, appName: string): Promise<{ state: string; status: string; ports: string }> {
  return agentFetch(connection, `/apps/${encodeURIComponent(appName)}/status`);
}

export async function saveAppEnvVars(connection: VMConnection, appName: string, envVars: Record<string, string>): Promise<void> {
  await agentFetch(connection, `/apps/${encodeURIComponent(appName)}/env`, { method: "PUT", body: JSON.stringify({ envVars }) });
}

export function generateWebhookSecret(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function getNextAvailablePort(): Promise<number> {
  const apps = await getApps();
  const usedPorts = new Set(apps.map(a => a.port));
  let port = 3001;
  while (usedPorts.has(port)) port++;
  return port;
}

// Legacy compat aliases
export function saveConnections(_: VMConnection[]) { console.warn("saveConnections is deprecated, use saveConnection/updateConnection"); }
export function saveApps(_: AppConfig[]) { console.warn("saveApps is deprecated, use createApp/updateApp"); }
export function getDeployments() { return getApps(); }
export function saveDeployments(_: AppConfig[]) { console.warn("saveDeployments is deprecated"); }
export function saveDatabases(_: DatabaseConfig[]) { console.warn("saveDatabases is deprecated"); }

const STORAGE_KEY = "cloudpanel_config";

export interface VMConnection {
  id: string;
  label: string;
  agentUrl: string;
  agentSecret: string;
  isDefault: boolean;
  status: "connected" | "disconnected" | "error";
  lastChecked?: string;
}

export interface AppConfig {
  id: string;
  connectionId: string;
  name: string;
  repoUrl?: string;
  deployPath: string;
  domain?: string;
  port: number;
  buildCmd?: string;
  status: "running" | "deploying" | "stopped" | "failed" | "idle";
  lastDeployed?: string;
  autoDeploy?: boolean;
  webhookSecret?: string;
  envVars?: Record<string, string>;
  createdAt: string;
}

export type DeploymentTarget = AppConfig;

export interface DatabaseConfig {
  id: string;
  connectionId: string;
  engine: "postgresql" | "mysql" | "mariadb" | "redis" | "mongodb";
  containerName: string;
  port: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  status: "active" | "inactive" | "error";
  containerId?: string;
  appId?: string;
}

export interface DeployLogEntry {
  timestamp: string;
  trigger: string;
  status: "success" | "failed";
  steps?: string[];
  error?: string;
  duration: number;
}

interface StoreData {
  connections: VMConnection[];
  apps: AppConfig[];
  databases: DatabaseConfig[];
  deployments?: AppConfig[];
}

function load(): StoreData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { connections: [], apps: [], databases: [] };
  const data = JSON.parse(raw);
  if (data.deployments && !data.apps) {
    data.apps = data.deployments.map((d: any) => ({ ...d, createdAt: d.createdAt || new Date().toISOString() }));
    delete data.deployments;
  }
  if (!data.apps) data.apps = [];
  return data;
}

function save(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getConnections(): VMConnection[] { return load().connections; }
export function saveConnections(connections: VMConnection[]) { const d = load(); d.connections = connections; save(d); }
export function getDefaultConnection(): VMConnection | undefined { return getConnections().find(c => c.isDefault); }

export function getApps(): AppConfig[] { return load().apps; }
export function saveApps(apps: AppConfig[]) { const d = load(); d.apps = apps; save(d); }
export function getDeployments(): AppConfig[] { return getApps(); }
export function saveDeployments(apps: AppConfig[]) { saveApps(apps); }

export function getDatabases(): DatabaseConfig[] { return load().databases; }
export function saveDatabases(databases: DatabaseConfig[]) { const d = load(); d.databases = databases; save(d); }

export async function agentFetch<T = unknown>(
  connection: VMConnection,
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${connection.agentUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-agent-secret": connection.agentSecret,
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
    const url = `${connection.agentUrl.replace(/\/$/, '')}/health`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncDeployConfigToAgent(
  connection: VMConnection,
  app: AppConfig
): Promise<void> {
  await agentFetch(connection, `/deploy-configs/${app.id}`, {
    method: "PUT",
    body: JSON.stringify({
      id: app.id, name: app.name, repoUrl: app.repoUrl, deployPath: app.deployPath,
      port: app.port, domain: app.domain, buildCmd: app.buildCmd,
      autoDeploy: app.autoDeploy ?? true, webhookSecret: app.webhookSecret, envVars: app.envVars || {},
    }),
  });
}

export async function deleteDeployConfigFromAgent(
  connection: VMConnection,
  appId: string
): Promise<void> {
  await agentFetch(connection, `/deploy-configs/${appId}`, { method: "DELETE" });
}

export async function fetchDeployLogs(
  connection: VMConnection,
  appName: string
): Promise<DeployLogEntry[]> {
  const result = await agentFetch<{ logs: DeployLogEntry[] }>(connection, `/deploy-log/${encodeURIComponent(appName)}`);
  return result.logs;
}

export async function fetchAppLogs(
  connection: VMConnection,
  appName: string,
  lines = 100
): Promise<string> {
  const result = await agentFetch<{ logs: string }>(connection, `/apps/${encodeURIComponent(appName)}/logs?lines=${lines}`);
  return result.logs;
}

export async function fetchAppStatus(
  connection: VMConnection,
  appName: string
): Promise<{ state: string; status: string; ports: string }> {
  return agentFetch(connection, `/apps/${encodeURIComponent(appName)}/status`);
}

export async function saveAppEnvVars(
  connection: VMConnection,
  appName: string,
  envVars: Record<string, string>
): Promise<void> {
  await agentFetch(connection, `/apps/${encodeURIComponent(appName)}/env`, {
    method: "PUT",
    body: JSON.stringify({ envVars }),
  });
}

export function generateWebhookSecret(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export function getNextAvailablePort(): number {
  const apps = getApps();
  const usedPorts = new Set(apps.map(a => a.port));
  let port = 3001;
  while (usedPorts.has(port)) port++;
  return port;
}
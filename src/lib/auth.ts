import { apiFetch } from "./api";

const TOKEN_KEY = "cygnus_token";
const SESSION_KEY = "cygnus_auth";

export type UserRole = "admin" | "tenant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  workspace: string;
  created_at: string;
  last_login?: string;
  disabled?: boolean;
  max_apps?: number;
  max_databases?: number;
  storage_quota_mb?: number;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  workspace: string;
  loginAt: string;
}

export async function login(email: string, password: string): Promise<AuthSession | null> {
  try {
    const data = await apiFetch<{ token: string; session: AuthSession }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    return data.session;
  } catch {
    throw new Error("Could not reach API server. Check that it's running and accessible via HTTPS.");
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}

// Tenant management - all API-backed
export async function getAllUsers(): Promise<User[]> {
  return apiFetch<User[]>("/api/tenants");
}

export async function getTenants(): Promise<User[]> {
  return apiFetch<User[]>("/api/tenants");
}

export async function createTenant(data: {
  email: string;
  name: string;
  password: string;
  workspace: string;
  maxApps?: number;
  maxDatabases?: number;
  storageQuotaMb?: number;
}): Promise<User> {
  return apiFetch<User>("/api/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTenant(id: string, updates: Partial<User>): Promise<User> {
  return apiFetch<User>(`/api/tenants/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteTenant(id: string): Promise<void> {
  await apiFetch(`/api/tenants/${id}`, { method: "DELETE" });
}

export async function toggleTenantStatus(id: string): Promise<{ id: string; disabled: boolean }> {
  return apiFetch(`/api/tenants/${id}/toggle`, { method: "POST" });
}

export async function getTenantById(id: string): Promise<User | undefined> {
  const tenants = await getTenants();
  return tenants.find(u => u.id === id);
}

export async function changePassword(userId: string, newPassword: string): Promise<void> {
  await apiFetch("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
}

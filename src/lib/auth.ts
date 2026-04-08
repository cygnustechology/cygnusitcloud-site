const AUTH_KEY = "cygnus_auth";
const USERS_KEY = "cygnus_users";

export type UserRole = "admin" | "tenant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  workspace: string;
  createdAt: string;
  lastLogin?: string;
  disabled?: boolean;
  maxApps?: number;
  maxDatabases?: number;
  storageQuotaMb?: number;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  workspace: string;
  loginAt: string;
}

const DEFAULT_ADMIN: User = {
  id: "admin-001",
  email: "admin@cygnus.cloud",
  name: "Admin",
  role: "admin",
  password: "admin123",
  workspace: "__admin__",
  createdAt: new Date().toISOString(),
  maxApps: -1,
  maxDatabases: -1,
  storageQuotaMb: -1,
};

function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const users = [DEFAULT_ADMIN];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users;
  }
  const users = JSON.parse(raw);
  if (!users.find((u: User) => u.id === "admin-001")) {
    users.unshift(DEFAULT_ADMIN);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(email: string, password: string): AuthSession | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password && !u.disabled);
  if (!user) return null;

  user.lastLogin = new Date().toISOString();
  saveUsers(users);

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    workspace: user.workspace,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}

export function getAllUsers(): User[] {
  return getUsers();
}

export function getTenants(): User[] {
  return getUsers().filter(u => u.role === "tenant");
}

export function createTenant(data: {
  email: string;
  name: string;
  password: string;
  workspace: string;
  maxApps?: number;
  maxDatabases?: number;
  storageQuotaMb?: number;
}): User {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    throw new Error("Email already exists");
  }
  if (users.find(u => u.workspace === data.workspace)) {
    throw new Error("Workspace name already taken");
  }
  const tenant: User = {
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name,
    role: "tenant",
    password: data.password,
    workspace: data.workspace.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
    createdAt: new Date().toISOString(),
    maxApps: data.maxApps ?? 5,
    maxDatabases: data.maxDatabases ?? 3,
    storageQuotaMb: data.storageQuotaMb ?? 1024,
  };
  users.push(tenant);
  saveUsers(users);
  return tenant;
}

export function updateTenant(id: string, updates: Partial<User>) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) throw new Error("User not found");
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

export function deleteTenant(id: string) {
  const users = getUsers().filter(u => u.id !== id && u.id !== "admin-001");
  saveUsers([...getUsers().filter(u => u.id === "admin-001"), ...users.filter(u => u.id !== "admin-001")]);
}

export function toggleTenantStatus(id: string) {
  const users = getUsers();
  const user = users.find(u => u.id === id);
  if (!user || user.role === "admin") return;
  user.disabled = !user.disabled;
  saveUsers(users);
  return user;
}

export function getTenantById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function changePassword(userId: string, newPassword: string) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error("User not found");
  user.password = newPassword;
  saveUsers(users);
}
export interface Instance {
  id: string;
  name: string;
  type: "vm" | "database";
  status: "running" | "stopped" | "error";
  cpu: number;
  ram: number;
  disk: number;
  os?: string;
  dbEngine?: string;
  ip?: string;
  createdAt: string;
}

export const instances: Instance[] = [
  { id: "vm-001", name: "web-prod-01", type: "vm", status: "running", cpu: 4, ram: 8, disk: 80, os: "Ubuntu 22.04", ip: "10.0.1.10", createdAt: "2026-03-15" },
  { id: "vm-002", name: "api-staging", type: "vm", status: "running", cpu: 2, ram: 4, disk: 40, os: "Debian 12", ip: "10.0.1.11", createdAt: "2026-03-20" },
  { id: "vm-003", name: "dev-sandbox", type: "vm", status: "stopped", cpu: 1, ram: 2, disk: 20, os: "Ubuntu 24.04", ip: "10.0.1.12", createdAt: "2026-04-01" },
  { id: "db-001", name: "postgres-main", type: "database", status: "running", cpu: 2, ram: 4, disk: 100, dbEngine: "PostgreSQL 16", ip: "10.0.1.20", createdAt: "2026-03-10" },
  { id: "db-002", name: "redis-cache", type: "database", status: "running", cpu: 1, ram: 2, disk: 10, dbEngine: "Redis 7", ip: "10.0.1.21", createdAt: "2026-03-22" },
];

export const serverStats = {
  totalCpu: 16, usedCpu: 10, totalRam: 32, usedRam: 20, totalDisk: 500, usedDisk: 250,
  uptime: "42 days, 7h 23m", hostname: "host-node-01", ip: "103.152.12.106",
};
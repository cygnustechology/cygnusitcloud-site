import { useState, useEffect } from "react";
import { Cpu, MemoryStick, HardDrive, Clock, RefreshCw, WifiOff } from "lucide-react";
import { getDefaultConnection, agentFetch, VMConnection } from "@/lib/connections";
import ResourceBar from "./ResourceBar";

interface ServerStats {
  hostname: string; ip: string; totalCpu: number; usedCpu: number; totalRam: number; usedRam: number; totalDisk: number; usedDisk: number; uptime: string; cpuModel?: string; platform?: string; arch?: string;
}

const StatsOverview = () => {
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [conn, setConn] = useState<VMConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    const defaultConn = getDefaultConnection();
    setConn(defaultConn || null);
    if (!defaultConn) { setError("no-connection"); return; }
    setLoading(true); setError(null);
    try { const data = await agentFetch<ServerStats>(defaultConn, "/stats"); setStats(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to fetch stats"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  if (error === "no-connection") return (
    <div className="stat-card p-10 text-center space-y-3"><WifiOff className="w-10 h-10 text-muted-foreground mx-auto" /><div><p className="text-sm font-medium text-foreground">No VM Connected</p><p className="text-xs text-muted-foreground mt-1">Go to Settings to add a VM connection and see live stats</p></div></div>
  );
  if (error) return <div className="stat-card p-8 text-center space-y-3"><p className="text-sm text-destructive">{error}</p><button onClick={fetchStats} className="text-xs text-primary hover:underline">Retry</button></div>;
  if (!stats) return <div className="stat-card p-10 text-center"><RefreshCw className="w-6 h-6 text-primary mx-auto animate-spin" /><p className="text-sm text-muted-foreground mt-3">Loading stats...</p></div>;

  const statCards = [
    { label: "CPU", value: `${stats.usedCpu} / ${stats.totalCpu} cores`, icon: Cpu, percentage: Math.round((stats.usedCpu / stats.totalCpu) * 100) },
    { label: "Memory", value: `${stats.usedRam} / ${stats.totalRam} GB`, icon: MemoryStick, percentage: Math.round((stats.usedRam / stats.totalRam) * 100) },
    { label: "Disk", value: `${stats.usedDisk} / ${stats.totalDisk} GB`, icon: HardDrive, percentage: stats.totalDisk ? Math.round((stats.usedDisk / stats.totalDisk) * 100) : 0 },
    { label: "Uptime", value: stats.uptime, icon: Clock, percentage: -1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold text-foreground">Server Overview</h2><p className="text-sm text-muted-foreground font-mono mt-1">{stats.hostname} • {stats.ip}{conn && <span className="text-primary ml-2">({conn.label})</span>}</p></div>
        <button onClick={fetchStats} disabled={loading} className="p-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"><RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center"><stat.icon className="w-4 h-4 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-sm font-mono font-semibold text-foreground">{stat.value}</p></div>
            </div>
            {stat.percentage >= 0 && <div className="resource-bar"><div className={`resource-bar-fill ${stat.percentage > 85 ? "bg-destructive" : stat.percentage > 65 ? "bg-yellow-500" : "bg-primary"}`} style={{ width: `${stat.percentage}%` }} /></div>}
          </div>
        ))}
      </div>
      <div className="stat-card space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Resource Allocation</h3>
        <ResourceBar label="CPU" used={stats.usedCpu} total={stats.totalCpu} unit="cores" />
        <ResourceBar label="RAM" used={stats.usedRam} total={stats.totalRam} unit="GB" />
        <ResourceBar label="Disk" used={stats.usedDisk} total={stats.totalDisk} unit="GB" />
      </div>
    </div>
  );
};

export default StatsOverview;
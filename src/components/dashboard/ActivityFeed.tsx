import { useState, useEffect } from "react";
import { RefreshCw, Loader2, Activity } from "lucide-react";
import { getDefaultConnection, agentFetch, DeployLogEntry, VMConnection } from "@/lib/connections";

interface AllLogs { [appName: string]: DeployLogEntry[]; }

const ActivityFeed = () => {
  const [logs, setLogs] = useState<{ app: string; entry: DeployLogEntry }[]>([]);
  const [loading, setLoading] = useState(false);
  const [conn, setConn] = useState<VMConnection | null>(null);

  const loadLogs = async () => {
    const defaultConn = await getDefaultConnection();
    setConn(defaultConn || null);
    if (!defaultConn) return;
    setLoading(true);
    try {
      const result = await agentFetch<{ logs: AllLogs }>(defaultConn, "/deploy-logs");
      const flat = Object.entries(result.logs).flatMap(([app, entries]) => entries.map(entry => ({ app, entry })));
      flat.sort((a, b) => new Date(b.entry.timestamp).getTime() - new Date(a.entry.timestamp).getTime());
      setLogs(flat.slice(0, 50));
    } catch { setLogs([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadLogs(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold text-foreground">Activity</h2><p className="text-sm text-muted-foreground">Deploy history across all apps</p></div>
        <button onClick={loadLogs} disabled={loading} className="p-2 rounded-md hover:bg-secondary transition-colors">
          {loading ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <RefreshCw className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>
      {!conn && <div className="stat-card p-8 text-center"><Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">Connect a server in Settings to see deploy activity</p></div>}
      {conn && logs.length === 0 && !loading && <div className="stat-card p-8 text-center"><p className="text-sm text-muted-foreground">No deploy activity yet</p></div>}
      <div className="space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="stat-card flex items-center gap-4 py-3">
            <div className={`w-2 h-2 rounded-full shrink-0 ${log.entry.status === "success" ? "bg-green-500" : "bg-destructive"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="text-sm font-medium text-foreground">{log.app}</span><span className="text-[10px] text-muted-foreground">{log.entry.trigger}</span></div>
              {log.entry.steps && <p className="text-xs text-muted-foreground mt-0.5">{log.entry.steps.join(" → ")}</p>}
              {log.entry.error && <p className="text-xs text-destructive mt-0.5 truncate">{log.entry.error}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-muted-foreground font-mono">{new Date(log.entry.timestamp).toLocaleString()}</p>
              {log.entry.duration > 0 && <p className="text-[10px] text-muted-foreground">{Math.round(log.entry.duration / 1000)}s</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;

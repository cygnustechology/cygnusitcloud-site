import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { VMConnection, DeployLogEntry, fetchDeployLogs } from "@/lib/connections";

interface DeployHistoryProps { conn: VMConnection; appName: string; }

const DeployHistory = ({ conn, appName }: DeployHistoryProps) => {
  const [logs, setLogs] = useState<DeployLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => { setLoading(true); try { const result = await fetchDeployLogs(conn, appName); setLogs(result); } catch {} finally { setLoading(false); } };
  useEffect(() => { loadLogs(); }, [appName]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-foreground">Deploy History</p>
        <button onClick={loadLogs} disabled={loading} className="p-1 rounded-md hover:bg-secondary transition-colors">{loading ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /> : <RefreshCw className="w-3 h-3 text-muted-foreground" />}</button>
      </div>
      {logs.length === 0 && !loading && <p className="text-[10px] text-muted-foreground">No deploy history yet</p>}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {logs.slice(0, 10).map((log, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded-md bg-secondary/50 text-[10px]">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.status === 'success' ? 'bg-green-500' : 'bg-destructive'}`} />
            <span className="text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleString()}</span>
            <span className="text-foreground font-medium">{log.trigger}</span>
            {log.duration > 0 && <span className="text-muted-foreground ml-auto">{Math.round(log.duration / 1000)}s</span>}
            {log.error && <span className="text-destructive truncate max-w-[150px]" title={log.error}>{log.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeployHistory;
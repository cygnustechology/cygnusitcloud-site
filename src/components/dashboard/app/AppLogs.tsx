import { useState, useEffect, useRef } from "react";
import { RefreshCw, Loader2, Terminal } from "lucide-react";
import { AppConfig, VMConnection, fetchAppLogs } from "@/lib/connections";

interface AppLogsProps { app: AppConfig; conn?: VMConnection; }

const AppLogs = ({ app, conn }: AppLogsProps) => {
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState(100);
  const scrollRef = useRef<HTMLPreElement>(null);

  const loadLogs = async () => {
    if (!conn) return;
    setLoading(true);
    try { const result = await fetchAppLogs(conn, app.name, lines); setLogs(result); setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 50); }
    catch { setLogs("Failed to fetch logs."); } finally { setLoading(false); }
  };

  useEffect(() => { loadLogs(); }, [app.name, lines]);

  if (!conn) return <div className="stat-card p-8 text-center"><p className="text-sm text-muted-foreground">No server connection to fetch logs from</p></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Terminal className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-foreground">Container Logs</span></div>
        <div className="flex items-center gap-2">
          <select value={lines} onChange={e => setLines(Number(e.target.value))} className="px-2 py-1 rounded-md bg-secondary border border-border text-xs text-foreground focus:outline-none"><option value={50}>50 lines</option><option value={100}>100 lines</option><option value={500}>500 lines</option></select>
          <button onClick={loadLogs} disabled={loading} className="p-1.5 rounded-md hover:bg-secondary transition-colors">{loading ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <RefreshCw className="w-4 h-4 text-muted-foreground" />}</button>
        </div>
      </div>
      <pre ref={scrollRef} className="bg-foreground/95 border border-border rounded-lg p-4 text-xs font-mono text-background overflow-auto max-h-[500px] whitespace-pre-wrap">{logs || (loading ? "Loading..." : "No logs available")}</pre>
    </div>
  );
};

export default AppLogs;
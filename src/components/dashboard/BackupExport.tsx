import { useState } from "react";
import { Download, FileJson, Archive, Loader2, CheckCircle } from "lucide-react";
import { getApps, getConnections, getDatabases, agentFetch } from "@/lib/connections";
import { getAllUsers } from "@/lib/auth";
import { toast } from "sonner";

const BackupExport = () => {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportConfig = () => {
    setExporting("config");
    try {
      const data = { exportedAt: new Date().toISOString(), platform: "Cygnus Cloud", version: "1.0.0", connections: getConnections().map(c => ({ ...c, agentSecret: "***REDACTED***" })), apps: getApps(), databases: getDatabases(), tenants: getAllUsers().filter(u => u.role === "tenant").map(t => ({ ...t, password: "***REDACTED***" })) };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `cygnus-config-${new Date().toISOString().split("T")[0]}.json`; a.click(); URL.revokeObjectURL(url);
      toast.success("Config exported successfully");
    } catch { toast.error("Export failed"); } finally { setExporting(null); }
  };

  const exportFullBackup = async () => {
    setExporting("full");
    try {
      const connections = getConnections(); const defaultConn = connections.find(c => c.isDefault) || connections[0];
      if (!defaultConn) { toast.error("No VM connection configured."); setExporting(null); return; }
      try {
        const result = await agentFetch<{ downloadUrl?: string; backup?: string }>(defaultConn, "/backup/full", { method: "POST" });
        if (result.downloadUrl) { window.open(result.downloadUrl, "_blank"); toast.success("Backup download started"); }
        else if (result.backup) { const blob = new Blob([result.backup], { type: "application/zip" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `cygnus-full-backup-${new Date().toISOString().split("T")[0]}.zip`; a.click(); URL.revokeObjectURL(url); toast.success("Full backup downloaded"); }
      } catch { toast.info("Full backup via agent not yet configured. Exporting config instead..."); exportConfig(); }
    } catch { toast.error("Backup failed"); } finally { setExporting(null); }
  };

  const importConfig = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { try { const data = JSON.parse(ev.target?.result as string); if (data.platform !== "Cygnus Cloud") { toast.error("Invalid backup file"); return; } localStorage.setItem("cloudpanel_config", JSON.stringify({ connections: data.connections || [], apps: data.apps || [], databases: data.databases || [] })); toast.success("Config imported. Refresh the page to apply."); } catch { toast.error("Invalid JSON file"); } };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div><h3 className="text-sm font-semibold text-foreground">Backup & Export</h3><p className="text-xs text-muted-foreground mt-1">Download your platform data for portability and disaster recovery</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileJson className="w-5 h-5 text-primary" /></div>
          <div><p className="text-sm font-medium text-foreground">Config Export</p><p className="text-xs text-muted-foreground mt-1">JSON file with all settings</p></div>
          <button onClick={exportConfig} disabled={exporting === "config"} className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50">{exporting === "config" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Export Config</button>
        </div>
        <div className="stat-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Archive className="w-5 h-5 text-accent" /></div>
          <div><p className="text-sm font-medium text-foreground">Full Backup</p><p className="text-xs text-muted-foreground mt-1">ZIP with source code, database dumps</p></div>
          <button onClick={exportFullBackup} disabled={exporting === "full"} className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50">{exporting === "full" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />} Full Backup</button>
        </div>
        <div className="stat-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"><CheckCircle className="w-5 h-5 text-muted-foreground" /></div>
          <div><p className="text-sm font-medium text-foreground">Import Config</p><p className="text-xs text-muted-foreground mt-1">Restore from exported JSON</p></div>
          <button onClick={importConfig} className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-80"><Download className="w-3.5 h-3.5 rotate-180" /> Import Config</button>
        </div>
      </div>
    </div>
  );
};

export default BackupExport;
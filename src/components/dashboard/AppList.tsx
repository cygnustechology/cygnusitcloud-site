import { useState, useEffect } from "react";
import { Box, ExternalLink, GitBranch, Plus, Clock } from "lucide-react";
import { AppConfig, getApps, getConnections, VMConnection } from "@/lib/connections";
import { motion } from "framer-motion";

interface AppListProps {
  onSelectApp: (app: AppConfig) => void;
  onCreateApp: () => void;
}

const statusColors: Record<string, string> = {
  running: "running", deploying: "running", stopped: "stopped", failed: "error", idle: "stopped",
};

const statusLabels: Record<string, string> = {
  running: "Running", deploying: "Deploying…", stopped: "Stopped", failed: "Failed", idle: "Not deployed",
};

const AppList = ({ onSelectApp, onCreateApp }: AppListProps) => {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [connections, setConnections] = useState<VMConnection[]>([]);

  useEffect(() => {
    getApps().then(setApps).catch(() => {});
    getConnections().then(setConnections).catch(() => {});
  }, []);

  const getConnLabel = (id: string) => connections.find(c => c.id === id)?.label || "—";

  if (apps.length === 0) {
    return (
      <div className="stat-card p-16 text-center space-y-4">
        <Box className="w-12 h-12 text-muted-foreground mx-auto" />
        <div>
          <p className="text-lg font-semibold text-foreground">No apps yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first app to deploy it to your server</p>
        </div>
        <button onClick={onCreateApp} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Create App
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Your Apps</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{apps.length} app{apps.length !== 1 ? "s" : ""} deployed</p>
        </div>
        <button onClick={onCreateApp} className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all">
          <Plus className="w-3.5 h-3.5" /> Create App
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {apps.map((app, i) => (
          <motion.button key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => onSelectApp(app)} className="stat-card text-left hover:border-primary/40 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Box className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{app.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{getConnLabel(app.connection_id)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`status-dot ${statusColors[app.status]}`} />
                <span className="text-[10px] text-muted-foreground">{statusLabels[app.status]}</span>
              </div>
            </div>
            {app.domain && (
              <div className="flex items-center gap-1.5 text-xs text-primary mb-2">
                <ExternalLink className="w-3 h-3" />
                <span className="font-mono">{app.domain}</span>
              </div>
            )}
            {app.repo_url && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <GitBranch className="w-3 h-3" />
                <span className="font-mono truncate">{app.repo_url.replace("https://github.com/", "")}</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[10px] text-muted-foreground font-mono">Port {app.port}</span>
              {app.last_deployed && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(app.last_deployed).toLocaleDateString()}
                </div>
              )}
              {app.auto_deploy !== false && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">AUTO</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AppList;

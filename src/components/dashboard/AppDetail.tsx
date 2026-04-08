import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { AppConfig, VMConnection, getConnections, getApps, saveApps } from "@/lib/connections";
import AppOverview from "./app/AppOverview";
import AppDeploys from "./app/AppDeploys";
import AppSettings from "./app/AppSettings";
import AppLogs from "./app/AppLogs";
import AppDatabase from "./app/AppDatabase";

interface AppDetailProps {
  app: AppConfig;
  onBack: () => void;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "deploys", label: "Deploys" },
  { id: "logs", label: "Logs" },
  { id: "settings", label: "Settings" },
  { id: "database", label: "Database" },
];

const AppDetail = ({ app: initialApp, onBack }: AppDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [app, setApp] = useState(initialApp);
  const [conn, setConn] = useState<VMConnection | undefined>();

  useEffect(() => {
    const conns = getConnections();
    setConn(conns.find(c => c.id === app.connectionId));
  }, [app.connectionId]);

  const updateApp = (updated: AppConfig) => {
    setApp(updated);
    const apps = getApps().map(a => a.id === updated.id ? updated : a);
    saveApps(apps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-md hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{app.name}</h2>
          {app.domain && <p className="text-xs text-primary font-mono">{app.domain}</p>}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className={`status-dot ${app.status === "running" ? "running" : app.status === "failed" ? "error" : "stopped"}`} />
          <span className="text-xs text-muted-foreground capitalize">{app.status}</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <AppOverview app={app} conn={conn} />}
      {activeTab === "deploys" && <AppDeploys app={app} conn={conn} onUpdate={updateApp} />}
      {activeTab === "logs" && <AppLogs app={app} conn={conn} />}
      {activeTab === "settings" && <AppSettings app={app} conn={conn} onUpdate={updateApp} />}
      {activeTab === "database" && <AppDatabase app={app} />}
    </div>
  );
};

export default AppDetail;
import { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { AppConfig, DatabaseConfig, getDatabases } from "@/lib/connections";

interface AppDatabaseProps { app: AppConfig; }

const AppDatabase = ({ app }: AppDatabaseProps) => {
  const [databases, setDatabases] = useState<DatabaseConfig[]>([]);
  useEffect(() => { const all = getDatabases(); setDatabases(all.filter(db => db.appId === app.id || db.connectionId === app.connectionId)); }, [app.id, app.connectionId]);

  return (
    <div className="space-y-4">
      <div className="stat-card space-y-3">
        <div className="flex items-center gap-2"><Database className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-foreground">Linked Databases</span></div>
        {databases.length === 0 ? (
          <div className="py-6 text-center"><p className="text-xs text-muted-foreground">No databases linked to this app</p><p className="text-[10px] text-muted-foreground mt-1">Go to the Databases tab in the sidebar to create one</p></div>
        ) : (
          <div className="space-y-2">
            {databases.map(db => (
              <div key={db.id} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                <Database className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground">{db.dbName || db.containerName}</p><p className="text-xs text-muted-foreground font-mono">{db.engine} • port {db.port}</p></div>
                <div className={`status-dot ${db.status === "active" ? "running" : "stopped"}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDatabase;
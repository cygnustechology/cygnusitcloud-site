import { ExternalLink, GitBranch, Clock, Server, Globe, Terminal } from "lucide-react";
import { AppConfig, VMConnection } from "@/lib/connections";

interface AppOverviewProps { app: AppConfig; conn?: VMConnection; }

const AppOverview = ({ app, conn }: AppOverviewProps) => {
  const items = [
    { label: "Server", value: conn?.label || "—", icon: Server },
    { label: "Port", value: String(app.port), icon: Terminal },
    { label: "Domain", value: app.domain || "Not set", icon: Globe },
    { label: "Created", value: new Date(app.created_at).toLocaleDateString(), icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.label} className="stat-card">
            <div className="flex items-center gap-2 mb-2"><item.icon className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">{item.label}</span></div>
            <p className="text-sm font-mono font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
      {app.repo_url && (
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2"><GitBranch className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Repository</span></div>
          <a href={app.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-primary hover:underline flex items-center gap-1.5">{app.repo_url.replace("https://github.com/", "")}<ExternalLink className="w-3 h-3" /></a>
        </div>
      )}
      {app.domain && (
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2"><Globe className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Live URL</span></div>
          <a href={`http://${app.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-primary hover:underline flex items-center gap-1.5">{app.domain}<ExternalLink className="w-3 h-3" /></a>
        </div>
      )}
      {app.last_deployed && (
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Last Deployed</span></div>
          <p className="text-sm font-mono text-foreground">{new Date(app.last_deployed).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default AppOverview;

import { useState } from "react";
import { Rocket, Loader2, Copy, Check } from "lucide-react";
import { AppConfig, VMConnection, agentFetch, saveAppEnvVars } from "@/lib/connections";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import DeployHistory from "../deploy/DeployHistory";

interface AppDeploysProps { app: AppConfig; conn?: VMConnection; onUpdate: (app: AppConfig) => void; }

const AppDeploys = ({ app, conn, onUpdate }: AppDeploysProps) => {
  const [deploying, setDeploying] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const webhookUrl = conn ? `${conn.agent_url.replace(/\/$/, '')}/webhook/github` : "";

  const copy = (text: string, field: string) => { navigator.clipboard.writeText(text); setCopied(field); toast.success("Copied!"); setTimeout(() => setCopied(null), 2000); };

  const triggerDeploy = async () => {
    if (!conn) { toast.error("No connection"); return; }
    setDeploying(true); onUpdate({ ...app, status: "deploying" });
    try {
      const result = await agentFetch<{ success: boolean; steps: string[] }>(conn, "/deploy", { method: "POST", body: JSON.stringify({ name: app.name, repoUrl: app.repo_url, deployPath: app.deploy_path, port: app.port, domain: app.domain, buildCmd: app.build_cmd }) });
      onUpdate({ ...app, status: "running", last_deployed: new Date().toISOString() }); toast.success(`Deployed! ${result.steps.join(" → ")}`);
    } catch (err: unknown) { onUpdate({ ...app, status: "failed" }); toast.error(err instanceof Error ? err.message : "Deploy failed"); }
    finally { setDeploying(false); }
  };

  const toggleAutoDeploy = async () => {
    const updated = { ...app, auto_deploy: !app.auto_deploy }; onUpdate(updated);
    if (conn) {
      try {
        await agentFetch(conn, `/deploy-configs/${app.id}`, {
          method: "PUT",
          body: JSON.stringify({ id: app.id, name: app.name, repoUrl: app.repo_url, deployPath: app.deploy_path, port: app.port, domain: app.domain, buildCmd: app.build_cmd, autoDeploy: updated.auto_deploy ?? true, webhookSecret: app.webhook_secret, envVars: app.env_vars || {} }),
        });
        toast.success(`Auto-deploy ${updated.auto_deploy ? "enabled" : "disabled"}`);
      } catch { toast.error("Failed to sync"); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="stat-card flex items-center justify-between">
        <div><p className="text-sm font-medium text-foreground">Manual Deploy</p><p className="text-xs text-muted-foreground mt-0.5">Pull latest code, build, and restart</p></div>
        <button onClick={triggerDeploy} disabled={deploying || !conn} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50">
          {deploying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />} Deploy Now
        </button>
      </div>
      <div className="stat-card flex items-center justify-between">
        <div><p className="text-sm font-medium text-foreground">Auto-Deploy on Push</p><p className="text-xs text-muted-foreground mt-0.5">Automatically deploy when GitHub receives a push</p></div>
        <Switch checked={app.auto_deploy !== false} onCheckedChange={toggleAutoDeploy} />
      </div>
      {webhookUrl && (
        <div className="stat-card space-y-3">
          <p className="text-sm font-medium text-foreground">GitHub Webhook Setup</p>
          <p className="text-xs text-muted-foreground">Go to your GitHub repo → Settings → Webhooks → Add webhook</p>
          <div className="space-y-1.5"><label className="text-[10px] text-muted-foreground uppercase tracking-wider">Payload URL</label>
            <div className="flex items-center gap-2"><code className="flex-1 px-3 py-1.5 rounded-md bg-secondary text-xs font-mono text-foreground truncate">{webhookUrl}</code>
              <button onClick={() => copy(webhookUrl, "url")} className="p-1.5 rounded-md hover:bg-secondary transition-colors shrink-0">{copied === "url" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}</button></div></div>
          {app.webhook_secret && (
            <div className="space-y-1.5"><label className="text-[10px] text-muted-foreground uppercase tracking-wider">Secret</label>
              <div className="flex items-center gap-2"><code className="flex-1 px-3 py-1.5 rounded-md bg-secondary text-xs font-mono text-foreground truncate">{app.webhook_secret}</code>
                <button onClick={() => copy(app.webhook_secret!, "secret")} className="p-1.5 rounded-md hover:bg-secondary transition-colors shrink-0">{copied === "secret" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}</button></div></div>
          )}
          <p className="text-[10px] text-muted-foreground">Content type: <code className="text-foreground">application/json</code> • Events: <code className="text-foreground">Just the push event</code></p>
        </div>
      )}
      {conn && <div className="stat-card"><DeployHistory conn={conn} appName={app.name} /></div>}
    </div>
  );
};

export default AppDeploys;

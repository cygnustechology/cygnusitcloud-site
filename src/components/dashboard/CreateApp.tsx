import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Rocket } from "lucide-react";
import { VMConnection, AppConfig, getConnections, getApps, saveApps, getNextAvailablePort, generateWebhookSecret, syncDeployConfigToAgent } from "@/lib/connections";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface CreateAppProps {
  onBack: () => void;
  onCreated: (app: AppConfig) => void;
}

const steps = ["Name & Repo", "Config", "Review"];

const CreateApp = ({ onBack, onCreated }: CreateAppProps) => {
  const [connections, setConnections] = useState<VMConnection[]>([]);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const [form, setForm] = useState({
    connectionId: "", name: "", repoUrl: "", domain: "", port: 3001, buildCmd: "npm run build", deployPath: "",
  });

  useEffect(() => {
    const conns = getConnections();
    setConnections(conns);
    const defaultConn = conns.find(c => c.isDefault) || conns[0];
    setForm(f => ({ ...f, connectionId: defaultConn?.id || "", port: getNextAvailablePort() }));
  }, []);

  const webhookSecret = generateWebhookSecret();

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.connectionId;
    return true;
  };

  const handleCreate = async () => {
    const app: AppConfig = {
      id: crypto.randomUUID(), connectionId: form.connectionId,
      name: form.name.trim().toLowerCase().replace(/\s+/g, "-"),
      repoUrl: form.repoUrl || undefined,
      deployPath: form.deployPath || `/opt/cloudpanel/apps/${form.name.trim().toLowerCase().replace(/\s+/g, "-")}`,
      domain: form.domain || undefined, port: form.port, buildCmd: form.buildCmd || undefined,
      status: "idle", autoDeploy: true, webhookSecret, envVars: {}, createdAt: new Date().toISOString(),
    };
    const apps = [...getApps(), app];
    saveApps(apps);
    toast.success(`App "${app.name}" created!`);
    const conn = connections.find(c => c.id === form.connectionId);
    if (conn) {
      try { await syncDeployConfigToAgent(conn, app); } catch { toast.error("Saved locally but failed to sync to agent"); }
    }
    onCreated(app);
  };

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success("Copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const conn = connections.find(c => c.id === form.connectionId);
  const webhookUrl = conn ? `${conn.agentUrl.replace(/\/$/, '')}/webhook/github` : "";
  const inputClass = "w-full px-3 py-2.5 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  if (connections.length === 0) {
    return (
      <div className="stat-card p-12 text-center space-y-4">
        <Rocket className="w-10 h-10 text-muted-foreground mx-auto" />
        <p className="text-sm font-medium text-foreground">No server connected</p>
        <p className="text-xs text-muted-foreground">Add a VM connection in Settings first, then come back to create an app.</p>
        <button onClick={onBack} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-80">Go to Settings</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </button>
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="stat-card space-y-5">
        {step === 0 && (
          <>
            <h3 className="text-sm font-semibold text-foreground">Name & Repository</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">App Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="my-awesome-app" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">GitHub Repository URL</label>
                <input type="text" value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} placeholder="https://github.com/user/repo.git" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Server</label>
                <select value={form.connectionId} onChange={e => setForm({ ...form, connectionId: e.target.value })} className={inputClass}>
                  {connections.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h3 className="text-sm font-semibold text-foreground">Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Domain (optional)</label>
                <input type="text" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} placeholder="myapp.example.com" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Port</label>
                <input type="number" value={form.port} onChange={e => setForm({ ...form, port: Number(e.target.value) })} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Build Command</label>
                <input type="text" value={form.buildCmd} onChange={e => setForm({ ...form, buildCmd: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Deploy Path</label>
                <input type="text" value={form.deployPath} onChange={e => setForm({ ...form, deployPath: e.target.value })} placeholder={`/opt/cloudpanel/apps/${form.name || "app"}`} className={inputClass} />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="text-sm font-semibold text-foreground">Review & Create</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-muted-foreground">App Name</span><p className="font-mono text-foreground">{form.name}</p></div>
                <div><span className="text-xs text-muted-foreground">Server</span><p className="text-foreground">{connections.find(c => c.id === form.connectionId)?.label}</p></div>
                <div><span className="text-xs text-muted-foreground">Port</span><p className="font-mono text-foreground">{form.port}</p></div>
                <div><span className="text-xs text-muted-foreground">Domain</span><p className="font-mono text-foreground">{form.domain || "—"}</p></div>
                {form.repoUrl && <div className="col-span-2"><span className="text-xs text-muted-foreground">Repo</span><p className="font-mono text-foreground truncate">{form.repoUrl}</p></div>}
              </div>
              {webhookUrl && (
                <div className="pt-3 border-t border-border space-y-2">
                  <p className="text-xs font-medium text-foreground">GitHub Webhook (set up after creating)</p>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Payload URL</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-1.5 rounded-md bg-secondary text-xs font-mono text-foreground truncate">{webhookUrl}</code>
                      <button onClick={() => copyText(webhookUrl, "url")} className="p-1.5 rounded-md hover:bg-secondary transition-colors shrink-0">
                        {copied === "url" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Secret</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-1.5 rounded-md bg-secondary text-xs font-mono text-foreground truncate">{webhookSecret}</code>
                      <button onClick={() => copyText(webhookSecret, "secret")} className="p-1.5 rounded-md hover:bg-secondary transition-colors shrink-0">
                        {copied === "secret" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => step > 0 ? setStep(step - 1) : onBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-80">
            <ArrowLeft className="w-3.5 h-3.5" /> {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={handleCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
              <Rocket className="w-3.5 h-3.5" /> Create App
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateApp;
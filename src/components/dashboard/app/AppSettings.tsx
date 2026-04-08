import { useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { AppConfig, VMConnection, syncDeployConfigToAgent, saveAppEnvVars } from "@/lib/connections";
import { toast } from "sonner";

interface AppSettingsProps { app: AppConfig; conn?: VMConnection; onUpdate: (app: AppConfig) => void; }

const AppSettings = ({ app, conn, onUpdate }: AppSettingsProps) => {
  const [form, setForm] = useState({ repoUrl: app.repoUrl || "", domain: app.domain || "", port: app.port, buildCmd: app.buildCmd || "npm run build", deployPath: app.deployPath });
  const [envVars, setEnvVars] = useState<[string, string][]>(Object.entries(app.envVars || {}));
  const [newKey, setNewKey] = useState(""); const [newVal, setNewVal] = useState(""); const [saving, setSaving] = useState(false);
  const inputClass = "w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  const handleSaveConfig = async () => {
    setSaving(true);
    const envObj = Object.fromEntries(envVars);
    const updated: AppConfig = { ...app, repoUrl: form.repoUrl || undefined, domain: form.domain || undefined, port: form.port, buildCmd: form.buildCmd || undefined, deployPath: form.deployPath, envVars: envObj };
    onUpdate(updated);
    if (conn) { try { await syncDeployConfigToAgent(conn, updated); await saveAppEnvVars(conn, app.name, envObj); toast.success("Settings synced to server"); } catch { toast.error("Saved locally but failed to sync"); } }
    else { toast.success("Settings saved locally"); }
    setSaving(false);
  };

  const addEnvVar = () => { if (!newKey.trim()) return; setEnvVars([...envVars, [newKey.trim(), newVal]]); setNewKey(""); setNewVal(""); };
  const removeEnvVar = (idx: number) => { setEnvVars(envVars.filter((_, i) => i !== idx)); };

  return (
    <div className="space-y-6">
      <div className="stat-card space-y-4">
        <h3 className="text-sm font-semibold text-foreground">App Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5"><label className="text-xs text-muted-foreground">GitHub Repo URL</label><input type="text" value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} placeholder="https://github.com/user/repo.git" className={inputClass} /></div>
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Domain</label><input type="text" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} placeholder="myapp.example.com" className={inputClass} /></div>
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Port</label><input type="number" value={form.port} onChange={e => setForm({ ...form, port: Number(e.target.value) })} className={inputClass} /></div>
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Build Command</label><input type="text" value={form.buildCmd} onChange={e => setForm({ ...form, buildCmd: e.target.value })} className={inputClass} /></div>
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Deploy Path</label><input type="text" value={form.deployPath} onChange={e => setForm({ ...form, deployPath: e.target.value })} className={inputClass} /></div>
        </div>
      </div>
      <div className="stat-card space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Environment Variables</h3>
        <p className="text-xs text-muted-foreground">These are injected into the container at deploy time</p>
        <div className="space-y-2">
          {envVars.map(([key, val], i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={key} readOnly className={`${inputClass} bg-muted/50 w-1/3`} />
              <input type="text" value={val} onChange={e => { const updated = [...envVars]; updated[i] = [key, e.target.value]; setEnvVars(updated); }} className={`${inputClass} flex-1`} />
              <button onClick={() => removeEnvVar(i)} className="p-2 rounded-md hover:bg-secondary transition-colors"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input type="text" value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="KEY" className={`${inputClass} w-1/3`} />
            <input type="text" value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="value" className={`${inputClass} flex-1`} onKeyDown={e => e.key === "Enter" && addEnvVar()} />
            <button onClick={addEnvVar} className="p-2 rounded-md hover:bg-secondary transition-colors"><Plus className="w-3.5 h-3.5 text-primary" /></button>
          </div>
        </div>
      </div>
      <button onClick={handleSaveConfig} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
      </button>
    </div>
  );
};

export default AppSettings;
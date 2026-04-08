import { useState, useEffect } from "react";
import { Server, Plus, Trash2, Wifi, WifiOff, Eye, EyeOff, Star, Pencil, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { VMConnection, getConnections, saveConnections, testConnection } from "@/lib/connections";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const ConnectionSettings = () => {
  const [connections, setConnections] = useState<VMConnection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "", agentUrl: "", agentSecret: "" });

  useEffect(() => { setConnections(getConnections()); }, []);

  const persist = (updated: VMConnection[]) => { setConnections(updated); saveConnections(updated); };
  const resetForm = () => { setForm({ label: "", agentUrl: "", agentSecret: "" }); setEditingId(null); setShowForm(false); };

  const handleSave = () => {
    if (!form.label.trim() || !form.agentUrl.trim() || !form.agentSecret.trim()) { toast.error("Please fill in all required fields"); return; }
    if (editingId) {
      persist(connections.map(c => c.id === editingId ? { ...c, ...form } : c));
      toast.success("Connection updated");
    } else {
      const newConn: VMConnection = { id: crypto.randomUUID(), ...form, isDefault: connections.length === 0, status: "disconnected" };
      persist([...connections, newConn]);
      toast.success("Connection added");
    }
    resetForm();
  };

  const startEdit = (conn: VMConnection) => { setForm({ label: conn.label, agentUrl: conn.agentUrl, agentSecret: conn.agentSecret }); setEditingId(conn.id); setShowForm(true); };

  const deleteConnection = (id: string) => {
    const updated = connections.filter(c => c.id !== id);
    if (updated.length > 0 && !updated.some(c => c.isDefault)) updated[0].isDefault = true;
    persist(updated); toast.success("Connection removed");
  };

  const setDefault = (id: string) => { persist(connections.map(c => ({ ...c, isDefault: c.id === id }))); toast.success("Default connection updated"); };

  const handleTest = async (id: string) => {
    setTesting(id);
    const conn = connections.find(c => c.id === id);
    if (!conn) { setTesting(null); return; }
    const ok = await testConnection(conn);
    const updated = connections.map(c => c.id === id ? { ...c, status: (ok ? "connected" : "error") as VMConnection["status"], lastChecked: new Date().toISOString() } : c);
    persist(updated); setTesting(null);
    if (ok) toast.success("Agent is reachable!"); else toast.error("Could not reach agent.");
  };

  const extractHost = (url: string) => { try { return new URL(url).host; } catch { return url; } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-sm font-semibold text-foreground">VM Connections</h3><p className="text-xs text-muted-foreground mt-1">Connect to VMs running the CloudPanel Agent</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Connection
        </button>
      </div>
      <div className="stat-card border-primary/20 text-xs text-muted-foreground space-y-1.5">
        <p className="font-medium text-foreground text-sm">Setup Instructions</p>
        <p>1. Download <code className="px-1 py-0.5 rounded bg-secondary font-mono text-primary">/cloudpanel-agent.js</code> to your VM</p>
        <p>2. Run: <code className="px-1 py-0.5 rounded bg-secondary font-mono text-primary">npm init -y && npm install express cors && node cloudpanel-agent.js</code></p>
        <p>3. Set <code className="px-1 py-0.5 rounded bg-secondary font-mono text-primary">AGENT_SECRET</code> env var and enter the matching secret below</p>
        <p>4. Agent URL format: <code className="px-1 py-0.5 rounded bg-secondary font-mono text-primary">http://YOUR_IP:9090</code></p>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="stat-card space-y-4">
              <h4 className="text-sm font-medium text-foreground">{editingId ? "Edit" : "New"} Connection</h4>
              <div className="space-y-4">
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Label *</label><input type="text" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="My Production Server" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Agent URL *</label><input type="text" value={form.agentUrl} onChange={e => setForm({ ...form, agentUrl: e.target.value })} placeholder="http://103.152.12.106:9090" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Agent Secret *</label>
                  <div className="relative">
                    <input type={showPasswords["form"] ? "text" : "password"} value={form.agentSecret} onChange={e => setForm({ ...form, agentSecret: e.target.value })} placeholder="Your AGENT_SECRET value" className="w-full px-3 py-2 pr-10 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, form: !p.form }))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                      {showPasswords["form"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">{editingId ? "Update" : "Save"} Connection</button>
                <button onClick={resetForm} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-80">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3">
        <AnimatePresence>
          {connections.map(conn => (
            <motion.div key={conn.id} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className={`stat-card flex items-center gap-4 ${conn.isDefault ? "border-primary/30" : ""}`}>
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0"><Server className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{conn.label}</p>
                  {conn.isDefault && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">DEFAULT</span>}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{extractHost(conn.agentUrl)}</p>
                {conn.lastChecked && <p className="text-[10px] text-muted-foreground mt-0.5">Checked: {new Date(conn.lastChecked).toLocaleString()}</p>}
              </div>
              <div className="flex items-center gap-1.5">
                {conn.status === "connected" ? <CheckCircle className="w-4 h-4 text-green-500" /> : conn.status === "error" ? <XCircle className="w-4 h-4 text-destructive" /> : <div className="status-dot stopped" />}
                <button onClick={() => handleTest(conn.id)} disabled={testing === conn.id} className="p-1.5 rounded-md hover:bg-secondary transition-colors disabled:opacity-50" title="Test">
                  {testing === conn.id ? <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" /> : <Wifi className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                {!conn.isDefault && <button onClick={() => setDefault(conn.id)} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Set default"><Star className="w-3.5 h-3.5 text-muted-foreground" /></button>}
                <button onClick={() => startEdit(conn)} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                <button onClick={() => deleteConnection(conn.id)} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {connections.length === 0 && !showForm && (
          <div className="stat-card p-10 text-center">
            <WifiOff className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No VM connections configured</p>
            <p className="text-xs text-muted-foreground mt-1">Install the agent on your VM and add a connection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionSettings;
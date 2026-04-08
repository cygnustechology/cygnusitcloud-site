import { useState, useEffect } from "react";
import { Database, Plus, Trash2, Play, Square, Loader2 } from "lucide-react";
import { DatabaseConfig, getDatabases, getConnections, VMConnection, agentFetch, createDatabase as apiCreateDatabase, deleteDatabase as apiDeleteDatabase, updateDatabase as apiUpdateDatabase } from "@/lib/connections";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const engines = [
  { id: "postgresql" as const, label: "PostgreSQL", defaultPort: 5432 },
  { id: "mysql" as const, label: "MySQL", defaultPort: 3306 },
  { id: "mariadb" as const, label: "MariaDB", defaultPort: 3306 },
  { id: "redis" as const, label: "Redis", defaultPort: 6379 },
  { id: "mongodb" as const, label: "MongoDB", defaultPort: 27017 },
];

const DatabaseSettings = () => {
  const [databases, setDatabases] = useState<DatabaseConfig[]>([]);
  const [connections, setConnections] = useState<VMConnection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ connectionId: "", engine: "postgresql" as DatabaseConfig["engine"], containerName: "", port: 5432, dbName: "", dbUser: "", dbPassword: "" });

  const reload = async () => {
    try { const [dbs, conns] = await Promise.all([getDatabases(), getConnections()]); setDatabases(dbs); setConnections(conns); } catch {}
  };
  useEffect(() => { reload(); }, []);

  const handleCreate = async () => {
    if (!form.connectionId || !form.containerName.trim() || !form.dbName.trim()) { toast.error("Please fill in all required fields"); return; }
    const conn = connections.find(c => c.id === form.connectionId);
    if (!conn) { toast.error("Connection not found"); return; }
    setCreating(true);
    try {
      const result = await agentFetch<{ success: boolean; containerId?: string }>(conn, "/databases", { method: "POST", body: JSON.stringify({ engine: form.engine, name: form.containerName, port: form.port, dbName: form.dbName, dbUser: form.dbUser, dbPassword: form.dbPassword }) });
      await apiCreateDatabase({ connection_id: form.connectionId, engine: form.engine, container_name: form.containerName, port: form.port, db_name: form.dbName, db_user: form.dbUser, db_password: form.dbPassword, container_id: result.containerId });
      toast.success(`Database "${form.dbName}" created on ${conn.label}`);
      setShowForm(false);
      setForm({ connectionId: "", engine: "postgresql", containerName: "", port: 5432, dbName: "", dbUser: "", dbPassword: "" });
      reload();
    } catch (err: unknown) { toast.error(`Failed: ${err instanceof Error ? err.message : "Unknown error"}`); }
    finally { setCreating(false); }
  };

  const deleteDb = async (db: DatabaseConfig) => {
    const conn = connections.find(c => c.id === db.connection_id);
    if (conn && db.container_id) { try { await agentFetch(conn, `/containers/${db.container_id}/remove`, { method: "POST" }); } catch {} }
    await apiDeleteDatabase(db.id); toast.success("Database removed"); reload();
  };

  const toggleDb = async (db: DatabaseConfig) => {
    const conn = connections.find(c => c.id === db.connection_id);
    if (!conn || !db.container_id) return;
    const action = db.status === "active" ? "stop" : "start";
    try {
      await agentFetch(conn, `/containers/${db.container_id}/${action}`, { method: "POST" });
      await apiUpdateDatabase(db.id, { status: action === "stop" ? "inactive" : "active" });
      toast.success(`Database ${action}ed`); reload();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
  };

  const getConnLabel = (id: string) => connections.find(c => c.id === id)?.label || "—";
  const getConnHost = (id: string) => { const c = connections.find(c2 => c2.id === id); try { return c ? new URL(c.agent_url).hostname : "—"; } catch { return "—"; } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-sm font-semibold text-foreground">Database Sources</h3><p className="text-xs text-muted-foreground mt-1">Provision databases as Docker containers on your VMs</p></div>
        <button onClick={() => setShowForm(true)} disabled={connections.length === 0} className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50">
          <Plus className="w-3.5 h-3.5" /> Add Database
        </button>
      </div>
      {connections.length === 0 && <div className="stat-card p-6 text-center border-yellow-500/30"><p className="text-sm text-yellow-600">Add a VM connection first in the Connections section above</p></div>}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="stat-card space-y-4">
              <h4 className="text-sm font-medium text-foreground">New Database</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">VM Connection *</label><select value={form.connectionId} onChange={e => setForm({ ...form, connectionId: e.target.value })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"><option value="">Select VM...</option>{connections.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Engine *</label><select value={form.engine} onChange={e => { const eng = e.target.value as DatabaseConfig["engine"]; setForm({ ...form, engine: eng, port: engines.find(en => en.id === eng)?.defaultPort || 5432 }); }} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">{engines.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Container Name *</label><input type="text" value={form.containerName} onChange={e => setForm({ ...form, containerName: e.target.value })} placeholder="postgres-main" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Port</label><input type="number" value={form.port} onChange={e => setForm({ ...form, port: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Database Name</label><input type="text" value={form.dbName} onChange={e => setForm({ ...form, dbName: e.target.value })} placeholder="myapp_db" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">DB Username</label><input type="text" value={form.dbUser} onChange={e => setForm({ ...form, dbUser: e.target.value })} placeholder="postgres" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="col-span-2 space-y-1.5"><label className="text-xs text-muted-foreground">DB Password</label><input type="password" value={form.dbPassword} onChange={e => setForm({ ...form, dbPassword: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleCreate} disabled={creating} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50">{creating && <Loader2 className="w-3 h-3 animate-spin" />} Create Database</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-80">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3">
        {databases.map(db => (
          <motion.div key={db.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0"><Database className="w-5 h-5 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{db.db_name || db.container_name}</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{engines.find(e => e.id === db.engine)?.label} • {getConnHost(db.connection_id)}:{db.port} • {getConnLabel(db.connection_id)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`status-dot ${db.status === "active" ? "running" : "stopped"}`} />
              <button onClick={() => toggleDb(db)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">{db.status === "active" ? <Square className="w-3.5 h-3.5 text-yellow-500" /> : <Play className="w-3.5 h-3.5 text-green-500" />}</button>
              <button onClick={() => deleteDb(db)} className="p-1.5 rounded-md hover:bg-secondary transition-colors"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DatabaseSettings;

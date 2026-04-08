import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Shield, ShieldOff, Pencil, X, UserPlus, AlertTriangle } from "lucide-react";
import { getTenants, createTenant, deleteTenant, toggleTenantStatus, updateTenant, User } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const AdminPanel = () => {
  const [tenants, setTenants] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", name: "", password: "", workspace: "", maxApps: 5, maxDatabases: 3, storageQuotaMb: 1024 });

  const reload = async () => { try { setTenants(await getTenants()); } catch {} };
  useEffect(() => { reload(); }, []);

  const resetForm = () => { setForm({ email: "", name: "", password: "", workspace: "", maxApps: 5, maxDatabases: 3, storageQuotaMb: 1024 }); setEditingId(null); setShowForm(false); };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateTenant(editingId, { email: form.email, name: form.name, workspace: form.workspace, max_apps: form.maxApps, max_databases: form.maxDatabases, storage_quota_mb: form.storageQuotaMb });
        toast.success("Tenant updated");
      } else {
        if (!form.email || !form.name || !form.password || !form.workspace) { toast.error("Fill all required fields"); return; }
        await createTenant(form); toast.success("Tenant created");
      }
      resetForm(); reload();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
  };

  const startEdit = (t: User) => { setForm({ email: t.email, name: t.name, password: "", workspace: t.workspace, maxApps: t.max_apps ?? 5, maxDatabases: t.max_databases ?? 3, storageQuotaMb: t.storage_quota_mb ?? 1024 }); setEditingId(t.id); setShowForm(true); };
  const handleDelete = async (id: string) => { if (!confirm("Delete this tenant and all their data?")) return; await deleteTenant(id); toast.success("Tenant deleted"); reload(); };
  const handleToggle = async (id: string) => { await toggleTenantStatus(id); reload(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold text-foreground">Tenant Management</h2><p className="text-sm text-muted-foreground mt-0.5">{tenants.length} tenant{tenants.length !== 1 ? "s" : ""} registered</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"><UserPlus className="w-3.5 h-3.5" /> Add Tenant</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div><div><p className="text-xs text-muted-foreground">Total Tenants</p><p className="text-lg font-bold text-foreground">{tenants.length}</p></div></div></div>
        <div className="stat-card"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-md bg-green-500/10 flex items-center justify-center"><Shield className="w-4 h-4 text-green-500" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold text-foreground">{tenants.filter(t => !t.disabled).length}</p></div></div></div>
        <div className="stat-card"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-md bg-yellow-500/10 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-yellow-500" /></div><div><p className="text-xs text-muted-foreground">Disabled</p><p className="text-lg font-bold text-foreground">{tenants.filter(t => t.disabled).length}</p></div></div></div>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="stat-card space-y-4">
              <div className="flex items-center justify-between"><h4 className="text-sm font-medium text-foreground">{editingId ? "Edit" : "New"} Tenant</h4><button onClick={resetForm} className="p-1 hover:bg-secondary rounded"><X className="w-4 h-4 text-muted-foreground" /></button></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Workspace ID *</label><input type="text" value={form.workspace} onChange={e => setForm({ ...form, workspace: e.target.value })} placeholder="johns-workspace" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">{editingId ? "New Password (blank = keep)" : "Password *"}</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Max Apps</label><input type="number" value={form.maxApps} onChange={e => setForm({ ...form, maxApps: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Max Databases</label><input type="number" value={form.maxDatabases} onChange={e => setForm({ ...form, maxDatabases: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" /></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">{editingId ? "Update" : "Create"} Tenant</button>
                <button onClick={resetForm} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-80">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3">
        {tenants.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`stat-card flex items-center gap-4 ${t.disabled ? "opacity-60" : ""}`}>
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><p className="text-sm font-medium text-foreground">{t.name}</p>{t.disabled && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive">DISABLED</span>}</div>
              <p className="text-xs text-muted-foreground">{t.email}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">workspace: {t.workspace} • max apps: {t.max_apps} • joined: {new Date(t.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => handleToggle(t.id)} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title={t.disabled ? "Enable" : "Disable"}>{t.disabled ? <Shield className="w-3.5 h-3.5 text-green-500" /> : <ShieldOff className="w-3.5 h-3.5 text-yellow-500" />}</button>
              <button onClick={() => startEdit(t)} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
            </div>
          </motion.div>
        ))}
        {tenants.length === 0 && !showForm && <div className="stat-card p-10 text-center"><Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">No tenants yet</p><p className="text-xs text-muted-foreground mt-1">Create a tenant to let them manage apps</p></div>}
      </div>
    </div>
  );
};

export default AdminPanel;

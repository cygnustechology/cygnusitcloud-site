import { Box, Database, Activity, Settings, Plus, Users, HelpCircle, LogOut } from "lucide-react";
import { AuthSession } from "@/lib/auth";
import cygnusLogo from "@/assets/cygnus-logo.png";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  session: AuthSession;
  onLogout: () => void;
}

const Sidebar = ({ activeView, onNavigate, session, onLogout }: SidebarProps) => {
  const isAdmin = session?.role === "admin";

  const navItems = [
    { id: "apps", label: "Apps", icon: Box },
    { id: "databases", label: "Databases", icon: Database },
    { id: "activity", label: "Activity", icon: Activity },
    ...(isAdmin ? [{ id: "tenants", label: "Tenants", icon: Users }] : []),
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & Docs", icon: HelpCircle },
  ];

  return (
    <aside className="w-60 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-30">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <img src={cygnusLogo} alt="Cygnus Cloud" className="h-8 w-auto" />
        </div>
        <p className="text-[10px] text-sidebar-foreground mt-1.5 tracking-wider uppercase font-heading">Cloud Platform</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-item w-full ${activeView === item.id ? "active" : ""}`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 space-y-2 border-t border-sidebar-border">
        <button
          onClick={() => onNavigate("create-app")}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-heading transition-all hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Create App
        </button>

        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">{session?.name?.[0]?.toUpperCase() || "?"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{session?.name || "User"}</p>
            <p className="text-[10px] text-sidebar-foreground capitalize">{session?.role || "—"}</p>
          </div>
          <button onClick={onLogout} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Logout">
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
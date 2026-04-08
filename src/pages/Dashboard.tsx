import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import AppList from "@/components/dashboard/AppList";
import AppDetail from "@/components/dashboard/AppDetail";
import CreateApp from "@/components/dashboard/CreateApp";
import ConnectionSettings from "@/components/dashboard/ConnectionSettings";
import DatabaseSettings from "@/components/dashboard/DatabaseSettings";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatsOverview from "@/components/dashboard/StatsOverview";
import AdminPanel from "@/components/dashboard/AdminPanel";
import HelpSection from "@/components/dashboard/HelpSection";
import BackupExport from "@/components/dashboard/BackupExport";
import { AppConfig } from "@/lib/connections";
import { getSession, logout, AuthSession } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

const viewTitles: Record<string, string> = {
  apps: "Apps", "app-detail": "App Detail", "create-app": "Create App",
  databases: "Databases", activity: "Activity", tenants: "Tenant Management",
  settings: "Settings", help: "Help & Documentation",
};

const Dashboard = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeView, setActiveView] = useState("apps");
  const [selectedApp, setSelectedApp] = useState<AppConfig | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setSession(getSession()); setAuthChecked(true); }, []);

  useEffect(() => { if (authChecked && !session) navigate("/login"); }, [authChecked, session, navigate]);

  const handleLogout = () => { logout(); setSession(null); navigate("/"); };

  if (!authChecked || !session) return null;

  const handleSelectApp = (app: AppConfig) => { setSelectedApp(app); setActiveView("app-detail"); };
  const handleBackToApps = () => { setSelectedApp(null); setActiveView("apps"); };
  const handleAppCreated = (app: AppConfig) => { setSelectedApp(app); setActiveView("app-detail"); };

  const renderContent = () => {
    switch (activeView) {
      case "apps": return <AppList onSelectApp={handleSelectApp} onCreateApp={() => setActiveView("create-app")} />;
      case "app-detail": return selectedApp ? <AppDetail app={selectedApp} onBack={handleBackToApps} /> : null;
      case "create-app": return <CreateApp onBack={handleBackToApps} onCreated={handleAppCreated} />;
      case "databases": return <DatabaseSettings />;
      case "activity": return <ActivityFeed />;
      case "tenants": return session.role === "admin" ? <AdminPanel /> : null;
      case "settings": return (<div className="space-y-8"><ConnectionSettings /><div className="border-t border-border pt-8"><BackupExport /></div><div className="border-t border-border pt-8"><StatsOverview /></div></div>);
      case "help": return <HelpSection />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeView={activeView} onNavigate={setActiveView} session={session} onLogout={handleLogout} />
      <div className="ml-60">
        <Header title={viewTitles[activeView] || "Cygnus Cloud"} session={session} />
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeView + (selectedApp?.id || "")} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
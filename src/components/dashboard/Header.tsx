import { Bell, User } from "lucide-react";
import { AuthSession } from "@/lib/auth";

interface HeaderProps {
  title: string;
  session?: AuthSession;
  onLogout?: () => void;
}

const Header = ({ title, session }: HeaderProps) => (
  <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
    <h1 className="text-sm font-semibold text-foreground">{title}</h1>
    <div className="flex items-center gap-3">
      {session && (
        <span className="text-xs text-muted-foreground font-mono">
          {session.workspace !== "__admin__" ? `workspace: ${session.workspace}` : "admin"}
        </span>
      )}
      <button className="p-2 rounded-md hover:bg-secondary transition-colors relative">
        <Bell className="w-4 h-4 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
      </button>
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
        <User className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  </header>
);

export default Header;
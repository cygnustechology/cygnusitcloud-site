import { useState } from "react";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "@/lib/auth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/CTS_Logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login(email, password);
      if (session) { navigate("/dashboard"); } else { setError("Invalid email or password"); }
    } catch { setError("Connection error. Is the API server running?"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="Cygnus Technology Solutions" className="h-12 w-auto mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mt-1">Sign in to your cloud platform</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-5 space-y-4 shadow-sm">
          {error && (<div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20"><AlertCircle className="w-4 h-4 text-destructive shrink-0" /><p className="text-xs text-destructive">{error}</p></div>)}
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="w-full px-3 py-2.5 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-3 py-2.5 pr-10 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-cygnus-red text-white text-sm font-heading hover:opacity-90 disabled:opacity-50 transition-all">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>
          <div className="pt-2 border-t border-border"><p className="text-[10px] text-muted-foreground text-center">Contact your administrator for access</p></div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;

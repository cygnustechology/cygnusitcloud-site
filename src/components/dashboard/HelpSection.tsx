import { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, Rocket, Server, Box, Database, Users, Shield, Download, GitBranch, Globe, Terminal, Key, Zap, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpTopic { id: string; icon: React.ElementType; title: string; sections: { heading: string; content: string }[]; }

const helpTopics: HelpTopic[] = [
  { id: "quickstart", icon: Rocket, title: "Quick Start Guide", sections: [
    { heading: "Getting Started", content: `1. **Login** with your admin credentials\n2. **Go to Settings** → Add a VM Connection\n3. **Create an App** → Enter app name, GitHub repo URL, domain\n4. **Set up GitHub Webhook** → Copy webhook URL and secret\n5. **Deploy** → Push code to GitHub or click "Deploy Now"` },
  ]},
  { id: "apps", icon: Box, title: "App Management", sections: [{ heading: "Creating an App", content: "Use the Create App wizard to set up name, repo, domain, and build command." }]},
  { id: "deploy", icon: GitBranch, title: "Deployment & Publishing", sections: [{ heading: "Auto-Deploy via GitHub Webhook", content: "Set up a webhook from your GitHub repo to auto-deploy on push." }]},
  { id: "domains", icon: Globe, title: "Domains & Shared Hosting", sections: [{ heading: "How Shared IP Hosting Works", content: "All apps share the same server IP. Nginx routes traffic by domain name." }]},
  { id: "databases", icon: Database, title: "Databases", sections: [{ heading: "Supported Engines", content: "PostgreSQL, MySQL, MariaDB, Redis, MongoDB — all as Docker containers." }]},
  { id: "tenants", icon: Users, title: "Multi-Tenancy", sections: [{ heading: "Tenant Model", content: "Each tenant gets a dedicated workspace, isolated apps, and resource quotas." }]},
  { id: "security", icon: Shield, title: "Security", sections: [{ heading: "Agent Security", content: "All communication is authenticated via x-agent-secret header." }]},
  { id: "automation", icon: Zap, title: "Automation", sections: [{ heading: "Lovable → GitHub → Production", content: "Edit in Lovable → auto-pushed to GitHub → auto-deployed to your server." }]},
];

const HelpSection = () => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>("quickstart");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = searchQuery ? helpTopics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.sections.some(s => s.heading.toLowerCase().includes(searchQuery.toLowerCase()) || s.content.toLowerCase().includes(searchQuery.toLowerCase()))) : helpTopics;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold text-foreground">Help & Documentation</h2><p className="text-sm text-muted-foreground mt-0.5">Everything you need to know about Cygnus Cloud</p></div>
        <HelpCircle className="w-4 h-4 text-muted-foreground" />
      </div>
      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search help topics..." className="w-full px-4 py-2.5 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      <div className="space-y-2">
        {filteredTopics.map(topic => (
          <div key={topic.id} className="stat-card !p-0 overflow-hidden">
            <button onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition-colors">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0"><topic.icon className="w-4 h-4 text-primary" /></div>
              <span className="text-sm font-medium text-foreground flex-1">{topic.title}</span>
              {expandedTopic === topic.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {expandedTopic === topic.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                    {topic.sections.map((section, i) => (
                      <div key={i} className="space-y-2">
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">{section.heading}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpSection;
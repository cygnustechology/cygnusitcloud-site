import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="gradient-navy py-10 border-t border-primary/20">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal" />
          <span className="text-sm font-semibold text-primary-foreground">CygnusITCloud</span>
        </div>
        <p className="text-xs text-primary-foreground/50 text-center">
          © {new Date().getFullYear()} Cygnus Technology Solutions Sdn. Bhd. All rights reserved. Malaysia's Sovereign Private Cloud.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

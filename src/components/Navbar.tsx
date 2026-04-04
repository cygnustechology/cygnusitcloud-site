import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Solutions", href: "#solutions" },
  { label: "Features", href: "#features" },
  { label: "Compliance", href: "#compliance" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-navy border-b border-primary/20">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <a href="#home" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-teal" />
          <div>
            <span className="text-lg font-bold text-primary-foreground tracking-tight font-heading">
              CygnusITCloud
            </span>
            <span className="hidden sm:block text-[10px] text-teal leading-none">
              Sovereign Private Cloud
            </span>
          </div>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-primary-foreground/80 hover:text-teal transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
          <Button
            asChild
            size="sm"
            className="bg-teal hover:bg-teal/90 text-accent-foreground font-semibold"
          >
            <a href="#contact">Get a Quote</a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden gradient-navy border-t border-primary/20 pb-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm text-primary-foreground/80 hover:text-teal transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="px-6 pt-2">
            <Button
              asChild
              size="sm"
              className="w-full bg-teal hover:bg-teal/90 text-accent-foreground font-semibold"
            >
              <a href="#contact" onClick={() => setOpen(false)}>Get a Quote</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

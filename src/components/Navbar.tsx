import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/CTS_Logo.png";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <a href="#home" className="flex items-center">
          <img src={logo} alt="Cygnus Technology Solutions" className="h-10 md:h-12 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-foreground hover:text-cygnus-red transition-colors font-medium uppercase tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <Button
            asChild
            size="sm"
            className="bg-cygnus-red hover:bg-cygnus-red/90 text-accent-foreground font-semibold uppercase tracking-wide"
          >
            <a href="#contact">Get a Quote</a>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-cygnus-red text-cygnus-red hover:bg-cygnus-red hover:text-white font-semibold uppercase tracking-wide"
          >
            <a href="/login">Login</a>
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border pb-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm text-foreground hover:text-cygnus-red transition-colors uppercase tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <div className="px-6 pt-2">
            <Button
              asChild
              size="sm"
              className="w-full bg-cygnus-red hover:bg-cygnus-red/90 text-accent-foreground font-semibold uppercase tracking-wide"
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

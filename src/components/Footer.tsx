import logo from "@/assets/CTS_Logo.png";

const Footer = () => (
  <footer className="gradient-dark py-10 border-t border-primary-foreground/10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={logo} alt="Cygnus Technology Solutions" className="h-8 w-auto brightness-0 invert" />
        <p className="text-xs text-primary-foreground/50 text-center">
          &copy; {new Date().getFullYear()} Cygnus Technology Solutions Sdn. Bhd. [202001030021 (1386341-K)]. All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

import { motion } from "framer-motion";
import { Shield, Award, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section id="home" className="relative gradient-navy pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
    {/* Subtle grid overlay */}
    <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: "linear-gradient(hsl(175 45% 38% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(175 45% 38% / 0.3) 1px, transparent 1px)",
      backgroundSize: "60px 60px"
    }} />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-gold" />
          <span className="text-sm font-semibold text-gold tracking-wide uppercase">
            Award-Winning Cloud Provider
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
          Malaysia's Sovereign{" "}
          <span className="text-gradient-teal">Private Cloud</span>
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mb-4 font-body">
          PDPA 2010 &amp; 2024 Amendment compliant cloud infrastructure with Data Protection
          Officer (DPO) assurance — purpose-built for Malaysian enterprises.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <Shield className="w-4 h-4 text-teal" />
            <span>PDPA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <Server className="w-4 h-4 text-teal" />
            <span>1M IOPS SSD</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <Award className="w-4 h-4 text-teal" />
            <span>DPO Assured</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="bg-teal hover:bg-teal/90 text-accent-foreground font-semibold text-base px-8"
          >
            <a href="#solutions">Explore Solutions</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8"
          >
            <a href="#compliance">View Compliance</a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;

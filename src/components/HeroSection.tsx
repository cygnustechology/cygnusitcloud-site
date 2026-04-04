import { motion } from "framer-motion";
import { Shield, Award, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section
    id="home"
    className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden"
  >
    {/* Background image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-foreground/75" />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Award className="w-5 h-5 text-cygnus-red" />
          <span className="text-sm font-semibold text-cygnus-red tracking-wide uppercase">
            Award-Winning Cloud Provider
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading text-primary-foreground leading-tight mb-6">
          Malaysia's Sovereign{" "}
          <span className="text-cygnus-red">Private Cloud</span>
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-4 text-justify-all text-center">
          Malaysia's Award-Winning Private Cloud Hosting for Secure Computing and Accounting Software-hosting.
          <br />
          Purpose-built for Malaysian Enterprises
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <Shield className="w-4 h-4 text-cygnus-red" />
            <span>PDPA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <Server className="w-4 h-4 text-cygnus-red" />
            <span>1M IOPS SSD</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <Award className="w-4 h-4 text-cygnus-red" />
            <span>DPO Assured</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-cygnus-red hover:bg-cygnus-red/90 text-accent-foreground font-semibold text-base px-8 uppercase tracking-wide"
          >
            <a href="#solutions">Explore Solutions</a>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-semibold text-base px-8 uppercase tracking-wide"
          >
            <a href="#compliance">View Compliance</a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;

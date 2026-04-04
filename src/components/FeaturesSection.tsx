import { motion } from "framer-motion";
import { Zap, AppWindow, Camera, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Enterprise-Grade SSD - Up to 1M IOPS",
    description:
      "Our storage infrastructure delivers up to 1 million IOPS - far exceeding typical VM providers. Ideal for demanding database workloads and transactional applications.",
  },
  {
    icon: AppWindow,
    title: "Host .exe Applications in the Cloud",
    description:
      "Specifically engineered to run on-premise Windows applications (accounting, HR, ERP) without local servers. Seamless remote access with enterprise reliability.",
  },
  {
    icon: Camera,
    title: "7-Day Snapshot Backups",
    description:
      "Automated daily snapshots with 7-day retention ensure rapid recovery and data protection. Point-in-time restores minimize downtime and data loss.",
  },
  {
    icon: ShieldCheck,
    title: "Full PDPA Compliance & Data Sovereignty",
    description:
      "100% Malaysia-based infrastructure ensures your data never leaves the country. Compliant with PDPA 2010 (Act 709) and the 2024 Amendment Act.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-20 md:py-28 bg-cygnus-light">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-cygnus-red uppercase tracking-wider">Features</span>
        <h2 className="text-3xl md:text-4xl font-heading text-foreground mt-3 mb-4">
          Technical Strengths
        </h2>
        <p className="text-muted-foreground text-center">
          Infrastructure built for performance, governance, and regulatory assurance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-4"
          >
            <div className="shrink-0 w-12 h-12 rounded-lg bg-cygnus-red flex items-center justify-center">
              <f.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-heading text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-justify-all">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;

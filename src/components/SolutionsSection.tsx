import { motion } from "framer-motion";
import { Monitor, Globe, Phone, Database, LayoutDashboard, HardDrive } from "lucide-react";

const solutions = [
  {
    icon: Monitor,
    title: "Application Hosting",
    description:
      "Host .exe accounting & HR applications — SQL Accounting, MYOB, Autocount, UBS, Million — without local servers. 7-day snapshot backups included.",
  },
  {
    icon: Globe,
    title: "Website Hosting (cPanel)",
    description:
      "Reliable cPanel-based web hosting fully hosted within Malaysia, ensuring data sovereignty and fast local access.",
  },
  {
    icon: Phone,
    title: "IP-Telephony",
    description:
      "Enterprise IP telephony solutions hosted on sovereign infrastructure for secure, compliant business communications.",
  },
  {
    icon: Database,
    title: "Database Hosting",
    description:
      "Sovereign database hosting for systems containing Malaysian citizens' personal data — fully PDPA compliant.",
  },
  {
    icon: LayoutDashboard,
    title: "Virtual Desktop (VDI)",
    description:
      "Secure Virtual Desktop Interface enabling remote workforce access with enterprise-grade encryption and compliance.",
  },
  {
    icon: HardDrive,
    title: "Backup & Disaster Recovery",
    description:
      "Automated backup and DR solutions ensuring business continuity with geographically local data replication.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const SolutionsSection = () => (
  <section id="solutions" className="py-20 md:py-28 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-teal uppercase tracking-wider">Solutions</span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
          Award-Winning Cloud Services
        </h2>
        <p className="text-muted-foreground">
          Purpose-built sovereign cloud solutions designed for Malaysian enterprises requiring PDPA compliance and data sovereignty.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((s, i) => (
          <motion.div
            key={s.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-teal/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-teal-light flex items-center justify-center mb-4 group-hover:bg-teal/10 transition-colors">
              <s.icon className="w-6 h-6 text-teal" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionsSection;

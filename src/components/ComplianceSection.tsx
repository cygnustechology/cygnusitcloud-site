import { motion } from "framer-motion";
import { Shield, FileCheck, UserCheck, MapPin } from "lucide-react";

const pillars = [
  {
    icon: FileCheck,
    title: "PDPA 2010 (Act 709)",
    text: "Full compliance with Malaysia's Personal Data Protection Act 2010, ensuring lawful processing, storage, and handling of personal data. Aligned with the latest 2024 amendments including mandatory breach notification, enhanced penalties, and strengthened data subject rights.",
  },
  {
    icon: Shield,
    title: "ESG Alignment",
    text: "Aligned with Environmental, Social, and Governance (ESG) standards: Reducing office power usage by eliminating on‑premise servers; Enabling secure remote work to cut travel emissions and improve well‑being, and embedding Compliance‑driven Governance into every deployment.",
  },
  {
    icon: UserCheck,
    title: "DPO Assurance",
    text: "Data Protection Officer governance embedded into our operations - providing oversight, audit readiness, and regulatory liaison for your organisation.",
  },
  {
    icon: MapPin,
    title: "Data Sovereignty",
    text: "All data is processed and stored exclusively within Malaysian borders. No cross-border data transfers - your data stays in Malaysia.",
  },
];

const ComplianceSection = () => (
  <section id="compliance" className="py-20 md:py-28 gradient-dark">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-cygnus-red uppercase tracking-wider">Compliance</span>
        <h2 className="text-3xl md:text-4xl font-heading text-primary-foreground mt-3 mb-4">
          Governance & Regulatory Assurance
        </h2>
        <p className="text-primary-foreground/60 text-justify-all">
          CygnusITCloud is purpose-built for organisations that require auditable, regulation-compliant cloud infrastructure.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-6"
          >
            <div className="w-10 h-10 rounded-full bg-cygnus-red/20 flex items-center justify-center mb-4">
              <p.icon className="w-5 h-5 text-cygnus-red" />
            </div>
            <h3 className="text-lg font-heading text-primary-foreground mb-2">{p.title}</h3>
            <p className="text-sm text-primary-foreground/60 leading-relaxed text-justify-all">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ComplianceSection;

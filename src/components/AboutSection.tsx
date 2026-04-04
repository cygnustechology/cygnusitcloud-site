import { motion } from "framer-motion";
import { Building2, Users, Target } from "lucide-react";

const AboutSection = () => (
  <section id="about" className="py-20 md:py-28 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-teal uppercase tracking-wider">About Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Cygnus Technology Solutions Sdn. Bhd.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-teal" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 font-heading">Malaysian Owned</h3>
            <p className="text-sm text-muted-foreground">
              A proudly Malaysian company delivering sovereign cloud infrastructure for local enterprises.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-teal" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 font-heading">Expert Team</h3>
            <p className="text-sm text-muted-foreground">
              Seasoned professionals in cloud architecture, compliance, and enterprise solutions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7 text-teal" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 font-heading">Mission-Driven</h3>
            <p className="text-sm text-muted-foreground">
              Committed to safeguarding Malaysian data through sovereign, compliant cloud services.
            </p>
          </div>
        </motion.div>

        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            CygnusITCloud.com is owned and managed by <strong className="text-foreground">Cygnus Technology Solutions Sdn. Bhd.</strong>, 
            a Malaysian enterprise dedicated to providing award-winning private cloud services. We specialise in 
            hosting business-critical applications, databases, and infrastructure — all within Malaysia — ensuring 
            full compliance with PDPA 2010 and the 2024 Amendment Act.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;

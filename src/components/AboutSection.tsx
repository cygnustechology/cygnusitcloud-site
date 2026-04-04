import { motion } from "framer-motion";
import {
  Cloud,
  Monitor,
  Globe2,
  Leaf,
  HeadphonesIcon,
  Layers,
  ShieldCheck,
  ArrowRight,
  Building2,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Monitor,
    title: "Run Legacy Apps Without Installation",
    description:
      "Host your legacy (.exe) applications directly on the cloud. No local installation needed. If you lose your laptop, simply log in from any device and you're back to work instantly.",
  },
  {
    icon: Globe2,
    title: "Access From Anywhere",
    description:
      "Your applications are available from any device, anywhere with an internet connection. Whether you're working from home, a café, or overseas - your entire office environment is just a login away.",
  },
  {
    icon: Leaf,
    title: "WFH-Ready & ESG-Friendly",
    description:
      "Enable seamless Work-From-Home (WFH) for your team without additional infrastructure. By reducing the need for physical offices and on-premise servers, your business indirectly contributes to ESG sustainability principles.",
  },
  {
    icon: HeadphonesIcon,
    title: "Real Human Support",
    description:
      "Our support team is reachable via phone and email - staffed by real people who understands proper IT-setup, and your business operations. We stand by to assist with monitoring, maintenance, and troubleshooting so you're never left on your own.",
  },
];

const AboutSection = () => (
  <section id="about" className="py-20 md:py-28 bg-background">
    <div className="container mx-auto px-4">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-sm font-semibold text-cygnus-red uppercase tracking-wider">
          About Us
        </span>
        <h2 className="text-3xl md:text-4xl font-heading text-foreground mt-3 mb-4">
          What is Private Cloud Hosting?
        </h2>
        <p className="text-muted-foreground leading-relaxed text-center whitespace-pre-line">
          CygnusCloud® is a single‑tenant, enterprise‑grade cloud solution purpose‑built for Malaysian businesses that demand data sovereignty, PDPA compliance, and DPO assurance. 
          {"\n"}Unlike conventional hosting providers, we are not a Virtual Private Server (VPS) provider and we do not offer generic Dedicated Servers; Instead, we deliver true Virtual Machines (VMs) engineered for enterprises that must safeguard sensitive information while meeting strict regulatory requirements.
        </p>
      </div>

      {/* Public Cloud vs Private Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto mb-16"
      >
        <h3 className="text-2xl font-heading text-foreground text-center mb-3 font-sans">
          Public Cloud vs Private Cloud
        </h3>
        <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mb-8">
          When evaluating cloud deployment models, businesses often compare public cloud hosting with private cloud hosting. While both deliver computing resources over the internet, the ownership, control, and compliance posture differ significantly.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Public Cloud */}
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-cygnus-light flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-cygnus-red" />
            </div>
            <h4 className="text-lg font-heading text-foreground mb-2 font-sans">
              Public Cloud Hosting
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed text-justify-all mb-4 flex-grow">
              Public cloud hosting involves multiple organizations sharing the same infrastructure. Each tenant operates within an isolated environment, but the underlying hardware and resources are pooled. This model is cost‑effective and scalable, yet data sovereignty and compliance controls are limited because resources are shared across different entities.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-cygnus-red/30 pl-3">
              <strong className="text-foreground not-italic">Analogy:</strong> Public cloud is like renting an apartment in a large building. You have your own unit, but the facilities and structure are shared with other tenants.
            </p>
          </div>
          {/* Private Cloud */}
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-cygnus-light flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-cygnus-red" />
            </div>
            <h4 className="text-lg font-heading text-foreground mb-2 font-sans">
              Private Cloud Hosting
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed text-justify-all mb-4 flex-grow">
              Private cloud hosting is a single‑tenant model where one organization has exclusive use of its cloud environment. Resources are not shared, giving the organization greater control, customization, and compliance assurance. While it comes at a higher cost, it provides the governance and sovereignty required for sensitive workloads.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-cygnus-red/30 pl-3">
              <strong className="text-foreground not-italic">Analogy:</strong> Private cloud is like renting an entire house. You have full control over the property, its layout, and its security, without sharing with neighbors.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Intro Card - Why Choose CygnusCloud */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="bg-card border border-border rounded-lg p-8 md:p-10">
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-14 h-14 rounded-lg bg-cygnus-red flex items-center justify-center">
              <Cloud className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-heading text-foreground mb-3 font-sans">
                Why Choose CygnusCloud®
              </h3>
              <p className="text-muted-foreground leading-relaxed text-justify-all mb-4">
                Unlike typical cloud providers who simply sell server space, <strong className="text-foreground">Cygnus Technology Solutions Sdn. Bhd.</strong> takes a holistic approach. We evaluate your environment, understand your needs, and architect a complete infrastructure - integrating our various solutions together to form a true <strong className="text-cygnus-red">#SolutionThatWorks</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed text-justify-all">
                From Private Cloud hosting and IP-Telephony to Cybersecurity and Compliance - we provide comprehensive IT solutions under one roof, making us uniquely positioned as both your cloud provider and IT strategic partner.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Highlight Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
        {highlights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-cygnus-red/30 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-cygnus-light flex items-center justify-center mb-4 group-hover:bg-cygnus-red/10 transition-colors">
              <item.icon className="w-6 h-6 text-cygnus-red" />
            </div>
            <h3 className="text-lg font-heading text-foreground mb-2 font-sans">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed text-justify-all">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Comprehensive Solutions Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-cygnus-light border border-border rounded-lg p-8 md:p-10">
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-14 h-14 rounded-lg bg-cygnus-red flex items-center justify-center">
              <Layers className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-heading text-foreground mb-3 font-sans">
                More Than Just Cloud - Comprehensive IT Solutions
              </h3>
              <p className="text-muted-foreground leading-relaxed text-justify-all mb-4 whitespace-pre-line">
                While most IT / Cloud providers focus solely on selling cloud resources - Cygnus is different. 
                {"\n"}We deliver an Integrated Ecosystem of Solutions - From Private Cloud Hosting and Unified Communications to Endpoint Protection, Compliance Assurance, and Secure Connectivity — all built on a foundation of properly designed and set-up infrastructure.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  { icon: ShieldCheck, label: "Cygnus TrustGuard®" },
                  { icon: Cloud, label: "CygnusCloud®" },
                  { icon: Monitor, label: "CygnusProtect®" },
                  { icon: Globe2, label: "CygnusConnect®" },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-card border border-border rounded-full px-3 py-1.5 text-foreground"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-cygnus-red" />
                    {badge.label}
                  </span>
                ))}
              </div>
              <Button
                asChild
                variant="link"
                className="text-cygnus-red hover:text-cygnus-red/80 p-0 h-auto font-semibold"
              >
                <a
                  href="https://cygnus.com.my/solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Our Strategic Pillars
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
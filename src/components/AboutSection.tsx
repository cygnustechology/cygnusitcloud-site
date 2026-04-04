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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Monitor,
    title: "Run Legacy Apps Without Installation",
    description:
      "Host your .exe accounting and HR applications — Autocount, SQL, MYOB, UBS, Million, HR2000, TIMES HRIS — directly in the cloud. No local installation needed. If you lose your laptop, simply log in from any device and you're back to work instantly.",
  },
  {
    icon: Globe2,
    title: "Access From Anywhere",
    description:
      "Your applications are available from any device, anywhere with an internet connection. Whether you're working from home, a café, or overseas — your entire office environment is just a login away.",
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
      "Our support team is reachable via phone and email — staffed by real people who understand your business. We stand by to assist with monitoring, maintenance, and troubleshooting so you're never left on your own.",
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
        <p className="text-muted-foreground leading-relaxed text-center">
          Private cloud hosting is a compliance-ready, single-tenant cloud platform that provides a secure and flexible hosting environment - Purpose-built for Malaysian enterprises that need to keep data sovereign and meet PDPA requirements.
        </p>
      </div>

      {/* Intro Card */}
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
                Why Choose CygnusITCloud?
              </h3>
              <p className="text-muted-foreground leading-relaxed text-justify-all mb-4">
                Unlike typical cloud providers who simply sell server space, <strong className="text-foreground">Cygnus Technology Solutions</strong> takes a holistic approach. We evaluate your environment, understand your needs, and architect a complete infrastructure — integrating our various solutions together to form a true <strong className="text-cygnus-red">#SolutionThatWorks</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed text-justify-all">
                From private cloud hosting and IP-telephony to cybersecurity and compliance — we provide comprehensive IT solutions under one roof, making us uniquely positioned as both your cloud provider and IT strategic partner.
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
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="bg-cygnus-light border border-border rounded-lg p-8 md:p-10">
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-14 h-14 rounded-lg bg-cygnus-red flex items-center justify-center">
              <Layers className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-heading text-foreground mb-3 font-sans">
                More Than Just Cloud — Comprehensive IT Solutions
              </h3>
              <p className="text-muted-foreground leading-relaxed text-justify-all mb-4">
                Most cloud providers focus solely on selling cloud resources. Cygnus is different. We deliver an integrated ecosystem of solutions — from cloud hosting and unified communications to endpoint protection, compliance assurance, and secure connectivity — all built on a foundation of properly designed infrastructure.
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

      {/* Company Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-justify-all">
            CygnusITCloud.com is owned and managed by{" "}
            <strong className="text-foreground">
              Cygnus Technology Solutions Sdn. Bhd.
            </strong>
            , a Malaysian enterprise dedicated to providing award-winning private
            cloud services. We specialise in hosting business-critical
            applications, databases, and infrastructure — all within Malaysia —
            ensuring full compliance with PDPA 2010 and the 2024 Amendment Act.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({
      title: "Inquiry Submitted",
      description: "Thank you. Our team will respond within 1 business day.",
    });
    setForm({ name: "", email: "", company: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-cygnus-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-cygnus-red uppercase tracking-wider">Contact</span>
          <h2 className="text-3xl md:text-4xl font-heading text-foreground mt-3 mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-justify-all">
            Speak with our compliance and solutions team about your sovereign cloud requirements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-heading text-foreground mb-6">
              Cygnus Technology Solutions Sdn. Bhd.
            </h3>
            <div className="space-y-5">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-cygnus-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a href="mailto:cts-info@cygnusitcloud.com" className="text-sm text-muted-foreground hover:text-cygnus-red transition-colors">
                    cts-info@cygnusitcloud.com
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-cygnus-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <a href="tel:+60397659999" className="text-sm text-muted-foreground hover:text-cygnus-red transition-colors">
                    +60 3 9765 9999
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-cygnus-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Office</p>
                  <p className="text-sm text-muted-foreground text-justify">
                    D3-12-1, Jalan Dutamas 3, Taman Dutamas, 43200 Cheras, Selangor, Malaysia.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-lg p-6 space-y-4"
          >
            <div>
              <Input
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <Input
              placeholder="Company Name"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <div>
              <Textarea
                placeholder="How can we help? *"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={errors.message ? "border-destructive" : ""}
              />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-cygnus-red hover:bg-cygnus-red/90 text-accent-foreground font-semibold uppercase tracking-wide"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Inquiry
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

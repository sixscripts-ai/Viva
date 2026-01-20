import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      const errorMsg = error.response?.data?.detail?.[0]?.msg || "Failed to send message. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-4"
            >
              GET IN TOUCH
            </motion.p>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              LET'S TALK
            </h2>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-10">
              Have a project in mind? Questions about our services? We'd love to
              hear from you. Reach out and let's create something amazing
              together.
            </p>

            {/* Contact Details */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.a
                variants={itemVariants}
                href="tel:541-844-8263"
                data-testid="contact-phone"
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 group"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-14 h-14 bg-[#171717] border border-white/10 flex items-center justify-center group-hover:border-[#F59E0B] transition-colors"
                >
                  <Phone size={24} className="text-[#F59E0B]" />
                </motion.div>
                <div>
                  <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-white text-lg font-medium group-hover:text-[#F59E0B] transition-colors">
                    541-844-8263
                  </p>
                </div>
              </motion.a>

              <motion.a
                variants={itemVariants}
                href="mailto:shelovexo9898@gmail.com"
                data-testid="contact-email"
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 group"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-14 h-14 bg-[#171717] border border-white/10 flex items-center justify-center group-hover:border-[#F59E0B] transition-colors"
                >
                  <Mail size={24} className="text-[#F59E0B]" />
                </motion.div>
                <div>
                  <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-white text-lg font-medium group-hover:text-[#F59E0B] transition-colors">
                    shelovexo9898@gmail.com
                  </p>
                </div>
              </motion.a>

              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#171717] border border-white/10 flex items-center justify-center">
                  <MapPin size={24} className="text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-white text-lg font-medium">
                    College Station, Texas
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="name"
                  className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-2"
                >
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  data-testid="contact-name-input"
                  className="booking-input h-12 bg-[#171717] border-white/10 text-white focus:border-[#F59E0B] transition-colors"
                  placeholder="John Doe"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="email"
                  className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  data-testid="contact-email-input"
                  className="booking-input h-12 bg-[#171717] border-white/10 text-white focus:border-[#F59E0B] transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="message"
                  className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-2"
                >
                  Your Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  data-testid="contact-message-input"
                  className="booking-input min-h-[150px] bg-[#171717] border-white/10 text-white resize-none focus:border-[#F59E0B] transition-colors"
                  placeholder="Tell us about your project..."
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="contact-submit-btn"
                  className="w-full btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 py-6"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <motion.span
                      animate={isSubmitting ? {} : { x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Send size={18} />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

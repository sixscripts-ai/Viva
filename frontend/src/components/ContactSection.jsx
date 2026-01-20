import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <div>
            <p className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-4">
              GET IN TOUCH
            </p>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              LET'S TALK
            </h2>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-10">
              Have a project in mind? Questions about our services? We'd love to
              hear from you. Reach out and let's create something amazing
              together.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <a
                href="tel:541-844-8263"
                data-testid="contact-phone"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-[#171717] border border-white/10 flex items-center justify-center group-hover:border-[#F59E0B] transition-colors">
                  <Phone size={24} className="text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-white text-lg font-medium group-hover:text-[#F59E0B] transition-colors">
                    541-844-8263
                  </p>
                </div>
              </a>

              <a
                href="mailto:shelovexo9898@gmail.com"
                data-testid="contact-email"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-[#171717] border border-white/10 flex items-center justify-center group-hover:border-[#F59E0B] transition-colors">
                  <Mail size={24} className="text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-white text-lg font-medium group-hover:text-[#F59E0B] transition-colors">
                    shelovexo9898@gmail.com
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#171717] border border-white/10 flex items-center justify-center">
                  <MapPin size={24} className="text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-white text-lg font-medium">
                    Oregon, USA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="glass-panel p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
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
                  className="booking-input h-12 bg-[#171717] border-white/10 text-white"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
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
                  className="booking-input h-12 bg-[#171717] border-white/10 text-white"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
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
                  className="booking-input min-h-[150px] bg-[#171717] border-white/10 text-white resize-none"
                  placeholder="Tell us about your project..."
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="contact-submit-btn"
                className="w-full btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 py-6"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={18} />
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

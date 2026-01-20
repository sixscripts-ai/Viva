import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Free initial consultation",
  "Custom packages available",
  "Quick turnaround times",
  "Professional equipment",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function BookingSection({ onOpenModal }) {
  return (
    <section id="booking" className="py-24 md:py-32 bg-[#050505] relative" data-testid="booking-section">
      {/* Background glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 diesel-glow"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-4"
            >
              READY TO CREATE?
            </motion.p>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              BOOK YOUR
              <br />
              <span className="text-[#F59E0B]">SESSION</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8">
              Let's bring your vision to life. Whether it's a wedding, commercial
              project, or social media content, we're here to create something
              extraordinary together.
            </p>

            {/* Benefits */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 mb-10"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle2 size={20} className="text-[#F59E0B]" />
                  </motion.div>
                  <span className="text-white">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onOpenModal}
                data-testid="booking-section-btn"
                className="btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 px-10 py-6 text-base"
              >
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  Schedule Now
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ y: -4, borderColor: "rgba(245, 158, 11, 0.3)" }}
              className="glass-panel p-8 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0"
                >
                  <Calendar size={24} className="text-[#F59E0B]" />
                </motion.div>
                <div>
                  <h3 className="font-anton text-xl text-white mb-2">
                    FLEXIBLE SCHEDULING
                  </h3>
                  <p className="text-[#A1A1AA]">
                    Choose a date and time that works for you. We accommodate
                    weekday and weekend shoots.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, borderColor: "rgba(245, 158, 11, 0.3)" }}
              className="glass-panel p-8 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0"
                >
                  <Clock size={24} className="text-[#F59E0B]" />
                </motion.div>
                <div>
                  <h3 className="font-anton text-xl text-white mb-2">
                    QUICK RESPONSE
                  </h3>
                  <p className="text-[#A1A1AA]">
                    We'll confirm your booking within 24 hours and reach out to
                    discuss your project details.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-8 border-[#F59E0B]/30"
            >
              <p className="text-center text-[#A1A1AA] mb-2">
                Have questions? Call us directly
              </p>
              <motion.a
                href="tel:541-844-8263"
                data-testid="booking-phone-link"
                whileHover={{ scale: 1.05 }}
                className="block text-center font-anton text-2xl text-[#F59E0B] hover:text-white transition-colors"
              >
                541-844-8263
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

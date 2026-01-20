import { motion } from "framer-motion";
import { Calendar, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { id: "event", label: "Events", icon: "🎉" },
  { id: "social_media", label: "Social Media", icon: "📱" },
  { id: "commercial", label: "Commercial", icon: "🎬" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function QuickBookingSection({ onOpenModal }) {
  return (
    <section className="relative py-16 bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#050505] overflow-hidden" data-testid="quick-booking-section">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#F59E0B]/10 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="glass-panel p-8 md:p-12 border-[#F59E0B]/20"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-[#F59E0B] text-sm font-medium uppercase tracking-wider">
                Quick Booking
              </span>
            </div>
            <h2 className="font-anton text-3xl md:text-4xl lg:text-5xl text-white mb-3">
              READY TO <span className="text-[#F59E0B]">CREATE</span>?
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
              Select your service type and book your session in just 60 seconds
            </p>
          </motion.div>

          {/* Service Quick Select */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            {services.map((service, index) => (
              <motion.button
                key={service.id}
                onClick={() => onOpenModal(service.id)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`quick-book-${service.id}`}
                className="group relative bg-[#171717] border border-white/10 p-6 text-center transition-all duration-300 hover:border-[#F59E0B]/50 hover:bg-[#1a1a1a]"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F59E0B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.span 
                  className="text-3xl mb-3 block"
                  animate={{ 
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3 + index,
                  }}
                >
                  {service.icon}
                </motion.span>
                <span className="font-medium text-white group-hover:text-[#F59E0B] transition-colors text-sm uppercase tracking-wide">
                  {service.label}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Info Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-4 bg-[#171717]/50 p-4 border border-white/5">
              <div className="w-12 h-12 bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-white font-medium">Flexible Dates</p>
                <p className="text-[#A1A1AA] text-sm">Book any day that works</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#171717]/50 p-4 border border-white/5">
              <div className="w-12 h-12 bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-white font-medium">24hr Confirmation</p>
                <p className="text-[#A1A1AA] text-sm">Quick response time</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#171717]/50 p-4 border border-white/5">
              <div className="w-12 h-12 bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-white font-medium">Premium Quality</p>
                <p className="text-[#A1A1AA] text-sm">Professional results</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <Button
              onClick={() => onOpenModal()}
              data-testid="quick-book-any-btn"
              className="group btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 px-10 py-6 text-base"
            >
              <span className="flex items-center gap-2">
                Book Any Service
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function HeroSection({ onBookClick }) {
  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-section" data-testid="hero-section">
      {/* Background */}
      <div className="hero-bg">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1670483513924-121f2573c295?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920"
          alt="Cinematic camera setup"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="hero-overlay" />

      {/* Diesel Glow Effect */}
      <motion.div 
        className="absolute inset-0 diesel-glow z-[2]"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#F59E0B]/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <motion.p
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="font-bebas text-[#F59E0B] text-lg md:text-xl tracking-[0.3em] mb-4"
        >
          PROFESSIONAL VIDEOGRAPHY
        </motion.p>

        <motion.h1
          className="font-anton text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-6"
        >
          <motion.span
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="block"
          >
            CAPTURING YOUR
          </motion.span>
          <motion.span
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="block"
          >
            <span className="text-[#F59E0B] relative">
              VISION
              <motion.span
                className="absolute -inset-2 bg-[#F59E0B]/20 blur-xl -z-10"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </span>{" "}
            IN MOTION
          </motion.span>
        </motion.h1>

        <motion.p
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="font-manrope text-[#A1A1AA] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          From weddings to commercials, we create cinematic stories that
          captivate audiences and elevate your brand.
        </motion.p>

        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onBookClick}
              data-testid="hero-book-btn"
              className="btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 px-8 py-6 text-base group"
            >
              <span className="flex items-center gap-2">
                Book Your Session
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight size={18} />
                </motion.span>
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={scrollToServices}
              data-testid="hero-services-btn"
              variant="outline"
              className="bg-transparent border border-white/20 text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-300 uppercase tracking-wider px-8 py-6 text-base group"
            >
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play size={18} />
                </motion.span>
                View Our Work
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-[#F59E0B] rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

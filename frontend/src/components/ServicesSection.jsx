import { motion } from "framer-motion";
import { Camera, Video, Building2, Sparkles, PartyPopper } from "lucide-react";

const services = [
  {
    id: "wedding",
    title: "Wedding Films",
    description: "Cinematic storytelling of your most precious moments, crafted with emotion and artistry.",
    image: "https://images.unsplash.com/photo-1685687919836-6c15deb19a54?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    icon: Camera,
    value: "wedding"
  },
  {
    id: "event",
    title: "Event Coverage",
    description: "Professional documentation of concerts, corporate events, and special occasions.",
    image: "https://images.unsplash.com/photo-1623332517008-b24881735e47?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    icon: PartyPopper,
    value: "event"
  },
  {
    id: "commercial",
    title: "Commercial Videos",
    description: "High-impact brand content that tells your story and drives engagement.",
    image: "https://images.unsplash.com/photo-1589994850515-ad76ef242731?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    icon: Video,
    value: "commercial"
  },
  {
    id: "social_media",
    title: "Social Media Content",
    description: "Scroll-stopping content optimized for Instagram, TikTok, and YouTube.",
    image: "https://images.unsplash.com/photo-1603207757545-de4fffdb404c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    icon: Sparkles,
    value: "social_media"
  },
  {
    id: "real_estate",
    title: "Real Estate Tours",
    description: "Stunning property showcases that help close deals faster.",
    image: "https://images.unsplash.com/photo-1592229505801-77b31918d822?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    icon: Building2,
    value: "real_estate"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ServicesSection({ onBookService }) {
  return (
    <section id="services" className="py-24 md:py-32 bg-[#050505]" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-4"
          >
            WHAT WE DO
          </motion.p>
          <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-white">
            OUR SERVICES
          </h2>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                onClick={() => onBookService(service.value)}
                data-testid={`service-card-${service.id}`}
                whileHover={{ y: -8 }}
                className={`service-card cursor-pointer bg-[#0A0A0A] border border-white/5 group ${
                  index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* Content overlay */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-[#F59E0B] flex items-center justify-center"
                      >
                        <Icon size={20} className="text-black" />
                      </motion.div>
                      <h3 className="font-anton text-2xl text-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-md">
                      {service.description}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="mt-4 flex items-center gap-2 text-[#F59E0B] text-sm font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span>Book This Service</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

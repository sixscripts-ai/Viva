import { motion } from "framer-motion";
import { Play, Instagram } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    title: "Mountain Wedding",
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1753996297177-a852d17fb202?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
  {
    id: 2,
    title: "Brand Launch Event",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1718421280278-4402ea0c00eb?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
  {
    id: 3,
    title: "Music Festival",
    category: "Event",
    image: "https://images.unsplash.com/photo-1716033752174-cc7904edf0dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
  {
    id: 4,
    title: "Luxury Real Estate",
    category: "Real Estate",
    image: "https://images.unsplash.com/photo-1630401450821-018693a1c7d3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
  {
    id: 5,
    title: "Product Showcase",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
  {
    id: 6,
    title: "Social Campaign",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="portfolio-section">
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
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-4"
          >
            OUR WORK
          </motion.p>
          <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            PORTFOLIO
          </h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            A selection of our recent projects. Follow us on social media for more behind-the-scenes content.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="portfolio-item group cursor-pointer relative overflow-hidden"
              data-testid={`portfolio-item-${item.id}`}
            >
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.7 }}
              />
              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/50 to-transparent"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center mb-4"
                >
                  <Play size={24} className="text-black ml-1" />
                </motion.div>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="font-anton text-xl text-white"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-[#F59E0B] text-sm uppercase tracking-wider"
                >
                  {item.category}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-[#A1A1AA] mb-6">
            Follow us for more content and behind-the-scenes
          </p>
          <div className="flex items-center justify-center gap-4">
            <motion.a
              href="https://www.instagram.com/diesel_media25/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="instagram-link"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#171717] border border-white/10 px-6 py-3 text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-300"
            >
              <Instagram size={20} />
              <span className="font-medium">@diesel_media25</span>
            </motion.a>
            <motion.a
              href="https://www.tiktok.com/@diesel.media2"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="tiktok-link"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#171717] border border-white/10 px-6 py-3 text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span className="font-medium">@diesel.media2</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

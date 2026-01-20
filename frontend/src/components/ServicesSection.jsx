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

export default function ServicesSection({ onBookService }) {
  return (
    <section id="services" className="py-24 md:py-32 bg-[#050505]" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-4">
            WHAT WE DO
          </p>
          <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-white">
            OUR SERVICES
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => onBookService(service.value)}
                data-testid={`service-card-${service.id}`}
                className={`service-card cursor-pointer bg-[#0A0A0A] border border-white/5 group ${
                  index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Content overlay */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#F59E0B] flex items-center justify-center">
                        <Icon size={20} className="text-black" />
                      </div>
                      <h3 className="font-anton text-2xl text-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-md">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[#F59E0B] text-sm font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Book This Service</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

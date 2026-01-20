import { ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection({ onBookClick }) {
  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-section" data-testid="hero-section">
      {/* Background */}
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1670483513924-121f2573c295?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920"
          alt="Cinematic camera setup"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="hero-overlay" />

      {/* Diesel Glow Effect */}
      <div className="absolute inset-0 diesel-glow z-[2]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <div className="opacity-0 animate-fade-in-up">
          <p className="font-bebas text-[#F59E0B] text-lg md:text-xl tracking-[0.3em] mb-4">
            PROFESSIONAL VIDEOGRAPHY
          </p>
        </div>

        <h1 className="font-anton text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-6 opacity-0 animate-fade-in-up animation-delay-100">
          CAPTURING YOUR
          <br />
          <span className="text-[#F59E0B]">VISION</span> IN MOTION
        </h1>

        <p className="font-manrope text-[#A1A1AA] text-base md:text-lg max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up animation-delay-200 leading-relaxed">
          From weddings to commercials, we create cinematic stories that
          captivate audiences and elevate your brand.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up animation-delay-300">
          <Button
            onClick={onBookClick}
            data-testid="hero-book-btn"
            className="btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 px-8 py-6 text-base"
          >
            <span className="flex items-center gap-2">
              Book Your Session
              <ChevronRight size={18} />
            </span>
          </Button>

          <Button
            onClick={scrollToServices}
            data-testid="hero-services-btn"
            variant="outline"
            className="bg-transparent border border-white/20 text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-300 uppercase tracking-wider px-8 py-6 text-base"
          >
            <span className="flex items-center gap-2">
              <Play size={18} />
              View Our Work
            </span>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 animate-fade-in animation-delay-500">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#F59E0B] rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

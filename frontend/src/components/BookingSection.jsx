import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Free initial consultation",
  "Custom packages available",
  "Quick turnaround times",
  "Professional equipment",
];

export default function BookingSection({ onOpenModal }) {
  return (
    <section id="booking" className="py-24 md:py-32 bg-[#050505] relative" data-testid="booking-section">
      {/* Background glow */}
      <div className="absolute inset-0 diesel-glow opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <p className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-4">
              READY TO CREATE?
            </p>
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
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#F59E0B]" />
                  <span className="text-white">{benefit}</span>
                </div>
              ))}
            </div>

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
          </div>

          {/* Right Content - Info Cards */}
          <div className="space-y-6">
            <div className="glass-panel p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-[#F59E0B]" />
                </div>
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
            </div>

            <div className="glass-panel p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-[#F59E0B]" />
                </div>
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
            </div>

            <div className="glass-panel p-8 border-[#F59E0B]/30">
              <p className="text-center text-[#A1A1AA] mb-2">
                Have questions? Call us directly
              </p>
              <a
                href="tel:541-844-8263"
                data-testid="booking-phone-link"
                className="block text-center font-anton text-2xl text-[#F59E0B] hover:text-white transition-colors"
              >
                541-844-8263
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import QuickBookingSection from "@/components/QuickBookingSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import BookingSection from "@/components/BookingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function LandingPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openBookingModal = (service = null) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#050505]"
    >
      <Navigation onBookClick={() => openBookingModal()} />
      <HeroSection onBookClick={() => openBookingModal()} />
      <QuickBookingSection onOpenModal={openBookingModal} />
      <ServicesSection onBookService={openBookingModal} />
      <PortfolioSection />
      <BookingSection onOpenModal={() => openBookingModal()} />
      <ContactSection />
      <Footer />
      
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preSelectedService={selectedService}
      />
    </motion.div>
  );
}

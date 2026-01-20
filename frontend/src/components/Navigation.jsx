import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation({ onBookClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Book Now", href: "#booking" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        data-testid="main-navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="/"
              data-testid="logo-link"
              className="flex items-center gap-3"
            >
              <span className="font-anton text-2xl md:text-3xl tracking-wider text-white">
                DIESEL<span className="text-[#F59E0B]">MEDIA</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  data-testid={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
                  className="nav-link text-sm font-medium text-[#A1A1AA] hover:text-white uppercase tracking-wider"
                >
                  {link.name}
                </button>
              ))}
              <Button
                onClick={onBookClick}
                data-testid="nav-book-btn"
                className="btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 px-6 py-2"
              >
                <span>Book Session</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-btn"
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
        data-testid="mobile-menu"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              data-testid={`mobile-nav-${link.name.toLowerCase().replace(" ", "-")}`}
              className="font-anton text-3xl text-white hover:text-[#F59E0B] transition-colors"
            >
              {link.name}
            </button>
          ))}
          <Button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onBookClick();
            }}
            data-testid="mobile-book-btn"
            className="btn-skew bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] transition-all duration-300 px-8 py-3 text-lg mt-4"
          >
            <span>Book Session</span>
          </Button>
        </div>
      </div>
    </>
  );
}

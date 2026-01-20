import { Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-anton text-2xl tracking-wider text-white">
              DIESEL<span className="text-[#F59E0B]">MEDIA</span>
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/diesel_media25/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram"
              className="w-10 h-10 bg-[#171717] border border-white/10 flex items-center justify-center text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@diesel.media2"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-tiktok"
              className="w-10 h-10 bg-[#171717] border border-white/10 flex items-center justify-center text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-300"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[#A1A1AA] text-sm">
            © {currentYear} Diesel Media. All rights reserved.
          </p>
        </div>

        {/* Admin Link (hidden) */}
        <div className="mt-8 text-center">
          <a
            href="/admin"
            data-testid="admin-link"
            className="text-[#A1A1AA]/30 text-xs hover:text-[#A1A1AA] transition-colors"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </footer>
  );
}

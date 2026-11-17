import React, { useState } from 'react';
import { Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';
import { InfoModalType } from './InfoModal';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenTrackOrder: () => void;
  onOpenInfoModal: (type: InfoModalType) => void;
  onOpenAdmin?: () => void;
}

// TikTok Custom Luxury Line Icon
const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.95-4.48V8.75a8.16 8.16 0 0 0 4.82 1.57v-3.5a4.85 4.85 0 0 1-1-.13z" />
  </svg>
);

// WhatsApp Custom Luxury Line Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.182 8.182 0 0 1 2.41 5.83c.01 4.54-3.69 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTrackOrder,
  onOpenInfoModal,
  onOpenAdmin
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 4000);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0A0A0A] text-white border-t border-stone-800 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-stone-800">
          
          {/* Column 1: Newsletter / Stay In The Know (md:col-span-4) */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-stone-400 block mb-2">
              STAY IN THE KNOW
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal leading-snug mb-5 text-balance">
              Be the first to discover new scents and exclusive offers.
            </h3>

            {isSubscribed ? (
              <div className="bg-stone-900 border border-stone-700 py-3 px-4 rounded text-xs text-amber-200">
                Welcome to the AR SCENTS inner circle. You will receive private updates and previews.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-[#141414] border border-stone-700 text-stone-200 placeholder:text-stone-500 text-xs px-3.5 py-2.5 w-full focus:outline-none focus:border-stone-400 transition"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="bg-[#000000] border-y border-r border-stone-700 hover:border-stone-400 hover:bg-stone-900 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 transition shrink-0 cursor-pointer"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}

            {/* Official Email Contact in Footer */}
            <div className="mt-5 pt-4 border-t border-stone-850 flex items-center gap-2 text-xs text-stone-400">
              <Mail className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Contact: </span>
              <a
                href="mailto:areebsaqib374@gmail.com"
                className="text-stone-300 hover:text-white transition font-medium underline underline-offset-2"
              >
                areebsaqib374@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: SHOP (md:col-span-2) */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-200 mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => { onSelectCategory('all'); scrollTo('featured-fragrances'); }}
                  className="hover:text-white transition cursor-pointer"
                >
                  All Fragrances
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('women'); scrollTo('featured-fragrances'); }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Women's Perfumes
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('men'); scrollTo('featured-fragrances'); }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Men's Perfumes
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('unisex'); scrollTo('featured-fragrances'); }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Unisex Fragrances
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('gift-sets'); scrollTo('promotions'); }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Gift Sets Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('discovery-sets'); scrollTo('promotions'); }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Discovery Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT (md:col-span-2) */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-200 mb-4">
              ABOUT
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => scrollTo('about-craft')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about-craft')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Ingredients
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about-craft')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Craftsmanship
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfoModal('contact')}
                  className="hover:text-white transition text-left cursor-pointer font-semibold text-amber-200/90"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: HELP (md:col-span-2) */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-200 mb-4">
              HELP
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onOpenInfoModal('delivery')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Karachi Delivery (PKR 200)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfoModal('easypaisa')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Easypaisa Advance Payment
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-white transition cursor-pointer text-left font-semibold text-stone-200"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfoModal('privacy')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: BRAND & SOCIALS (md:col-span-2 flex flex-col md:items-end text-left md:text-right) */}
          <div className="md:col-span-2 flex flex-col items-start md:items-end justify-between">
            {/* Logo */}
            <div className="flex flex-col items-start md:items-end mb-6">
              <span className="font-serif text-2xl tracking-[0.26em] font-medium text-white">
                AR SCENTS
              </span>
            </div>

            {/* Social Icons matching exactly: Instagram, Facebook, TikTok, WhatsApp (Pinterest REMOVED) */}
            <div className="flex items-center space-x-4 text-stone-300 mb-4">
              <a
                href="https://www.instagram.com/ar_scentss"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition transform hover:scale-115 p-1"
                aria-label="Instagram"
                title="Instagram @ar_scentss"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1aacT6a48i/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition transform hover:scale-115 p-1"
                aria-label="Facebook"
                title="Facebook AR SCENTS"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@ar..scents"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition transform hover:scale-115 p-1"
                aria-label="TikTok"
                title="TikTok @ar..scents"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/qr/LWMAL6IJMJSMN1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition transform hover:scale-115 p-1 text-emerald-500"
                aria-label="WhatsApp"
                title="WhatsApp Concierge"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>

            {/* Copyright & Branding: © 2026 AR SCENTS. All rights reserved. */}
            <div className="text-[11px] text-stone-400 tracking-wider text-left md:text-right">
              <p>© 2026 AR SCENTS. All rights reserved.</p>
              <p>Handcrafted Luxury Fragrances · Karachi Delivery Only.</p>
            </div>
          </div>

        </div>

        {/* Quiet Footnote */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <p>Handcrafted Luxury Fragrances · Karachi Delivery Only.</p>
          <div className="flex items-center gap-4">
            <p>Flat PKR 200 delivery · Advance payment via Easypaisa.</p>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-stone-500 hover:text-stone-200 underline underline-offset-2 transition cursor-pointer"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

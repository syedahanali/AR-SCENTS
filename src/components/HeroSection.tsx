import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  heroProduct?: Product;
  onExploreCollections: () => void;
  onQuickView?: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollections
}) => {
  return (
    <section
      aria-label="Hero Showcase"
      className="relative overflow-hidden bg-[#0A0A0A] min-h-[540px] sm:min-h-[640px] lg:min-h-[720px] flex items-end sm:items-center border-b border-stone-800"
    >
      {/* 1. Full Section Background Image from 'images/ar_scents.jpg' */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Mobile (< sm): Centers the perfume bottle horizontally as full background without cropping */}
        <img
          src="/images/ar_scents.jpg"
          alt="AR Scents Legacy Perfume surrounded by mystical incense smoke on dark textured stone"
          className="sm:hidden absolute inset-y-0 left-1/2 -translate-x-[67%] h-full w-auto max-w-none filter brightness-[0.98] contrast-[1.03]"
          loading="eager"
          referrerPolicy="no-referrer"
        />

        {/* Tablet & Desktop (>= sm): Original framing preserved unchanged */}
        <img
          src="/images/ar_scents.jpg"
          alt="AR Scents Legacy Perfume surrounded by mystical incense smoke on dark textured stone"
          className="hidden sm:block w-full h-full object-cover object-center lg:object-[68%_center] filter brightness-[0.98] contrast-[1.03]"
          loading="eager"
          referrerPolicy="no-referrer"
        />

        {/* Mobile Evenly Balanced Subtle Gradient (< sm): Softly tints full hero without darkening the lower bottle */}
        <div
          className="sm:hidden absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/30 backdrop-blur-[1.5px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Tablet & Desktop Cinematic Scrim Gradients (unchanged) */}
        <div
          className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 lg:from-black/85 lg:via-black/40 lg:to-transparent"
          aria-hidden="true"
        />
        <div
          className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
          aria-hidden="true"
        />
      </div>

      {/* 2. Hero Content Container (Overlaid directly on hero image) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-52 pb-8 sm:py-20 lg:py-24 relative z-10">
        <div className="max-w-xl lg:max-w-2xl flex flex-col justify-center text-left drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] sm:drop-shadow-none">
          
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3.5">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-stone-300">
              CRAFTED FOR MOMENTS
            </span>
            <span className="text-stone-500 font-light">·</span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-300/90">
              AR SCENTS
            </span>
          </div>

          <h1 className="font-serif text-[32px] sm:text-5xl lg:text-[56px] xl:text-[62px] font-normal tracking-tight text-white leading-[1.08] sm:leading-[1.06] mb-3.5 sm:mb-5 text-balance drop-shadow-sm">
            Scents that leave a lasting impression.
          </h1>

          <p className="text-stone-200/90 text-xs sm:text-base leading-relaxed max-w-lg mb-5 sm:mb-8 font-light drop-shadow-xs">
            Luxury fragrances, thoughtfully crafted with the finest ingredients from around the world. Featuring our signature <strong className="font-medium text-white">AR Scents Legacy Extrait</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExploreCollections}
              className="group inline-flex items-center gap-3 bg-white text-stone-950 px-6 py-3 sm:px-7 sm:py-3.5 text-xs font-bold tracking-[0.18em] uppercase transition-all duration-200 hover:bg-stone-200 hover:shadow-xl focus:outline-none cursor-pointer rounded-xs"
            >
              <span>EXPLORE COLLECTIONS</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

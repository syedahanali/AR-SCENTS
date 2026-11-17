import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { DISCOVERY_SET_PRODUCT, GIFT_SET_PRODUCT } from '../data/products';

interface PromoBannersProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({
  onQuickView
}) => {
  return (
    <section
      id="promotions"
      aria-label="Promotional Showcases"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* HTML5 & CSS Grid Layout: 2 Equal Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Card 1: DISCOVERY SETS (Full background image with subtle overlay) */}
        <article
          onClick={() => onQuickView(DISCOVERY_SET_PRODUCT)}
          className="relative overflow-hidden rounded-2xl bg-[#111111] text-white border border-stone-800 shadow-xl group min-h-[380px] sm:min-h-[420px] flex flex-col justify-end p-7 sm:p-10 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-stone-700"
        >
          {/* Full background cover image */}
          <img
            src="/images/discovery sets.jpg"
            alt="AR SCENTS Discovery Sets"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />

          {/* Soft, subtle corner gradient concentrated near the text — keeps product photography bright and visible */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent sm:bg-gradient-to-tr sm:from-black/52 sm:via-black/15 sm:to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Card Content with feathered backdrop gradient glow for crisp white text contrast */}
          <div className="relative z-10 max-w-md flex flex-col justify-end drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
            <div
              className="pointer-events-none absolute -inset-x-6 -top-8 -bottom-6 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_bottom_left,rgba(12,12,12,0.56)_0%,rgba(12,12,12,0.28)_55%,transparent_88%)] blur-xl"
              aria-hidden="true"
            />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-stone-200 uppercase">
              DISCOVERY SETS
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight mt-2.5 mb-3">
              Find your signature scent.
            </h3>

            <p className="text-stone-100 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              Explore our curated sets and find the fragrance that's uniquely yours.
            </p>

            <div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(DISCOVERY_SET_PRODUCT);
                }}
                className="group/btn inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-xs border border-white text-white hover:bg-white hover:text-stone-950 px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase rounded-lg transition-all duration-200 focus:outline-none cursor-pointer shadow-md"
              >
                <span>SHOP DISCOVERY SETS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </article>

        {/* Card 2: THE ART OF GIFTING (Bright, sharp image with minimal subtle text overlay) */}
        <article
          onClick={() => onQuickView(GIFT_SET_PRODUCT)}
          className="relative overflow-hidden rounded-2xl bg-[#DFD3C7] text-white border border-stone-800/40 shadow-xl group min-h-[380px] sm:min-h-[420px] flex flex-col justify-end p-7 sm:p-10 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-stone-700"
        >
          {/* Full background cover image */}
          <img
            src="/images/gift sets.jpg"
            alt="AR SCENTS The Art of Gifting"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />

          {/* Soft, subtle corner gradient concentrated near the text — keeps product photography bright and visible */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent sm:bg-gradient-to-tr sm:from-black/52 sm:via-black/15 sm:to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Card Content with feathered backdrop gradient glow for crisp white text contrast */}
          <div className="relative z-10 max-w-md flex flex-col justify-end drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
            <div
              className="pointer-events-none absolute -inset-x-6 -top-8 -bottom-6 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_bottom_left,rgba(12,12,12,0.56)_0%,rgba(12,12,12,0.28)_55%,transparent_88%)] blur-xl"
              aria-hidden="true"
            />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-stone-200 uppercase">
              THE ART OF GIFTING
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight mt-2.5 mb-3">
              Gifts that speak elegance.
            </h3>

            <p className="text-stone-100 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              Beautifully wrapped, thoughtfully chosen. The perfect gift for every occasion.
            </p>

            <div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(GIFT_SET_PRODUCT);
                }}
                className="group/btn inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-xs border border-white text-white hover:bg-white hover:text-stone-950 px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase rounded-lg transition-all duration-200 focus:outline-none cursor-pointer shadow-md"
              >
                <span>SHOP GIFT SETS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </article>

      </div>
    </section>
  );
};

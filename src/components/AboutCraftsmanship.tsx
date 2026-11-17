import React from 'react';

export const AboutCraftsmanship: React.FC = () => {
  return (
    <section
      id="about-craft"
      aria-label="About AR SCENTS & Philosophy"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-stone-200/60"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-stone-500 block mb-2">
          THE AR SCENTS PHILOSOPHY
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Formulated for Every Impression
        </h2>
        <div className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-3 font-light space-y-2">
          <p>
            At AR SCENTS, we believe a fragrance is more than a scent. It is an expression of individuality, confidence and personal style.
          </p>
          <p>
            Our collections are thoughtfully curated to bring together distinctive fragrance experiences, quality presentation and accessible luxury.
          </p>
        </div>
      </div>

      {/* 3-Column Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Pillar 1 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-stone-400 font-mono text-xs block mb-3">01 / INGREDIENTS</span>
            <h3 className="font-serif text-xl text-stone-900 font-medium mb-2.5">
              Thoughtfully Selected Fragrances
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed font-light">
              Every AR SCENTS creation is selected with attention to its fragrance character, balance and overall wearing experience.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 text-[10px] tracking-widest text-stone-400 uppercase font-semibold">
            A Distinctive Scent Experience
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-stone-400 font-mono text-xs block mb-3">02 / CONCENTRATION</span>
            <h3 className="font-serif text-xl text-stone-900 font-medium mb-2.5">
              Fragrance That Defines You
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed font-light">
              Explore a collection of carefully selected fragrances designed to complement different personalities, occasions and preferences.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 text-[10px] tracking-widest text-stone-400 uppercase font-semibold">
            Find Your Signature Scent
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-stone-400 font-mono text-xs block mb-3">03 / PRESENTATION</span>
            <h3 className="font-serif text-xl text-stone-900 font-medium mb-2.5">
              Elegance in Every Detail
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed font-light">
              From carefully presented perfume bottles to thoughtfully arranged gift collections, every detail reflects our commitment to an elegant customer experience.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 text-[10px] tracking-widest text-stone-400 uppercase font-semibold">
            Designed for Everyday Luxury
          </div>
        </div>

      </div>
    </section>
  );
};

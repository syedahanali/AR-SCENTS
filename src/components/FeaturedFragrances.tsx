import React from 'react';
import { Plus, ArrowDown, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface FeaturedFragrancesProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAll?: () => void;
}

export const FeaturedFragrances: React.FC<FeaturedFragrancesProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onViewAll
}) => {
  const scrollToPromos = () => {
    const el = document.getElementById('promotions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="featured-fragrances"
      aria-label="Featured Fragrances"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      {/* Section Header Row */}
      <div className="flex items-center justify-between mb-7 pb-2 border-b border-stone-200/50">
        <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-stone-900">
          FEATURED FRAGRANCES
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[11px] font-semibold tracking-wider text-stone-500 hover:text-stone-900 uppercase transition cursor-pointer"
          >
            SHOW ALL (3)
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center space-y-4 my-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-medium">
            Curated Gift & Discovery Sets
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Discovery Sets and Gift Collections are showcased in our dedicated bespoke presentation section below.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={scrollToPromos}
              className="bg-[#0E0E0E] text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-stone-800 transition flex items-center gap-2 cursor-pointer"
            >
              <span>EXPLORE SETS BELOW</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="bg-stone-100 text-stone-800 text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-stone-200 transition cursor-pointer"
              >
                View Perfumes
              </button>
            )}
          </div>
        </div>
      ) : (
        /* HTML5 & CSS Grid Layout: 3 Columns on Desktop */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col justify-between transition-all duration-300"
            >
              {/* Clickable Card Body */}
              <div
                onClick={() => onQuickView(product)}
                className="cursor-pointer"
              >
                {/* Image Container with Warm Neutral Tone */}
                <div
                  className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center p-3 mb-3.5 transition-all duration-300 group-hover:shadow-md border border-stone-200/50"
                  style={{ backgroundColor: product.cardBg || '#F8F5EE' }}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} 30ml`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>

                {/* Fragrance Title - slightly increased size for better readability */}
                <h3 className="text-sm sm:text-[15px] font-bold tracking-[0.14em] uppercase text-stone-900 leading-snug group-hover:text-stone-700 transition-colors">
                  {product.name}
                </h3>

                {/* Category / Size Notes (Typographic Unboxed Separators) */}
                <p className="text-[11px] text-stone-500 font-normal tracking-wide mt-1 line-clamp-1">
                  {product.notes.join(' · ')}
                </p>
              </div>

              {/* Price and Add-to-Cart Button Row */}
              <div className="flex items-end justify-between mt-3 pt-1">
                <div className="flex flex-col">
                  {/* Original Struck-Through Price */}
                  {product.originalPriceDisplay && (
                    <span className="text-[10px] sm:text-[11px] font-medium text-stone-400 line-through tracking-wider leading-none mb-1">
                      {product.originalPriceDisplay}
                    </span>
                  )}
                  {/* Prominent Current Price */}
                  <span className="text-xs sm:text-[14px] font-bold text-stone-900 tabular-nums tracking-wide leading-tight">
                    {product.priceDisplay || `PKR ${product.price.toLocaleString()}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#121212] text-white flex items-center justify-center transition-all duration-200 hover:scale-115 hover:bg-stone-800 active:scale-95 shadow-sm focus:outline-none cursor-pointer shrink-0"
                  title={`Add ${product.name} to bag`}
                  aria-label={`Add ${product.name} to bag`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

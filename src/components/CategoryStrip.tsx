import React from 'react';
import { CATEGORIES } from '../data/products';
import {
  WomenPerfumeIcon,
  MenPerfumeIcon,
  UnisexFragranceIcon,
  GiftSetIcon,
  DiscoverySetIcon
} from './LuxuryIcons';

interface CategoryStripProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const renderIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:scale-105 ${
      isSelected ? 'text-stone-950 stroke-[1.6]' : 'text-stone-800 stroke-[1.25]'
    }`;

    switch (iconName) {
      case 'women':
        return <WomenPerfumeIcon className={iconClass} size={32} />;
      case 'men':
        return <MenPerfumeIcon className={iconClass} size={32} />;
      case 'unisex':
        return <UnisexFragranceIcon className={iconClass} size={32} />;
      case 'gift':
        return <GiftSetIcon className={iconClass} size={32} />;
      case 'discovery':
        return <DiscoverySetIcon className={iconClass} size={32} />;
      default:
        return <WomenPerfumeIcon className={iconClass} size={32} />;
    }
  };

  return (
    <section
      id="category-strip"
      aria-label="Fragrance Categories"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20"
    >
      <div className="bg-white rounded-2xl shadow-lg shadow-stone-900/5 border border-stone-200/80 overflow-hidden">
        {/* CSS Grid with exactly 5 responsive columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex flex-col items-center justify-center p-5 sm:py-7 sm:px-4 text-center transition-all duration-200 focus:outline-none cursor-pointer relative ${
                  isSelected
                    ? 'bg-stone-50'
                    : 'hover:bg-[#FAF8F5]/80'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {isSelected && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-stone-900" />
                )}

                {/* Category Icon */}
                <div className="mb-3 flex items-center justify-center h-10">
                  {renderIcon(cat.iconName, isSelected)}
                </div>

                {/* Category Labels */}
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase leading-tight ${
                    isSelected ? 'text-stone-950 font-extrabold' : 'text-stone-800'
                  }`}>
                    {cat.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.14em] text-stone-600 uppercase leading-tight mt-0.5">
                    {cat.subtext}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

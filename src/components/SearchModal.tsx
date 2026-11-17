import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filteredProducts = products.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.notes.some((n) => n.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-150">
      <div className="flex min-h-screen items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-[#FAF8F5] text-left shadow-2xl transition-all border border-stone-200/80 p-6 z-10">
          {/* Header Input */}
          <div className="flex items-center space-x-3 pb-4 border-b border-stone-200">
            <Search className="w-5 h-5 text-stone-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fragrances, notes (e.g. Amber, Rose, Oud)..."
              autoFocus
              className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-900 transition"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions Tags */}
          <div className="py-3 flex flex-wrap gap-2 text-xs">
            <span className="text-stone-400 text-[11px] font-medium py-1">Popular:</span>
            {['Rose', 'Sandalwood', 'Oud', 'Bergamot', 'Discovery Set', 'Gift Sets'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results */}
          <div className="mt-2 max-h-80 overflow-y-auto divide-y divide-stone-100">
            {filteredProducts.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-8">
                No fragrances found matching "{query}". Try searching for notes like "Amber" or "Jasmine".
              </p>
            ) : (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 hover:bg-white rounded-lg cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 object-contain bg-stone-100 rounded p-1"
                    />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {p.notes.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold text-stone-900">
                      ${p.price.toFixed(2)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Sparkles, MapPin, CreditCard, Wallet, Ban } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, volume: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const selectedVolume = product.volume || '30ml';
  const currentPrice = product.price;

  const handleAdd = () => {
    onAddToCart(
      {
        ...product,
        price: currentPrice
      },
      quantity,
      selectedVolume
    );
    onClose();
  };

  const isSet = product.category === 'discovery-sets' || product.category === 'gift-sets';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-6 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#FAF8F5] text-left shadow-2xl transition-all border border-stone-200/80 p-5 sm:p-8 z-10 my-6">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-stone-400 hover:text-stone-900 p-1.5 rounded-full hover:bg-stone-200/60 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal CSS Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Image Column (md:col-span-5) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div
                className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center border border-stone-200/60 shadow-xs bg-[#F8F5EE]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Volume / Presentation Badge */}
              {product.id === 'luxury-gift-collection' ? (
                <div className="mt-3 w-full bg-white/95 p-3 rounded-xl border border-stone-200/80 text-left space-y-2.5 shadow-2xs">
                  <div className="text-center pb-1.5 border-b border-stone-100">
                    <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest block">
                      Collection Details
                    </span>
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      AR SCENTS COUTURE GIFT COLLECTION
                    </span>
                  </div>

                  <div className="space-y-2 text-stone-700">
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div className="text-[11px] font-bold text-stone-900">
                        1. Eau de Parfum — 100ml
                      </div>
                      <div className="text-[10px] text-stone-500 leading-snug mt-0.5">
                        Customer ki choice ka ek full-size 100ml AR SCENTS perfume.
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div className="text-[11px] font-bold text-stone-900">
                        2. Travel Atomizer — 1 Unit
                      </div>
                      <div className="text-[10px] text-stone-500 leading-snug mt-0.5">
                        Ek convenient travel atomizer jo gift collection ke saath included hai.
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div className="text-[11px] font-bold text-stone-900">
                        3. Hand-Poured Scented Soy Candle — 70g
                      </div>
                      <div className="text-[10px] text-stone-500 leading-snug mt-0.5">
                        Ek premium hand-poured 70g scented soy candle.
                      </div>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-stone-100 text-center text-[10px] font-bold text-stone-900 uppercase tracking-wider">
                    Total: 3 Premium Items Included
                  </div>
                </div>
              ) : (
                <div className="mt-3 w-full bg-white/90 p-2.5 rounded-lg border border-stone-200/60 text-center">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
                    {isSet ? 'Collection Details' : 'Specification'}
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    {product.volume}
                  </span>
                </div>
              )}
            </div>

            {/* Details Column (md:col-span-7) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand Identifier */}
                <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-stone-500 block mb-1">
                  AR SCENTS
                </span>

                {/* Fragrance / Collection Name */}
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 tracking-wider uppercase mt-1 mb-3">
                  {product.subtitle || 'Extrait de Parfum'}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4">
                  {product.originalPriceDisplay && (
                    <span className="text-sm font-medium text-stone-400 line-through tracking-wider">
                      {product.originalPriceDisplay}
                    </span>
                  )}
                  <span className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums tracking-tight">
                    {product.priceDisplay || (product.price > 500 ? `PKR ${currentPrice.toLocaleString()}` : `$${currentPrice.toFixed(2)}`)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed mb-4 font-light">
                  {product.description}
                </p>

                {/* Features / Pyramid */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 mb-4 space-y-2 text-xs">
                  <div className="flex items-start text-stone-700">
                    <span className="w-16 font-semibold uppercase tracking-wider text-[10px] text-stone-900 shrink-0">
                      TOP
                    </span>
                    <span className="text-stone-600 text-[11px]">{product.topNotes.join(', ')}</span>
                  </div>
                  <div className="flex items-start text-stone-700">
                    <span className="w-16 font-semibold uppercase tracking-wider text-[10px] text-stone-900 shrink-0">
                      HEART
                    </span>
                    <span className="text-stone-600 text-[11px]">{product.heartNotes.join(', ')}</span>
                  </div>
                  <div className="flex items-start text-stone-700">
                    <span className="w-16 font-semibold uppercase tracking-wider text-[10px] text-stone-900 shrink-0">
                      BASE
                    </span>
                    <span className="text-stone-600 text-[11px]">{product.baseNotes.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Add to Bag */}
              <div className="flex items-center gap-3 pt-2 border-t border-stone-200/80">
                <div className="flex items-center border border-stone-300 rounded-lg bg-white px-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:text-stone-950 font-bold cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:text-stone-950 font-bold cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 bg-[#0E0E0E] hover:bg-stone-800 text-white py-3 px-4 sm:px-5 text-xs font-bold tracking-[0.16em] uppercase rounded-lg transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    ADD TO BAG · PKR {(currentPrice * quantity).toLocaleString()}
                  </span>
                </button>
              </div>

              {/* Trust & Authenticity Badges */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-stone-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                  100% Authentic AR SCENTS Products
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  2 Complimentary Sample Vials With Every Order
                </span>
              </div>

              {/* Delivery & Payment Guarantee Box (Karachi Only) */}
              <div className="mt-3 p-3 rounded-xl bg-stone-100/80 border border-stone-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/60">
                  <span className="flex items-center gap-1.5 font-bold text-stone-900 uppercase tracking-wider text-[10px] sm:text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                    Karachi Delivery Only
                  </span>
                  <span className="text-[10px] font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                    Flat PKR 200
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3 h-3 text-stone-700 shrink-0" />
                    <span>Advance Payment Required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>Easypaisa Available</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 text-stone-600 font-medium pt-0.5">
                    <Ban className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>Cash on Delivery Not Available</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

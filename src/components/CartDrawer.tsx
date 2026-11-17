import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // Flat Karachi delivery fee: PKR 200 (not multiplied by quantity)
  const deliveryCharges = items.length > 0 ? 200 : 0;
  const grandTotal = subtotal + deliveryCharges;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
          className="w-screen max-w-md bg-[#FAF8F5] border-l border-stone-200/80 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200/80 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-5 h-5 text-stone-900 stroke-[1.5]" />
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-stone-900">
                  SHOPPING BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-stone-500 hover:text-stone-900 transition rounded-full focus:outline-none cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Karachi Delivery Exclusive Notice */}
            <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 rounded-lg p-2.5 text-[11px] text-amber-900">
              <Truck className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <strong className="font-semibold">Karachi Delivery Only:</strong> Flat PKR 200 delivery fee. Advance payment via Easypaisa.
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1]" />
                </div>
                <h3 className="font-serif text-lg text-stone-800 font-medium">Your shopping bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1 mb-6">
                  Explore our curated high perfumery collections: Legacy, Phantom, and Serene.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#0E0E0E] text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded hover:bg-stone-800 transition cursor-pointer"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl p-3.5 border border-stone-200/70 shadow-2xs flex space-x-3.5 items-center"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-stone-100"
                    style={{ backgroundColor: item.product.cardBg || '#F6EFEA' }}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 truncate mt-0.5">
                      {item.selectedVolume || item.product.volume} · Eau de Parfum
                    </p>
                    <p className="text-xs font-semibold text-stone-900 tabular-nums mt-1">
                      PKR {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Stepper & Trash */}
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono tabular-nums text-stone-900 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Module */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-200/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Complimentary Samples</span>
                  <span className="text-stone-900 font-medium">Included (2 × 2ml)</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Karachi Flat Delivery</span>
                  <span className="text-stone-900 font-semibold">
                    PKR {deliveryCharges.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-950">
                  <span>Grand Total</span>
                  <span className="tabular-nums">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onCheckout}
                className="w-full bg-[#0E0E0E] hover:bg-stone-800 text-white py-3.5 px-4 text-xs font-bold tracking-[0.18em] uppercase rounded transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>Karachi Only · Advance Easypaisa Payment · No COD</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

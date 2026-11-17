import React from 'react';
import { Check, ShoppingBag, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, onOpenCart }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#111111] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3.5 border border-stone-700 max-w-sm">
        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-stone-200 truncate">
            {message}
          </p>
        </div>

        <button
          onClick={onOpenCart}
          className="text-[11px] font-bold tracking-wider uppercase text-amber-300 hover:text-amber-200 underline underline-offset-2 shrink-0 cursor-pointer"
        >
          View Bag
        </button>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

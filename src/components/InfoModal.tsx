import React from 'react';
import { X, Mail, Phone, MapPin, CreditCard, ShieldCheck, MessageCircle, Truck } from 'lucide-react';

export type InfoModalType = 'contact' | 'delivery' | 'easypaisa' | 'privacy' | null;

interface InfoModalProps {
  type: InfoModalType;
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, isOpen, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-150">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#FAF8F5] text-left shadow-2xl transition-all border border-stone-200/80 p-6 sm:p-8 z-10 my-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 p-1.5 rounded-full hover:bg-stone-200/60 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CONTACT MODAL */}
          {type === 'contact' && (
            <div className="space-y-5">
              <div className="text-center pb-2 border-b border-stone-200">
                <span className="font-serif text-2xl tracking-[0.24em] font-medium text-stone-900 block">
                  AR SCENTS
                </span>
                <span className="text-[10px] tracking-[0.32em] text-stone-500 uppercase font-semibold">
                  OFFICIAL CLIENT CONCIERGE
                </span>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed">
                Have questions regarding your order, Karachi delivery, or bespoke fragrance recommendations? Reach out directly to our concierge team.
              </div>

              <div className="space-y-3 pt-1">
                {/* Official Email */}
                <a
                  href="mailto:areebsaqib374@gmail.com"
                  className="flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-stone-200/80 hover:border-stone-900 transition group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-800 group-hover:bg-stone-900 group-hover:text-white transition shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Official Email Support
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-stone-900 truncate group-hover:underline">
                      areebsaqib374@gmail.com
                    </div>
                  </div>
                </a>

                {/* Official WhatsApp */}
                <a
                  href="https://wa.me/qr/LWMAL6IJMJSMN1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-stone-200/80 hover:border-emerald-600 transition group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Official WhatsApp Concierge
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-emerald-700 transition">
                      Instant WhatsApp Chat & Verification
                    </div>
                  </div>
                </a>

                <div className="p-3 bg-stone-100/70 rounded-xl text-[11px] text-stone-500 space-y-1">
                  <p><strong>Operating Hours:</strong> Monday – Saturday, 10:00 AM – 9:00 PM (PKT)</p>
                  <p><strong>Service Area:</strong> Karachi, Pakistan</p>
                </div>
              </div>
            </div>
          )}

          {/* KARACHI DELIVERY MODAL */}
          {type === 'delivery' && (
            <div className="space-y-5">
              <div className="text-center pb-2 border-b border-stone-200">
                <span className="font-serif text-2xl tracking-[0.24em] font-medium text-stone-900 block">
                  AR SCENTS
                </span>
                <span className="text-[10px] tracking-[0.32em] text-stone-500 uppercase font-semibold">
                  DELIVERY INFORMATION
                </span>
              </div>

              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
                <Truck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Karachi Delivery Only:</strong> We deliver exclusively within Karachi, Pakistan. All orders are hand-packed in protective luxury packaging.
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-2">
                  <div className="flex justify-between pb-1.5 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Delivery Area:</span>
                    <span className="font-bold text-stone-900">Karachi City Only</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Delivery Charges:</span>
                    <span className="font-bold text-stone-900">Flat PKR 200 per order</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Quantity Surcharge:</span>
                    <span className="font-semibold text-emerald-800">None (Fixed Flat Rate)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Complimentary Samples:</span>
                    <span className="font-semibold text-stone-900">2 Sample Vials with Every Order</span>
                  </div>
                </div>

                <div className="text-stone-600 text-[11px] space-y-1.5 leading-relaxed">
                  <p>• Orders are dispatched after phone confirmation with the client.</p>
                  <p>• Covered zones include DHA, Clifton, Gulshan-e-Iqbal, PECHS, Nazimabad, Johar, Saddar, and all major Karachi localities.</p>
                  <p>• Cash on delivery is not supported; all orders require advance Easypaisa confirmation.</p>
                </div>
              </div>
            </div>
          )}

          {/* EASYPAISA PAYMENT MODAL */}
          {type === 'easypaisa' && (
            <div className="space-y-5">
              <div className="text-center pb-2 border-b border-stone-200">
                <span className="font-serif text-2xl tracking-[0.24em] font-medium text-stone-900 block">
                  AR SCENTS
                </span>
                <span className="text-[10px] tracking-[0.32em] text-stone-500 uppercase font-semibold">
                  EASYPAISA ADVANCE PAYMENT
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-950 space-y-2">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-900">
                    Payment Method Details
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200/80 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Account Holder Name:</span>
                      <span className="font-bold text-stone-900">Muhammad Areeb Saqib</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Easypaisa Account Number:</span>
                      <span className="font-mono font-bold text-emerald-800">03101162153</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Account Type:</span>
                      <span className="font-semibold text-stone-800">Personal Easypaisa Account</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-2 text-stone-700">
                  <div className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                    How To Pay:
                  </div>
                  <p className="text-[11px] leading-relaxed">1. Open your Easypaisa App or dial *786# on your registered mobile number.</p>
                  <p className="text-[11px] leading-relaxed">2. Send the exact Grand Total (Subtotal + PKR 200 delivery fee) to our official Easypaisa account.</p>
                  <p className="text-[11px] leading-relaxed">3. Copy the 11-12 digit Transaction ID (TRX ID) received via SMS.</p>
                  <p className="text-[11px] leading-relaxed">4. Enter the TRX ID at checkout to finalize your booking.</p>
                </div>

                <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl text-[11px] text-rose-900 leading-relaxed">
                  ⚠️ <strong>Notice:</strong> Cash on Delivery (COD) is strictly unavailable. Orders enter <strong>Payment Pending</strong> status and will be dispatched once our verification desk confirms the transaction with you.
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY MODAL */}
          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="text-center pb-2 border-b border-stone-200">
                <span className="font-serif text-2xl tracking-[0.24em] font-medium text-stone-900 block">
                  AR SCENTS
                </span>
                <span className="text-[10px] tracking-[0.32em] text-stone-500 uppercase font-semibold">
                  PRIVACY POLICY
                </span>
              </div>

              <div className="space-y-3 text-xs text-stone-600 max-h-72 overflow-y-auto leading-relaxed pr-1">
                <p>
                  At <strong>AR SCENTS</strong>, we respect your privacy and are committed to protecting the personal information you share with us.
                </p>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  1. Information We Collect
                </h4>
                <p>
                  When you place an order, we collect your full name, Karachi delivery address, phone number, and payment transaction reference (TRX ID).
                </p>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  2. Use of Information
                </h4>
                <p>
                  Your details are utilized strictly for verifying your Easypaisa transfer, coordinating delivery via courier within Karachi, and providing order updates.
                </p>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  3. Contact & Inquiries
                </h4>
                <p>
                  For any privacy inquiries or record requests, please contact us at <a href="mailto:areebsaqib374@gmail.com" className="text-stone-900 font-semibold underline">areebsaqib374@gmail.com</a>.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

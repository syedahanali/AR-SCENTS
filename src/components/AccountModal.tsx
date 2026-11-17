import React, { useState, useEffect } from 'react';
import { X, Search, ShieldAlert, MessageCircle, Lock } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'track';
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'track'
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'track'>(initialTab);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  // Tracking state
  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [lookupSubmitted, setLookupSubmitted] = useState(false);

  // Sync initialTab when modal opens
  useEffect(() => {
    setActiveTab(initialTab);
    setLookupSubmitted(false);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim() || !phoneInput.trim()) return;
    setLookupSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-150">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#FAF8F5] text-left shadow-2xl transition-all border border-stone-200/80 p-6 sm:p-8 z-10 my-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 p-1 cursor-pointer rounded-full hover:bg-stone-200/60 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-serif text-2xl tracking-[0.24em] font-medium text-stone-900 block">
              AR SCENTS
            </span>
            <h2 className="text-[10px] tracking-[0.32em] text-stone-500 uppercase font-semibold mt-1">
              AR SCENTS ORDER SERVICES
            </h2>
          </div>

          {/* Navigation Tabs: SIGN IN & TRACK YOUR ORDER */}
          <div className="flex border-b border-stone-200 mb-6 text-xs font-semibold tracking-wider uppercase">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 pb-3 text-center transition cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-b-2 border-stone-900 text-stone-950 font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              1. Sign In
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`flex-1 pb-3 text-center transition cursor-pointer ${
                activeTab === 'track'
                  ? 'border-b-2 border-stone-900 text-stone-950 font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              2. Track Your Order
            </button>
          </div>

          {/* OPTION 1: SIGN IN */}
          {activeTab === 'signin' && (
            <div>
              {isSent ? (
                <div className="bg-stone-100 p-5 rounded-xl text-center text-xs text-stone-700 space-y-2 border border-stone-200">
                  <p className="font-bold text-stone-900 text-sm">Client Accounts Coming Soon</p>
                  <p>
                    Public self-service customer accounts require backend email authentication setup.
                    If you placed an order using <strong className="text-stone-900">{email}</strong>, please contact our WhatsApp Concierge for your status.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) setIsSent(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[11px] font-bold tracking-wider uppercase text-stone-700 block mb-1.5">
                      Customer Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@gmail.com"
                      required
                      className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0E0E0E] text-white py-3 px-4 text-xs font-bold tracking-[0.18em] uppercase rounded-lg hover:bg-stone-800 transition cursor-pointer shadow-sm"
                  >
                    CONTINUE TO ACCOUNT
                  </button>

                  <p className="text-[10px] text-center text-stone-500">
                    For security, guest checkout orders are protected and never exposed publicly in the browser.
                  </p>
                </form>
              )}
            </div>
          )}

          {/* OPTION 2: TRACK YOUR ORDER */}
          {activeTab === 'track' && (
            <div className="space-y-4">
              <form onSubmit={handleTrackOrder} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold tracking-wider uppercase text-stone-700 block mb-1.5">
                    Enter Order ID
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="e.g. ARS-123456"
                      className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-wider uppercase text-stone-700 block mb-1.5">
                    Registered Karachi Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 0300-1234567"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0E0E0E] text-white text-xs font-bold tracking-[0.18em] uppercase px-5 py-3 rounded-lg hover:bg-stone-800 transition cursor-pointer"
                >
                  TRACK ORDER
                </button>
              </form>

              {lookupSubmitted && (
                <div className="mt-4 bg-white border border-stone-200 rounded-xl p-4 space-y-3 text-xs text-stone-700 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <p className="font-bold text-stone-900">
                        Live Public Tracking Requires Backend Verification
                      </p>
                      <p className="text-[11px] leading-relaxed text-stone-600">
                        To protect customer privacy and phone/address data, AR SCENTS blocks direct browser queries to the orders database. Self-service tracking requires a verified Cloud Function endpoint matching both <span className="font-mono font-semibold text-stone-900">{orderIdInput.trim()}</span> and your phone number.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Orders encrypted &amp; admin-protected
                    </span>
                    <a
                      href="https://wa.me/qr/LWMAL6IJMJSMN1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold tracking-wider uppercase px-3.5 py-2 rounded-lg transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Check via WhatsApp Concierge</span>
                    </a>
                  </div>
                </div>
              )}

              {!lookupSubmitted && (
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  For your security, customer orders are not stored in browser storage or exposed to unauthenticated queries. Use your Order ID (<span className="font-mono">ARS-XXXXXX</span>) and registered mobile number or contact WhatsApp Concierge for live dispatch updates.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


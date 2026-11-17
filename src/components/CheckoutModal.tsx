import React, { useState, useRef } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Truck,
  Loader2
} from 'lucide-react';
import { CartItem, Order } from '../types';
import { submitOrderToFirestore } from '../services/orderService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

const KARACHI_AREAS = [
  'Clifton (Blocks 1-9)',
  'DHA Phase 1',
  'DHA Phase 2 & Ext',
  'DHA Phase 4',
  'DHA Phase 5 & Ext',
  'DHA Phase 6',
  'DHA Phase 7 & Ext',
  'DHA Phase 8',
  'Gulshan-e-Iqbal (Blocks 1-19)',
  'Gulistan-e-Johar (Blocks 1-20)',
  'PECHS (Blocks 1-6) / Tariq Road',
  'Bahadurabad & Sharfabad',
  'North Nazimabad (Blocks A-T)',
  'Nazimabad (Numbers 1-5)',
  'Saddar & Cantonment',
  'Federal B Area (Blocks 1-22)',
  'Malir & Model Colony',
  'Korangi & Creek Vista',
  'Defence View & Phase 1 Ext',
  'Buffer Zone & North Karachi',
  'Bath Island & Civil Lines',
  'Gulberg & Federal Capital Area',
  'Other Karachi Area'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [karachiArea, setKarachiArea] = useState(KARACHI_AREAS[0]);
  const [customArea, setCustomArea] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  if (!isOpen) return null;

  // Karachi Flat Delivery Fee is PKR 200 (not multiplied by quantity)
  const deliveryCharges = 200;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const grandTotal = subtotal + deliveryCharges;

  // Official Easypaisa account details
  const EASYPAISA_ACCOUNT_TITLE = 'Muhammad Areeb Saqib';
  const EASYPAISA_ACCOUNT_NUMBER = '03101162153';
  const EASYPAISA_RAW_NUMBER = '03101162153';
  const EASYPAISA_ACCOUNT_TYPE = 'Personal Easypaisa Account';

  const handleClose = () => {
    if (isSubmitting) return;
    if (submittedOrder) {
      setSubmittedOrder(null);
      setTransactionId('');
      setDeliveryNotes('');
    }
    setErrorMessage(null);
    onClose();
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(EASYPAISA_RAW_NUMBER).catch(() => {});
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return;
    setErrorMessage(null);

    // Validation aligned with firestore.rules constraints
    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add an item before placing an order.');
      return;
    }
    if (customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10 || phoneNumber.trim().length > 25) {
      setErrorMessage('Please enter a valid mobile number (10–25 characters, e.g. 0300-1234567).');
      return;
    }
    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setErrorMessage('Please enter a valid email address or leave the optional email field blank.');
      return;
    }
    if (deliveryAddress.trim().length < 5) {
      setErrorMessage('Please provide your complete delivery address in Karachi (at least 5 characters).');
      return;
    }
    const finalArea = karachiArea === 'Other Karachi Area' ? (customArea.trim() || 'Karachi') : karachiArea;
    if (karachiArea === 'Other Karachi Area' && customArea.trim().length < 2) {
      setErrorMessage('Please specify your Karachi area.');
      return;
    }
    if (transactionId.trim().length < 4) {
      setErrorMessage('Please enter a valid Easypaisa Transaction ID (TRX ID).');
      return;
    }

    // Generate unique Order ID
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newOrderId = `ARS-${randomDigits}`;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await submitOrderToFirestore({
        orderId: newOrderId,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        customerEmail: customerEmail.trim() || undefined,
        karachiArea: finalArea,
        deliveryAddress: deliveryAddress.trim(),
        notes: deliveryNotes.trim() || undefined,
        items: [...items],
        subtotal,
        deliveryFee: deliveryCharges,
        grandTotal,
        transactionId: transactionId.trim(),
        hasScreenshot: false,
        receiptPath: ''
      });

      const newOrder: Order = {
        orderId: newOrderId,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        customerEmail: customerEmail.trim() || undefined,
        karachiArea: finalArea,
        deliveryAddress: deliveryAddress.trim(),
        items: [...items],
        subtotal,
        deliveryCharges,
        grandTotal,
        paymentMethod: 'Easypaisa',
        transactionId: transactionId.trim(),
        paymentStatus: 'Payment Pending',
        orderStatus: 'Pending',
        createdAt: new Date().toISOString(),
        notes: deliveryNotes.trim() || undefined
      };

      setSubmittedOrder(newOrder);
      onOrderSuccess(newOrder);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to submit your order right now. Please try again.';
      setErrorMessage(message);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!submittedOrder && !isSubmitting) handleClose();
        }}
      />

      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 text-left">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-[#FAF8F5] shadow-2xl transition-all border border-stone-200/90 p-5 sm:p-7 z-10 my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <span className="font-serif text-xl sm:text-2xl tracking-[0.22em] font-medium text-stone-900 block">
                AR SCENTS
              </span>
              <span className="text-[10px] tracking-[0.28em] text-stone-500 uppercase font-semibold">
                SECURE CHECKOUT · KARACHI DELIVERY ONLY
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200/60 transition disabled:opacity-40"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submittedOrder ? (
            /* Order Placed Success View */
            <div className="py-6 sm:py-8 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-700 shadow-sm animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-[11px] font-bold tracking-widest uppercase rounded-full border border-amber-200">
                  Payment Status: Payment Pending
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium">
                  Order Received Successfully
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Thank you, <strong className="text-stone-900">{submittedOrder.customerName}</strong>! Your order has been placed.
                  Our team will verify your Easypaisa transaction and call you on{' '}
                  <strong className="text-stone-900">{submittedOrder.phoneNumber}</strong> to confirm dispatch.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 text-left max-w-md mx-auto space-y-3 shadow-2xs text-xs">
                <div className="flex justify-between pb-2.5 border-b border-stone-100">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-mono font-bold text-stone-900 tracking-wider">
                    {submittedOrder.orderId}
                  </span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-stone-100">
                  <span className="text-stone-500">Easypaisa TRX ID:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {submittedOrder.transactionId}
                  </span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-stone-100">
                  <span className="text-stone-500">Delivery City & Area:</span>
                  <span className="font-medium text-stone-900 text-right">
                    {submittedOrder.karachiArea}, Karachi
                  </span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-stone-100">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="font-medium text-stone-900 text-right max-w-[200px] truncate">
                    {submittedOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-stone-900">
                  <span>Grand Total (Advance):</span>
                  <span>PKR {submittedOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 max-w-md mx-auto text-center leading-relaxed">
                📌 <strong>Verification Notice:</strong> Orders will only be processed for packing and dispatch after our accounts desk matches your Transaction Reference ID with the received Easypaisa SMS.
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-[#0E0E0E] text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-3 rounded-lg hover:bg-stone-800 transition cursor-pointer shadow-md"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="mt-5 space-y-6">
              
              {/* Karachi Delivery Mandatory Alert Banner */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
                <Truck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong className="font-bold">Karachi Delivery Only:</strong> We currently deliver exclusively within Karachi, Pakistan. Flat delivery fee is <strong>PKR 200</strong>. Orders for other cities cannot be processed.
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2 text-xs text-rose-800 animate-in fade-in"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Customer & Delivery Details + Easypaisa (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Step 1: Customer Contact & Karachi Address */}
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                      <MapPin className="w-4 h-4 text-stone-800" />
                      <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-stone-900">
                        1. Karachi Delivery Address
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Ali Ahmed Khan"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Mobile / WhatsApp Number * (For Delivery Call)
                        </label>
                        <input
                          type="tel"
                          required
                          disabled={isSubmitting}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="0300-1234567 or 0321-1234567"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                          Email Address (Optional · For Future Order Confirmation)
                        </label>
                        <input
                          type="email"
                          disabled={isSubmitting}
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="e.g. customer@gmail.com"
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Karachi Area / Sector *
                        </label>
                        <select
                          disabled={isSubmitting}
                          value={karachiArea}
                          onChange={(e) => setKarachiArea(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                        >
                          {KARACHI_AREAS.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                      </div>

                      {karachiArea === 'Other Karachi Area' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                            Specify Karachi Area *
                          </label>
                          <input
                            type="text"
                            required
                            disabled={isSubmitting}
                            value={customArea}
                            onChange={(e) => setCustomArea(e.target.value)}
                            placeholder="Enter your Karachi locality"
                            className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Complete Street Address * (House/Apt, Street, Landmark)
                        </label>
                        <textarea
                          required
                          disabled={isSubmitting}
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="House / Flat #, Street #, Sector / Block, Near Landmark"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                          Delivery Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          disabled={isSubmitting}
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="e.g. Call before delivery, ring second bell"
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Easypaisa Manual Advance Payment Box */}
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-700" />
                        <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-stone-900">
                          2. Easypaisa Advance Payment
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        No COD Available
                      </span>
                    </div>

                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2 text-xs">
                      <div className="text-[11px] font-semibold text-emerald-950 uppercase tracking-wider">
                        Transfer Exact Total ({`PKR ${grandTotal.toLocaleString()}`}) to:
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-emerald-200/80 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-500">Account Holder Name:</span>
                          <span className="font-bold text-stone-900">
                            {EASYPAISA_ACCOUNT_TITLE}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-500">Easypaisa Account Number:</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-800">
                            <span>{EASYPAISA_ACCOUNT_NUMBER}</span>
                            <button
                              type="button"
                              onClick={handleCopyNumber}
                              className="text-stone-500 hover:text-stone-900 p-0.5 rounded transition cursor-pointer"
                              title="Copy Number"
                            >
                              {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-500">Account Type:</span>
                          <span className="font-semibold text-stone-800">
                            {EASYPAISA_ACCOUNT_TYPE}
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-emerald-900/90 leading-relaxed pt-1 space-y-1">
                        <p>1. Open your Easypaisa App or dial *786#.</p>
                        <p>2. Send <strong>PKR {grandTotal.toLocaleString()}</strong> to the above account.</p>
                        <p>3. Copy the 11-12 digit <strong>Transaction ID (TRX ID)</strong> from the SMS and paste it below.</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                          Easypaisa Transaction ID (TRX ID) *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. 10482910381"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 font-mono text-stone-900 text-xs focus:outline-none focus:border-stone-800 focus:bg-white transition disabled:opacity-60"
                        />
                        <p className="text-[10px] text-stone-500 mt-1">
                          You receive this reference ID in the confirmation SMS immediately after transferring.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Order Summary & Confirmation Button (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs space-y-4">
                    <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-stone-900 pb-2 border-b border-stone-100">
                      Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
                    </h4>

                    {/* Items List */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3 py-1">
                          <div
                            className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1 border border-stone-100"
                            style={{ backgroundColor: item.product.cardBg || '#F6EFEA' }}
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <div className="font-bold text-stone-900 uppercase truncate">
                              {item.product.name}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              Qty: {item.quantity} · {item.selectedVolume || item.product.volume}
                            </div>
                            <div className="font-semibold text-stone-900 tabular-nums">
                              PKR {(item.product.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                      <div className="flex justify-between text-stone-600">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-stone-900 tabular-nums">
                          PKR {subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Karachi Flat Delivery</span>
                        <span className="font-semibold text-stone-900 tabular-nums">
                          PKR {deliveryCharges.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Complimentary Samples</span>
                        <span className="font-medium text-emerald-800">2 × 2ml Included</span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                        <span>Grand Total</span>
                        <span className="tabular-nums">
                          PKR {grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || items.length === 0}
                      className="w-full bg-[#0E0E0E] hover:bg-stone-800 disabled:bg-stone-400 disabled:cursor-not-allowed text-white py-3.5 px-4 text-xs font-bold tracking-[0.18em] uppercase rounded-lg transition flex items-center justify-center gap-2 shadow-md cursor-pointer mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>SUBMITTING ORDER...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>PLACE ORDER (PKR {grandTotal.toLocaleString()})</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-stone-400 leading-tight">
                      By confirming, your order will be submitted with 'Payment Pending' status. Our staff will confirm your TRX ID before shipping.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-100/70 border border-stone-200 rounded-xl text-[10px] text-stone-500 space-y-1">
                    <p className="font-semibold text-stone-700">Client Service Guarantee:</p>
                    <p>• Fast delivery within Karachi via specialized courier.</p>
                    <p>• Hand-packed in tamper-proof luxury packaging.</p>
                    <p>• Real-time updates via SMS and WhatsApp.</p>
                  </div>
                </div>

              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

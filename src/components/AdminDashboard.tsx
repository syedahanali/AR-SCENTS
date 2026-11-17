import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LogOut,
  Search,
  Package,
  CheckCircle2,
  Eye,
  X,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';
import { AdminOrderRecord, OrderStatus, PaymentStatus } from '../types';
import { subscribeToAdminOrders, updateAdminOrder } from '../services/orderService';
import { logoutAdmin } from '../services/adminAuthService';
import { getReceiptDownloadUrl } from '../services/receiptUploadService';
import {
  AdminOrderReviewState,
  initializeReviewBaseline,
  isOrderUnreviewed,
  loadReviewState,
  markOrderReviewedInState,
  playNewOrderNotificationSound,
  unlockNotificationAudio
} from '../services/orderNotificationService';

interface AdminDashboardProps {
  adminUid?: string | null;
  adminEmail: string | null;
  onBackToStore: () => void;
}

const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  'Payment Pending',
  'Payment Verified',
  'Payment Rejected'
];

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

function getPaymentBadgeClass(status: PaymentStatus): string {
  switch (status) {
    case 'Payment Verified':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Payment Rejected':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'Payment Pending':
    default:
      return 'bg-amber-50 text-amber-900 border-amber-200';
  }
}

function getOrderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Shipped':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'Processing':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'Cancelled':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'Pending':
    default:
      return 'bg-stone-100 text-stone-800 border-stone-200';
  }
}

function formatDateTime(date: Date | null): string {
  if (!date) return 'Pending timestamp...';
  return date.toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUid,
  adminEmail,
  onBackToStore
}) => {
  const adminTrackingKey = adminUid || adminEmail || 'admin';

  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentStatus>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Selected Order Detail state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('Payment Pending');
  const [editOrderStatus, setEditOrderStatus] = useState<OrderStatus>('Pending');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [copiedTrx, setCopiedTrx] = useState(false);

  // Receipt viewer state
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  // New Order Notification & Review Tracking state
  const [reviewState, setReviewState] = useState<AdminOrderReviewState | null>(() =>
    loadReviewState(adminTrackingKey)
  );
  const reviewStateRef = useRef<AdminOrderReviewState | null>(reviewState);
  const [sessionNewOrderIds, setSessionNewOrderIds] = useState<Set<string>>(() => new Set());
  const sessionNewOrderIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedInitialSnapshotRef = useRef(false);
  const knownDocIdsRef = useRef<Set<string>>(new Set());
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [liveNewOrderAlert, setLiveNewOrderAlert] = useState<AdminOrderRecord | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(true);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const initial = loadReviewState(adminTrackingKey);
    reviewStateRef.current = initial;
    setReviewState(initial);
    hasLoadedInitialSnapshotRef.current = false;
    knownDocIdsRef.current = new Set();
    sessionNewOrderIdsRef.current = new Set();
    setSessionNewOrderIds(new Set());
  }, [adminTrackingKey]);

  // Unlock browser Web Audio on first user interaction for subtle live-order chimes
  useEffect(() => {
    const handleUnlock = () => unlockNotificationAudio();
    window.addEventListener('pointerdown', handleUnlock, { passive: true });
    window.addEventListener('keydown', handleUnlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
    };
  }, []);

  // Close notification dropdown on outside click or Escape
  useEffect(() => {
    if (!isNotificationMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationMenuOpen]);

  // Auto-hide floating live incoming order toast after 10 seconds
  useEffect(() => {
    if (!liveNewOrderAlert) return;
    const timer = window.setTimeout(() => {
      setLiveNewOrderAlert(null);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [liveNewOrderAlert]);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);

    const unsubscribe = subscribeToAdminOrders(
      (fetchedOrders) => {
        if (!hasLoadedInitialSnapshotRef.current) {
          hasLoadedInitialSnapshotRef.current = true;
          knownDocIdsRef.current = new Set(fetchedOrders.map((o) => o.firestoreDocId));

          const existingState = loadReviewState(adminTrackingKey);
          if (!existingState) {
            // Establish baseline on first-ever load so existing orders are not marked as NEW
            const initialized = initializeReviewBaseline(adminTrackingKey, fetchedOrders);
            reviewStateRef.current = initialized;
            setReviewState(initialized);
          } else {
            reviewStateRef.current = existingState;
            setReviewState(existingState);
          }
          // Do not play sound on initial loading
        } else {
          const arrivedOrders = fetchedOrders.filter(
            (o) => !knownDocIdsRef.current.has(o.firestoreDocId)
          );
          knownDocIdsRef.current = new Set(fetchedOrders.map((o) => o.firestoreDocId));

          const currentReviewState = reviewStateRef.current;
          const genuinelyNewOrders = arrivedOrders.filter((o) => {
            if (o.isReviewed === true) return false;
            if (currentReviewState?.reviewedOrderIds.includes(o.firestoreDocId)) {
              return false;
            }
            return true;
          });

          if (genuinelyNewOrders.length > 0) {
            const nextSessionSet = new Set(sessionNewOrderIdsRef.current);
            genuinelyNewOrders.forEach((o) => nextSessionSet.add(o.firestoreDocId));
            sessionNewOrderIdsRef.current = nextSessionSet;
            setSessionNewOrderIds(nextSessionSet);

            setIsBannerDismissed(false);
            setLiveNewOrderAlert(genuinelyNewOrders[0]);

            if (soundEnabledRef.current) {
              playNewOrderNotificationSound();
            }
          }
        }

        setOrders(fetchedOrders);
        setIsLoading(false);
        setLoadError(null);
      },
      (message) => {
        setLoadError(message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [adminTrackingKey]);

  const unreviewedOrders = useMemo(
    () =>
      orders.filter((order) =>
        isOrderUnreviewed(order, reviewState, sessionNewOrderIds)
      ),
    [orders, reviewState, sessionNewOrderIds]
  );

  const unreviewedOrderIdSet = useMemo(
    () => new Set(unreviewedOrders.map((order) => order.firestoreDocId)),
    [unreviewedOrders]
  );

  const handleOpenOrder = (order: AdminOrderRecord) => {
    // Mark order as reviewed persistently without modifying paymentStatus or orderStatus
    const nextState = markOrderReviewedInState(
      adminTrackingKey,
      reviewStateRef.current,
      order.firestoreDocId
    );
    reviewStateRef.current = nextState;
    setReviewState(nextState);

    if (sessionNewOrderIdsRef.current.has(order.firestoreDocId)) {
      const nextSession = new Set(sessionNewOrderIdsRef.current);
      nextSession.delete(order.firestoreDocId);
      sessionNewOrderIdsRef.current = nextSession;
      setSessionNewOrderIds(nextSession);
    }

    if (liveNewOrderAlert?.firestoreDocId === order.firestoreDocId) {
      setLiveNewOrderAlert(null);
    }

    setIsNotificationMenuOpen(false);
    setSelectedOrderId(order.firestoreDocId);
  };

  const selectedOrder = useMemo(
    () => orders.find((o) => o.firestoreDocId === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  // Sync modal edit inputs when an order is opened
  useEffect(() => {
    if (!selectedOrder) {
      setReceiptUrl(null);
      setReceiptError(null);
      return;
    }

    setEditPaymentStatus(selectedOrder.paymentStatus);
    setEditOrderStatus(selectedOrder.orderStatus);
    setEditAdminNotes(selectedOrder.adminNotes);
    setSaveError(null);
    setSaveSuccess(null);

    if (selectedOrder.receiptPath) {
      setReceiptLoading(true);
      setReceiptError(null);
      getReceiptDownloadUrl(selectedOrder.receiptPath)
        .then((url) => {
          setReceiptUrl(url);
        })
        .catch((err) => {
          setReceiptError(
            err instanceof Error ? err.message : 'Unable to load payment receipt.'
          );
          setReceiptUrl(null);
        })
        .finally(() => {
          setReceiptLoading(false);
        });
    } else {
      setReceiptUrl(null);
      setReceiptError(null);
      setReceiptLoading(false);
    }
  }, [selectedOrder?.firestoreDocId]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter) {
        return false;
      }
      if (orderStatusFilter !== 'all' && order.orderStatus !== orderStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        order.orderId.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phoneNumber.toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery, paymentFilter, orderStatusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pendingPayment = orders.filter((o) => o.paymentStatus === 'Payment Pending').length;
    const verifiedPayment = orders.filter((o) => o.paymentStatus === 'Payment Verified').length;
    const activeFulfillment = orders.filter(
      (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing'
    ).length;
    const verifiedRevenue = orders
      .filter((o) => o.paymentStatus === 'Payment Verified')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    return { total, pendingPayment, verifiedPayment, activeFulfillment, verifiedRevenue };
  }, [orders]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || isSaving) return;

    setSaveError(null);
    setSaveSuccess(null);
    setIsSaving(true);

    try {
      await updateAdminOrder(selectedOrder.firestoreDocId, {
        paymentStatus: editPaymentStatus,
        orderStatus: editOrderStatus,
        adminNotes: editAdminNotes
      });
      setSaveSuccess('Order updated successfully.');
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Failed to update order.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyTrx = (trx: string) => {
    navigator.clipboard.writeText(trx).catch(() => {});
    setCopiedTrx(true);
    setTimeout(() => setCopiedTrx(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-[#0E0E0E] text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-serif text-xl sm:text-2xl tracking-[0.24em] font-medium block leading-none">
                AR SCENTS
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-amber-300/90 uppercase font-semibold block mt-1">
                ADMIN ORDER MANAGEMENT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {adminEmail && (
              <span className="hidden md:inline-block text-xs text-stone-300 border border-stone-700 bg-stone-900/70 px-3 py-1.5 rounded-lg">
                {adminEmail}
              </span>
            )}

            {/* Notification Bell with Unread Order Count */}
            <div className="relative" ref={notificationMenuRef}>
              <button
                type="button"
                onClick={() => setIsNotificationMenuOpen((prev) => !prev)}
                aria-label={`Order notifications (${unreviewedOrders.length} unread)`}
                aria-expanded={isNotificationMenuOpen}
                className="relative inline-flex items-center justify-center p-2 text-stone-200 hover:text-white border border-stone-700 hover:border-stone-500 bg-stone-900/70 rounded-lg transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreviewedOrders.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center leading-none shadow-sm">
                    {unreviewedOrders.length > 99 ? '99+' : unreviewedOrders.length}
                  </span>
                )}
              </button>

              {isNotificationMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-stone-900 rounded-xl border border-stone-200 shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
                        New Order Alerts
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {unreviewedOrders.length === 0
                          ? 'All orders reviewed'
                          : `${unreviewedOrders.length} unreviewed order${
                              unreviewedOrders.length === 1 ? '' : 's'
                            }`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSoundEnabled((prev) => !prev)}
                      title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-100 text-[10px] font-semibold text-stone-700 transition cursor-pointer"
                    >
                      {soundEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Sound On</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                          <span>Muted</span>
                        </>
                      )}
                    </button>
                  </div>

                  {unreviewedOrders.length === 0 ? (
                    <div className="px-4 py-6 text-center space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="text-xs font-medium text-stone-700">
                        No unreviewed new orders
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Incoming customer orders will appear here in real time.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                      {unreviewedOrders.map((order) => (
                        <button
                          key={order.firestoreDocId}
                          type="button"
                          onClick={() => handleOpenOrder(order)}
                          className="w-full text-left px-4 py-3 hover:bg-amber-50/70 transition flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-stone-900">
                                {order.orderId}
                              </span>
                              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-600 text-white">
                                NEW
                              </span>
                            </div>
                            <p className="text-xs font-medium text-stone-800 truncate mt-0.5">
                              {order.customerName} · {order.karachiArea}
                            </p>
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                          <span className="font-bold text-xs text-stone-900 tabular-nums shrink-0">
                            PKR {order.grandTotal.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-stone-200 hover:text-white border border-stone-700 hover:border-stone-500 px-3 py-2 rounded-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <button
              type="button"
              onClick={() => logoutAdmin()}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase bg-white text-stone-950 hover:bg-stone-200 px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Unreviewed New Orders Notification Banner */}
        {!isLoading && unreviewedOrders.length > 0 && !isBannerDismissed && (
          <div
            role="status"
            className="bg-[#0E0E0E] text-white rounded-2xl border border-amber-500/45 p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold tracking-wide text-white">
                    {unreviewedOrders.length} Unreviewed New Order
                    {unreviewedOrders.length === 1 ? '' : 's'}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-amber-500 text-stone-950">
                    NEW
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Latest: <span className="font-mono font-semibold text-amber-200">{unreviewedOrders[0].orderId}</span>{' '}
                  from <strong className="text-white">{unreviewedOrders[0].customerName}</strong> (PKR{' '}
                  {unreviewedOrders[0].grandTotal.toLocaleString()}). Opening an order marks it reviewed without changing payment status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenOrder(unreviewedOrders[0])}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition cursor-pointer"
              >
                Review Latest Order
              </button>
              <button
                type="button"
                onClick={() => setIsBannerDismissed(true)}
                aria-label="Dismiss notification banner"
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Metrics Overview */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Total Orders
            </span>
            <span className="text-2xl font-serif font-semibold text-stone-900 mt-1 block">
              {stats.total}
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Payment Pending
            </span>
            <span className="text-2xl font-serif font-semibold text-amber-900 mt-1 block">
              {stats.pendingPayment}
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Payment Verified
            </span>
            <span className="text-2xl font-serif font-semibold text-emerald-900 mt-1 block">
              {stats.verifiedPayment}
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              To Fulfill
            </span>
            <span className="text-2xl font-serif font-semibold text-stone-900 mt-1 block">
              {stats.activeFulfillment}
            </span>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-[#0E0E0E] text-white rounded-xl p-4 border border-stone-800 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Verified Revenue
            </span>
            <span className="text-xl sm:text-2xl font-serif font-semibold text-amber-200 mt-1 block tabular-nums">
              PKR {stats.verifiedRevenue.toLocaleString()}
            </span>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID (ARS-...), Customer Name, or Phone #"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition"
              />
            </div>

            {/* Payment Status Filter */}
            <div className="md:col-span-3">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as 'all' | PaymentStatus)}
                aria-label="Filter by payment status"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition"
              >
                <option value="all">All Payment Statuses</option>
                {PAYMENT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Status Filter */}
            <div className="md:col-span-3">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value as 'all' | OrderStatus)}
                aria-label="Filter by order status"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition"
              >
                <option value="all">All Order Statuses</option>
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span>
              Showing <strong className="text-stone-900">{filteredOrders.length}</strong> of{' '}
              <strong className="text-stone-900">{orders.length}</strong> orders (newest first)
            </span>
            {(searchQuery || paymentFilter !== 'all' || orderStatusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPaymentFilter('all');
                  setOrderStatusFilter('all');
                }}
                className="text-stone-700 hover:text-stone-950 font-semibold underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </section>

        {/* Error Banner */}
        {loadError && (
          <div
            role="alert"
            className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-800"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Unable to load orders</p>
              <p className="mt-0.5">{loadError}</p>
            </div>
          </div>
        )}

        {/* Loading / Empty / Orders List */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center space-y-3">
            <Loader2 className="w-7 h-7 animate-spin text-stone-700 mx-auto" />
            <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
              Loading Firestore Orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center space-y-2">
            <Package className="w-9 h-9 text-stone-300 mx-auto" />
            <h3 className="font-serif text-xl text-stone-900 font-medium">
              {orders.length === 0 ? 'No orders submitted yet' : 'No matching orders found'}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {orders.length === 0
                ? 'Customer orders placed through checkout will appear here in real time.'
                : 'Try adjusting your search query or clearing your status filters.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Karachi Area</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">TRX ID</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Order Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {filteredOrders.map((order) => {
                      const isNewOrder = unreviewedOrderIdSet.has(order.firestoreDocId);
                      return (
                        <tr
                          key={order.firestoreDocId}
                          onClick={() => handleOpenOrder(order)}
                          className={`transition cursor-pointer ${
                            isNewOrder
                              ? 'bg-amber-50/45 hover:bg-amber-50/80'
                              : 'hover:bg-stone-50/90'
                          }`}
                        >
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-stone-900">
                                {order.orderId}
                              </span>
                              {isNewOrder && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-amber-600 text-white shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  NEW
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400 block mt-0.5">
                              {formatDateTime(order.createdAt)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-semibold text-stone-900">{order.customerName}</div>
                            <div className="text-[11px] text-stone-500 font-mono">{order.phoneNumber}</div>
                          </td>
                          <td className="py-3.5 px-4 align-top text-stone-600 max-w-[160px] truncate">
                            {order.karachiArea}
                          </td>
                          <td className="py-3.5 px-4 align-top text-stone-700">
                            {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                          </td>
                          <td className="py-3.5 px-4 align-top font-mono text-[11px] text-stone-800">
                            {order.transactionId}
                          </td>
                          <td className="py-3.5 px-4 align-top font-bold text-stone-900 tabular-nums whitespace-nowrap">
                            PKR {order.grandTotal.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap ${getPaymentBadgeClass(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap ${getOrderStatusBadgeClass(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-top text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenOrder(order);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 hover:text-stone-950 border border-stone-200 hover:border-stone-400 px-2.5 py-1 rounded-lg bg-white transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="lg:hidden space-y-3">
              {filteredOrders.map((order) => {
                const isNewOrder = unreviewedOrderIdSet.has(order.firestoreDocId);
                return (
                  <div
                    key={order.firestoreDocId}
                    onClick={() => handleOpenOrder(order)}
                    className={`rounded-xl border p-4 space-y-3 shadow-2xs cursor-pointer transition ${
                      isNewOrder
                        ? 'bg-amber-50/35 border-amber-300'
                        : 'bg-white border-stone-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-stone-900">
                            {order.orderId}
                          </span>
                          {isNewOrder && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-amber-600 text-white">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              NEW
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {formatDateTime(order.createdAt)}
                        </span>
                      </div>
                      <span className="font-bold text-sm text-stone-900 tabular-nums">
                        PKR {order.grandTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Customer</span>
                        <span className="font-semibold text-stone-900 block">{order.customerName}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{order.phoneNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Area & TRX</span>
                        <span className="text-stone-700 block truncate">{order.karachiArea}</span>
                        <span className="text-[11px] font-mono text-stone-800">{order.transactionId}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getPaymentBadgeClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getOrderStatusBadgeClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-stone-800 inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Order Detail & Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
            onClick={() => {
              if (!isSaving) setSelectedOrderId(null);
            }}
          />

          <div className="flex min-h-screen items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl p-5 sm:p-7 z-10 my-6 space-y-5">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 block">
                    Order Details
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5 mt-1">
                    <h2 className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
                      {selectedOrder.orderId}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getPaymentBadgeClass(
                        selectedOrder.paymentStatus
                      )}`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getOrderStatusBadgeClass(
                        selectedOrder.orderStatus
                      )}`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Created: {formatDateTime(selectedOrder.createdAt)} · Last Updated:{' '}
                    {formatDateTime(selectedOrder.updatedAt)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setSelectedOrderId(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200/70 transition cursor-pointer"
                  aria-label="Close order details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer & Delivery Details */}
                <div className="bg-white rounded-xl border border-stone-200/80 p-4 space-y-2.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-800" />
                    Customer & Delivery Information
                  </h3>

                  <div className="space-y-1.5 text-stone-700">
                    <p>
                      <span className="text-stone-400 block text-[10px] uppercase">Full Name</span>
                      <strong className="text-stone-900">{selectedOrder.customerName}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-mono font-semibold text-stone-900">
                        {selectedOrder.phoneNumber}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-stone-700">
                        {selectedOrder.customerEmail || 'Not provided'}
                      </span>
                    </p>
                    <p>
                      <span className="text-stone-400 block text-[10px] uppercase">Karachi Area</span>
                      <span className="font-medium text-stone-900">
                        {selectedOrder.karachiArea}
                      </span>
                    </p>
                    <p>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        Full Delivery Address
                      </span>
                      <span className="text-stone-800">{selectedOrder.deliveryAddress}</span>
                    </p>
                    <p>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        Customer Notes
                      </span>
                      <span className="text-stone-700 italic">
                        {selectedOrder.notes || 'None'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Payment & Receipt Verification */}
                <div className="bg-white rounded-xl border border-stone-200/80 p-4 space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    Easypaisa Payment Details
                  </h3>

                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Method:</span>
                      <span className="font-bold text-stone-900">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Transaction ID:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-900">
                          {selectedOrder.transactionId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTrx(selectedOrder.transactionId)}
                          className="p-0.5 text-stone-500 hover:text-stone-900 cursor-pointer"
                          title="Copy TRX ID"
                        >
                          {copiedTrx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Receipt Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Uploaded Payment Receipt
                    </span>

                    {receiptLoading ? (
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-2 text-stone-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading receipt image...</span>
                      </div>
                    ) : receiptUrl ? (
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border border-stone-200 hover:border-stone-400 transition"
                      >
                        <img
                          src={receiptUrl}
                          alt={`Receipt for ${selectedOrder.orderId}`}
                          className="w-full max-h-48 object-contain bg-stone-50"
                        />
                      </a>
                    ) : receiptError ? (
                      <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                        {receiptError}
                      </p>
                    ) : selectedOrder.hasScreenshot ? (
                      <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                        Customer attached a local preview during checkout, but Firebase Storage upload was not active yet. Verify manually using the TRX ID or WhatsApp.
                      </p>
                    ) : (
                      <p className="text-[11px] text-stone-500 bg-stone-50 border border-stone-200 rounded-lg p-2.5">
                        No payment receipt image uploaded for this order.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ordered Items & Totals */}
              <div className="bg-white rounded-xl border border-stone-200/80 p-4 space-y-3 text-xs">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100">
                  Ordered Fragrances & Pricing Breakdown
                </h3>

                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="py-2 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-bold text-stone-900 uppercase">
                          {item.productName}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {item.selectedVolume} · Unit: PKR {item.unitPrice.toLocaleString()} ×{' '}
                          {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-stone-900 tabular-nums">
                        PKR {item.lineTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium">
                      PKR {selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Karachi Flat Delivery Fee</span>
                    <span className="tabular-nums font-medium">
                      PKR {selectedOrder.deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-950 pt-1">
                    <span>Grand Total</span>
                    <span className="tabular-nums">
                      PKR {selectedOrder.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Management Controls */}
              <form
                onSubmit={handleSaveChanges}
                className="bg-white rounded-xl border border-stone-200/80 p-4 space-y-4 text-xs"
              >
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-900 pb-1.5 border-b border-stone-100 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-stone-700" />
                  Admin Verification & Fulfillment Update
                </h3>

                {saveError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{saveError}</span>
                  </div>
                )}

                {saveSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{saveSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Payment Status
                    </label>
                    <select
                      disabled={isSaving}
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Order Status
                    </label>
                    <select
                      disabled={isSaving}
                      value={editOrderStatus}
                      onChange={(e) => setEditOrderStatus(e.target.value as OrderStatus)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    disabled={isSaving}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Record TRX verification notes, rider assignment, or call confirmation..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setSelectedOrderId(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#0E0E0E] hover:bg-stone-800 disabled:bg-stone-400 text-white px-5 py-2.5 text-xs font-bold tracking-[0.16em] uppercase rounded-lg transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>SAVING...</span>
                      </>
                    ) : (
                      <span>SAVE CHANGES</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Incoming Order Popup */}
      {liveNewOrderAlert && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-sm w-[calc(100vw-2.5rem)] bg-[#0E0E0E] text-white border border-amber-500/50 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    New Order Received
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-500 text-stone-950">
                    NEW
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-white mt-0.5">
                  {liveNewOrderAlert.orderId}
                </p>
                <p className="text-[11px] text-stone-300 truncate">
                  {liveNewOrderAlert.customerName} · PKR {liveNewOrderAlert.grandTotal.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLiveNewOrderAlert(null)}
              aria-label="Close incoming order alert"
              className="p-1 text-stone-400 hover:text-white rounded transition cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setLiveNewOrderAlert(null)}
              className="px-3 py-1.5 text-[11px] font-medium text-stone-300 hover:text-white transition cursor-pointer"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => handleOpenOrder(liveNewOrderAlert)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              Open Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  FieldValue,
  Timestamp
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from '../firebase';
import {
  IS_FIREBASE_STORAGE_READY,
  isValidReceiptStoragePath
} from './receiptUploadService';
import {
  HERO_PRODUCT,
  FEATURED_PRODUCTS,
  DISCOVERY_SET_PRODUCT,
  GIFT_SET_PRODUCT
} from '../data/products';
import {
  CartItem,
  AdminOrderRecord,
  FirestoreOrderItem,
  PaymentStatus,
  OrderStatus
} from '../types';

export interface SubmitOrderInput {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  customerEmail?: string;
  karachiArea: string;
  deliveryAddress: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  transactionId: string;
  hasScreenshot?: boolean;
  receiptPath?: string;
}

export interface FirestoreOrderPayload {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  karachiArea: string;
  deliveryAddress: string;
  notes: string;
  items: FirestoreOrderItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  currency: 'PKR';
  paymentMethod: 'Easypaisa';
  transactionId: string;
  hasScreenshot: boolean;
  receiptPath: string;
  paymentStatus: 'Payment Pending';
  orderStatus: 'Pending';
  adminNotes: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface SubmitOrderResult {
  firestoreDocId: string;
  orderId: string;
}

export interface UpdateAdminOrderInput {
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  adminNotes: string;
}

const CATALOG_PRODUCTS = [
  HERO_PRODUCT,
  ...FEATURED_PRODUCTS,
  DISCOVERY_SET_PRODUCT,
  GIFT_SET_PRODUCT
];

const DELIVERY_FEE_PKR = 200;

const ALLOWED_PAYMENT_STATUSES: PaymentStatus[] = [
  'Payment Pending',
  'Payment Verified',
  'Payment Rejected'
];

const ALLOWED_ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export async function submitOrderToFirestore(
  input: SubmitOrderInput
): Promise<SubmitOrderResult> {
  if (!input.items || input.items.length === 0) {
    throw new Error('Your shopping bag is empty. Please add at least one item before placing an order.');
  }
  if (input.items.length > 10) {
    throw new Error('A single order may contain up to 10 distinct line items.');
  }

  const trimmedOrderId = input.orderId.trim();
  const trimmedName = input.customerName.trim();
  const trimmedPhone = input.phoneNumber.trim();
  const trimmedEmail = input.customerEmail ? input.customerEmail.trim() : '';
  const trimmedArea = input.karachiArea.trim();
  const trimmedAddress = input.deliveryAddress.trim();
  const trimmedNotes = input.notes ? input.notes.trim() : '';
  const trimmedTrx = input.transactionId.trim();

  if (!/^ARS-[0-9]{6}$/.test(trimmedOrderId)) {
    throw new Error('Invalid order reference format.');
  }
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    throw new Error('Full name must be between 2 and 100 characters.');
  }
  if (trimmedPhone.length < 10 || trimmedPhone.length > 25) {
    throw new Error('Phone number must be between 10 and 25 characters.');
  }
  if (trimmedEmail.length > 150) {
    throw new Error('Email address cannot exceed 150 characters.');
  }
  if (trimmedArea.length < 2 || trimmedArea.length > 120) {
    throw new Error('Karachi area must be between 2 and 120 characters.');
  }
  if (trimmedAddress.length < 5 || trimmedAddress.length > 400) {
    throw new Error('Delivery address must be between 5 and 400 characters.');
  }
  if (trimmedNotes.length > 500) {
    throw new Error('Delivery notes cannot exceed 500 characters.');
  }
  if (trimmedTrx.length < 4 || trimmedTrx.length > 64) {
    throw new Error('Easypaisa Transaction ID must be between 4 and 64 characters.');
  }

  // Look up authoritative catalog prices locally as client-side defense-in-depth.
  // Note: True tamper-proof price enforcement requires a trusted server/Cloud Function.
  const sanitizedItems: FirestoreOrderItem[] = input.items.map((item) => {
    const catalogMatch = CATALOG_PRODUCTS.find((p) => p.id === item.product.id);
    if (!catalogMatch) {
      throw new Error(`Unrecognized product in cart: ${item.product.name}`);
    }
    const unitPrice = Number(catalogMatch.price);
    const quantity = Math.max(1, Math.min(50, Math.floor(Number(item.quantity) || 1)));
    const selectedVolume = String(item.selectedVolume || catalogMatch.volume || '30ml').slice(0, 80);

    return {
      productId: String(catalogMatch.id).slice(0, 80),
      productName: String(catalogMatch.name).slice(0, 120),
      quantity,
      selectedVolume,
      unitPrice,
      lineTotal: unitPrice * quantity
    };
  });

  const computedSubtotal = sanitizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const computedGrandTotal = computedSubtotal + DELIVERY_FEE_PKR;

  const orderRef = doc(collection(db, 'orders'));

  const requestedReceiptPath = input.receiptPath ? input.receiptPath.trim() : '';
  const safeReceiptPath =
    IS_FIREBASE_STORAGE_READY &&
    requestedReceiptPath &&
    isValidReceiptStoragePath(orderRef.id, requestedReceiptPath)
      ? requestedReceiptPath
      : '';

  const payload: FirestoreOrderPayload = {
    orderId: trimmedOrderId,
    customerName: trimmedName,
    phoneNumber: trimmedPhone,
    customerEmail: trimmedEmail,
    karachiArea: trimmedArea,
    deliveryAddress: trimmedAddress,
    notes: trimmedNotes,
    items: sanitizedItems,
    subtotal: computedSubtotal,
    deliveryFee: DELIVERY_FEE_PKR,
    grandTotal: computedGrandTotal,
    currency: 'PKR',
    paymentMethod: 'Easypaisa',
    transactionId: trimmedTrx,
    hasScreenshot: Boolean(input.hasScreenshot),
    receiptPath: safeReceiptPath,
    paymentStatus: 'Payment Pending',
    orderStatus: 'Pending',
    adminNotes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(orderRef, payload);
    return {
      firestoreDocId: orderRef.id,
      orderId: payload.orderId
    };
  } catch (error) {
    console.error('Failed to submit order to Firestore:', error);

    if (error instanceof FirebaseError) {
      if (error.code === 'permission-denied') {
        throw new Error(
          'Order submission was blocked by Firestore security rules (permission-denied). Deploy firestore.rules in Firebase Console to permit validated order creation.'
        );
      }
      if (error.code === 'unavailable') {
        throw new Error(
          'Unable to reach the order service right now. Please check your internet connection and try again.'
        );
      }
      throw new Error(`Unable to submit order (${error.code}). Please try again.`);
    }

    throw new Error('An unexpected error occurred while submitting your order. Please try again.');
  }
}

function toDateSafe(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

export function subscribeToAdminOrders(
  onOrders: (orders: AdminOrderRecord[]) => void,
  onError: (message: string) => void
): () => void {
  const ordersQuery = query(
    collection(db, 'orders'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const records: AdminOrderRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const rawItems = Array.isArray(data.items) ? data.items : [];

        return {
          firestoreDocId: docSnap.id,
          orderId: String(data.orderId || docSnap.id),
          customerName: String(data.customerName || ''),
          phoneNumber: String(data.phoneNumber || ''),
          customerEmail: String(data.customerEmail || ''),
          karachiArea: String(data.karachiArea || ''),
          deliveryAddress: String(data.deliveryAddress || ''),
          notes: String(data.notes || ''),
          items: rawItems.map((item: Record<string, unknown>) => ({
            productId: String(item.productId || ''),
            productName: String(item.productName || ''),
            quantity: Number(item.quantity || 0),
            selectedVolume: String(item.selectedVolume || ''),
            unitPrice: Number(item.unitPrice || 0),
            lineTotal: Number(item.lineTotal || 0)
          })),
          subtotal: Number(data.subtotal || 0),
          deliveryFee: Number(data.deliveryFee ?? 200),
          grandTotal: Number(data.grandTotal || 0),
          currency: 'PKR',
          paymentMethod: 'Easypaisa',
          transactionId: String(data.transactionId || ''),
          hasScreenshot: Boolean(data.hasScreenshot),
          receiptPath: String(data.receiptPath || ''),
          paymentStatus: ALLOWED_PAYMENT_STATUSES.includes(data.paymentStatus)
            ? data.paymentStatus
            : 'Payment Pending',
          orderStatus: ALLOWED_ORDER_STATUSES.includes(data.orderStatus)
            ? data.orderStatus
            : 'Pending',
          adminNotes: String(data.adminNotes || ''),
          createdAt: toDateSafe(data.createdAt),
          updatedAt: toDateSafe(data.updatedAt),
          isReviewed: typeof data.isReviewed === 'boolean' ? data.isReviewed : undefined,
          reviewedAt: toDateSafe(data.reviewedAt),
          reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : undefined
        };
      });

      onOrders(records);
    },
    (error) => {
      console.error('Failed to subscribe to admin orders:', error);
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        onError(
          'Permission denied while reading orders. Ensure firestore.rules are deployed and your UID is registered in the admins collection.'
        );
        return;
      }
      onError('Unable to load orders from Firestore. Please check your connection and try again.');
    }
  );
}

export async function updateAdminOrder(
  firestoreDocId: string,
  updates: UpdateAdminOrderInput
): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(firestoreDocId)) {
    throw new Error('Invalid order document identifier.');
  }
  if (!ALLOWED_PAYMENT_STATUSES.includes(updates.paymentStatus)) {
    throw new Error('Invalid payment status selected.');
  }
  if (!ALLOWED_ORDER_STATUSES.includes(updates.orderStatus)) {
    throw new Error('Invalid order status selected.');
  }

  const trimmedNotes = updates.adminNotes.trim();
  if (trimmedNotes.length > 1000) {
    throw new Error('Admin notes cannot exceed 1,000 characters.');
  }

  try {
    const orderRef = doc(db, 'orders', firestoreDocId);
    await updateDoc(orderRef, {
      paymentStatus: updates.paymentStatus,
      orderStatus: updates.orderStatus,
      adminNotes: trimmedNotes,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to update order in Firestore:', error);
    if (error instanceof FirebaseError && error.code === 'permission-denied') {
      throw new Error(
        'Permission denied when updating order. Verify admin authorization and firestore.rules.'
      );
    }
    throw new Error('Unable to save order changes. Please try again.');
  }
}

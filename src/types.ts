export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'women' | 'men' | 'unisex' | 'gift-sets' | 'discovery-sets';
  price: number;
  originalPrice?: number;
  priceDisplay?: string;
  originalPriceDisplay?: string;
  image: string;
  liquidColor: string;
  cardBg: string;
  notes: string[];
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  concentration: string;
  volume: string;
  rating: number;
  reviewsCount: number;
  longevity: string;
  sillage: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVolume: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  subtext: string;
  iconName: 'women' | 'men' | 'unisex' | 'gift' | 'discovery';
}

export type PaymentStatus = 'Payment Pending' | 'Payment Verified' | 'Payment Rejected';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  customerEmail?: string;
  karachiArea: string;
  deliveryAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharges: number; // Fixed PKR 200
  grandTotal: number;
  paymentMethod: 'Easypaisa';
  transactionId: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  screenshotDataUrl?: string;
  receiptPath?: string;
  notes?: string;
}

export interface FirestoreOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  selectedVolume: string;
  unitPrice: number;
  lineTotal: number;
}

export interface AdminOrderRecord {
  firestoreDocId: string;
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
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  adminNotes: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  isReviewed?: boolean;
  reviewedAt?: Date | null;
  reviewedBy?: string;
}

export interface AdminAuthState {
  isLoading: boolean;
  isAdmin: boolean;
  uid: string | null;
  email: string | null;
  error: string | null;
}

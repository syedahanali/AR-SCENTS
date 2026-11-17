import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseError } from 'firebase/app';
import { storage } from '../firebase';

export const ALLOWED_RECEIPT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

export const MAX_RECEIPT_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Set to true ONLY after enabling Firebase Storage in Firebase Console
 * (ar-scents.firebasestorage.app) and deploying storage.rules.
 */
export const IS_FIREBASE_STORAGE_READY = false;

export interface ReceiptValidationResult {
  valid: boolean;
  error?: string;
}

export function validateReceiptFile(file: File): ReceiptValidationResult {
  if (!ALLOWED_RECEIPT_MIME_TYPES.includes(file.type as (typeof ALLOWED_RECEIPT_MIME_TYPES)[number])) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, or WebP image files are allowed for payment receipts.'
    };
  }

  if (file.size <= 0 || file.size > MAX_RECEIPT_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Receipt image must be smaller than 5 MB.'
    };
  }

  return { valid: true };
}

function getExtensionFromMime(mimeType: string): string {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/jpeg':
    default:
      return 'jpg';
  }
}

export function isValidReceiptStoragePath(orderDocId: string, receiptPath: string): boolean {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(orderDocId)) return false;
  if (!receiptPath || receiptPath.length > 200) return false;
  const escapedId = orderDocId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^order-receipts/${escapedId}/receipt_[0-9]+\\.(jpg|jpeg|png|webp)$`);
  return pattern.test(receiptPath);
}

export function buildReceiptStoragePath(orderDocId: string, file: File): string {
  const safeExt = getExtensionFromMime(file.type);
  const timestamp = Date.now();
  return `order-receipts/${orderDocId}/receipt_${timestamp}.${safeExt}`;
}

export async function uploadOrderReceipt(
  orderDocId: string,
  receiptPath: string,
  file: File
): Promise<string> {
  if (!IS_FIREBASE_STORAGE_READY) {
    throw new Error(
      'Firebase Storage receipt upload is not active yet. Enable Firebase Storage in Firebase Console and deploy storage.rules first.'
    );
  }

  if (!isValidReceiptStoragePath(orderDocId, receiptPath)) {
    throw new Error('Invalid receipt storage path format for this order.');
  }

  const validation = validateReceiptFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid receipt file.');
  }

  try {
    const storageRef = ref(storage, receiptPath);
    await uploadBytes(storageRef, file, {
      contentType: file.type
    });
    return receiptPath;
  } catch (error) {
    console.error('Failed to upload payment receipt to Firebase Storage:', error);
    if (error instanceof FirebaseError) {
      if (error.code === 'storage/unauthorized') {
        throw new Error('Receipt upload was rejected by Firebase Storage security rules.');
      }
      throw new Error(`Receipt upload failed (${error.code}).`);
    }
    throw new Error('Unable to upload payment receipt right now.');
  }
}

export async function getReceiptDownloadUrl(receiptPath: string): Promise<string | null> {
  if (!receiptPath) return null;

  try {
    const storageRef = ref(storage, receiptPath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Failed to load receipt download URL:', error);
    if (error instanceof FirebaseError && error.code === 'storage/unauthorized') {
      throw new Error('Unauthorized to view this receipt. Verify admin rules and Storage deployment.');
    }
    if (error instanceof FirebaseError && error.code === 'storage/object-not-found') {
      return null;
    }
    throw new Error('Unable to retrieve uploaded receipt image.');
  }
}

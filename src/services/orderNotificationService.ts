import { AdminOrderRecord } from '../types';

export interface AdminOrderReviewState {
  baselineCreatedAtMs: number;
  reviewedOrderIds: string[];
}

const STORAGE_KEY_PREFIX = 'ar_scents_admin_order_tracking_v1';

function getStorageKey(adminIdentifier: string): string {
  const safeId = (adminIdentifier || 'default-admin')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_@.-]/g, '_');
  return `${STORAGE_KEY_PREFIX}:${safeId}`;
}

export function loadReviewState(adminIdentifier: string): AdminOrderReviewState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey(adminIdentifier));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AdminOrderReviewState>;
    const baselineCreatedAtMs =
      typeof parsed.baselineCreatedAtMs === 'number' && Number.isFinite(parsed.baselineCreatedAtMs)
        ? parsed.baselineCreatedAtMs
        : 0;
    const reviewedOrderIds = Array.isArray(parsed.reviewedOrderIds)
      ? parsed.reviewedOrderIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
      : [];

    return {
      baselineCreatedAtMs,
      reviewedOrderIds
    };
  } catch {
    return null;
  }
}

export function saveReviewState(
  adminIdentifier: string,
  state: AdminOrderReviewState
): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getStorageKey(adminIdentifier), JSON.stringify(state));
  } catch {
    // Ignore storage quota or private browsing errors gracefully
  }
}

/**
 * Initializes persistent review tracking on first dashboard load so all
 * pre-existing orders are established as the reviewed baseline and are not
 * falsely flagged as NEW.
 */
export function initializeReviewBaseline(
  adminIdentifier: string,
  existingOrders: AdminOrderRecord[]
): AdminOrderReviewState {
  const maxCreatedAtMs = existingOrders.reduce((maxMs, order) => {
    const ts = order.createdAt ? order.createdAt.getTime() : 0;
    return ts > maxMs ? ts : maxMs;
  }, 0);

  const state: AdminOrderReviewState = {
    baselineCreatedAtMs: maxCreatedAtMs,
    reviewedOrderIds: existingOrders.map((order) => order.firestoreDocId)
  };

  saveReviewState(adminIdentifier, state);
  return state;
}

export function markOrderReviewedInState(
  adminIdentifier: string,
  currentState: AdminOrderReviewState | null,
  orderDocId: string
): AdminOrderReviewState {
  const base: AdminOrderReviewState = currentState ?? {
    baselineCreatedAtMs: 0,
    reviewedOrderIds: []
  };

  if (base.reviewedOrderIds.includes(orderDocId)) {
    return base;
  }

  const nextState: AdminOrderReviewState = {
    baselineCreatedAtMs: base.baselineCreatedAtMs,
    reviewedOrderIds: [...base.reviewedOrderIds, orderDocId]
  };

  saveReviewState(adminIdentifier, nextState);
  return nextState;
}

export function isOrderUnreviewed(
  order: AdminOrderRecord,
  state: AdminOrderReviewState | null,
  sessionNewOrderIds: Set<string>
): boolean {
  // If Firestore explicitly records reviewed === true, respect it
  if (order.isReviewed === true) {
    return false;
  }

  // If the admin has already opened/reviewed this order in persistent state
  if (state && state.reviewedOrderIds.includes(order.firestoreDocId)) {
    return false;
  }

  // If Firestore explicitly marks an order as unreviewed
  if (order.isReviewed === false) {
    return true;
  }

  // If the order arrived live during this open dashboard session
  if (sessionNewOrderIds.has(order.firestoreDocId)) {
    return true;
  }

  // If tracking was initialized earlier and this order was created after baseline
  if (state && order.createdAt) {
    return order.createdAt.getTime() > state.baselineCreatedAtMs;
  }

  return false;
}

// Web Audio API subtle luxury chime for live incoming orders
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioCtx) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  return sharedAudioContext;
}

export function unlockNotificationAudio(): void {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }
  } catch {
    // Ignore browser audio restrictions
  }
}

export function playNewOrderNotificationSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const triggerChime = () => {
      const now = ctx.currentTime;

      const playTone = (freq: number, startOffset: number, duration: number, peakGain: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + startOffset);

        gain.gain.setValueAtTime(0.0001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(peakGain, now + startOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration + 0.02);
      };

      // Subtle two-note warm chime (D5 -> A5)
      playTone(587.33, 0, 0.28, 0.08);
      playTone(880, 0.11, 0.42, 0.07);
    };

    if (ctx.state === 'suspended') {
      void ctx
        .resume()
        .then(triggerChime)
        .catch(() => {});
    } else {
      triggerChime();
    }
  } catch {
    // Fail silently if audio playback is blocked
  }
}

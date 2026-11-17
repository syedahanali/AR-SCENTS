import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { auth, db } from '../firebase';
import { AdminAuthState } from '../types';

async function verifyAdminRecord(user: User): Promise<{ authorized: boolean; error?: string }> {
  try {
    const adminRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      return {
        authorized: false,
        error: 'Access denied. This account is not registered in the AR SCENTS admin allowlist.'
      };
    }

    const data = adminSnap.data();
    if (!data || data.active !== true) {
      return {
        authorized: false,
        error: 'Access denied. This administrator account is inactive.'
      };
    }

    if (data.role !== 'admin') {
      return {
        authorized: false,
        error: 'Access denied. This account does not have the required "admin" role.'
      };
    }

    return { authorized: true };
  } catch (error) {
    console.error('Admin authorization check failed:', error);
    if (error instanceof FirebaseError && error.code === 'permission-denied') {
      return {
        authorized: false,
        error:
          'Permission denied while verifying admin authorization. Ensure firestore.rules are deployed and your UID exists in the admins collection.'
      };
    }
    return {
      authorized: false,
      error: 'Unable to verify administrator privileges right now. Please try again.'
    };
  }
}

export async function loginAdmin(email: string, password: string): Promise<void> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    throw new Error('Please enter both your admin email address and password.');
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    const verification = await verifyAdminRecord(credential.user);

    if (!verification.authorized) {
      await signOut(auth);
      throw new Error(
        verification.error || 'Unauthorized account. Admin access denied.'
      );
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          throw new Error('Invalid email or password.');
        case 'auth/invalid-email':
          throw new Error('Please enter a valid email address.');
        case 'auth/too-many-requests':
          throw new Error('Too many failed sign-in attempts. Please wait and try again.');
        case 'auth/user-disabled':
          throw new Error('This authentication account has been disabled.');
        default:
          throw new Error(`Authentication failed (${error.code}). Please try again.`);
      }
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to sign in right now. Please try again.');
  }
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAdminAuth(
  onStateChange: (state: AdminAuthState) => void
): () => void {
  onStateChange({
    isLoading: true,
    isAdmin: false,
    uid: null,
    email: null,
    error: null
  });

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      onStateChange({
        isLoading: false,
        isAdmin: false,
        uid: null,
        email: null,
        error: null
      });
      return;
    }

    const verification = await verifyAdminRecord(user);
    if (!verification.authorized) {
      // Ensure unauthorized signed-in accounts do not retain an active admin session
      await signOut(auth).catch(() => {});
      onStateChange({
        isLoading: false,
        isAdmin: false,
        uid: null,
        email: null,
        error: verification.error || 'Unauthorized account.'
      });
      return;
    }

    onStateChange({
      isLoading: false,
      isAdmin: true,
      uid: user.uid,
      email: user.email,
      error: null
    });
  });
}

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDJCNB67rouxOfVzuQJyOmHtDX-wMsUEEg",
  authDomain: "ar-scents.firebaseapp.com",
  projectId: "ar-scents",
  storageBucket: "ar-scents.firebasestorage.app",
  messagingSenderId: "735309460217",
  appId: "1:735309460217:web:bfabfaccf74086fb526828"
};

// Initialize Firebase only once
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
export default app;

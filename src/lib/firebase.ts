import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  limit,
  orderBy,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Silence Firestore internal connectivity warning logs in sandboxed/offline preview environment
try {
  setLogLevel('silent');
} catch {}

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore database with reliable long-polling to prevent proxy/sandboxed iframe connection timeouts
const databaseId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

let firestoreDb: ReturnType<typeof getFirestore>;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true
    },
    databaseId
  );
} catch {
  firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreDb;

export {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  limit,
  orderBy,
  getDocs,
  deleteDoc,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};
export type { User };
export default app;


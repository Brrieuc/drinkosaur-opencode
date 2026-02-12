import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Firebase config: use env vars if available, otherwise fall back to provided config (MVP friendly)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBGkKn2DBxFIXME-FIX-REPLACE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'drinkosaur-5cebe.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'drinkosaur-5cebe',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'drinkosaur-5cebe.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '999271625766',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:999271625766:web:b4104448736a297fc7e2e7',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-38DLX5ZFKD'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

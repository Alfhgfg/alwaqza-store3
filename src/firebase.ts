import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDummyDevKeyForAppletEnvironment",
  authDomain: "alwaqza-store.firebaseapp.com",
  projectId: "alwaqza-store",
  storageBucket: "alwaqza-store.appspot.com",
  messagingSenderId: "80105292363",
  appId: "1:80105292363:android:39c76f3528434141a0e097"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

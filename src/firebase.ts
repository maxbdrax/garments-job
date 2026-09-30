import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Test connection on boot as mandated by the Firebase skill
export async function testFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'global'));
    console.log('[Firebase] Connected successfully to Firestore database.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Offline or connecting...');
    } else {
      console.log('[Firebase] Initialized with config:', firebaseConfig.projectId);
    }
  }
}

testFirebaseConnection();

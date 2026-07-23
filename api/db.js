import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getDb() {
  if (getApps().length === 0) {
    try {
      let serviceAccount;
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } else {
        console.warn('FIREBASE_SERVICE_ACCOUNT is not set.');
      }
      
      if (serviceAccount) {
        initializeApp({
          credential: cert(serviceAccount)
        });
      } else {
        initializeApp();
      }
    } catch (error) {
      console.error('Firebase Admin Initialization Error:', error);
      throw new Error(`Firebase Init Failed: ${error.message}`);
    }
  }
  return getFirestore();
}

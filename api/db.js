import admin from 'firebase-admin';

let isInitialized = false;

export function getDb() {
  if (!isInitialized && !admin.apps.length) {
    try {
      let serviceAccount;
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } else {
        console.warn('FIREBASE_SERVICE_ACCOUNT is not set.');
      }
      admin.initializeApp({
        credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault()
      });
      isInitialized = true;
    } catch (error) {
      console.error('Firebase Admin Initialization Error:', error);
      throw new Error(`Firebase Init Failed: ${error.message}`);
    }
  }
  return admin.firestore();
}

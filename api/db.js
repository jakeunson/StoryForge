import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    let serviceAccount;
    // Check if the service account is provided via env var
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT is not set. Using default application credentials.');
    }

    admin.initializeApp({
      credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault()
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}
let dbInstance;
try {
  dbInstance = admin.firestore();
} catch (e) {
  console.error("Failed to get firestore instance:", e);
}

export const db = dbInstance;

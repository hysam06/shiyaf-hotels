import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase already initialized');
      return admin.app();
    }

    // Validate required environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Missing Firebase credentials. Please check your .env file.\n' +
        'Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
      );
    }

    // Initialize Firebase with service account
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      }),
      storageBucket: `${projectId}.appspot.com`,
    });

    console.log('✅ Firebase initialized successfully');
    console.log(`📦 Project: ${projectId}`);
    
    return admin.app();
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Initialize Firebase
const app = initializeFirebase();

// Export Firebase services
export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();

// Export admin for other uses
export default admin;

// Firestore settings for better performance
db.settings({
  ignoreUndefinedProperties: true,
});

console.log('🔥 Firestore, Storage, and Auth services ready');

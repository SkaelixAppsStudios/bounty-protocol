import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Helper to format private key correctly (handle newlines)
const formatPrivateKey = (key: string | undefined) => {
    return key?.replace(/\\n/g, "\n");
};

const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
};

// Initialize Firebase Admin (Singleton pattern)
const app = getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert(firebaseAdminConfig),
    });

const adminDb = getFirestore(app);

export { adminDb };

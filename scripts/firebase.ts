import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export interface UserProfile {
  grade: string;
  desiredSchool: string;
  personality: string;
}

export async function writeUserProfile(uid: string, profile: UserProfile) {
  return set(ref(db, `users/${uid}`), profile);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.exists() ? (snapshot.val() as UserProfile) : null;
}

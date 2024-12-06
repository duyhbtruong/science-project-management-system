import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN ?? "project-01-firebase.firebaseapp.com",
  projectId: process.env.PROJECT_ID ?? "project-01-firebase",
  databaseURL: process.env.FIRESTORE_DB_URL ?? "",
  storageBucket:
    process.env.STORAGE_BUCKET ?? "project-01-firebase.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID ?? "175308821128",
  appId: process.env.APP_ID ?? "1:175308821128:web:0d168980828ae4054ac53d",
  measurementId: process.env.MESSUREMENT_ID ?? "G-063FXX84Y0",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

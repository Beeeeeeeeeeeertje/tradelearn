import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAOy9ZT_3ZyC6ebAERmn5F4iD3qJl31nM0",
  authDomain: "tradelearn-c4106.firebaseapp.com",
  projectId: "tradelearn-c4106",
  storageBucket: "tradelearn-c4106.firebasestorage.app",
  messagingSenderId: "242435102900",
  appId: "1:242435102900:web:8f5dc0360a2be955695fe1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Jouw admin UID — vullen we zo in
export const ADMIN_UID = "ouKTTEAtAsSTzotNAilP0M4h1yB2";
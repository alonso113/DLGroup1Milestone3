import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDqSrlpF-tqHB7N2RMRvGM9gRxlzzC0C4c",
  authDomain: "deeplearningmilestone3.firebaseapp.com",
  projectId: "deeplearningmilestone3",
  storageBucket: "deeplearningmilestone3.firebasestorage.app",
  messagingSenderId: "916983776074",
  appId: "1:916983776074:web:dd55d4b7841d12b3aaf7b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;

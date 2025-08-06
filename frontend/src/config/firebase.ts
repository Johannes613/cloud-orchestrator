import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDa-NPOzvKVLX-8cCULrp1y04-__gLaldA",
  authDomain: "cloud-native-app-351d4.firebaseapp.com",
  projectId: "cloud-native-app-351d4",
  storageBucket: "cloud-native-app-351d4.firebasestorage.app",
  messagingSenderId: "825276618446",
  appId: "1:825276618446:web:da0c2e8d2247f0326d629f",
  measurementId: "G-NNKQMG9X8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app; 
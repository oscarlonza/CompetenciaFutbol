// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCIo2wOm-kS6B1JjvTQDl6oAoY_AQTB8Qg",
  authDomain: "competenciafutbol-36a6a.firebaseapp.com",
  projectId: "competenciafutbol-36a6a",
  storageBucket: "competenciafutbol-36a6a.appspot.com",
  messagingSenderId: "451329444933",
  appId: "1:451329444933:web:8167a3c1f5e62a8ba1e72c",
  measurementId: "G-LPNFTPQG9S",
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZlmvhnUP0dgO0Eguo4_GIMarLtKUiQ-s",
    authDomain: "chill-gamer-f09f5.firebaseapp.com",
    projectId: "chill-gamer-f09f5",
    storageBucket: "chill-gamer-f09f5.firebasestorage.app",
    messagingSenderId: "223802669941",
    appId: "1:223802669941:web:e5ad65335e8881d0cb713c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
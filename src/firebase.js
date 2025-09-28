// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXk-NlFeDvaLniVNa1ZKfy6LWkUxukpFQ",
  authDomain: "student-app-chat.firebaseapp.com",
  projectId: "student-app-chat",
  storageBucket: "student-app-chat.firebasestorage.app",
  messagingSenderId: "184744512499",
  appId: "1:184744512499:web:0722c82b813e509acca086",
  locationId: "africa-south1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
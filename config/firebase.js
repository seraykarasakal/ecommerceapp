// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCy7EyGdfIDhw_peLOE9Eu7EKaJD8v6lGk",
    authDomain: "ecommerceapp-51f1f.firebaseapp.com",
    projectId: "ecommerceapp-51f1f",
    storageBucket: "ecommerceapp-51f1f.appspot.com",
    messagingSenderId: "716715652916",
    appId: "1:716715652916:web:2053f357500c1d3bcc5761",
    measurementId: "G-30TECR9807",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

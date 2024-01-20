// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACODxLz-jWzvLtSIfyUuaPJr11nyH5AXI",
  authDomain: "ecommerce-site-bae1b.firebaseapp.com",
  projectId: "ecommerce-site-bae1b",
  storageBucket: "ecommerce-site-bae1b.appspot.com",
  messagingSenderId: "321396378371",
  appId: "1:321396378371:web:a4bcb0fd3bd8ead441f736"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const auth = getAuth(app);

export {app, database, auth}
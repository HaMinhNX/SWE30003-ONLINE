// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgQlNZoMB53Eb9Vol6pvwlipbSiPptHyA",
  authDomain: "swe30003-15645.firebaseapp.com",
  projectId: "swe30003-15645",
  storageBucket: "swe30003-15645.firebasestorage.app",
  messagingSenderId: "948686843813",
  appId: "1:948686843813:web:b13741a6b95e36489bc24c",
  measurementId: "G-CEJY9JHHDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

const storage = getStorage(app);

export { db, auth, storage };
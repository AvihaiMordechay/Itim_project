import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB16sybcpKqs-7vc_BnoH6Y7eMk4GH10H8",
    authDomain: "itim-project.firebaseapp.com",
    projectId: "itim-project",
    storageBucket: "itim-project.appspot.com",
    messagingSenderId: "201989656695",
    appId: "1:201989656695:web:f36ae6503e3263233b3672",
    measurementId: "G-PDMVLGYM68"
  };

const app = initializeApp(firebaseConfig);

const myAuth = getAuth(app); // for Authentication uysage
const db = getFirestore(app); // for Database (Firestore) usage

export { myAuth, db }; // Export the authentication instance



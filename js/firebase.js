import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getStorage } from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9awZXCn1JHfMEoxAleFLiOw4tBnGMZiA",
  authDomain: "jigmasterlist.firebaseapp.com",
  projectId: "jigmasterlist",
  storageBucket: "jigmasterlist.firebasestorage.app",
  messagingSenderId: "767930728467",
  appId: "1:767930728467:web:0ce9905d24798046f2bfe6",
  measurementId: "G-BKQLB6GFZ7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
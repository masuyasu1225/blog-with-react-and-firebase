import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6iACs5O5M7hG-JGHnvJtbJ0FgV78u4_E",
  authDomain: "blog-c220d.firebaseapp.com",
  projectId: "blog-c220d",
  storageBucket: "blog-c220d.appspot.com",
  messagingSenderId: "662728970555",
  appId: "1:662728970555:web:88d885ad96916dc7a7271e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };

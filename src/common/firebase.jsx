import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC04cMWrhX5JOAJHlgLRRzENkpU2TJPnmc",
  authDomain: "blog-e5e55.firebaseapp.com",
  projectId: "blog-e5e55",
  storageBucket: "blog-e5e55.appspot.com",
  messagingSenderId: "771689245106",
  appId: "1:771689245106:web:89180cd08edc081faa9cab",
};

const app = initializeApp(firebaseConfig);

// Google Auth
const provider = new GoogleAuthProvider();

const auth = getAuth();
export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => {
      console.log(error);
    });
  return user;
};

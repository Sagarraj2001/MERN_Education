import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider 
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBHYiLeW0GdsDP27g-qMnocjYoJnzeOCLY",
  authDomain: "christian-ngo.firebaseapp.com",
  projectId: "christian-ngo",
  storageBucket: "christian-ngo.firebasestorage.app",
  messagingSenderId: "164078942576",
  appId: "1:164078942576:web:4de7f100e6336bd584b7b5",
  measurementId: "G-RDD31HCELS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, facebookProvider, githubProvider };

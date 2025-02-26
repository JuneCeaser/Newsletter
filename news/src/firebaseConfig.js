import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Avoid importing analytics if you're testing on web without HTTPS
const firebaseConfig = {
  apiKey: "AIzaSyDpf93xPqpw6_Bh5J44-OvWLL_Y_NF_3NY",
  authDomain: "newsletter-72d03.firebaseapp.com",
  projectId: "newsletter-72d03",
  storageBucket: "newsletter-72d03.appspot.com",
  messagingSenderId: "782880796845",
  appId: "1:782880796845:web:3323f1c2e1ee61dcc59624",
  measurementId: "G-LV6FFHGN0X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

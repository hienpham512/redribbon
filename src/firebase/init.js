import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";
import "firebase/firestore";

import ReactObserver from "react-event-observer";

const firebaseConfig = {
  apiKey: "AIzaSyAfir5YpFADRToIqBbpxd1RnkfNF_AxsCs",
  authDomain: "red-ribbon-epitech.firebaseapp.com",
  projectId: "red-ribbon-epitech",
  storageBucket: "red-ribbon-epitech.appspot.com",
  messagingSenderId: "696737510796",
  appId: "1:696737510796:web:41044bd3ca692bc742d2a9",
  measurementId: "G-DVCGRGH84F",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const fbAnalytics = firebase.analytics();
export const storage = firebase.storage();
export const firebaseObserver = ReactObserver();

auth.onAuthStateChanged(() => {
  firebaseObserver.publish("authStateChanged", loggedIn());
});

export const loggedIn = () => {
  return !!auth.currentUser;
};

export default firebaseApp;

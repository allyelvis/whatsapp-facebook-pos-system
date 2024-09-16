import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "-api-key",
  authDomain: "-auth-domain",
  projectId: "-project-id",
  storageBucket: "-storage-bucket",
  messagingSenderId: "-messaging-sender-id",
  appId: "sokoni"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();

import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBFr_UeIAb70e5x4R4tduS9PuFWxyYxdPQ",
  authDomain: "pgu-biology-monitoring.firebaseapp.com",
  databaseURL: "https://pgu-biology-monitoring.firebaseio.com",
  projectId: "pgu-biology-monitoring",
  storageBucket: "pgu-biology-monitoring.appspot.com",
  messagingSenderId: "1040239242438",
  appId: "1:1040239242438:web:6df7a2ad168ddf8b723bc7",
  measurementId: "G-E4M8R64FBS",
};
const firebaseApp = firebase.initializeApp(config);
export const auth = firebaseApp.auth();
export const db = firebase.firestore();

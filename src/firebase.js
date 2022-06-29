import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
const firebaseConfig = {
    apiKey: "AIzaSyCfHkFgy0YoOqs-z5N7ZsaFbm9fP9WfomQ",
    authDomain: "postagram-4574a.firebaseapp.com",
    projectId: "postagram-4574a",
    storageBucket: "postagram-4574a.appspot.com",
    messagingSenderId: "1002313696260",
    appId: "1:1002313696260:web:234a5dc782b42cc8d82151",
    measurementId: "G-6HN1KTTNZ9"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
// const provider = new firebase.auth.GoogleAuthProvider();
export { auth, db, storage };
// export default db;
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth, initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBKpuM0rHzovA6BZ5JKf8t7f7L8-YoUF5w",
    authDomain: "infrawatch-620ef.firebaseapp.com",
    projectId: "infrawatch-620ef",
    storageBucket: "infrawatch-620ef.appspot.com",
    messagingSenderId: "603037031454",
    appId: "1:603037031454:web:0cecd0cedeba3bed54220f"
};



const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
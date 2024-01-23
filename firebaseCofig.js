import { initializeApp } from "firebase/app";
import { CACHE_SIZE_UNLIMITED, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB3I_lJENQzbBvwZmzEmfMDwww54BmV7eQ",
    authDomain: "test-87fde.firebaseapp.com",
    projectId: "test-87fde",
    storageBucket: "test-87fde.appspot.com",
    messagingSenderId: "373648071484",
    appId: "1:373648071484:web:177eab222695868f4d5c39",
    measurementId: "G-QHMYTSHRQ8"
  };

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = initializeFirestore(app,{
  persistence: memoryLocalCache({ sizeBytes: CACHE_SIZE_UNLIMITED })
})

export {auth, db}
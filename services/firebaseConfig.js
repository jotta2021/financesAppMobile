
import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth, setPersistence,Auth,browserLocalPersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBgeocFK32IQ0uSx7_618BZ0N3xRgz1jcY",
  authDomain: "appfinances-5b3f9.firebaseapp.com",
  projectId: "appfinances-5b3f9",
  storageBucket: "appfinances-5b3f9.appspot.com",
  messagingSenderId: "254420018380",
  appId: "1:254420018380:web:b5ce4db85bead1c1ce0e69",
  measurementId: "G-VT9XN8L8SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)


export {db,auth};

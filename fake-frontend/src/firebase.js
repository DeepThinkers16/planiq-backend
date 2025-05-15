// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBJr4VCK0Pgl3UuqSu7NOdXPu5vudBOHVo',
  authDomain: 'planiq-f3144.firebaseapp.com',
  projectId: 'planiq-f3144',
  storageBucket: 'planiq-f3144.appspot.com',
  messagingSenderId: '1083316304713',
  appId: '1:1083316304713:web:9984a7ef198290a5c07898',
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// ✅ 문자 인증 비활성화 → 이메일 인증만 사용
export const auth = getAuth(app);
export const db = getFirestore(app);

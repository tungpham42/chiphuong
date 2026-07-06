// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Thay thế đoạn cấu hình này bằng thông tin từ project Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCXmKlJBpQvl46olXcSG4ayV7XpvIoHHJo",
  authDomain: "chiphuongmanulife.firebaseapp.com",
  projectId: "chiphuongmanulife",
  storageBucket: "chiphuongmanulife.firebasestorage.app",
  messagingSenderId: "554711390956",
  appId: "1:554711390956:web:423a657166003d5c2623c9",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo và export Firestore để sử dụng ở các file khác
export const db = getFirestore(app);

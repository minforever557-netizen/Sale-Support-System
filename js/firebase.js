/* ================= FIREBASE CORE ================= */

import { initializeApp, getApps, getApp }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


/* ================= CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyAa2uSD_tjNqYE2eXnZcn75h_jAVscDG-c",
  authDomain: "salesupportsystemapp.firebaseapp.com",
  projectId: "salesupportsystemapp",
  storageBucket: "salesupportsystemapp.firebasestorage.app",
  messagingSenderId: "840890441207",
  appId: "1:840890441207:web:f3a5076d46e963a90de2f2"
};


/* ================= INIT APP (กัน init ซ้ำ) ================= */

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();


/* ================= SERVICES ================= */

const db = getFirestore(app);
const auth = getAuth(app);

/* ================= AUDIT LOG FUNCTION (เพิ่มส่วนนี้) ================= */
// ฟังก์ชันกลางสำหรับบันทึก Log กิจกรรม
export async function createLog(user, actionType, details) {
    try {
        await addDoc(collection(db, "logs"), {
            userName: user?.name || user?.username || "Unknown",
            userEmail: user?.email || "Unknown",
            actionType: actionType, // เช่น 'LOGIN', 'UPDATE', 'DELETE', 'ERROR'
            details: details,       // รายละเอียดกิจกรรม
            path: window.location.pathname.split('/').pop() || 'index.html',
            timestamp: serverTimestamp(), // เวลาเซิร์ฟเวอร์เพื่อให้ Filter วันที่แม่นยำ
            isError: actionType.includes('ERROR') // เช็คเพื่อใส่สีแดงในหน้า Logs
        });
    } catch (e) {
        console.error("Error adding log: ", e);
    }
}


/* ================= EXPORT ================= */

export { app, db, auth };

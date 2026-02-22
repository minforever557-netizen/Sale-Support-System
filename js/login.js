import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    setPersistence, 
    browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= FIREBASE CONFIG =================
const firebaseConfig = {
    apiKey: "AIzaSyAa2uSD_tjNqYE2eXnZcn75h_jAVscDG-c",
    authDomain: "salesupportsystemapp.firebaseapp.com",
    projectId: "salesupportsystemapp",
    storageBucket: "salesupportsystemapp.firebasestorage.app",
    messagingSenderId: "840890441207",
    appId: "1:840890441207:web:f3a5076d46e963a90de2f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ================= LOGIN =================
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;

    loginBtn.disabled = true;
    loginBtn.innerHTML = "กำลังตรวจสอบ...";

    try {

        // ล้าง session เก่า
        localStorage.clear();

        // ===== 1. หา user จาก username =====
        const adminRef = collection(db, "admin");
        const q = query(adminRef, where("username", "==", usernameInput));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("ไม่พบชื่อผู้ใช้งาน");
            resetBtn();
            return;
        }

        let userEmail = "";
        let userRole = "user";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            userEmail = data.email;
            userRole = data.role || "user";
        });

        // ===== 2. จำสถานะ login =====
        await setPersistence(auth, browserLocalPersistence);

        // ===== 3. Login =====
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, passwordInput);

        // ✅ เพิ่มตรงนี้: บังคับให้รอรับ Token ให้เสร็จชัวร์ๆ ก่อนไปต่อ
        await userCredential.user.getIdToken(true);

        // ===== 4. Save session =====
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("isLogin", "true");

        // ===== 5. Redirect ตาม ROLE (ใส่ดีเลย์นิดเดียวเพื่อให้ Session นิ่ง) =====
        setTimeout(() => {
            redirectByRole(userRole);
        }, 300);

    } catch (error) {
        console.error(error);

        let message = "เข้าสู่ระบบไม่สำเร็จ";
        if (error.code === 'auth/wrong-password') message = "รหัสผ่านไม่ถูกต้อง";
        if (error.code === 'auth/user-not-found') message = "ไม่พบผู้ใช้งาน";

        alert(message);
        resetBtn();
    }
});


// ================= REDIRECT ROLE =================
function redirectByRole(role) {

    switch(role) {
        case "admin":
            window.location.replace("dashboard.html");
            break;

        case "sale":
            window.location.replace("sale-dashboard.html");
            break;

        case "support":
            window.location.replace("support-dashboard.html");
            break;

        default:
            window.location.replace("dashboard.html");
    }
}


// ================= RESET BUTTON =================
function resetBtn() {
    loginBtn.disabled = false;
    loginBtn.innerHTML = "<span>เข้าสู่ระบบ</span>";
}

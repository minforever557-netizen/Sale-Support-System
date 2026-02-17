import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    // เปลี่ยนสถานะปุ่มขณะกำลังโหลด
    loginBtn.innerText = "กำลังเข้าสู่ระบบ...";
    loginBtn.disabled = true;

    try {
        // 1. ค้นหา Email จาก Username ใน Firestore (เพราะ Firebase Auth ใช้ Email ในการ Login)
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("ไม่พบชื่อผู้ใช้งานนี้ในระบบ");
        }

        let userEmail = "";
        querySnapshot.forEach((doc) => {
            userEmail = doc.data().email;
        });

        // 2. ทำการ Login ด้วย Email ที่หาเจอ
        await signInWithEmailAndPassword(auth, userEmail, password);
        
        // 3. Login สำเร็จ -> ไปที่หน้า Dashboard
        alert("เข้าสู่ระบบสำเร็จ!");
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login Error:", error);
        alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
        loginBtn.innerText = "LOG IN";
        loginBtn.disabled = false;
    }
});

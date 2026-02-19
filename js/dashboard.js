import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAa2uSD_tjNqYE2eXnZcn75h_jAVscDG-c",
    authDomain: "salesupportsystemapp.firebaseapp.com",
    projectId: "salesupportsystemapp",
    storageBucket: "salesupportsystemapp.firebasestorage.app",
    messagingSenderId: "840890441207",
    appId: "1:840890441207:web:f3a5076d46e963a90de2f2"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

console.log("Checking Auth Status..."); // ดูว่าไฟล์นี้เริ่มทำงานหรือยัง

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Firebase User Found:", user.uid); // 1. เช็คว่าล็อกอินผ่านไหม
        
        try {
            const adminDoc = await getDoc(doc(db, "admin", user.uid));
            
            if (adminDoc.exists()) {
                console.log("Admin Data Found:", adminDoc.data()); // 2. เช็คว่ามีข้อมูลในคอลเลกชัน admin ไหม
                const userData = adminDoc.data();
                await initGlobalLayout(userData, user.email);
                loadDashboardStats(user.email);
            } else {
                // 🚩 จุดที่น่าจะเสีย: ล็อกอินผ่าน แต่ไม่มีเลข UID นี้ในคอลเลกชัน admin
                console.error("Critical: User UID not found in 'admin' collection!");
                alert("สิทธิ์การเข้าใช้งานไม่ถูกต้อง (ไม่พบ UID ในระบบ Admin)");
                await signOut(auth);
                window.location.replace("login.html");
            }
        } catch (error) {
            console.error("Firestore Error:", error);
        }
    } else {
        console.log("No User Found. Redirecting..."); // 3. ถ้าเด้งมาตรงนี้แสดงว่า Firebase ยังมองไม่เห็น User
        if (!window.location.pathname.includes("login.html")) {
            window.location.replace("login.html");
        }
    }
});

// --- ฟังก์ชันอื่นๆ คงเดิม (เพื่อความกระชับผมขอตัดเนื้อในออก แต่ให้คุณใช้ของเดิมที่คุณมีได้เลย) ---
async function initGlobalLayout(userData, email) { /* ... โค้ดเดิม ... */ }
async function loadDashboardStats(userEmail) { /* ... โค้ดเดิม ... */ }

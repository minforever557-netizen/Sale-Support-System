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

// 🚩 จุดแก้ไขสำคัญ: ใช้ onAuthStateChanged เพียงครั้งเดียวและจัดการทุกอย่างข้างใน
onAuthStateChanged(auth, async (user) => {
    // 1. ถ้ามี User เข้าระบบอยู่
    if (user) {
        console.log("Logged in as:", user.email);
        
        try {
            // ดึงข้อมูล Admin จาก Firestore
            const adminDoc = await getDoc(doc(db, "admin", user.uid));
            
            if (adminDoc.exists()) {
                const userData = adminDoc.data();
                
                // ล้างระบบเก่า (ถ้ามี)
                localStorage.removeItem("user"); 
                
                // เริ่มโหลด UI
                await initGlobalLayout(userData, user.email);
                await loadDashboardStats(user.email);
            } else {
                // ถ้าไม่มีชื่อในฐานข้อมูล admin ให้เด้งออก
                console.error("User exists but not in Admin collection");
                await signOut(auth);
                window.location.replace("login.html");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    } 
    // 2. ถ้าไม่มี User (และต้องแน่ใจว่า Firebase เช็คเสร็จแล้วจริงๆ)
    else {
        console.log("No user found, redirecting to login...");
        // ป้องกัน Loop: เช็คว่าตอนนี้ไม่ได้อยู่ที่หน้า Login แล้วจริงๆ ถึงจะเด้งไป
        if (!window.location.pathname.includes("login.html")) {
            window.location.replace("login.html");
        }
    }
});

// --- ฟังก์ชันโหลด Layout ---
async function initGlobalLayout(userData, email) {
    const comps = [
        { id: 'sidebar-placeholder', url: './components/sidebar.html' },
        { id: 'topbar-placeholder', url: './components/topbar.html' }
    ];

    for (const comp of comps) {
        try {
            const res = await fetch(comp.url);
            if (res.ok) {
                const el = document.getElementById(comp.id);
                if (el) {
                    el.innerHTML = await res.text();
                    el.classList.remove('hidden');
                }
            }
        } catch (e) { console.warn("Layout component missing:", comp.url); }
    }

    // อัปเดตข้อมูลบน Topbar
    const syncUI = setInterval(() => {
        const nameDisplay = document.querySelector('#topbar-user-name');
        if (nameDisplay) {
            nameDisplay.innerText = userData.name || "User";
            const emailDisplay = document.querySelector('#topbar-user-email');
            const avatarDisplay = document.querySelector('#topbar-avatar-text');
            if (emailDisplay) emailDisplay.innerText = email;
            if (avatarDisplay) avatarDisplay.innerText = (userData.name || "U")[0].toUpperCase();
            clearInterval(syncUI);
        }
    }, 100);
}

// --- ฟังก์ชันดึงสถิติ ---
async function loadDashboardStats(userEmail) {
    try {
        const q = query(collection(db, "tickets"), where("ownerEmail", "==", userEmail));
        const snap = await getDocs(q);
        let total = 0, progress = 0, closed = 0;
        
        snap.forEach(docSnap => {
            const d = docSnap.data();
            total++;
            if (["In Progress", "Pending"].includes(d.status)) progress++;
            if (["Success", "Closed"].some(s => d.status?.includes(s))) closed++;
        });

        const safeUpdate = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.innerText = val;
        };

        safeUpdate('stat-total', total);
        safeUpdate('stat-progress', progress);
        safeUpdate('stat-closed', closed);

    } catch (err) { console.error("Stats fail:", err); }
}

// --- ระบบ Logout (ใช้ Event Delegation เพื่อรองรับปุ่มที่โหลดมาทีหลัง) ---
document.addEventListener('click', (e) => {
    // เปิด Modal
    if (e.target.closest('#main-logout-btn')) {
        const modal = document.getElementById('logout-modal');
        if(modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('logout-backdrop').classList.add('opacity-100');
                document.getElementById('logout-content').classList.remove('scale-90', 'opacity-0');
            }, 10);
        }
    }
    // ปิด Modal
    if (e.target.id === 'close-logout') {
        document.getElementById('logout-backdrop').classList.remove('opacity-100');
        document.getElementById('logout-content').classList.add('scale-90', 'opacity-0');
        setTimeout(() => document.getElementById('logout-modal').classList.add('hidden'), 300);
    }
    // ยืนยัน Logout
    if (e.target.id === 'confirm-logout') {
        signOut(auth).then(() => window.location.replace("login.html"));
    }
});

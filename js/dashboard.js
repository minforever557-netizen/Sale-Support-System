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
        console.log("Firebase User Found:", user.uid);
        
        try {
            // ดึงข้อมูล Admin จาก Firestore โดยใช้ UID
            const adminDoc = await getDoc(doc(db, "admin", user.uid));
            
            if (adminDoc.exists()) {
                const userData = adminDoc.data();
                console.log("Admin Data Found:", userData);

                // 1. โหลด Layout พื้นฐาน
                await initGlobalLayout(userData, user.email);
                
                // 2. โหลดสถิติ Dashboard
                loadDashboardStats(user.email);

                // 3. เริ่มทำงานระบบ Sidebar (Toggle, Active Link, Admin Visibility)
                initSidebarBehavior(userData);

            } else {
                console.error("Critical: User UID not found in 'admin' collection!");
                alert("สิทธิ์การเข้าใช้งานไม่ถูกต้อง");
                await signOut(auth);
                window.location.replace("login.html");
            }
        } catch (error) {
            console.error("Firestore Error:", error);
        }
    } else {
        console.log("No User Found. Redirecting...");
        if (!window.location.pathname.includes("login.html")) {
            window.location.replace("login.html");
        }
    }
});

// --- ฟังก์ชันใหม่สำหรับควบคุมพฤติกรรม Sidebar ---
function initSidebarBehavior(userData) {
    const sidebar = document.getElementById('sidebar-placeholder');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const toggleIcon = document.getElementById('toggle-icon');
    const currentPath = window.location.pathname.split("/").pop() || "dashboard.html";

    // A. ตรวจสอบสิทธิ์ Admin เพื่อเปิดเมนู
    const adminSection = document.getElementById('admin-menu-section');
    if (adminSection && userData.role === 'Admin') {
        adminSection.classList.remove('hidden-secure');
        adminSection.classList.remove('hidden'); // กรณีใช้ class พื้นฐานของ Tailwind
    }

    // B. ตั้งค่า Active Menu (แสดงให้รู้ว่าอยู่เมนูไหน)
    document.querySelectorAll('.nav-link-modern').forEach(link => {
        // เทียบค่า data-page กับชื่อไฟล์ปัจจุบัน
        if (link.getAttribute('data-page') === currentPath) {
            link.classList.add('active');
        }
    });

    // C. ระบบพับ Sidebar (Desktop Toggle)
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('mini');
            // เปลี่ยนไอคอนลูกศร
            if (sidebar.classList.contains('mini')) {
                toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right');
            } else {
                toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
            }
        };
    }

    // D. ระบบ Mobile Hamburger (กดเปิด/ปิดในมือถือ)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.onclick = () => {
            sidebar.classList.toggle('active'); // ใช้ class .active ที่เขียนใน CSS ขั้นตอนที่ 2
        };
    }
}

// --- ฟังก์ชันอื่นๆ คงเดิม (เพื่อความกระชับผมขอตัดเนื้อในออก แต่ให้คุณใช้ของเดิมที่คุณมีได้เลย) ---
async function initGlobalLayout(userData, email) {
    const comps = [
        { id: 'sidebar-placeholder', url: './components/sidebar.html' },
        { id: 'topbar-placeholder', url: './components/topbar.html' }
    ];

    for (const comp of comps) {
        try {
            const response = await fetch(comp.url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const container = document.getElementById(comp.id);
            if (container) {
                container.innerHTML = html;
                // ถ้าเป็น Sidebar ให้ลบ class hidden ออกเพื่อให้แสดงผล
                if (comp.id === 'sidebar-placeholder') {
                    container.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error(`Failed to load ${comp.id}:`, error);
        }
    }

    // อัปเดตข้อมูลผู้ใช้บน Topbar (อ้างอิง ID ใน topbar.html)
    const nameDisplay = document.querySelector('#topbar-user-name');
    if (nameDisplay) nameDisplay.innerText = userData.name || "User";
    
    const emailDisplay = document.querySelector('#topbar-user-email');
    if (emailDisplay) emailDisplay.innerText = email;

    // 🚩 สำคัญ: เรียกฟังก์ชันควบคุม Sidebar หลังจากโหลด HTML เสร็จแล้ว
    initSidebarBehavior(userData);
}

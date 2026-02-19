import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAa2uSD_tjNqYE2eXnZcn75h_jAVscDG-c",
    authDomain: "salesupportsystemapp.firebaseapp.com",
    projectId: "salesupportsystemapp",
    storageBucket: "salesupportsystemapp.firebasestorage.app",
    messagingSenderId: "840890441207",
    appId: "1:840890441207:web:f3a5076d46e963a90de2f2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// 2. Authentication Monitor & Role Check
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "admin", user.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userRole = (userData.role || "").toLowerCase();

                // ตรวจสอบ Role (admin, user, staff)
                if (['admin', 'user', 'staff'].includes(userRole)) {
                    // เรียกโหลด Layout และรอจนกว่าจะโหลด Component เสร็จจริง
                    await initGlobalLayout(userData, user.email);
                    
                    if (typeof loadDashboardStats === 'function') {
                        loadDashboardStats(user.email);
                    }
                } else {
                    alert("สิทธิ์การใช้งานของคุณไม่ถูกต้อง");
                    await signOut(auth);
                    window.location.replace("login.html");
                }
            } else {
                alert("ไม่พบข้อมูลผู้ใช้งานในระบบ");
                await signOut(auth);
                window.location.replace("login.html");
            }
        } catch (error) {
            console.error("Auth Change Error:", error);
        }
    } else {
        if (!window.location.pathname.includes("login.html")) {
            window.location.replace("login.html");
        }
    }
});

// 3. ฟังก์ชันโหลด Sidebar และ Topbar (ปรับปรุงใหม่)
async function initGlobalLayout(userData, email) {
    const components = [
        { id: 'sidebar-placeholder', url: './components/sidebar.html' },
        { id: 'topbar-placeholder', url: './components/topbar.html' }
    ];

    // 1. โหลด HTML Components (รอให้โหลดเสร็จจริงๆ ก่อนไปต่อ)
    for (const comp of components) {
        try {
            const response = await fetch(comp.url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const container = document.getElementById(comp.id);
            if (container) {
                container.innerHTML = html;
                console.log(`✅ Loaded Component: ${comp.id}`);
            }
        } catch (error) {
            console.error(`❌ Error loading ${comp.id}:`, error);
        }
    }

    // 2. ฟังก์ชันฉีดข้อมูลเข้า Topbar (ปรับปรุงให้เช็คถี่ขึ้น)
    const renderUserData = (attempts = 0) => {
        const nameEl = document.getElementById('tp-fullname');
        const userEl = document.getElementById('tp-username');
        const emailEl = document.getElementById('tp-email');
        const avatarEl = document.getElementById('tp-avatar-circle');

        if (nameEl) {
            // ใส่ข้อมูล (ใช้ค่าจาก userData ใน Firestore: image_0f7262.png)
            nameEl.innerText = userData.name || "user 02";
            if (userEl) userEl.innerText = `@${userData.username || "user02"}`;
            if (emailEl) emailEl.innerText = email || userData.email;
            if (avatarEl && (userData.name || userData.username)) {
                const firstChar = (userData.name || userData.username).charAt(0).toUpperCase();
                avatarEl.innerText = firstChar;
            }
            
            console.log("🚀 Topbar UI Updated Successfully!");
            // เริ่มระบบนาฬิกาเมื่อ UI พร้อมแล้ว
            initLiveClock();
        } else if (attempts < 50) { // ลองใหม่ทุก 20ms รวมสูงสุด 1 วินาที
            setTimeout(() => renderUserData(attempts + 1), 20);
        } else {
            console.error("❌ Critical: Topbar elements not found after 1s");
        }
    };

    // 3. เริ่มการอัปเดต UI
    renderUserData();

    // 4. เริ่มทำงานระบบ Sidebar
    if (typeof initSidebarBehavior === 'function') {
        initSidebarBehavior(userData);
    }
}

// ฟังก์ชันนาฬิกาแยกออกมาเพื่อความเป็นระเบียบ
function initLiveClock() {
    const clockEl = document.getElementById('tp-clock');
    const dateEl = document.getElementById('tp-date');
    if (clockEl && dateEl) {
        const update = () => {
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString('th-TH', { hour12: false });
            dateEl.innerText = now.toLocaleDateString('th-TH', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
            });
        };
        update();
        setInterval(update, 1000);
    }
}

    // เริ่มทำงานระบบ Sidebar (ลูกศรย่อขยาย)
    if (typeof initSidebarBehavior === 'function') {
        initSidebarBehavior(userData);
    }
}
// 4. ระบบควบคุม Sidebar (Toggle, Active Link, Admin Control)
function initSidebarBehavior(userData) {
    const sidebar = document.getElementById('sidebar-placeholder');
    const toggleBtn = document.getElementById('sidebar-toggle'); // ลูกศร Desktop
    const toggleIcon = document.getElementById('toggle-icon');
    const currentPath = window.location.pathname.split("/").pop() || "dashboard.html";

    // --- 1. ตรวจสอบสิทธิ์จากฟิลด์ role เท่านั้น ---
const adminSection = document.getElementById('admin-menu-section');
    if (adminSection) {
        // ปรับให้เช็คเป็น 'admin' (ตัวเล็ก) ตามฐานข้อมูล
        if (userData && userData.role && userData.role.toLowerCase() === 'admin') {
            adminSection.classList.remove('hidden', 'hidden-secure');
        } else {
            adminSection.remove(); 
        }
    }

    // --- 2. ตั้งค่า Active State (ไฮไลท์เมนูที่เลือก) ---
    document.querySelectorAll('.nav-link-modern').forEach(link => {
        // ลบ active เก่าออกก่อนเพื่อความชัวร์
        link.classList.remove('active');
        if (link.getAttribute('data-page') === currentPath) {
            link.classList.add('active');
        }
    });

    // --- 3. ระบบพับ Sidebar สำหรับ Desktop (ลูกศรข้าง Sidebar) ---
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('mini');
            if (toggleIcon) {
                if (sidebar.classList.contains('mini')) {
                    toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right');
                } else {
                    toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
                }
            }
        };
    }

    // --- 4. ระบบ Mobile Hamburger (ปุ่ม Bars ที่อาจจะมีในหน้าจอเล็ก) ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.onclick = () => {
            // ใช้ class 'active' หรือ 'translate-x-0' ขึ้นอยู่กับ CSS ของคุณ
            sidebar.classList.toggle('active'); 
        };
    }
}

// 5. ฟังก์ชันดึงสถิติ Dashboard
async function loadDashboardStats(userEmail) {
    try {
        const q = query(collection(db, "tickets"), where("ownerEmail", "==", userEmail));
        const snap = await getDocs(q);
        
        let total = 0, progress = 0, closed = 0;
        
        snap.forEach(docSnap => {
            const data = docSnap.data();
            total++;
            if (["In Progress", "Pending", "กำลังดำเนินการ"].includes(data.status)) progress++;
            if (["Success", "Closed", "ปิดงานแล้ว"].includes(data.status)) closed++;
        });

        // อัปเดตตัวเลขการ์ด
        const setVal = (id, val) => { if(document.getElementById(id)) document.getElementById(id).innerText = val; };
        setVal('stat-total', total);
        setVal('stat-progress', progress);
        setVal('stat-closed', closed);

        // คำนวณความสำเร็จ (%)
        if (total > 0) {
            const percent = Math.round((closed / total) * 100);
            setVal('eff-percent', percent + "%");
            const circle = document.getElementById('progress-circle');
            if (circle) circle.style.strokeDasharray = `${percent} 100`;
        }
    } catch (err) {
        console.error("Stats Error:", err);
    }
}

// 6. ระบบ Logout (ใช้ Event Delegation)
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
    // ยกเลิก Logout
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

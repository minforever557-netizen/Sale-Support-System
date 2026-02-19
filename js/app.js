import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = { 
    apiKey: "AIzaSyAa2uSD_tjNqYE2eXnZcn75h_jAVscDG-c",
    authDomain: "salesupportsystemapp.firebaseapp.com",
    projectId: "salesupportsystemapp",
    storageBucket: "salesupportsystemapp.firebasestorage.app",
    messagingSenderId: "840890441207",
    appId: "1:840890441207:web:f3a5076d46e963a90de2f2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ฟังก์ชันหลักที่ทุกหน้าจะเรียกใช้
export async function initPage() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : { name: "User", role: "USER" };
            await loadLayout(userData, user.email);
        } else {
            window.location.replace("login.html");
        }
    });
}

async function loadLayout(userData, email) {
    const comps = [
        { id: 'sidebar-placeholder', url: './components/sidebar.html' },
        { id: 'topbar-placeholder', url: './components/topbar.html' }
    ];

    for (const comp of comps) {
        const res = await fetch(comp.url);
        if (res.ok) {
            let html = await res.text();
            if (comp.id === 'topbar-placeholder') {
                html = html.replace(/{{name}}/g, userData.name || 'Loading...')
                           .replace(/{{email}}/g, email || '')
                           .replace(/{{role}}/g, userData.role || 'USER');
            }
            const el = document.getElementById(comp.id);
            el.innerHTML = html;
            
            // รัน Script เพื่อให้ปุ่มย่อขยาย Sidebar ทำงาน
            el.querySelectorAll("script").forEach(oldScript => {
                const newScript = document.createElement("script");
                newScript.type = "module";
                newScript.textContent = oldScript.textContent;
                document.head.appendChild(newScript);
            });
        }
    }
}

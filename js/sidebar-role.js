import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


console.log("ROLE CHECK START");

document.addEventListener("layoutLoaded", () => {

  onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

      // ✅ ไปอ่าน USER PROFILE จาก database
      const q = query(
        collection(db, "admin"), // ⭐ collection ที่เก็บ user profile
        where("email", "==", user.email)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        console.warn("User profile not found");
        return;
      }

      const userData = snap.docs[0].data();
      const role = (userData.role || "").toLowerCase();

      console.log("USER ROLE =", role);

      const adminMenu =
        document.getElementById("admin-menu-section");

      // ✅ เช็คจาก FIELD role โดยตรง
      if (role === "admin") {

        console.log("ADMIN MENU SHOW");

        if (adminMenu)
          adminMenu.style.display = "block";

      } else {

        console.log("NORMAL USER");

        if (adminMenu)
          adminMenu.style.display = "none";
      }

    } catch (err) {
      console.error("ROLE LOAD ERROR:", err);
    }

  });

});

// ==========================================================
// ส่วนที่เพิ่มใหม่: ระบบ Notification แบบสมบูรณ์ (Persistent & Detailed)
// ==========================================================
import { 
    onSnapshot, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function startNotificationSystem(role, email) {
    const notiDot = document.getElementById('noti-dot');
    const notiList = document.getElementById('noti-list');
    const notiBtn = document.getElementById('noti-btn');
    const notiDrop = document.getElementById('noti-dropdown');

    if (!notiList) return;

    let q;
    if (role === 'admin') {
        // Admin: ดึงรายการ Pending ล่าสุด
        q = query(collection(db, "tickets"), where("status", "==", "Pending"), orderBy("createdAt", "desc"), limit(5));
    } else {
        // User: ดึงรายการที่อัปเดตล่าสุดของตัวเอง
        q = query(collection(db, "tickets"), where("ownerEmail", "==", email), orderBy("updatedAt", "desc"), limit(5));
    }

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            notiList.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs font-medium">ไม่มีการแจ้งเตือน</div>`;
            if (notiDot) notiDot.classList.add('hidden');
            return;
        }

        let html = "";
        let hasNewChange = false;

        // ✅ 1. ตรวจสอบการเปลี่ยนแปลงเพื่อแสดงจุดแดง (เฉพาะข้อมูลใหม่ที่ไม่ได้มาจาก Cache)
        snapshot.docChanges().forEach((change) => {
            if (!snapshot.metadata.fromCache && (change.type === "added" || change.type === "modified")) {
                hasNewChange = true;
            }
        });

        // ✅ 2. วนลูปสร้างรายการจาก Snapshot ทั้งหมด (ทำให้ข้อมูลไม่หายเมื่อ Refresh)
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const internetNo = data.id_number || data.internetNo || "ไม่ระบุเลข";
            const topic = data.topic || "ไม่มีหัวข้อ";

            if (role === 'admin') {
                // --- Template สำหรับ ADMIN ---
                html += `
                    <div onclick="window.location.href='admin-management.html'" 
                         class="p-4 border-b border-slate-50 hover:bg-emerald-50 transition cursor-pointer group">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span class="font-black text-emerald-600 text-[10px] uppercase tracking-wider">ใบงานใหม่รอจัดการ</span>
                        </div>
                        <div class="font-bold text-slate-700 text-xs leading-tight">Internet No: ${internetNo}</div>
                        <div class="text-slate-500 text-[11px] mt-1 line-clamp-1">หัวข้อ: ${topic}</div>
                        <div class="text-[9px] text-emerald-500 mt-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity">➔ ไปหน้าจัดการงาน</div>
                    </div>`;
            } else {
                // --- Template สำหรับ USER ---
                let messageTitle = "มีการอัปเดตใบงาน";
                let messageDetail = `ใบงานหมายเลข ${internetNo} มีการอัปเดตข้อมูลใหม่`;
                let themeColor = "blue";
                let bgColor = "bg-blue-50/50";
                let textColor = "text-blue-600";

                // แยกประเภทข้อความตามสถานะ
                if (data.status === "Success" || data.status === "In Progress") {
                    messageTitle = "ใบงานได้รับการตรวจสอบแล้ว";
                    messageDetail = `ใบงานหมายเลข ${internetNo} ได้รับการตรวจสอบและปรับสถานะเป็น ${data.status} เรียบร้อย`;
                    themeColor = "emerald";
                    bgColor = "bg-emerald-50/50";
                    textColor = "text-emerald-600";
                } else {
                    messageTitle = "มีการ Update ใบงานแล้ว";
                    messageDetail = `แอดมินได้เพิ่มหมายเหตุหรือข้อมูลในใบงานหมายเลข ${internetNo}`;
                }

                html += `
                    <div onclick="window.location.href='dashboard.html'" 
                         class="p-4 border-b border-slate-50 hover:${bgColor} transition cursor-pointer group">
                        <div class="font-bold ${textColor} text-xs mb-1 flex items-center gap-1">
                            <span>🔔</span> ${messageTitle}
                        </div>
                        <div class="text-slate-700 font-bold text-[11px] leading-snug mb-1">"${topic}"</div>
                        <div class="text-slate-500 text-[10px] leading-relaxed line-clamp-2">${messageDetail}</div>
                    </div>`;
            }
        });

        // ✅ 3. อัปเดต UI
        notiList.innerHTML = html;
        if (hasNewChange && notiDot) {
            notiDot.classList.remove('hidden');
        }
    });

    // ✅ 4. ระบบ Dropdown
    if (notiBtn && notiDrop) {
        notiBtn.onclick = (e) => {
            e.stopPropagation();
            notiDrop.classList.toggle('hidden');
            if (notiDot) notiDot.classList.add('hidden');
        };
        // คลิกพื้นที่อื่นเพื่อปิด
        window.addEventListener('click', () => notiDrop.classList.add('hidden'));
    }
}

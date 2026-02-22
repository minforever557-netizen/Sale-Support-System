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


// ================= HELPER : WAIT ELEMENT =================
function waitForElement(id, callback) {

  const el = document.getElementById(id);

  if (el) {
    callback(el);
    return;
  }

  const observer = new MutationObserver(() => {
    const el = document.getElementById(id);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

window.addEventListener("layoutLoaded", () => {

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

      waitForElement("admin-menu-section", () => {

  const adminMenu =
    document.getElementById("admin-menu-section");

  if (role === "admin") {

    console.log("ADMIN MENU SHOW");
    adminMenu.style.display = "block";

  } else {

    console.log("NORMAL USER");
    adminMenu.style.display = "none";
  }

});
      

  // ================= START NOTIFICATION =================
waitForElement("noti-btn", () => {

  console.log("START NOTIFICATION");

  startNotificationSystem(role, user.email);

});

    } catch (err) {
      console.error("ROLE LOAD ERROR:", err);
    }

  });

});

// ==========================================================
// ส่วนที่เพิ่มใหม่: ระบบ Notification (ไม่กระทบ Script เดิม)
// ==========================================================
import { 
    onSnapshot, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================================
// ✅ NOTIFICATION SYSTEM (FINAL STABLE VERSION)
// ==========================================================
async function startNotificationSystem(role, email) {

    const notiDot  = document.getElementById('noti-dot');
    const notiList = document.getElementById('noti-list');
    const notiBtn  = document.getElementById('noti-btn');
    const notiDrop = document.getElementById('noti-dropdown');
    const clearBtn = document.getElementById('clear-all-noti');

    if (!notiList || !notiBtn || !notiDrop) {
    console.warn("Notification elements not ready");
    return;
}

    // ✅ ป้องกัน listener ซ้อน (สำคัญมาก)
    if (window.notiUnsubscribe) {
        window.notiUnsubscribe();
    }

    // ================= QUERY BY ROLE =================
    let q;

    if (role === "admin") {

        // 👑 ADMIN เห็นทุก ticket ใหม่
        q = query(
            collection(db, "tickets"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

    } else {

        // 👤 USER เห็นเฉพาะของตัวเอง
        q = query(
            collection(db, "tickets"),
            where("ownerEmail", "==", email),
            orderBy("updatedAt", "desc"),
            limit(10)
        );
    }

    // ================= REALTIME LISTENER =================
    window.notiUnsubscribe = onSnapshot(q, (snapshot) => {

        if (snapshot.empty) {
            notiList.innerHTML =
                `<div class="p-4 text-center text-slate-400 text-xs">
                    ไม่มีการแจ้งเตือน
                </div>`;
            notiDot?.classList.add("hidden");
            return;
        }

        let html = "";
        let hasNew = false;

        snapshot.docChanges().forEach((change) => {

            const data = change.doc.data();

            // ===== ADMIN : ticket ใหม่ =====
            if (role === "admin" && change.type === "added") {

                html += `
                <div class="p-4 border-b hover:bg-emerald-50 cursor-pointer">
                    <div class="font-bold text-emerald-600">🆕 ใบงานใหม่</div>
                    <div class="text-[11px] text-slate-600">
                        ${data.owner} เปิดใบงาน : ${data.topic}
                    </div>
                </div>`;

                hasNew = true;
            }

            // ===== USER : ticket ถูกอัปเดต =====
            if (role !== "admin" && change.type === "modified") {

                html += `
                <div class="p-4 border-b hover:bg-blue-50 cursor-pointer">
                    <div class="font-bold text-blue-600">🔔 อัปเดตใบงาน</div>
                    <div class="text-[11px] text-slate-600">
                        ${data.topic} → ${data.status}
                    </div>
                </div>`;

                hasNew = true;
            }

        });

        if (hasNew) {
            notiList.innerHTML = html + notiList.innerHTML;
            notiDot?.classList.remove("hidden");
        }
    });

    // ================= DROPDOWN =================
    if (notiBtn && notiDrop) {

        notiBtn.onclick = (e) => {
            e.stopPropagation();
            notiDrop.classList.toggle("hidden");
            notiDot?.classList.add("hidden");
        };

        window.addEventListener("click", () => {
            notiDrop.classList.add("hidden");
        });
    }

    // ================= CLEAR ALL =================
    if (clearBtn) {
        clearBtn.onclick = () => {

            notiList.innerHTML =
                `<div class="p-4 text-center text-slate-400 text-xs">
                    ไม่มีการแจ้งเตือน
                </div>`;

            notiDot?.classList.add("hidden");
        };
    }
}



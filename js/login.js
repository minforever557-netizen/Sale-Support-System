import { auth } from "./firebase.js";

/* ===============================
   NOTIFICATION FUNCTION
================================*/
function showNotify(message, type = "success") {

  const area = document.getElementById("notifyArea");
  if (!area) return;

  const box = document.createElement("div");
  box.className = `notify ${type}`;
  box.innerText = message;

  area.appendChild(box);

  // animate เข้า
  setTimeout(() => {
    box.classList.add("show");
  }, 50);

  // หายอัตโนมัติ
  setTimeout(() => {
    box.classList.remove("show");
    setTimeout(() => box.remove(), 300);
  }, 3000);
}


/* ===============================
   LOGIN EVENT
================================*/
window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("loginBtn");

  if (!btn) {
    console.error("ไม่พบปุ่ม loginBtn");
    return;
  }

  btn.addEventListener("click", async () => {

    const username =
      document.getElementById("username").value.trim();

    const password =
      document.getElementById("password").value.trim();

    // ===== VALIDATE =====
    if (!username) {
      showNotify("กรุณากรอก Username", "warning");
      return;
    }

    if (password.length < 4) {
      showNotify("Password ต้องอย่างน้อย 4 ตัว", "warning");
      return;
    }

    // ===== DEMO STEP (ยังไม่ auth จริง) =====
    console.log("Login Clicked ✅");
    console.log("Username:", username);

    showNotify("ระบบพร้อม Login แล้ว ✅", "success");

    // STEP ถัดไปจะใส่ Firebase Login จริงตรงนี้
    /*
      await signInWithEmailAndPassword(...)
      redirect dashboard
    */

  });

});

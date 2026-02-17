import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn = document.getElementById("loginBtn");

function notify(msg, type = "error") {

  const box = document.createElement("div");
  box.className =
    "fixed top-5 right-5 px-6 py-3 rounded-xl text-white shadow-lg transition-all duration-500 translate-x-full";

  box.style.background =
    type === "success" ? "#16a34a" : "#dc2626";

  box.innerText = msg;

  document.body.appendChild(box);

  setTimeout(() => {
    box.classList.remove("translate-x-full");
  }, 100);

  setTimeout(() => {
    box.classList.add("translate-x-full");
    setTimeout(() => box.remove(), 500);
  }, 2500);
}

btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    notify("กรุณากรอกข้อมูล", "error");
    return;
  }

  try {

    const querySnapshot = await getDocs(collection(db, "user"));

    let loginSuccess = false;

    querySnapshot.forEach((doc) => {
      const user = doc.data();

      if (
        user.email === email &&
        user.password === password
      ) {
        loginSuccess = true;

        notify("Login Success", "success");

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1200);
      }
    });

    if (!loginSuccess) {
      notify("Email หรือ Password ไม่ถูกต้อง", "error");
    }

  } catch (err) {
    console.error(err);
    notify("เชื่อมต่อ Firebase ไม่สำเร็จ", "error");
  }

});

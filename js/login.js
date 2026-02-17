import { auth } from "./firebase.js";

// รอหน้าโหลดก่อน
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("loginBtn");

  btn.addEventListener("click", async () => {

    const username =
      document.getElementById("username").value;

    const password =
      document.getElementById("password").value;

    if(password.length < 4){
      alert("Password ต้องอย่างน้อย 4 ตัว");
      return;
    }

    // ตอนนี้ทดสอบก่อน
    console.log("Login Clicked");
    console.log("Username:", username);

    alert("ปุ่มทำงานแล้ว ✅ (Step ต่อไปจะเชื่อม Firebase Login)");

  });

});

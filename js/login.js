import { auth } from "./firebase.js";

window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("loginBtn");

  // กัน error ถ้าหา element ไม่เจอ
  if(!btn){
    console.error("ไม่พบ loginBtn");
    return;
  }

  btn.addEventListener("click", () => {

    const username =
      document.getElementById("username").value;

    const password =
      document.getElementById("password").value;

    if(password.length < 4){
      alert("Password ต้องอย่างน้อย 4 ตัว");
      return;
    }

    console.log("Login Clicked ✅");
    alert("ปุ่มทำงานแล้ว");

  });

});

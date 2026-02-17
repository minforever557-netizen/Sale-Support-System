import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

// ================= LOGIN =================
document.getElementById("loginBtn")
.addEventListener("click", async () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(!username || !password){
        notify("กรอกข้อมูลให้ครบ","error");
        return;
    }

    try{

        const querySnapshot = await getDocs(collection(db,"admin"));

        let loginSuccess = false;

        querySnapshot.forEach((doc)=>{
            const data = doc.data();

            if(
                data.username === username &&
                data.password === password
            ){
                loginSuccess = true;

                // SAVE SESSION
                localStorage.setItem("user",JSON.stringify(data));

                notify("Login สำเร็จ");

                setTimeout(()=>{
                    window.location.href="dashboard.html";
                },1000);
            }
        });

        if(!loginSuccess){
            notify("Username หรือ Password ไม่ถูก","error");
        }

    }catch(err){
        console.error(err);
        notify("ระบบ error","error");
    }
});

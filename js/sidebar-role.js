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

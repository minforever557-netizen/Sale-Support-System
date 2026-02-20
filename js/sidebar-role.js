// รอให้ layout โหลด sidebar เสร็จก่อน
document.addEventListener("layoutLoaded", () => {

    const role = (localStorage.getItem("userRole") || "")
        .toLowerCase()
        .trim();

    console.log("ROLE CHECK =", role);

    const adminMenu = document.getElementById("admin-menu-section");

    if (!adminMenu) {
        console.log("ADMIN MENU NOT FOUND");
        return;
    }

    // ✅ แสดงเฉพาะ admin
    adminMenu.style.display =
        role === "admin" ? "block" : "none";

});

document.addEventListener("DOMContentLoaded", () => {

    const role = (localStorage.getItem("userRole") || "")
                    .toLowerCase()
                    .trim();

    console.log("ROLE CHECK =", role);

    const adminMenu = document.getElementById("admin-menu-section");

    if (!adminMenu) return;

    // ✅ แสดงเฉพาะ admin
    if (role === "admin") {
        adminMenu.style.display = "block";
    } else {
        adminMenu.style.display = "none";
    }

});

document.addEventListener("layoutLoaded", () => {

  console.log("ROLE CHECK START");

  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    console.warn("No userData found");
    return;
  }

  // ✅ กันพังเรื่องตัวใหญ่ตัวเล็ก
  const role = (userData.role || "").toLowerCase();

  console.log("USER ROLE =", role);

  // ===== เปิด ADMIN MENU =====
  const adminSection = document.getElementById("admin-menu-section");

  if (!adminSection) {
    console.warn("admin-menu-section not found");
    return;
  }

  if (role === "admin") {
    adminSection.style.display = "block";
    console.log("ADMIN MENU SHOW");
  } else {
    adminSection.style.display = "none";
  }

});

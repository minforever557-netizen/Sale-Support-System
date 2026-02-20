document.addEventListener("layoutLoaded", async () => {

  console.log("ROLE CHECK START");

  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    console.warn("No userData");
    return;
  }

  // ✅ แก้ตรงนี้
  const role = (userData.role || "").toLowerCase();

  console.log("ROLE =", role);

  // ===== MENU =====
  const adminMenus = document.querySelectorAll(".menu-admin");
  const userMenus = document.querySelectorAll(".menu-user");

  if (role === "admin") {

    adminMenus.forEach(el => el.classList.remove("hidden"));
    userMenus.forEach(el => el.classList.remove("hidden"));

  } else {

    adminMenus.forEach(el => el.classList.add("hidden"));
  }

});

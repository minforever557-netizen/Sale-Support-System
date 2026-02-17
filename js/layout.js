// ===============================
// LOAD MAIN LAYOUT (SIDEBAR + TOPBAR)
// ===============================

async function loadLayout() {
  try {

    // ---------- LOAD SIDEBAR ----------
    const sidebarRes = await fetch("./components/sidebar.html");
    const sidebarHTML = await sidebarRes.text();
    document.getElementById("sidebar-container").innerHTML = sidebarHTML;

    // ---------- LOAD TOPBAR ----------
    const topbarRes = await fetch("./components/topbar.html");
    const topbarHTML = await topbarRes.text();
    document.getElementById("topbar-container").innerHTML = topbarHTML;

    // ---------- AFTER LOAD COMPLETE ----------
    setActiveMenu();
    loadUserToTopbar();

  } catch (error) {
    console.error("Layout Load Error:", error);
  }
}


// ===============================
// ACTIVE MENU AUTO HIGHLIGHT
// ===============================

function setActiveMenu() {

  const currentPage = window.location.pathname.split("/").pop();

  const links = document.querySelectorAll(".menu-link");

  links.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add(
        "bg-blue-500",
        "text-white",
        "font-semibold"
      );
    }
  });

}


// ===============================
// LOAD USER TO TOPBAR
// ===============================

function loadUserToTopbar() {

  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData) return;

  const fullname = document.getElementById("userFullname");
  const email = document.getElementById("userEmail");

  if (fullname) {
    fullname.innerText =
      (userData.name || "") + " " + (userData.lastname || "");
  }

  if (email) {
    email.innerText = userData.email || "";
  }
}


// ===============================
// START SYSTEM
// ===============================

document.addEventListener("DOMContentLoaded", loadLayout);

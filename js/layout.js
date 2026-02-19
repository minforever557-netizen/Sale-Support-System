// ==============================
// LOAD SIDEBAR + TOPBAR
// ==============================

async function loadLayout() {

    // ---------- SIDEBAR ----------
    const sidebar = await fetch("./components/sidebar.html?v=" + Date.now())
        .then(res => res.text());

    document.getElementById("sidebar-container").innerHTML = sidebar;

    // ---------- TOPBAR ----------
    const topbar = await fetch("./components/topbar.html?v=" + Date.now())
        .then(res => res.text());

    document.getElementById("topbar-container").innerHTML = topbar;

    // หลัง inject HTML ต้อง init
    initLogout();
    loadUserToTopbar();
    setActiveMenu();
}



// ==============================
// LOAD USER TO TOPBAR
// ==============================
function loadUserToTopbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const role = document.getElementById("userRole");
    const fullname = document.getElementById("userFullname");
    const email = document.getElementById("userEmail");

    if (role) role.innerText = user.role || "User";
    if (fullname)
        fullname.innerText =
            (user.name || "") + " " + (user.lastname || "");
    if (email) email.innerText = user.email || "-";
}
// ==============================
// SET ACTIVE MENU
// ==============================
function setActiveMenu() {

    const currentPage = location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link-modern")
        .forEach(link => {

            const page = link.dataset.page;

            if (page === currentPage) {
                link.classList.add("active");
            }
        });
}



// ==============================
// LOGOUT
// ==============================
function initLogout() {

    const btn =
        document.getElementById("logoutBtn") ||
        document.getElementById("main-logout-btn");

    if (!btn) return;

    btn.addEventListener("click", () => {

        localStorage.removeItem("user");
        window.location.href = "index.html";
    });
}



// ==============================
// PAGE GUARD
// ==============================
function authGuard() {

    const user = localStorage.getItem("user");
    console.log("AUTH GUARD CHECK:", user);

    if (!user) {
        window.location.href = "index.html";
    }
}


// ==============================
// START
// ==============================
authGuard();
loadLayout();

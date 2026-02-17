// ==============================
// LOAD SIDEBAR + TOPBAR
// ==============================

async function loadLayout() {

    // ---------- SIDEBAR ----------
    const sidebar = await fetch("./components/sidebar.html")
        .then(res => res.text());

    document.getElementById("sidebar-container").innerHTML = sidebar;

    // ---------- TOPBAR ----------
    const topbar = await fetch("./components/topbar.html")
        .then(res => res.text());

    document.getElementById("topbar-container").innerHTML = topbar;

    // หลัง inject HTML ต้อง init
    initLogout();
    loadUserToTopbar();
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
// LOGOUT
// ==============================
function initLogout() {

    const btn = document.getElementById("logoutBtn");

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

    if (!user) {
        window.location.href = "index.html";
    }
}


// ==============================
// START
// ==============================
authGuard();
loadLayout();

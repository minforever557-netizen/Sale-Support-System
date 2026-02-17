// =============================
// LOAD USER TO TOPBAR
// =============================

export function loadUserToTopbar() {

    const raw = localStorage.getItem("user");
    if (!raw) return;

    const userData = JSON.parse(raw);

    // element
    const fullnameEl = document.getElementById("userFullname");
    const emailEl = document.getElementById("userEmail");

    // รองรับหลายรูปแบบ field
    let fullname =
        userData.fullname ||
        userData.name ||
        ((userData.firstname || "") + " " + (userData.lastname || ""));

    if (fullnameEl)
        fullnameEl.innerText = fullname || "Unknown User";

    if (emailEl)
        emailEl.innerText = userData.email || "-";
}

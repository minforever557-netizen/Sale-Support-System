async function loadLayout() {

  // ===== SIDEBAR =====
  const sidebar = await fetch("components/sidebar.html");
  document.getElementById("sidebar").innerHTML =
      await sidebar.text();

  // ===== TOPBAR =====
  const topbar = await fetch("components/topbar.html");
  document.getElementById("topbar").innerHTML =
      await topbar.text();

  startClock();
}

// ===== CLOCK =====
function startClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById("dateTime").innerText =
      now.toLocaleString("th-TH");
  }, 1000);
}

loadLayout();
loadUserProfile();
async function loadUserProfile() {

  // อ่าน username จาก session
  const username = localStorage.getItem("username");

  if (!username) return;

  // firebase db
  const db = window.db;

  const snapshot = await db
      .collection("admin")
      .where("username", "==", username)
      .get();

  snapshot.forEach(doc => {

      const data = doc.data();

      document.getElementById("userFullname").innerText =
          data.name || "-";

      document.getElementById("userEmail").innerText =
          data.email || "-";
  });
}

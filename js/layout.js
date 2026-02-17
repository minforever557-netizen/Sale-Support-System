function toggleSidebar(){
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("hidden");
}
// โหลด Sidebar
async function loadLayout() {

  const sidebar = await fetch("components/sidebar.html");
  const sidebarHTML = await sidebar.text();

  document.getElementById("sidebar").innerHTML = sidebarHTML;

}

loadLayout();


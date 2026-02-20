document.addEventListener("layoutLoaded", () => {

    console.log("ROLE CHECK START");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const role = user.role;

    if (role === "admin") {
        document.querySelectorAll(".admin-menu")
            .forEach(el => el.classList.remove("hidden"));
    }
});

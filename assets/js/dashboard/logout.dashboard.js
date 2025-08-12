///Function LogOut
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem("session");
    alert("You have been logged out successfully.");
    window.location.href = "login.html";
});
function checkSession() {
    const sessionData = JSON.parse(localStorage.getItem("session"));
    const now = Date.now();

    if (!sessionData) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    if (now > sessionData.expiresAt) {
        localStorage.removeItem("session");
        alert("Session expired. Please login again.");
        window.location.href = "login.html";
        return;
    }
}
checkSession();
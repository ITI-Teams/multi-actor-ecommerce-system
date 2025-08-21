// ====== التحقق من الجلسة ======
function checkSession() {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) {
        window.location.href = "login.html";
        return null;
    }

    if (Date.now() > session.expiresAt) {
        localStorage.removeItem("session");
        alert("Session has expired. Please log in again.");
        window.location.href = "login.html";
        return null;
    }

    return session;
}

// ====== التحقق من الصلاحيات ======
function checkAuthorization(allowedRoles = []) {
    const session = checkSession();
    if (!session) return;

    if (session.role === "admin") return;

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
        alert("You are not authorized to access this page.");
        window.location.href = "dashboard.html";
    }
}

function filterSidebar() {
    const session = checkSession();
    if (!session) return;

    document.querySelectorAll("#sidebar li[data-role]").forEach(item => {
        const allowedRole = item.getAttribute("data-role");

        if (
            allowedRole !== "common" &&
            session.role !== "admin" &&
            allowedRole !== session.role
        ) {
            item.remove();
        }
    });
}

// ====== استدعاء الدوال عند تحميل الصفحة ======
document.addEventListener("DOMContentLoaded", function () {
    checkAuthorization(["seller"]);
});

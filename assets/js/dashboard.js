const collapseBtn = document.getElementById('collapse-btn');
const sidebar = document.getElementById('sidebar');

collapseBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
});

if (localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
}

const toggleBtn = document.getElementById('toggleDarkMode');
const body = document.body;

function updateDarkIcon(isDark) {
    toggleBtn.innerHTML = isDark ? `<i class="fas fa-sun" id="darkIcon"></i>` : `<i class="fas fa-moon" id="darkIcon"></i>`;
}

toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('bg-dark');
    body.classList.toggle('text-white');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    updateDarkIcon(isDark);
});

if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('bg-dark', 'text-white');
    updateDarkIcon(true);
} else {
    updateDarkIcon(false);
}

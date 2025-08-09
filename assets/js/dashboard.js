/*Start Dashboard Layout*/
import { renderHeader } from '../js/include/header.dashboard.js';
import { renderFooter } from '../js/include/footer.dashboard.js';
import { renderSidebar } from '../js/include/sidebar.dashboard.js';

let currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll("#sidebar a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.parentElement.classList.add("active");
    }
});
let pageName = currentPage.replace('.html', '');
pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
if(currentPage == "index.html"){
    currentPage = 'dashboard.html';
    pageName  = 'Dashboard';
}
renderHeader(pageName,currentPage);
renderFooter();
renderSidebar(currentPage);
/*End Dashboard Layout*/

/*Start Splash Screen*/
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2000);
});
/*End Splash Screen*/

const collapseBtn = document.getElementById('collapse-btn');
const sidebar = document.getElementById('sidebar');

function updateCollapseIcon(isCollapsed) {
    collapseBtn.innerHTML = isCollapsed ? `<i class="fas fa-thumbtack"></i>` : `<i class="fas fa-greater-than"></i>`;
}

collapseBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    updateCollapseIcon(isCollapsed)
});

if (localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
    updateCollapseIcon(true);
} else {
    updateCollapseIcon(false);
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

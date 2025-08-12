document.addEventListener("DOMContentLoaded", function () {
    const session = JSON.parse(localStorage.getItem("session"));
    const AdminName = document.getElementById('AdminName');

    if (!session) {
        return;
    }

    const now = Date.now();
    if (now > session.expiresAt) {
        localStorage.removeItem("session");
        location.reload();
        return;
    }
    AdminName.innerHTML = `Profile (<strong>${session.name}</strong>)`;
});
export function renderHeader(pageName,currentPage) {
    const menuItems = [
        { href: "dashboard.html"   , icon: "fa-home"            , label: "Dashboard"   },
        { href: "products.html"    , icon: "fa-box"             , label: "Products"    },
        { href: "categories.html"  , icon: "fa-th"              , label: "Categories"  },
        { href: "orders.html"      , icon: "fa-paper-plane"     , label: "Orders"      },
        { href: "reviews.html"     , icon: "fa-star"            , label: "Reviews"     },
        { href: "cart.html"        , icon: "fa-cart-arrow-down" , label: "Cart"        },
        { href: "messages.html"    , icon: "fa-inbox"           , label: "messages"    },
        { href: "mails.html"       , icon: "fa-envelope"        , label: "Mails"       },
        { href: "customers.html"   , icon: "fa-user"            , label: "Customers"   },
        { href: "users.html"       , icon: "fa-users"           , label: "Users"       },
        { href: "profile.html"     , icon: "fa-id-card"         , label: "My Profile"  },
        { href: "menus.html"       , icon: "fa-bars"            , label: "Menus"       },
        { href: "settings.html"    , icon: "fa-cogs"            , label: "Settings"    },
    ];

    const links = menuItems.map(item => `
        <li class="nav-item ${item.href === currentPage ? "active" : ""}">
            <a href="${item.href}" class="nav-link text-white">
                <i class="fas ${item.icon}"></i> 
                <span class="ms-2">${item.label}</span>
            </a>
        </li>
    `).join("");

    document.getElementById("header").innerHTML = `
    <nav class="navbar shadow-sm px-3">
        <div class="container-fluid d-flex justify-content-between">
            <button id="modile-offcanvas" class="btn btn-outline-dark d-md-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar">
                <i class="fas fa-bars"></i>
            </button>
            <span class="navbar-brand mb-0 h1">${pageName}</span>
            <div class="dropdown">
                <button class="btn btn-light me-2" id="toggleDarkMode">
                    <i class="fas fa-moon" id="darkIcon"></i>
                </button>
                <button class="btn btn-light" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="../../../pages/dashboard/profile.html" id="AdminName">Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- Offcanvas Sidebar for Mobile -->
    <div class="offcanvas offcanvas-start bg-dark text-white" tabindex="-1" id="mobileSidebar">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">Larkon</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <ul class="nav nav-pills flex-column">
                ${links}
            </ul>
        </div>
    </div>
    `;
}
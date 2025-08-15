export function renderSidebar(currentPage) {
    const session = checkSession();
    if (!session) return;
    const menuItems = [
        { href: "dashboard.html"   , icon: "fa-home"             , label: "Dashboard"   , role: "common"  },
        { href: "products.html"    , icon: "fa-box"              , label: "Products"    , role: "seller"  },
        { href: "categories.html"  , icon: "fa-th"               , label: "Categories"  , role: "admin"   },
        { href: "orders.html"      , icon: "fa-paper-plane"      , label: "Orders"      , role: "seller"  },
        { href: "reviews.html"     , icon: "fa-star"             , label: "Reviews"     , role: "common"  },
        { href: "cart.html"        , icon: "fa-cart-arrow-down"  , label: "Cart"        , role: "common"  },
        { href: "messages.html"    , icon: "fa-inbox"            , label: "messages"    , role: "admin"   },
        { href: "mails.html"       , icon: "fa-envelope"         , label: "Mails"       , role: "seller"  },
        { href: "customers.html"   , icon: "fa-user"             , label: "Customers"   , role: "admin"   },
        { href: "users.html"       , icon: "fa-users"            , label: "Users"       , role: "admin"   },
        { href: "profile.html"     , icon: "fa-id-card"          , label: "My Profile"  , role: "common"  },
        { href: "menus.html"       , icon: "fa-bars"             , label: "Menus"       , role: "admin"   },
        // { href: "settings.html"    , icon: "fa-cogs"             , label: "Settings"    , role: "admin"   },
    ];

    const visibleItems = menuItems.filter(item => 
        item.role === "common" || session.role === "admin" || item.role === session.role
    );

    const links = visibleItems.map(item => `
        <li class="nav-item w-100 ${item.href === currentPage ? "active" : ""} data-role="${item.role}"">
            <a href="${item.href}" class="nav-link text-white px-0">
                <i class="fas ${item.icon}"></i> 
                <span class="ms-2 menu-text">${item.label}</span>
            </a>
        </li>
    `).join("");

    document.getElementById("sidebar").innerHTML = `
        <div class="d-flex flex-column align-items-start pt-2" id="sidebar-content">
            <div class="w-100 d-flex align-items-center px-3 py-3" id="toggle-area">
                <a href="#" class="d-flex align-items-center text-white text-decoration-none me-3" id="logo">
                    <img src="../../assets/img/Dashboard-logo.png" alt="Logo" width="30" height="30" class="me-2">
                    <span class="fs-5" id="logo-text">Trendora</span>
                </a>
                <button class="btn btn-sm btn-outline-light ms-auto" id="collapse-btn">
                    <i class="fas fa-greater-than"></i>
                </button>
            </div>
            <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu">
                ${links}
            </ul>
        </div>
    `;
}
export function renderHeader(pageName,currentPage) {
    const menuItems = [
        { href: "dashboard.html"   , icon: "fa-home"  , label: "Dashboard"   },
        { href: "products.html"    , icon: "fa-box"   , label: "Products"    },
        { href: "categories.html"  , icon: "fa-th"    , label: "Categories"  },
    ];
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
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#">Logout</a></li>
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
                <li class="nav-item">
                    <a href="#" class="nav-link text-white active">
                        <i class="fas fa-home"></i> 
                        <span class="ms-2">Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link text-white">
                        <i class="fas fa-box"></i> 
                        <span class="ms-2">Products</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link text-white">
                        <i class="fas fa-th"></i> 
                        <span class="ms-2">Categories</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link text-white">
                        <i class="fas fa-cogs"></i> 
                        <span class="ms-2">Settings</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    `;
}


export function renderSidebar(currentPage) {
    const menuItems = [
        { href: "dashboard.html"   , icon: "fa-home"  , label: "Dashboard"   },
        { href: "products.html"    , icon: "fa-box"   , label: "Products"    },
        { href: "categories.html"  , icon: "fa-th"    , label: "Categories"  },
    ];

    const links = menuItems.map(item => `
        <li class="nav-item w-100 ${item.href === currentPage ? "active" : ""}">
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
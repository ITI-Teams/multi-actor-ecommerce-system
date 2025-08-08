window.onload = function () {
    const main_nav = document.getElementById('main-nav')
    const main_footer = document.getElementById('main-footer')
    const nav_content = `<div class="container">
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand fw-bold fs-4" href="#">Trendora</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Features</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Pricing</a>
                        </li>
                    </ul>
                </div>

                <!-- profile -->
                <div class="d-flex flex-row gap-2">
                    <div class="dropdown bg-nav-transparent">
                        <button class="btn btn-link text-black text-decoration-none dropdown-toggle" type="button"
                            id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end profile" aria-labelledby="profileDropdown">
                            <li><a class="dropdown-item" href="#">Sign Up</a></li>
                            <li><a class="dropdown-item" href="#">Login</a></li>
                        </ul>
                    </div>
                </div>

                <!-- search -->
                <div class="collapse align-content-center me-2" id="searchIcon">
                    <div class="input-group">
                        <input class="form-control bg-transparent text-white border-light" type="search"
                            placeholder="Search" aria-label="Search">
                    </div>
                </div>
                <p class="mt-3">
                    <i class="fa fa-search" type="button" data-bs-toggle="collapse" data-bs-target="#searchIcon"
                        aria-expanded="false" aria-controls="searchIcon" aria-hidden="true">
                    </i>
                </p>

                <!-- cart -->
                <div class="dropdown">
                    <button class="btn btn-link text-black text-decoration-none position-relative" type="button"
                        id="cartDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger">
                            0
                        </span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end p-3 mycart" style="min-width: 300px;"
                        aria-labelledby="cartDropdown">
                        <p class="fs-4 fw-bold text-dark">Your Cart</p>
                        <p class="text-secondary mb-0">Your cart is empty</p>
                    </div>
                </div>
            </div>`;
    const footer_content = `<div class="container">
            <div class="row justify-content-center">
                <div class="col-sm mb-4 d-flex flex-column gap-1">
                    <h1>Trendora</h1>
                    <h3>Subscribe</h3>
                    <p>Get 10% off your first order</p>
                    <input type="email" class="subscribe-input" placeholder="Enter your email">
                </div>

                <div class="col-sm md pt-2 mb-4">
                    <h3>Support</h3>
                    <div class="support-info d-flex flex-column gap-1">
                        <a target="_blank" class="" href="https://maps.app.goo.gl/uQVUpHbPq2LidsDE9">Ill Bijby sarani,
                            Dhaka,<br />DH 1515, Bangladesh.</a>
                        <a target="_blank" class="" href="mailto:exclusive@gmail.com">exclusive@gmail.com</a>
                        <a href="tel:+88015-88888-9999">+88015-88888-9999</a>
                    </div>
                </div>

                <div class="col-sm md pt-2 mb-4">
                    <h3>Account</h3>
                    <div class="account-info d-flex flex-column gap-1">
                        <a href="/" class="nav-link">My Account</a>
                        <a href="/" class="nav-link">Login / Register</a>
                        <a href="/" class="nav-link">Cart</a>
                        <a href="/" class="nav-link">Wishlist</a>
                        <a href="/" class="nav-link">Shop</a>
                    </div>
                </div>

                <div class="col-sm md pt-2 mb-4">
                    <h3>Quick Link</h3>
                    <div class="quick-link d-flex flex-column gap-1">
                        <a href="/" class="nav-link">Privacy Policy</a>
                        <a href="/" class="nav-link">Terms Of Use</a>
                        <a href="/" class="nav-link">FAQ</a>
                        <a href="/" class="nav-link">Contact</a>
                    </div>
                </div>
            </div>

            <div class="copyright text-secondary">
                <p>© Copyright Rimel 2022. All right reserved.</p>
            </div>
        </div>`;        
    // adding the nav
    main_nav.innerHTML = nav_content;
    // adding the footer
    main_footer.innerHTML = footer_content;
};
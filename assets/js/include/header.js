const nav_content = `<div class="container">
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                    <a class="navbar-brand fw-bold fs-4" href="/">
                    <img src="/assets/img/Black White Minimalist Simple Monogram Typography Logo.svg" alt="Logo" width="75">
                        Trendora
                    </a>
                <div class="offcanvas offcanvas-start ps-3 pt-2" id="navbarNav">
                <div class="offcanvas-header">
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Men</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Women</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Kids</a>
                        </li>
                    </ul>
                </div>

                <!-- profile -->
                <div class="d-flex flex-row gap-2">
                    <div class="dropdown">
                        <button class="btn btn-link text-black text-decoration-none dropdown-toggle" type="button"
                            id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end profile" aria-labelledby="profileDropdown">
                            <li><a class="dropdown-item" href="/pages/register.html">Sign Up</a></li>
                            <li><a class="dropdown-item" href="/pages/login.html">Login</a></li>
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

export default nav_content;

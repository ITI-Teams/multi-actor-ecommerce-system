const dropdownMenu = document.getElementById('mydropdwenProfile');

if (!dropdownMenu) {
    console.error("Failed to find #mydropdwen after insertion");
}

if (!currentID) {
    dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="../../../pages/register.html">Sign Up</a></li>
        <li><a class="dropdown-item" href="../../../pages/login.html">Login</a></li>
    `;
} else {
    dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="../../../pages/user-profile.html">Profile (${currentCustomer?.name || 'User'})</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logout</a></li>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem("customerSession");
        alert("Successful logout");
        window.location.href = "../../../index.html";
    });
}


const menuContainer = document.getElementById("TrendoraMenu");
if (!menuContainer) {
    console.warn("#TrendoraMenu not found");
}

const storedMenu = JSON.parse(localStorage.getItem("menuData")) || [];

if (!Array.isArray(storedMenu) || storedMenu.length === 0) {
    menuContainer.innerHTML = `
       <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Categories
                    </button>
                <ul class="dropdown-menu">
                <li class="nav-item">
                            <a class="nav-link" href="../../../pages/categories.html">Men</a>
                        </li>
                          <li class="nav-item">
                            <a class="nav-link" href="../../../pages/categories.html">Women</a>
                        </li>
                          
  </ul>
</div>  
        

               <li class="nav-item">
                            <a class="nav-link" href="../../../pages/products.html">Proudcts</a>
                        </li>
                           <li class="nav-item">
                            <a class="nav-link" href="../../../pages/about-us-page.html">About</a>
                        </li>
                          <li class="nav-item">
                            <a class="nav-link" href="../../../pages/contact-us-page.html">Contact</a>
                        </li>

                      
    `;
} else {
    menuContainer.innerHTML = '';
    storedMenu.forEach((item, idx) => {
        const li = document.createElement('li');

        if (item.children && item.children.length > 0) {
            li.className = 'nav-item dropdown';

            const toggleId = `navDropdown-${idx}`;

            li.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" id="${toggleId}"
                role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                ${item.name}</a>
                <ul class="dropdown-menu" aria-labelledby="${toggleId}">${item.children.map(child => `<li><a class="dropdown-item" href="${child.link}">${child.name}</a></li>
                `).join('')}
                </ul>`;
        } else {
            li.className = 'nav-item';
            li.innerHTML = `<a class="nav-link" href="${item.link}">${item.name}</a>`;
        }

        menuContainer.appendChild(li);
    });
}

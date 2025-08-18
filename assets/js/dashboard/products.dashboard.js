let categoriesList = JSON.parse(localStorage.getItem("categories")) || [];
const categorySelect = document.getElementById("category");
categorySelect.innerHTML = "";
categoriesList.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
});
let products = JSON.parse(localStorage.getItem("products")) || [];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}


function renderTable() {
    const session = JSON.parse(localStorage.getItem("session")) || null;
    if (!session) {
        document.getElementById("productTableBody").innerHTML = 
            `<tr><td colspan="10" class="text-center text-danger">No session found</td></tr>`;
        return;
    }

    let filteredProducts = products;
    if (session.role === "seller") {
        filteredProducts = products.filter(p => p.seller_id === session.id);
    }

    const searchValue = document.getElementById("searchProduct").value.toLowerCase();
    filteredProducts = filteredProducts.filter(u =>
        (u.name && u.name.toLowerCase().includes(searchValue)) ||
        (u.description && u.description.toLowerCase().includes(searchValue))
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedProducts = filteredProducts.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";

    paginatedProducts.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${product.description.split(" ").slice(0, 3).join(" ") + "..."}</td>
                <td>${product.category}</td>
                <td>${product.reviews}</td>
                <td>${product.price}</td>
                <td class="${product.stock == 0 ? 'bg-danger text-white' : ''}">${product.stock}</td>
                <td>${product.size.map(z => `<span style="padding:2px; background-color: #44ff00; border-radius:4px; border:1px solid #025d74; margin:5px;">${z}</span>`).join("")}</td>
                <td>${product.color.map(c => `<span style="width:20px;height:20px;display:inline-block;background:${c};border-radius:4px;border:1px solid #ccc;margin-right:5px;"></span>`).join("")}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredProducts.length);
}



function renderPagination(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPagePagination ? "active" : ""}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
}

function changePage(page) {
    currentPagePagination = page;
    renderTable();
}

function showFormMessage(message, type = "danger") {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = `
        <div class="alert alert-${type} py-2 px-3" role="alert">
            ${message}
        </div>
    `;
    msgDiv.style.display = "block";
}

function clearFormMessage() {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = "";
    msgDiv.style.display = "none";
}

document.getElementById("createProductBtn").addEventListener("click", () => {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    clearFormMessage();
    document.getElementById("productModalTitle").textContent = "Create Product";
    new bootstrap.Modal(document.getElementById("productModal")).show();
});

document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();
    clearFormMessage();

    const id = document.getElementById("productId").value;
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const size = Array.from(document.getElementById("size").selectedOptions).map(opt => opt.value);
    const color = colorsArray;
    const images =  imagesArray;

    // Validation
    const allowedSizes = ["s", "m", "l", "XL", "XXL", "XXXL"];
    const allowedImageExtensions = /\.(png|jpg|jpeg|jpe|webp|svg)$/i;
    const colorRegex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    const invalidChars = /<.*?>|[{}[\]<>]/;
    if ([name, description, category, price,stock, ...size, ...color].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!name || !description || !category || !size.length || !color.length || !price || !stock || !images.length) {
        showFormMessage("All fields are required!");
        return;
    }
    if (name.length > 50) {
        showFormMessage("Name is too long, maximum 50 characters.");
        return;
    }
    if (description.length > 1200) {
        showFormMessage("Description is too long, maximum 500 characters.");
        return;
    }
    if (isNaN(price) || Number(price) <= 0) {
        showFormMessage("Price must be a positive number greater than 0.");
        return;
    }
    if (isNaN(stock) || Number(stock) < 0) {
        showFormMessage("Stock must be a positive number or = 0.");
        return;
    }
    if (!category.trim()) {
        showFormMessage("Category is required.");
        return;
    }
    if (!size.every(s => allowedSizes.includes(s))) {
        showFormMessage("Invalid size selected.");
        return;
    }
    if (!color.every(c => colorRegex.test(c))) {
        showFormMessage("Invalid color format. Use valid hex color codes like #FFF, #FFFFFF.");
        return;
    }
    const nameExists = products.some(p => 
        p.name.toLowerCase() === name.toLowerCase() && p.id != id
    );
    if (nameExists) {
        showFormMessage("A product with this name already exists!");
        return;
    }

    const session = JSON.parse(localStorage.getItem("session")) || null;

    const productData = {
        id: id ? parseInt(id) : Date.now(),
        name: name,
        description: description, 
        category: category,
        reviews: 4,
        price: price,
        size: size,
        color: colorsArray,
        images :imagesArray,
        seller_id: session ? session.id : 1,
        stock : stock,
    };

    if (id) {
        const index = products.findIndex(u => u.id == id);
        products[index] = productData;
    } else {
        products.push(productData);
    }

    saveProducts();
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    renderTable();
});

function editProduct(id) {
    const product = products.find(u => u.id === id);
    document.getElementById("productId").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("description").value= product.description;
    document.getElementById("category").value= product.category;
    document.getElementById("price").value= product.price;
    document.getElementById("stock").value= product.stock;

    Array.from(document.getElementById("size").options).forEach(opt => {
        opt.selected = product.size.includes(opt.value);
    });

    colorsArray = [...product.color];
    renderColors();
    imagesArray = [...product.images];
    renderImages();

    clearFormMessage();
    document.getElementById("productModalTitle").textContent = "Update Product";
    new bootstrap.Modal(document.getElementById("productModal")).show();
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        const index = products.findIndex(u => u.id === id);
        products.splice(index, 1);
        saveProducts();
        renderTable();
    }
}

document.getElementById("searchProduct").addEventListener("input", renderTable);

renderTable();

/// Add Colors
let colorsArray = [];
const colorInput = document.getElementById("colorInput");
const addColorBtn = document.getElementById("addColorBtn");
const colorList = document.getElementById("colorList");

function renderColors() {
    colorList.innerHTML = "";
    colorsArray.forEach((color, index) => {
        const badge = document.createElement("span");
        badge.className = "badge me-2 mb-2";
        badge.style.backgroundColor = color;
        badge.style.color = "#fff";
        badge.style.padding = "8px";
        badge.style.cursor = "pointer";
        badge.innerHTML = `${color} <span style="margin-left:5px;">✖</span>`;
        badge.addEventListener("click", () => {
            colorsArray.splice(index, 1);
            renderColors();
        });
        colorList.appendChild(badge);
    });
}

addColorBtn.addEventListener("click", () => {
    const selectedColor = colorInput.value;
    if (selectedColor && !colorsArray.includes(selectedColor)) {
        colorsArray.push(selectedColor);
        renderColors();
    }
});
let imagesArray = [];
const fileInput = document.getElementById("imageFileInput");
const imageList = document.getElementById("imageList");

fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    if (files.length) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagesArray.push(e.target.result);
                    renderImages();
                };
                reader.readAsDataURL(file);
            } else {
                alert("Only image files are allowed!");
            }
        });
    }
});

function renderImages() {
    imageList.innerHTML = "";
    imagesArray.forEach((imgSrc, index) => {
        const imgWrapper = document.createElement("div");
        imgWrapper.style.display = "inline-block";
        imgWrapper.style.position = "relative";
        imgWrapper.style.marginRight = "10px";
        const img = document.createElement("img");
        if (imgSrc.startsWith("data:")) {
            img.src = imgSrc;
        } else {
            img.src = "/assets/img/products/"+imgSrc;
        }
        img.style.width = "60px";
        img.style.height = "60px";
        img.style.objectFit = "cover";
        img.style.border = "1px solid #ccc";
        img.style.borderRadius = "4px";
        const removeBtn = document.createElement("span");
        removeBtn.innerHTML = "✖";
        removeBtn.style.position = "absolute";
        removeBtn.style.top = "0";
        removeBtn.style.right = "0";
        removeBtn.style.background = "rgba(0,0,0,0.5)";
        removeBtn.style.color = "#fff";
        removeBtn.style.fontSize = "12px";
        removeBtn.style.padding = "2px 4px";
        removeBtn.style.cursor = "pointer";
        removeBtn.addEventListener("click", () => {
            imagesArray.splice(index, 1);
            renderImages();
        });

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(removeBtn);
        imageList.appendChild(imgWrapper);
    });
}
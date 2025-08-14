let categories = JSON.parse(localStorage.getItem("categories")) || [];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

function renderTable() {
    const searchValue = document.getElementById("searchCategory").value.toLowerCase();
    const filteredCategories = categories.filter(u =>
        u.name.toLowerCase().includes(searchValue) ||
        u.description.toLowerCase().includes(searchValue)
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedCategories = filteredCategories.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("categoryTableBody");
    tbody.innerHTML = "";

    paginatedCategories.forEach(category => {
        tbody.innerHTML += `
            <tr>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredCategories.length);
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

document.getElementById("createCategoryBtn").addEventListener("click", () => {
    document.getElementById("categoryForm").reset();
    document.getElementById("categoryId").value = "";
    clearFormMessage();
    document.getElementById("categoryModalTitle").textContent = "Create Category";
    new bootstrap.Modal(document.getElementById("categoryModal")).show();
});

document.getElementById("categoryForm").addEventListener("submit", function(e) {
    e.preventDefault();
    clearFormMessage();

    const id = document.getElementById("categoryId").value;
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    
    // Validation
    const invalidChars = /<.*?>|[{}[\]<>]/;
    if ([name, description].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!name || !description ) {
        showFormMessage("All fields are required!");
        return;
    }
    if (name.length > 120) {
        showFormMessage("Name is too long, maximum 120 characters.");
        return;
    }
    if (description.length > 150) {
        showFormMessage("Description is too long, maximum 150 characters.");
        return;
    }
    if (!/^[\p{L}][\p{L}\d\s\p{P}\p{S}]*$/u.test(name.trim())) {
        showFormMessage("The name must begin with a letter and contain only letters and numbers.");
        return;
    }
    if (!/^[\p{L}][\p{L}\d\s\p{P}\p{S}]*$/u.test(description.trim())) {
        showFormMessage("The Description must begin with a letter and contain only letters and numbers.");
        return;
    }

    const categoryData = {
        id: id ? parseInt(id) : Date.now(),
        name: name,
        description: description, 
    };

    if (id) {
        const index = categories.findIndex(u => u.id == id);
        categories[index] = categoryData;
    } else {
        categories.push(categoryData);
    }

    saveCategories();
    bootstrap.Modal.getInstance(document.getElementById("categoryModal")).hide();
    renderTable();
});

function editCategory(id) {
    const category = categories.find(u => u.id === id);
    document.getElementById("categoryId").value = category.id;
    document.getElementById("name").value = category.name;
    document.getElementById("description").value= category.description;
    clearFormMessage();
    document.getElementById("categoryModalTitle").textContent = "Update Category";
    new bootstrap.Modal(document.getElementById("categoryModal")).show();
}

function deleteCategory(id) {
    if (confirm("Are you sure you want to delete this category?")) {
        const index = categories.findIndex(u => u.id === id);
        categories.splice(index, 1);
        saveCategories();
        renderTable();
    }
}

document.getElementById("searchCategory").addEventListener("input", renderTable);

renderTable();
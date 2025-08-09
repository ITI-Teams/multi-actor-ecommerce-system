let users = JSON.parse(localStorage.getItem("users")) || [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", phone: "123456789" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Seller", phone: "987654321" }
];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function renderTable() {
    const searchValue = document.getElementById("searchUser").value.toLowerCase();
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchValue) ||
        u.email.toLowerCase().includes(searchValue)
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    paginatedUsers.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.phone}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredUsers.length);
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

document.getElementById("createUserBtn").addEventListener("click", () => {
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    clearFormMessage();
    document.getElementById("userModalTitle").textContent = "Create User";
    new bootstrap.Modal(document.getElementById("userModal")).show();
});

document.getElementById("userForm").addEventListener("submit", function(e) {
    e.preventDefault();
    clearFormMessage();

    const id = document.getElementById("userId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Validation
    const invalidChars = /<.*?>|[{}[\]<>]/;
    if ([name, email, role, password, phone].some(field => invalidChars.test(field))) {
        showFormMessage("❌ المدخلات لا يجب أن تحتوي على أكواد HTML أو رموز غير مسموحة.");
        return;
    }
    if (!name || !email || !role || (!id && !password) || !phone) {
        showFormMessage("❌ جميع الحقول مطلوبة!");
        return;
    }
    if (!/^[\p{L}\s]+$/u.test(name)) {
        showFormMessage("❌ الاسم يجب أن يحتوي على حروف فقط بدون أرقام.");
        return;
    }
    if (name.length > 50) {
        showFormMessage("❌ الاسم طويل جدًا، الحد الأقصى 50 حرف.");
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email)) {
        showFormMessage("❌ البريد الإلكتروني غير صحيح. مثال: abdullah@google.com");
        return;
    }
    if (email.length > 100) {
        showFormMessage("❌ البريد الإلكتروني طويل جدًا.");
        return;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!id && !passwordPattern.test(password)) {
        showFormMessage("❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وصغير ورقم ورمز.");
        return;
    }
    const phonePattern = /^(010|012|013|015)\d{8}$/;
    if (!phonePattern.test(phone)) {
        showFormMessage("❌ رقم الهاتف يجب أن يبدأ بـ 010 أو 012 أو 013 أو 015 ويتكون من 11 رقم.");
        return;
    }



    const userData = {
        id: id ? parseInt(id) : Date.now(),
        name: name,
        email: email,
        role: role,
        password: password || (id ? users.find(u => u.id == id).password : ""),
        phone: phone
    };

    if (id) {
        const index = users.findIndex(u => u.id == id);
        users[index] = userData;
    } else {
        users.push(userData);
    }

    saveUsers();
    bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
    renderTable();
});

function editUser(id) {
    const user = users.find(u => u.id === id);
    document.getElementById("userId").value = user.id;
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("role").value = user.role;
    document.getElementById("password").value = "";
    document.getElementById("phone").value = user.phone;
    clearFormMessage();
    document.getElementById("userModalTitle").textContent = "Update User";
    new bootstrap.Modal(document.getElementById("userModal")).show();
}

function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        const index = users.findIndex(u => u.id === id);
        users.splice(index, 1);
        saveUsers();
        renderTable();
    }
}

document.getElementById("searchUser").addEventListener("input", renderTable);

renderTable();

let users = JSON.parse(localStorage.getItem("users")) || [];
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
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Validation
    const invalidChars = /<.*?>|[{}[\]<>]/;
    if ([name, email, role, password, phone].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!name || !email || !role || (!id && !password) || !phone) {
        showFormMessage("All fields are required!");
        return;
    }
    if (!/^[\p{L}\s]+$/u.test(name)) {
        showFormMessage("The name must contain only letters, no numbers.");
        return;
    }
    if (name.length > 50) {
        showFormMessage("Name is too long, maximum 50 characters.");
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email)) {
        showFormMessage("Invalid email address. Example: abdullah@google.com");
        return;
    }
    if (email.length > 100) {
        showFormMessage("The email is too long.");
        return;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!id && !passwordPattern.test(password)) {
        showFormMessage("The password must be at least 8 characters long and contain an uppercase and lowercase letter, a number, and a symbol.");
        return;
    }
    if (!id && password !== confirmPassword) {
        showFormMessage("Password and Confirm Password do not match!");
        return;
    }
    if (id && password && password !== confirmPassword) {
        showFormMessage("Password and Confirm Password do not match!");
        return;
    }
    const phonePattern = /^(010|011|012|013|015)\d{8}$/;
    if (!phonePattern.test(phone)) {
        showFormMessage("The phone number must start with 010, 012, 013 or 015 and consist of 11 digits.");
        return;
    }
    const existingUser = users.find(u => 
        (u.email === email && u.id != id) || 
        (u.phone === phone && u.id != id)
    );

    if (existingUser) {
        if (existingUser.email === email) {
            showFormMessage("This email is already registered. Please use a different email.");
            return;
        }
        if (existingUser.phone === phone) {
            showFormMessage("This phone number is already registered. Please use a different phone number.");
            return;
        }
    }


    let encryptedPassword;
    if (id) {
        const existingUser = users.find(u => u.id == id);
        encryptedPassword = password ? encryptText(password) : existingUser.password;
    } else {
        encryptedPassword = encryptText(password);
    }


    const userData = {
        id: id ? parseInt(id) : Date.now(),
        name: name,
        email: email,
        role: role,
        password: encryptedPassword,
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
    document.getElementById("confirmPassword").value = "";
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


function encryptText(text) {
    if (!text) return '';
    let step1 = text.split('').reverse().join('');
        let step2 = '';
    for (let i = 0; i < step1.length; i += 2) {
        if (i + 1 < step1.length) {
            step2 += step1[i+1] + step1[i];
        } else {
            step2 += step1[i];
        }
    }
    
    let step3 = '';
    for (let i = 0; i < step2.length; i++) {
        let charCode = step2.charCodeAt(i);
        step3 += String.fromCharCode(charCode + 3);
    }
    
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + step3 + suffix;
}

function decryptText(encryptedText) {
    if (!encryptedText) return '';
    
    let step1 = encryptedText.substring(1, encryptedText.length - 1);
    
    let step2 = '';
    for (let i = 0; i < step1.length; i++) {
        let charCode = step1.charCodeAt(i);
        step2 += String.fromCharCode(charCode - 3);
    }
    
    let step3 = '';
    for (let i = 0; i < step2.length; i += 2) {
        if (i + 1 < step2.length) {
            step3 += step2[i+1] + step2[i];
        } else {
            step3 += step2[i];
        }
    }
    
    return step3.split('').reverse().join('');
}
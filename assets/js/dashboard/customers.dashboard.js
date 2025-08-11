let customers = JSON.parse(localStorage.getItem("customers")) || [
    { 
        id: 1, 
        name: "Ahmed", 
        gender : "male",
        email: "Ahmed@trendora.com", 
        country: "Egypt",
        city: "Cairo",
        address: "12 street - cairo",
        birthday: "1999-07-15",
        phone: "01124252789",
        password: "@A1234s",
    },
    { 
        id: 2, 
        name: "mohamed", 
        gender : "male",
        email: "mohamed@trendora.com", 
        country: "Egypt",
        city: "Alex",
        address: "16 street - Alex",
        birthday: "1999-07-15",
        phone: "01257462789",
        password: "s1234@A",
    },
];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveCustomers() {
    localStorage.setItem("customers", JSON.stringify(customers));
}

function renderTable() {
    const searchValue = document.getElementById("searchCustomer").value.toLowerCase();
    const filteredCustomers = customers.filter(u =>
        u.name.toLowerCase().includes(searchValue) ||
        u.email.toLowerCase().includes(searchValue)
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedCustomers = filteredCustomers.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("customerTableBody");
    tbody.innerHTML = "";

    paginatedCustomers.forEach(customer => {
        tbody.innerHTML += `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.gender}</td>
                <td>${customer.country}</td>
                <td>${customer.city}</td>
                <td>${customer.address}</td>
                <td>${new Date(new Date()-new Date(customer.birthday)).getFullYear()-1970}</td>
                <td>${customer.phone}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomerr(${customer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredCustomers.length);
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

document.getElementById("createCustomerBtn").addEventListener("click", () => {
    document.getElementById("customerForm").reset();
    document.getElementById("customerId").value = "";
    clearFormMessage();
    document.getElementById("customerModalTitle").textContent = "Create Customer";
    new bootstrap.Modal(document.getElementById("customerModal")).show();
});

document.getElementById("customerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    clearFormMessage();

    const id = document.getElementById("customerId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const gender = document.getElementById("gender").value;
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value.trim();
    const birthday = document.getElementById("birthday").value;
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    // Validation
    const invalidChars = /<.*?>|[{}[\]<>]/;
    const cityRegex = /^[\p{L}\s-]+$/u; 
    const addressRegex = /^[\p{L}\p{N}\s.,#-]+$/u;
    if ([name, email,gender ,country,city,address,birthday, password, phone].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!name || !email || !gender || !country || !city || !address || !birthday || (!id && !password) || !phone) {
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
    const phonePattern = /^(010|011|012|013|015)\d{8}$/;
    if (!phonePattern.test(phone)) {
        showFormMessage("The phone number must start with 010, 012, 013 or 015 and consist of 11 digits.");
        return;
    }
    if (!gender || !country || !city || !address || !birthday) {
        alert("All fields are required!");
        return;
    }
    if ([gender, country, city, address].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!cityRegex.test(city)) {
        showFormMessage("City must contain only letters, spaces, and hyphens.");
        return;
    }
    if (!addressRegex.test(address)) {
        showFormMessage("Address contains invalid characters.");
        return;
    }
    const today = new Date();
    const birthDate = new Date(birthday);
    if (birthDate >= today) {
        showFormMessage("Birthday must be in the past.");
        return;
    }

    const customerData = {
        id: id ? parseInt(id) : Date.now(),
        name: name,
        email: email,
        gender: gender,
        country: country,
        city: city,
        address: address,
        birthday: birthday,
        password: password || (id ? customers.find(u => u.id == id).password : ""),
        phone: phone
    };

    if (id) {
        const index = customers.findIndex(u => u.id == id);
        customers[index] = customerData;
    } else {
        customers.push(customerData);
    }

    saveCustomers();
    bootstrap.Modal.getInstance(document.getElementById("customerModal")).hide();
    renderTable();
});

function editCustomer(id) {
    const customer = customers.find(u => u.id === id);
    document.getElementById("customerId").value = customer.id;
    document.getElementById("name").value = customer.name;
    document.getElementById("email").value = customer.email;
    document.getElementById("gender").value = customer.gender;
    document.getElementById("country").value = customer.country;
    document.getElementById("city").value = customer.city;
    document.getElementById("address").value = customer.address;
    document.getElementById("birthday").value = customer.birthday;
    document.getElementById("password").value = "";
    document.getElementById("phone").value = customer.phone;

    clearFormMessage();
    document.getElementById("customerModalTitle").textContent = "Update Customer";
    new bootstrap.Modal(document.getElementById("customerModal")).show();
}

function deleteCustomer(id) {
    if (confirm("Are you sure you want to delete this customer?")) {
        const index = customers.findIndex(u => u.id === id);
        customers.splice(index, 1);
        saveCustomers();
        renderTable();
    }
}

document.getElementById("searchCustomer").addEventListener("input", renderTable);

renderTable();

const countryCities = {
    US: ["New York", "Los Angeles", "Chicago"],
    UK: ["London", "Manchester", "Birmingham"],
    EG: [  "Cairo",
            "Alexandria",
            "Giza",
            "Port Said",
            "Suez",
            "Luxor",
            "Aswan",
            "Ismailia",
            "Beheira",
            "Dakahlia",
            "Damietta",
            "Sharqia",
            "Qalyubia",
            "Kafr El Sheikh",
            "Minya",
            "Faiyum",
            "Beni Suef",
            "Qena",
            "Sohag",
            "Red Sea",
            "New Valley",
            "North Sinai",
            "South Sinai",
            "Matrouh",
            "Ash Sharqiyah",
            "Gharbia",
            "Menoufia",
            "Assiut"
        ],
    SA: ["Riyadh", "Jeddah", "Dammam"],
    FR: ["Paris", "Lyon", "Marseille"]
};

const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");


countrySelect.addEventListener("change", function () {
    const selectedCountry = this.value;
    citySelect.innerHTML = `<option value="">-- Select City --</option>`;

    if (selectedCountry && countryCities[selectedCountry]) {
        countryCities[selectedCountry].forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
});
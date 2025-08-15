function loadProfile() {

    const customers = JSON.parse(localStorage.getItem("customers")) || [];

  const currentCustomerEmail = customers[0].email;

  if (!currentCustomerEmail) {
    console.warn("No Customer is logged in.");
    return;
  }

  const currentCustomer = customers.find(customer => customer.email === currentCustomerEmail);

  if (!currentCustomer) {
    console.warn("Customer not found in localStorage.");
    return;
  }

  document.getElementById("profileName").textContent = currentCustomer.name || "Unknown Customer";
  document.getElementById("profileEmail").textContent = currentCustomer.email || "Not provided";
  document.getElementById("profileGender").textContent = "Gender: " + (currentCustomer.gender || "-");
  document.getElementById("profileDOB").textContent = "Date Of Birth: " + (currentCustomer.birthday || "-");
  document.getElementById("profileAge").textContent = "Age: " + (currentCustomer.age || "-");
  document.getElementById("profileCountry").textContent = "Country: " + (currentCustomer.country || "-");
  document.getElementById("profileCity").textContent = "City: " + (currentCustomer.city || "-");
  document.getElementById("profileAddress").textContent = "Address: " + (currentCustomer.address || "-");
  document.getElementById("profilePhone").textContent = "Phone: " + (currentCustomer.phone || "-");
}
function saveOrUpdateCustomer(email, birthday, phone, password) {
  const name = document.getElementById("nameInput").value;
  const gender = document.getElementById("genderInput").value;
  const age = calculateAge(birthday);
  const country = document.getElementById("countryInput").value;
  const city = document.getElementById("cityInput").value;
  const address = document.getElementById("addressInput").value;

  let customers = JSON.parse(localStorage.getItem("customers")) || [];

  const existingIndex = customers.findIndex(cust => cust.email === currentCustomerEmail);

  if (existingIndex === -1) {
    console.warn("Cannot update: Customer not found.");
    return;
  }

  customers[existingIndex] = {
    name,
    email,
    gender,
    birthday,
    age,
    country,
    city,
    address,
    phone,
    password
  };

  localStorage.setItem("customers", JSON.stringify(customers));

}

function showEditForm() {
  document.getElementById("ordersSection").style.display = "none";
  document.getElementById("editProfileForm").style.display = "block";
}

function cancelEdit() {
  document.getElementById("ordersSection").style.display = "block";
  document.getElementById("editProfileForm").style.display = "none";
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  input.classList.add("is-invalid");
  let errorElem = input.nextElementSibling;
  if (!errorElem || !errorElem.classList.contains("error-message")) {
    errorElem = document.createElement("div");
    errorElem.className = "error-message text-danger mt-1";
    input.parentNode.insertBefore(errorElem, input.nextSibling);
  }
  errorElem.textContent = message;
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  input.classList.remove("is-invalid");
  let errorElem = input.nextElementSibling;
  if (errorElem && errorElem.classList.contains("error-message")) {
    errorElem.textContent = "";
  }
}

function saveProfile(e) {
  e.preventDefault();
  let isValid = true;

  const email = document.getElementById("emailInput").value.trim();
  const birthday = document.getElementById("dobInput").value;
  const phone = document.getElementById("phoneInput").value.trim();
  const password = document.getElementById("passwordInput").value;

  if (!/^[\w.%+-]+@gmail\.com$/i.test(email)) {
    showError("emailInput", "Email must be a valid Gmail address");
    isValid = false;
  } else {
    clearError("emailInput");
  }

  if (birthday) {
    const year = new Date(birthday).getFullYear();
    if (year > 2015 || year < 1930) {
      showError("dobInput", "Year of birth must be between 1930 and 2015");
      isValid = false;
    } else {
      clearError("dobInput");
    }
  } else {
    clearError("dobInput");
  }

  if (!/^(010|011|012|015)[0-9]{8}$/.test(phone)) {
    showError("phoneInput", "Enter a valid Egyptian phone number (e.g., 010xxxxxxxx)");
    isValid = false;
  } else {
    clearError("phoneInput");
  }

  if (!/^(?=.*[A-Z]).{8,}$/.test(password)) {
    showError("passwordInput", "Password must be at least 8 characters and contain at least 1 uppercase letter");
    isValid = false;
  } else {
    clearError("passwordInput");
  }

  if (!isValid) return;

  saveOrUpdateCustomer(email, birthday, phone, password);

  loadProfile();
  cancelEdit();
}

function saveOrUpdateCustomer(email, birthday, phone, password) {
  const name = document.getElementById("nameInput").value;
  const gender = document.getElementById("genderInput").value;
  const age = calculateAge(birthday);
  const country = document.getElementById("countryInput").value;
  const city = document.getElementById("cityInput").value;
  const address = document.getElementById("addressInput").value;

  let customers = JSON.parse(localStorage.getItem("customers")) || [];

  const existingIndex = customers.findIndex(cust => cust.email === customers[0].email);

  if (existingIndex === -1) {
    console.warn("Cannot update: Customer not found.");
    return;
  }

  customers[existingIndex] = {
    profileImage,
    name,
    email,
    gender,
    birthday,
    age,
    country,
    city,
    address,
    phone,
    password
  };

  localStorage.setItem("customers", JSON.stringify(customers));
}

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // localStorage.setItem("profileImage", e.target.result);
      document.getElementById("profileImage").src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
}

function calculateAge(birthday) {
  if (!birthday) return "-";
  const diff = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const countryCityMap = {
  "USA": ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
  "Egypt": ["Cairo", "Alex", "Mahala", "Tanta", "Mansoura"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  "India": ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata"]
};

function populateCities() {
  const country = document.getElementById("countryInput").value;
  const citySelect = document.getElementById("cityInput");
  citySelect.innerHTML = '<option value="">Select City</option>';
  if (countryCityMap[country]) {
    countryCityMap[country].forEach(city => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }
}

// Orders Section
const tbody = document.getElementById("orders-body");
const paginationContainer = document.querySelector(".pagination");
let orders = [];
let currentPage = 1;
const ordersPerPage = 5;

async function loadOrders() {
  const res = await fetch("https://dummyjson.com/products?limit=200");
  const data = await res.json();

  const filtered = data.products.filter(
    p => p.category.includes("mens") || p.category.includes("womens")
  );

  const randomOrders = [];
  const numOrders = Math.floor(Math.random() * 6) + 5;
  const used = new Set();
  while (randomOrders.length < numOrders) {
    const idx = Math.floor(Math.random() * filtered.length);
    if (!used.has(idx)) {
      used.add(idx);
      randomOrders.push(filtered[idx]);
    }
  }

  orders = randomOrders.map(item => {
    const qty = Math.floor(Math.random() * 3) + 1;
    const total = item.price * qty;
    return { ...item, qty, total };
  });

  displayOrders();
  setupPagination();
}

function displayOrders() {
  tbody.innerHTML = "";
  const start = (currentPage - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  const pageOrders = orders.slice(start, end);

  pageOrders.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td><img src="${item.thumbnail}" width="50" height="50"></td>
        <td>${item.category}</td>
        <td>${item.title}</td>
        <td>${item.description.slice(0, 40)}...</td>
        <td>$${item.price}</td>
        <td>${item.qty}</td>
        <td>$${item.total}</td>
      </tr>
    `;
  });
}

function setupPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const prev = document.createElement("li");
  prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link text-dark" href="#">&laquo;</a>`;
  prev.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayOrders();
      setupPagination();
    }
  });
  paginationContainer.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${currentPage === i ? "active" : ""}`;
    li.innerHTML = `<a class="page-link text-dark" href="#">${i}</a>`;
    li.addEventListener("click", () => {
      currentPage = i;
      displayOrders();
      setupPagination();
    });
    paginationContainer.appendChild(li);
  }

  const next = document.createElement("li");
  next.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link text-dark" href="#">&raquo;</a>`;
  next.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayOrders();
      setupPagination();
    }
  });
  paginationContainer.appendChild(next);
}

document.addEventListener("DOMContentLoaded", () => {
  const birthdayInput = document.getElementById("dobInput");
  if (birthdayInput) {
    birthdayInput.max = "2015-12-31";
  }
  loadProfile();
  loadOrders();
});

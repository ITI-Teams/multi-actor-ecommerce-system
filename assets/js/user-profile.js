function loadProfile() {
  let currentID = localStorage.getItem("customerSession");
  if (!currentID) {
    alert("You must log in first.");
    window.location.href = "login.html";
    return;
  }
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const currentCustomer = customers.find(c => String(c.id) === String(currentID));
  if (!currentCustomer) {
    alert("Profile not found.");
    return;
  }

  const displayName =
    (currentCustomer.firstName || "") +
    (currentCustomer.lastName ? " " + currentCustomer.lastName : "");
  document.getElementById("profileImage").src = currentCustomer.profileImage || "../assets/img/defultUser.webp";
  document.getElementById("profileName").textContent = displayName.trim() || currentCustomer.name || "Unknown Customer";
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
  const firstName = document.getElementById("fnameInput").value;
  const lastName = document.getElementById("lnameInput").value;
  const gender = document.getElementById("genderInput").value;
  const age = calculateAge(birthday);
  const country = document.getElementById("countryInput").value;
  const city = document.getElementById("cityInput").value;
  const address = document.getElementById("addressInput").value;

  const currentCustomerId = localStorage.getItem("customerSession");
  if (!currentCustomerId) {
    alert("You must be logged in to update your profile.");
    return;
  }

  let customers = JSON.parse(localStorage.getItem("customers")) || [];
  const existingIndex = customers.findIndex(cust => String(cust.id) === String(currentCustomerId));

  if (existingIndex === -1) {
    console.warn("Cannot update: Customer not found.");
    return;
  }

  let profileImage = customers[existingIndex].profileImage || null;
  const fileInput = document.querySelector("input[type='file']");
  if (fileInput && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImage = e.target.result;
      updateCustomerData();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    updateCustomerData();
  }
  function updateCustomerData() {
    customers[existingIndex] = {
      ...customers[existingIndex], 
      profileImage,
      firstName,
      lastName,
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
    localStorage.setItem("customerSession", String(customers[existingIndex].id)); 
    loadProfile(); 
  }
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
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const email = document.getElementById("emailInput").value.trim();
  const birthday = document.getElementById("dobInput").value;
  const phone = document.getElementById("phoneInput").value.trim();
  const password = document.getElementById("passwordInput").value;
  const emailExists = customers.some(customer => customer.email.toLowerCase() === email.toLowerCase());

  if (!/^[\w.%+-]+@gmail\.com$/i.test(email)) {
    showError("emailInput", "Email must be a valid Gmail address");
    isValid = false;
  } else if (emailExists) {
    showError("emailInput", "This email is already registered.");
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

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profileImage").src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
}

function calculateAge(birthday) {
  if (!birthday) return "-";
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const countryCityMap = {
  USA: ["New York", "Los Angeles", "Chicago"],
  GBR: ["London", "Manchester", "Birmingham"],
  EGY: ["Cairo", "Alexandria", "Giza", "Port Said", "Suez", "Luxor", "Aswan", "Ismailia",
    "Beheira", "Dakahlia", "Damietta", "Sharqia", "Qalyubia", "Kafr El Sheikh", "Minya",
    "Faiyum", "Beni Suef", "Qena", "Sohag", "Red Sea", "New Valley", "North Sinai",
    "South Sinai", "Matrouh", "Ash Sharqiyah", "Gharbia", "Menoufia", "Assiut"],
  SAU: ["Riyadh", "Jeddah", "Dammam"],
  FRA: ["Paris", "Lyon", "Marseille"]
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

// CustomerOrders Section
const tbody = document.getElementById("orders-body");
const paginationContainer = document.querySelector(".pagination");
let CustomerOrders = [];
let currentPage = 1;
const CustomerOrdersPerPage = 5;

async function loadCustomerOrders() {
  const res = await fetch("https://dummyjson.com/products?limit=200");
  const data = await res.json();

  const filtered = data.products.filter(
    p => p.category.includes("mens") || p.category.includes("womens")
  );

  const randomCustomerOrders = [];
  const numCustomerOrders = Math.floor(Math.random() * 6) + 5;
  const used = new Set();
  while (randomCustomerOrders.length < numCustomerOrders) {
    const idx = Math.floor(Math.random() * filtered.length);
    if (!used.has(idx)) {
      used.add(idx);
      randomCustomerOrders.push(filtered[idx]);
    }
  }

  CustomerOrders = randomCustomerOrders.map(item => {
    const qty = Math.floor(Math.random() * 3) + 1;
    const total = item.price * qty;
    return { ...item, qty, total };
  });

  displayCustomerOrders();
  setupPagination();
}

function displayCustomerOrders() {
  tbody.innerHTML = "";
  const start = (currentPage - 1) * CustomerOrdersPerPage;
  const end = start + CustomerOrdersPerPage;
  const pageCustomerOrders = CustomerOrders.slice(start, end);

  pageCustomerOrders.forEach(item => {
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
  const totalPages = Math.ceil(CustomerOrders.length / CustomerOrdersPerPage);

  const prev = document.createElement("li");
  prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link text-dark" href="#">&laquo;</a>`;
  prev.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayCustomerOrders();
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
      displayCustomerOrders();
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
      displayCustomerOrders();
      setupPagination();
    }
  });
  paginationContainer.appendChild(next);
}

function logoutCustomer() {
  localStorage.removeItem("customerSession");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const birthdayInput = document.getElementById("dobInput");
  if (birthdayInput) {
    birthdayInput.max = "2015-12-31";
  }

  loadProfile();
  loadCustomerOrders();
});

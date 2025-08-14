function loadProfile() {
  document.getElementById("profileImage").src = localStorage.getItem("profileImage");
  document.getElementById("profileName").textContent = localStorage.getItem("name") || "Unknown User";
  document.getElementById("profileEmail").textContent = localStorage.getItem("email") || "Not provided";
  document.getElementById("profileGender").textContent = "Gender: " + (localStorage.getItem("gender") || "-");
  document.getElementById("profileDOB").textContent = "Date Of Birth: " + (localStorage.getItem("dob") || "-");
  document.getElementById("profileAge").textContent = "Age: " + (localStorage.getItem("age") || "-");
  document.getElementById("profileCountry").textContent = "Country: " + (localStorage.getItem("country") || "-");
  document.getElementById("profileCity").textContent = "City: " + (localStorage.getItem("city") || "-");
  document.getElementById("profileAddress").textContent = "Address: " + (localStorage.getItem("address") || "-");
  document.getElementById("profilePhone").textContent = "Phone: " + (localStorage.getItem("phone") || "-");
}

function showEditForm() {
  document.getElementById("ordersSection").style.display = "none";
  document.getElementById("editProfileForm").style.display = "block";
}

function cancelEdit() {
  document.getElementById("ordersSection").style.display = "block";
  document.getElementById("editProfileForm").style.display = "none";
}

// Helper: show error message under field
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

// Helper: clear error
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
  if (!/^[\w.%+-]+@gmail\.com$/i.test(email)) {
    showError("emailInput", "Email must be a valid Gmail address");
    isValid = false;
  } else {
    clearError("emailInput");
  }

  const dob = document.getElementById("dobInput").value;
  if (dob) {
    const year = new Date(dob).getFullYear();
    if (year > 2015 ||year<1930) {
      showError("dobInput", "Year of birth must between 1930 and 2015");
      isValid = false;
    } else {
      clearError("dobInput");
    }
  } else {
    clearError("dobInput");
  }

  const phone = document.getElementById("phoneInput").value.trim();
  if (!/^(010|011|012|015)[0-9]{8}$/.test(phone)) {
    showError("phoneInput", "Enter a valid Egyptian phone number (e.g., 010xxxxxxxx)");
    isValid = false;
  } else {
    clearError("phoneInput");
  }

  // Password validation: min 8 chars, at least one uppercase letter
  const password = document.getElementById("passwordInput").value;
  if (!/^(?=.*[A-Z]).{8,}$/.test(password)) {
    showError("passwordInput", "Password must be at least 8 characters and contain at least 1 uppercase letter");
    isValid = false;
  } else {
    clearError("passwordInput");
  }

  if (!isValid) return;

  // Save data
  localStorage.setItem("name", document.getElementById("nameInput").value);
  localStorage.setItem("email", email);
  localStorage.setItem("gender", document.getElementById("genderInput").value);
  localStorage.setItem("dob", dob);
  localStorage.setItem("age", calculateAge(dob));
  localStorage.setItem("country", document.getElementById("countryInput").value);
  localStorage.setItem("city", document.getElementById("cityInput").value);
  localStorage.setItem("address", document.getElementById("addressInput").value);
  localStorage.setItem("phone", phone);
  localStorage.setItem("password", password);

  loadProfile();
  cancelEdit();
}

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("profileImage", e.target.result);
      document.getElementById("profileImage").src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
}

function calculateAge(dob) {
  if (!dob) return "-";
  const diff = Date.now() - new Date(dob).getTime();
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

// Set DOB max year = 2015
document.addEventListener("DOMContentLoaded", () => {
  const dobInput = document.getElementById("dobInput");
  if (dobInput) {
    dobInput.max = "2015-12-31";
  }
  loadProfile();
  loadOrders();
});

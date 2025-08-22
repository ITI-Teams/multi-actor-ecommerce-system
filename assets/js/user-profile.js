
  function loadProfile() {
  const currentID = localStorage.getItem("customerSession");
  if (!currentID) {
    alert("You must log in first.");
    window.location.href = "login.html";
    return;
  }

  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const currentCustomer = customers.find(c => String(c.id) === String(currentID));

  if (!currentCustomer) {
    alert("Profile not found");
    return;
  }

  const displayName =
    (currentCustomer.FirstName || "") +
    (currentCustomer.lastName ? " " + currentCustomer.lastName : "");

  document.getElementById("profileImage").src = currentCustomer.profileImage || "../assets/img/defultUser.webp";
  document.getElementById("profileName").textContent = displayName.trim() || currentCustomer.name || "Unknown Customer";
  document.getElementById("profileEmail").textContent = currentCustomer.email || "Not provided";
  document.getElementById("profileGender").textContent = "Gender: " + (currentCustomer.gender || "-");
  document.getElementById("profileDOB").textContent = "Date Of Birth: " + (currentCustomer.birthday || "-");
  document.getElementById("profileAge").textContent = "Age: " + ( Math.floor((new Date() - new Date(currentCustomer.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) || "-");
  document.getElementById("profileCountry").textContent = "Country: " + (currentCustomer.country || "-");
  document.getElementById("profileCity").textContent = "City: " + (currentCustomer.city || "-");
  document.getElementById("profileAddress").textContent = "Address: " + (currentCustomer.address || "-");
  document.getElementById("profilePhone").textContent = "Phone: " + (currentCustomer.phone || "-");
}

function saveOrUpdateCustomer(email, birthday, phone, password) {
  const FirstName = document.getElementById("fnameInput").value;
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
      FirstName,
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

function fillEditForm(currentCustomer) {
  document.getElementById("fnameInput").value = currentCustomer.FirstName || "";
  document.getElementById("lnameInput").value = currentCustomer.lastName || "";
  document.getElementById("emailInput").value = currentCustomer.email || "";
  document.getElementById("genderInput").value = currentCustomer.gender || "";
  document.getElementById("dobInput").value = currentCustomer.birthday || "";
  document.getElementById("phoneInput").value = currentCustomer.phone || "";
  document.getElementById("passwordInput").value = currentCustomer.password || "";``
  document.getElementById("countryInput").value = currentCustomer.country || "";
  populateCities(); 
  document.getElementById("cityInput").value = currentCustomer.city || "";
  document.getElementById("addressInput").value = currentCustomer.address || "";
}

function showEditForm() {
  document.getElementById("ordersSection").style.display = "none";
  document.getElementById("editProfileForm").style.display = "block";

  const currentID = localStorage.getItem("customerSession");
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const currentCustomer = customers.find(c => String(c.id) === String(currentID));
  if (currentCustomer) {
    fillEditForm(currentCustomer);
  }
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

  if (!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    showError("emailInput", "Enter a valid email address");
    isValid = false;
  }  else {
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

function loadOrders() {
  const currentID = localStorage.getItem("customerSession");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const customerOrders = orders.filter(o => String(o.customer_id) === String(currentID));
  const tbody = document.getElementById("orders-body");
  const products = JSON.parse(localStorage.getItem("products")) || [];

  tbody.innerHTML = "";

  if (customerOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No orders found</td></tr>`;
    return;
  }

  customerOrders.forEach(order => {
    const tr = document.createElement("tr");
    let actionBtn = "";

    if (order.status === "Cancelled") {
      actionBtn = `<button class="btn btn-danger btn-sm disabled" disabled>Cancelled</button>`;   
    } else if ( order.status !== "Completed"){
      actionBtn = `<button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">Cancel</button>`;
      
    }else {
      actionBtn = `
                <button class="btn btn-success btn-sm" 
                  data-bs-toggle="modal" 
                  data-bs-target="#reviewModal"
                  onclick="window.pendingReviewData={productId: ${order.product_id}, orderId: ${order.id}}">
              Review
          </button>
      
      `;
    }
    const product = products.find(p => p.id === order.product_id);
    const productName = product ? product.name : "Unknown Product";
    tr.innerHTML = `
      <td class="text-center">${order.id}</td>
      <td class="text-center">${productName}</td>
      <td class="text-center">${order.status}</td>
      <td class="text-center">${order.totalPrice} EGP</td>
      <td class="text-center">${order.quntity}</td>
      <td class="text-center">${order.totalPrice * order.quntity} EGP</td>
      <td class="text-center">${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

  loadProfile();
  loadOrders();



function setupPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(CustomerOrders.length / CustomerOrdersPerPage);

  const prev = document.createElement("li");
  prev.className = `page-item text-dark ${currentPage === 1 ? "disabled" : ""}`;
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
/////////////
function cancelOrder(orderId) {
  if (!confirm("Are you sure you want to cancel this order?")) {
    return;
  }
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders = orders.map(o => {
    if (o.id === orderId && o.status != "Completed") {
      o.status = "Cancelled";
    }
    return o;
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}



let selectedRating = 0;
document.querySelectorAll("#starRating .star").forEach(star => {
  star.addEventListener("click", function () {
    selectedRating = this.getAttribute("data-value");
    document.querySelectorAll("#starRating .star").forEach(s => {
      s.classList.remove("text-warning");
    });
    for (let i = 0; i < selectedRating; i++) {
      document.querySelectorAll("#starRating .star")[i].classList.add("text-warning");
    }
  });
});

function openReviewModal(productId,orderId) {
  document.getElementById("reviewOrderId").value = orderId;
  const customerId = localStorage.getItem("customerSession");
  selectedRating = 0;
  document.querySelectorAll("#starRating .star").forEach(s => s.classList.remove("text-warning"));
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  let existingReview = reviews.find(r => r.product_id == productId && r.customer_id == customerId);
  if (existingReview) {
    selectedRating = existingReview.review; 
    for (let i = 0; i < selectedRating; i++) {
      document.querySelectorAll("#starRating .star")[i].classList.add("text-warning");
    }
  }
  document.getElementById("reviewProductId").value = productId;
  let modal = new bootstrap.Modal(document.getElementById("reviewModal"));
  modal.show();
}

function submitReview() {
  const customerId = localStorage.getItem("customerSession");
  const productId = document.getElementById("reviewProductId").value;
  if (selectedRating === 0) {
    alert("Please select a star rating!");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  let existingReviewIndex = reviews.findIndex(r => r.product_id == productId && r.customer_id == customerId);
  if (existingReviewIndex !== -1) {
    reviews[existingReviewIndex].review = selectedRating;
    alert("✏️ Your review has been updated!");
  }else{
    let newReview = {
      id: reviews.length + 1,
      product_id: productId,
      customer_id: customerId,
      review: selectedRating
    };
    reviews.push(newReview);
    alert("✅ Review submitted successfully!");
  }
  localStorage.setItem("reviews", JSON.stringify(reviews));
  let reviewModal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
  reviewModal.hide();
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
}

document.getElementById('reviewModal').addEventListener('shown.bs.modal', function () {
    if (window.pendingReviewData) {
        openReviewModal(window.pendingReviewData.productId, window.pendingReviewData.orderId);
        window.pendingReviewData = null; // reset
    }
});
document.getElementById('reviewModal').addEventListener('hidden.bs.modal', function () {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style = ""; // إزالة أي overflow أو padding
});
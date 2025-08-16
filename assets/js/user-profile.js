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

function fillEditForm(currentCustomer) {
  document.getElementById("fnameInput").value = currentCustomer.firstName || "";
  document.getElementById("lnameInput").value = currentCustomer.lastName || "";
  document.getElementById("emailInput").value = currentCustomer.email || "";
  document.getElementById("genderInput").value = currentCustomer.gender || "";
  document.getElementById("dobInput").value = currentCustomer.birthday || "";
  document.getElementById("phoneInput").value = currentCustomer.phone || "";
  document.getElementById("passwordInput").value = currentCustomer.password || "";
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

  if (!/^[\w.%+-]/i.test(email)) {
    showError("emailInput", "Email must be a valid Gmail address");
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
  loadProfile();

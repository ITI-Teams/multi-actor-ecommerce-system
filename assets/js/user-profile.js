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

function saveProfile(e) {
  e.preventDefault();
  const dob = document.getElementById("dobInput").value;
  localStorage.setItem("name", document.getElementById("nameInput").value);
  localStorage.setItem("email", document.getElementById("emailInput").value);
  localStorage.setItem("gender", document.getElementById("genderInput").value);
  localStorage.setItem("dob", dob);
  localStorage.setItem("age", calculateAge(dob));
  localStorage.setItem("country", document.getElementById("countryInput").value);
  localStorage.setItem("city", document.getElementById("cityInput").value);
  localStorage.setItem("address", document.getElementById("addressInput").value);
  localStorage.setItem("phone", document.getElementById("phoneInput").value);
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

async function loadOrders() {
  const res = await fetch("https://dummyjson.com/products?limit=200");
  const data = await res.json();
  const tbody = document.getElementById("orders-body");
  tbody.innerHTML = "";
  const filtered = data.products.filter(p => p.category.includes("mens") || p.category.includes("womens"));
  const randomOrders = [];
  const numOrders = Math.floor(Math.random() * 6) + 5; //num of orders 
  const used = new Set();
  while (randomOrders.length < numOrders) {
    const idx = Math.floor(Math.random() * filtered.length);
    if (!used.has(idx)) {
      used.add(idx);
      randomOrders.push(filtered[idx]);
    }
  }
  randomOrders.forEach(item => {
    const qty = Math.floor(Math.random() * 3) + 1; // quantity of order
    const total = item.price * qty;
    tbody.innerHTML += `
    <tr>
      <td>${item.id}</td>
      <td><img src="${item.thumbnail}" width="50" height="50"></td>
      <td>${item.category}</td>
      <td>${item.title}</td>
      <td>${item.description.slice(0, 40)}...</td>
      <td>$${item.price}</td>
      <td>${qty}</td>
      <td>$${total}</td>
    </tr>
  `;
  });
}

loadProfile();
loadOrders();



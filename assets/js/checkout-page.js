const citiesByCountry = {
    USA: ["New York", "Los Angeles", "Chicago"],
    GBR: ["London", "Manchester", "Birmingham"],
    EGY: [  "Cairo",
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
    SAU: ["Riyadh", "Jeddah", "Dammam"],

};
/* Demo cart data (dynamic)*/
const currentID = localStorage.getItem("customerSession");
let cards = JSON.parse(localStorage.getItem("cards")) || [];

if (!currentID) {
    alert("You must log in first.");
    window.location.href = "login.html";
}
const customers = JSON.parse(localStorage.getItem("customers")) || [];
const currentCustomer = customers.find(c => String(c.id) === String(currentID));
let carts = JSON.parse(localStorage.getItem("carts")) ;
let cart =carts.filter(cart => cart.customer_id == currentID);
let products = JSON.parse(localStorage.getItem("products")) || [];
const cartList = document.getElementById('cart-list');
const subtotalPriceEl = document.getElementById('subtotal-price');
const totalPriceEl = document.getElementById('total-price');
const itemCountEl = document.getElementById('item-count');



const email = document.getElementById('email');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const country = document.getElementById('country');
const city = document.getElementById('city');
const zip = document.getElementById('zip');
const phone = document.getElementById('phone');

document.getElementById('email').value = currentCustomer.email || '';
document.getElementById('firstName').value = currentCustomer.FirstName || '';
document.getElementById('lastName').value = currentCustomer.lastName || '';
document.getElementById('address').value = currentCustomer.address || '';
document.getElementById('country').value = currentCustomer.country || '';

// const option = document.createElement("option");
// option.value = currentCustomer.city;
// option.textContent = currentCustomer.city;
// option.selected = true;

document.getElementById('zip').value = currentCustomer.zip || '';
document.getElementById('phone').value = currentCustomer.phone || '';



function renderCart() {
    loadCart();
    cartList.innerHTML = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (!product) return;
        const imgStr = String(product?.images?.src || product?.images || '').trim();
        const finalSrc = (/^data:|^https?:\/\/|^\/\//i.test(imgStr))
        ? imgStr
        : (imgStr ? `../../assets/img/products/${imgStr}` : `../../assets/img/products/`+product.images[0]);
        const row = document.createElement('div'); row.className = 'item-row';
        row.innerHTML = `
      <img src="${finalSrc}" alt="">
      <div class="item-meta">
        <div style="font-weight:600">${escapeHtml(product.name)}</div>
        <div class="small text-muted">${product.size ? escapeHtml(product.size) : ''}</div>
        <div class="mt-1">
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="form-control form-control-sm item-qty" style="width:50px;display:inline-block">
          <button class="btn btn-link text-danger btn-sm ms-2 remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <div style="font-weight:600">$${(product.price * item.quantity).toFixed(2)}</div>
      
    `;
        cartList.appendChild(row);
    });
    updateTotals();
}
cartList.addEventListener('input', (e) => {
    if (e.target.classList.contains('item-qty')) {
        const id = Number(e.target.dataset.id);
        const qty = Math.max(1, Number(e.target.value) || 1);
        const it = cart.find(i => i.id === id);
        if (it) { 
            it.quantity = qty; 
            carts = carts.map(c => c.id === id ? { ...c, quantity: qty } : c);
            localStorage.setItem("carts", JSON.stringify(carts));
            renderCart(); 
        }
    }
});
cartList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const id = Number(e.target.dataset.id);
        cart = cart.filter(i => i.id !== id);
        carts = carts.filter(c => c.id !== id);
        localStorage.setItem("carts", JSON.stringify(carts));
        renderCart();
    }
});

// simple html escape for names show items in right side 
function escapeHtml(s) {
    return String(s)
        .replace(/[&<>"']/g, c => ({
            '&': '&amp;',   // Replace & with &amp;
            '<': '&lt;',    // Replace < with &lt;
            '>': '&gt;',    // Replace > with &gt;
            '"': '&quot;',  // Replace " with &quot;
            "'": '&#39;'    // Replace ' with &#39;
        }[c]));
}

function updateTotals() {
    let subtotal = 0, items = 0;
   
    cart.forEach(i => { 
        const product = products.find(p => p.id === i.product_id);
        if (!product) return;
        subtotal += product.price * i.quantity; items += i.quantity; 
    });
    const shipping = subtotal > 0 ? 1 : 0;
    document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('item-count').textContent = items;
    document.getElementById('total-price').textContent = `USD $${(subtotal + shipping).toFixed(2)}`;
}
renderCart();

cartList.addEventListener('input', (e) => {
    if (e.target.classList.contains('item-qty')) {
        const id = Number(e.target.dataset.id);
        const qty = Math.max(1, Number(e.target.value) || 1);
        const it = cart.find(i => i.id === id);
        if (it) { it.quantity = qty; renderCart(); }
    }
});
cartList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const id = Number(e.target.dataset.id);
        cart = cart.filter(i => i.id !== id);
        renderCart();
    }
});

// =====================================================================================================================================


// === Cities by Country ===


// === Elements ===
const form = document.getElementById("checkout-form");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

// === Populate cities dynamically ===
countrySelect.addEventListener("change", () => {
    const selectedCountry = countrySelect.value;
    const cities = citiesByCountry[selectedCountry] || [];
    citySelect.innerHTML = `<option value="" disabled selected>Select city</option>`;
    if (cities.length > 0) {
      cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
    } else {
      citySelect.disabled = true;
    }
});
country.value = currentCustomer.country;
citySelect.innerHTML = "";
if (citiesByCountry[currentCustomer.country]) {
    citiesByCountry[currentCustomer.country].forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        if (city === currentCustomer.city) {
            option.selected = true; 
        }
        citySelect.appendChild(option);
    });
}
function updateCustomerData() {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const currentIndex = customers.findIndex(c => String(c.id) === String(currentID));

    if (currentIndex === -1) return;

    const newEmail = email.value.trim();
    const newPhone = phone.value.trim();

    const duplicateEmail = customers.some((c, idx) => idx !== currentIndex && c.email === newEmail);
    const duplicatePhone = customers.some((c, idx) => idx !== currentIndex && c.phone === newPhone);

    if (duplicateEmail) {
        alert("This email address is already in use.");
        return false;
    }
    if (duplicatePhone) {
        alert("The phone number is already in use.");
        return false;
    }
    customers[currentIndex] = {
        ...customers[currentIndex],
        name: firstName.value + " " + lastName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        gender: customers[currentIndex].gender || "",  
        email: newEmail,
        country: country.value,
        city: city.value,
        zip: zip.value,
        address: address.value,
        birthday: customers[currentIndex].birthday || "",
        phone: newPhone,
        password: customers[currentIndex].password 
    };

    localStorage.setItem("customers", JSON.stringify(customers));
    return true;
}
// === On Submit ===
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select");
    let valid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) valid = false;
    });

    if (!valid) {
        alert(`Make sure you enter the data correctly.`);
        return;
    }
    if (!updateCustomerData()) return;

    // حساب المجموع
    let subtotal = 0, items = 0;
    cart.forEach(i => { 
        const product = products.find(p => p.id === i.product_id);
        if (!product) return;
        subtotal += product.price * i.quantity; 
        items += i.quantity; 
    });
    const shipping = subtotal > 0 ? 1 : 0;
    const total = subtotal + shipping;

    // === تحقق من الدفع ===
    if (!processPayment(total)) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let newId = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;

    // ✅ إنشاء order لكل منتج بالعربة
    cart.forEach(i => {
        const product = products.find(p => p.id === i.product_id);
        if (!product) return;

        const order = {
            id: newId++,
            product_id: product.id,
            seller_id: product.seller_id || "", // لو عندك seller
            customer_id: currentCustomer.id,
            status: "Delivery",
            quntity: i.quantity,
            totalPrice: product.price * i.quantity + (shipping / cart.length), // توزيع الشحن
            date: new Date().toLocaleString()
        };
        orders.push(order);
    });

    // حفظ الطلبات
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(`Order #${newId} set successfully!`);
    form.reset();
    carts = carts.filter(c => String(c.customer_id) !== String(currentCustomer.id));
    localStorage.setItem("carts", JSON.stringify(carts));
    cart = [];
    renderCart();
    citySelect.innerHTML = `<option value="" disabled selected>Select city</option>`;
    if (history.length > 1) {
        history.back();
    } else {
        location.href = '../index.html';
    }

});
function loadCart() {
    const allCarts = JSON.parse(localStorage.getItem("carts")) || [];
    cart = allCarts.filter(c => String(c.customer_id) === String(currentID));
}

function validateInput(input) {
    const value = input.value.trim();
    const name = input.name || input.id;

    // قواعد التحقق
    const validators = {
        email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        firstName: val => val.length >= 2,
        lastName: val => val.length >= 2,
        address: val => val.length >= 5,
        country: val => val !== "",
        city: val => val !== "",
        zip: val => /^[0-9]{4,10}$/.test(val),
        phone: val => /^\+?[0-9]{8,15}$/.test(val),
        "cc-number": val => /^[0-9]{13,19}$/.test(val.replace(/\s+/g, "")),
        "cc-exp": val => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val),
        "cc-cvc": val => /^[0-9]{3,4}$/.test(val),
        "cc-name": val => val.length >= 3
    };

    if (validators[name]) {
        return validators[name](value);
    }
    return value !== "";
}

function processPayment(total) {
    let cards = JSON.parse(localStorage.getItem("cards")) || [];

    const number = document.getElementById("cc-number").value;
    const exp = document.getElementById("cc-exp").value;
    const cvc = document.getElementById("cc-cvc").value;
    const name = document.getElementById("cc-name").value;
    const cardIndex = cards.findIndex(c => c.number == number && c.exp == exp && c.cvc == cvc && c.name == name);
    if (cardIndex === -1) {
        alert("The card is invalid or not registered.");
        return false;
    }
    if (cards[cardIndex].balance < total) {
        alert("The balance is not sufficient to complete the transaction.");
        return false;
    }
    cards[cardIndex].balance -= total;
    localStorage.setItem("cards", JSON.stringify(cards));
    return true;
}
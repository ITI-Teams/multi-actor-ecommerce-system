/* Demo cart data (dynamic)*/
let cart = [
    { id: 1, name: "L044 Strider Cut-Off Short", size: "L", price: 128.00, qty: 1, img: "../assets/img/product01.jpg" },
    { id: 2, name: "Linen Cotton Shirt", size: "S", price: 168.00, qty: 1, img: "../assets/img/product02.jpg" },
    { id: 3, name: "Cement Seafarer Cotton Guernsey", size: "M", price: 178.00, qty: 1, img: "../assets/img/product01.jpg" },
    { id: 4, name: "Casita Camp Shirt", size: "XS", price: 168.00, qty: 1, img: "../assets/img/product02.jpg" },
];

const cartList = document.getElementById('cart-list');
const subtotalPriceEl = document.getElementById('subtotal-price');
const totalPriceEl = document.getElementById('total-price');
const itemCountEl = document.getElementById('item-count');

function renderCart() {
    cartList.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('div'); row.className = 'item-row';
        row.innerHTML = `
      <img src="${item.img}" alt="">
      <div class="item-meta">
        <div style="font-weight:600">${escapeHtml(item.name)}</div>
        <div class="small text-muted">${item.size ? escapeHtml(item.size) : ''}</div>
        <div class="mt-1">
          <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="form-control form-control-sm item-qty" style="width:50px;display:inline-block">
          <button class="btn btn-link text-danger btn-sm ms-2 remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <div style="font-weight:600">$${(item.price * item.qty).toFixed(2)}</div>
    `;
        cartList.appendChild(row);
    });
    updateTotals();
}

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
    cart.forEach(i => { subtotal += i.price * i.qty; items += i.qty; });
    const shipping = subtotal > 0 ? 1 : 0; // demo shipping
    document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('item-count').textContent = items;
    document.getElementById('total-price').textContent = `USD $${(subtotal + shipping).toFixed(2)}`;
}
renderCart();

// event remove
cartList.addEventListener('input', (e) => {
    if (e.target.classList.contains('item-qty')) {
        const id = Number(e.target.dataset.id);
        const qty = Math.max(1, Number(e.target.value) || 1);
        const it = cart.find(i => i.id === id);
        if (it) { it.qty = qty; renderCart(); }
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
const citiesByCountry = {
    EG: ["Cairo", "Giza", "Alexandria", "Port Said", "Luxor", "Aswan"],
    US: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
    UK: ["London", "Manchester", "Birmingham", "Liverpool"],
    FR: ["Paris", "Lyon", "Marseille", "Nice"],
    SA: ["Riyadh", "Jeddah", "Dammam", "Mecca"],
    AE: ["Dubai", "Abu Dhabi", "Sharjah"]
};

// === Elements ===
const form = document.getElementById("checkout-form");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

// === Populate cities dynamically ===
countrySelect.addEventListener("change", () => {
    citySelect.innerHTML = `<option value="" disabled selected>Select city</option>`;
    (citiesByCountry[countrySelect.value] || []).forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
    });
});

// === Validation Rules ===
const validators = {
    email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    firstName: val => val.trim().length >= 2,
    lastName: val => val.trim().length >= 2,
    address: val => val.trim().length >= 5,
    zip: val => /^[0-9]{4,10}$/.test(val),
    phone: val => /^\+?[0-9]{8,15}$/.test(val),
    "cc-number": val => /^[0-9]{13,19}$/.test(val.replace(/\s+/g, "")),
    "cc-exp": val => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val),  // MM/YY
    "cc-cvc": val => /^[0-9]{3,4}$/.test(val),
    "cc-name": val => val.trim().length >= 3
};

/* ===== (card number + expiry + masking) ===== */

const ccNum = document.getElementById('cc-number');
const ccExp = document.getElementById('cc-exp');

// Format card number on input
ccNum.addEventListener('input', () => formatCardNumber(ccNum));

// Format expiry on input
ccExp.addEventListener('input', () => formatExpiry(ccExp));

function formatCardNumber(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 16); // max 16 digits
    input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    input.value = v;
}

// Mask card on blur
ccNum.addEventListener('blur', () => {
    const raw = ccNum.value.replace(/\s/g, '');
    if (raw.length === 16) { // only mask full cards
        const first = raw.slice(0, 4), last = raw.slice(-4);
        ccNum.dataset.raw = raw;
        ccNum.value = `${first} **** **** ${last}`;
    }
});

// Restore on focus
ccNum.addEventListener('focus', () => {
    if (ccNum.dataset.raw) {
        const r = ccNum.dataset.raw;
        ccNum.value = r.replace(/(.{4})/g, '$1 ').trim();
        delete ccNum.dataset.raw;
    }
});

// === Validate Input Function ===
function validateInput(input) {
    const id = input.id;
    if (validators[id]) {
        const valid = validators[id](input.value);
        input.classList.toggle("is-invalid", !valid);
        return valid;
    } else {
        // default required check
        const valid = input.value.trim() !== "";
        input.classList.toggle("is-invalid", !valid);
        return valid;
    }
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
        alert("Please correct the highlighted fields before submitting.");
        return;
    }
    // === Collect simplified order ===
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let newId = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;

    // Collect order
    const order = {
        id: newId,
        name: document.getElementById("firstName").value + " " + document.getElementById("lastName").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        country: document.getElementById("country").value,
        city: document.getElementById("city").value,
        // zip: document.getElementById("zip").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        product_id: 1,         // default
        seller_id: "",         // placeholder
        customer_id: "",       // placeholder
        status: "Delivery",    // default status
        quantity: document.getElementById('item-count').value,
        totalPrice: document.getElementById('total-price').value,
        date: new Date().toLocaleString()
    };

    // Save to localStorage
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(`Order #${newId} submitted successfully!`);
    form.reset();
    citySelect.innerHTML = `<option value="" disabled selected>Select city</option>`;
});

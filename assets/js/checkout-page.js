/* Demo cart data (dynamic)*/
let cart = [
    { id: 1, name: "L044 Strider Cut-Off Short", size: "27", price: 128.00, qty: 1, img: "../assets/img/product01.jpg" },
    { id: 2, name: "Light Blue Linen/Cotton Shirt", size: "S", price: 168.00, qty: 1, img: "../assets/img/product02.jpg" },
    { id: 3, name: "Cement Seafarer Cotton Guernsey", size: "M", price: 178.00, qty: 1, img: "../assets/img/product01.jpg" },
    { id: 4, name: "White Casita Camp Shirt", size: "", price: 168.00, qty: 1, img: "../assets/img/product02.jpg" },
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
          <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="form-control form-control-sm item-qty" style="width:90px;display:inline-block">
          <button class="btn btn-link text-danger btn-sm ms-2 remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <div style="font-weight:600">$${(item.price * item.qty).toFixed(2)}</div>
    `;
        cartList.appendChild(row);
    });
    updateTotals();
}

// simple html escape for names
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function updateTotals() {
    let subtotal = 0, items = 0;
    cart.forEach(i => { subtotal += i.price * i.qty; items += i.qty; });
    const shipping = subtotal > 0 ? 6.99 : 0; // demo shipping
    document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('item-count').textContent = items;
    document.getElementById('total-price').textContent = `USD $${(subtotal + shipping).toFixed(2)}`;
}
renderCart();

// event delegation for qty change & remove
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

// gift code demo
document.getElementById('applyGift').addEventListener('click', () => {
    const code = document.getElementById('giftCode').value.trim();
    if (!code) { alert('Enter a code'); return; }
    // demo: code "SAVE10" -> 10 off each item
    if (code.toUpperCase() === 'SAVE10') {
        cart = cart.map(i => ({ ...i, price: Math.max(0, i.price - 10) }));
        renderCart();
        alert('Gift applied: $10 off each item');
    } else {
        alert('Invalid gift code (demo)');
    }
});

/* Shipping method update*/
function updateShippingMethod() {
    const address = document.getElementById('address1').value.trim();
    const city = document.getElementById('city').value.trim();
    const zip = document.getElementById('zip').value.trim();
    const sbox = document.getElementById('shipping-method');
    if (address && city && zip) {
        sbox.innerHTML = `<div><strong>Standard shipping</strong> — 3–5 business days<br><small class="text-muted">$6.99</small></div>`;
    } else {
        sbox.textContent = 'Enter your shipping address to view available shipping methods.';
    }
}
['address1', 'city', 'zip'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => setTimeout(updateShippingMethod, 150));
});

/* Validation*/
const form = document.getElementById('checkout-form');
let triedSubmit = false;

// validators
const validators = {
    email: v => /^\S+@\S+\.\S+$/.test(v),
    firstName: v => v.trim().length > 0,
    lastName: v => v.trim().length > 0,
    address1: v => v.trim().length > 3,
    city: v => v.trim().length > 1,
    state: v => v.trim().length > 1,
    zip: v => /^\d{3,10}$/.test(v),
    phone: v => /^\+?\d{7,15}$/.test(v),
    'cc-number': v => { const n = v.replace(/\s/g, ''); return /^\d{13,19}$/.test(n) && luhn(n); },
    'cc-exp': v => validateExpiry(v),
    'cc-cvc': v => /^\d{3,4}$/.test(v),
    'cc-name': v => v.trim().length > 1
};

// show/hide invalid text
function showInvalid(id, show) {
    const sel = form.querySelector(`[data-for="${id}"]`);
    const input = document.getElementById(id);
    if (!input) return;
    if (show) {
        input.classList.add('is-invalid');
        if (sel) sel.style.display = 'block';
    } else {
        input.classList.remove('is-invalid');
        if (sel) sel.style.display = 'none';
    }
}

// validate one field
function validateField(id) {
    const input = document.getElementById(id);
    if (!input) return true;
    const value = input.value;
    const ok = validators[id] ? validators[id](value) : true;
    // show only if triedSubmit or if user blurred (we'll call on blur)
    if (triedSubmit) showInvalid(id, !ok);
    return ok;
}

// attach blur+input handlers
Object.keys(validators).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => { validateField(id); });
    el.addEventListener('input', () => {
        // live validation after first submit attempt
        if (triedSubmit) validateField(id);
        // card formatting helpers:
        if (id === 'cc-number') formatCardNumber(el);
        if (id === 'cc-exp') formatExpiry(el);
    });
});

// form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    triedSubmit = true;
    let ok = true;
    Object.keys(validators).forEach(id => {
        const pass = validateField(id);
        if (!pass) ok = false;
    });

    // payment method selection: if not card, skip cc validators
    const pay = document.querySelector('input[name="payMethod"]:checked')?.value;
    if (pay !== 'card') {
        // hide any credit card errors if PayPal
        ['cc-number', 'cc-exp', 'cc-cvc', 'cc-name'].forEach(id => showInvalid(id, false));
    }

    if (!ok) {
        // scroll to first invalid
        const first = form.querySelector('.is-invalid');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // All good — prepare payload
    const payload = {
        contact: { email: document.getElementById('email').value.trim() },
        shipping: {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            address1: document.getElementById('address1').value.trim(),
            address2: document.getElementById('address2').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            zip: document.getElementById('zip').value.trim(),
            phone: document.getElementById('phone').value.trim(),
        },
        paymentMethod: pay,
        total: document.getElementById('total-price').textContent
    };
    console.log('Checkout payload:', payload);
    alert('Form valid — ready to submit (check console).');
});

/* 
  Card helpers: format, expiry
*/
function formatCardNumber(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 19);
    // insert spaces every 4
    input.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    input.value = v;
}

// Luhn
function luhn(num) {
    const arr = num.split('').reverse().map(x => parseInt(x, 10));
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        let d = arr[i];
        if (i % 2 === 1) { d = d * 2; if (d > 9) d -= 9; }
        sum += d;
    }
    return sum % 10 === 0;
}

// expiry validator
function validateExpiry(v) {
    if (!/^\d{2}\/\d{2}$/.test(v)) return false;
    const [m, yy] = v.split('/').map(Number);
    if (m < 1 || m > 12) return false;
    const now = new Date();
    const exp = new Date(2000 + yy, m - 1, 1);
    // set to end of month
    exp.setMonth(exp.getMonth() + 1);
    exp.setDate(0);
    return exp >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/* 
  Mask middle digits after blur (security)
*/
const ccInput = document.getElementById('cc-number');
ccInput.addEventListener('blur', () => {
    const raw = ccInput.value.replace(/\s/g, '');
    if (raw.length >= 8) {
        // show first4 + masked + last4 (preserve spacing)
        const first = raw.slice(0, 4);
        const last = raw.slice(-4);
        const masked = `${first} **** **** ${last}`.trim();
        ccInput.dataset.raw = raw;
        ccInput.value = masked;
    }
});
ccInput.addEventListener('focus', () => {
    // restore raw if any
    if (ccInput.dataset.raw) {
        let r = ccInput.dataset.raw;
        ccInput.value = r.replace(/(.{4})/g, '$1 ').trim();
        delete ccInput.dataset.raw;
    }
});

/* toggle card fields when accordion radio toggles*/
const payRadios = document.querySelectorAll('input[name="payMethod"]');
payRadios.forEach(r => {
    r.addEventListener('change', () => {
        // if not card, collapse card accordion
        if (r.value === 'paypal' && r.checked) {
            // collapse card
            const collapseCard = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapseCard'));
            collapseCard.hide();
            // show paypal section
            const collapsePay = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapsePay'));
            collapsePay.show();
        } else if (r.value === 'card' && r.checked) {
            const collapseCard = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapseCard'));
            collapseCard.show();
            const collapsePay = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapsePay'));
            collapsePay.hide();
        }
    });
});

/* 
disable native form submit on Enter inside number inputs
*/
form.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.preventDefault();
});
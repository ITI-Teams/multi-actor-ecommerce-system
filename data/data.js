// ======  تحميل الببانات ======
// ========== CATEGORIES ==========
let categories = JSON.parse(localStorage.getItem("categories")) || [
    { id: 1, name: "Men", description: "Clothing and accessories for men" },
    { id: 2, name: "Women", description: "Clothing and accessories for women" },
    { id: 3, name: "Kids", description: "Clothing and accessories for kids" },
];
// ========== USERS ==========
let users = JSON.parse(localStorage.getItem("users")) || [
    { id: 1, name: "Admin User", email: "admin@trendora.com", role: "admin", phone: "0100000001", password: encryptText("Admin123!") },
    { id: 2, name: "Seller One", email: "seller1@trendora.com", role: "seller", phone: "0100000002", password: encryptText("Seller123!") },
    { id: 3, name: "Seller Two", email: "seller2@trendora.com", role: "seller", phone: "0100000003", password: encryptText("Seller123!") },
    { id: 4, name: "Seller Three", email: "seller3@trendora.com", role: "seller", phone: "0100000004", password: encryptText("Seller123!") },
    { id: 5, name: "Seller Four", email: "seller4@trendora.com", role: "seller", phone: "0100000005", password: encryptText("Seller123!") },
    { id: 6, name: "Seller Five", email: "seller5@trendora.com", role: "seller", phone: "0100000006", password: encryptText("Seller123!") },
];
// ========== CUSTOMERS ==========
let customers = JSON.parse(localStorage.getItem("customers")) || Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Customer${i + 1}`,
    FirstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    gender: i % 2 === 0 ? "male" : "female",
    email: `customer${i + 1}@trendora.com`,
    country: "EGY",
    city: i % 2 === 0 ? "Cairo" : "Alex",
    zip: "31589",
    address: `${i + 10} Street, City`,
    birthday: "1995-01-01",
    phone: `0100000${i + 100}`,
    password: encryptText("Cust1234!")
}));
// ========== PRODUCTS ==========
let products = JSON.parse(localStorage.getItem("products")) || Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    description: `This is description for product ${i + 1}`,
    category: categories[i % 3].name,
    reviews: Math.floor(Math.random() * 5) + 1,
    price: (Math.random() * 500 + 50).toFixed(2),
    size: ['S','M','L','XL'],
    color: ["#000000", "#FFFFFF", "#FF0000"],
    images: [`product${(i % 10) + 1}.jpg`],
    seller_id: (i % 5) + 2, // sellers start from id=2
    stock: Math.floor(Math.random() * 50) + 1
}));
// ========== ORDERS ==========
let statuses = ["Pending", "Processing", "Delivery", "Completed", "Cancelled"];
let orders = JSON.parse(localStorage.getItem("orders")) || Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    product_id: (i % 100) + 1,
    seller_id: (i % 5) + 2,
    customer_id: (i % 100) + 1,
    status: statuses[i % statuses.length],
    quntity: Math.floor(Math.random() * 5) + 1,
    totalPrice: (Math.random() * 500 + 50).toFixed(2),
    date: `2025-08-${(i % 28) + 1}`
}));
// ========== CARTS ==========
let carts = JSON.parse(localStorage.getItem("carts")) || Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    customer_id: (i % 100) + 1,
    product_id: (i % 100) + 1,
    seller_id: (i % 5) + 2,
    quantity: Math.floor(Math.random() * 3) + 1
}));
// ========== REVIEWS ==========
let reviews = JSON.parse(localStorage.getItem("reviews")) || Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    product_id: (i % 100) + 1,
    customer_id: (i % 100) + 1,
    review: Math.floor(Math.random() * 5) + 1
}));
// ========== MAILS ==========
let mails = JSON.parse(localStorage.getItem("mails")) || Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    to: `customer${(i % 100) + 1}@trendora.com`,
    from: "admin@trendora.com",
    subject: `Mail Subject ${i + 1}`,
    message: `Hello, this is test message number ${i + 1}`,
    date: `2025-08-${(i % 28) + 1}`
}));
// ========== MESSAGES ==========
let messages = JSON.parse(localStorage.getItem("messages")) || Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    phone: `010${100000 + i}`,
    subject: "Contact Us",
    message: `This is message number ${i + 1}`,
    date: `2025-08-${(i % 28) + 1}`
}));
// ========== cards ==========
let cards = JSON.parse(localStorage.getItem("cards")) || Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    number: `4871 0499 9999 9${i}10`,
    exp: "09/35",
    cvc: 123,
    name: "customer"+i,
    balance: 30000*i,
}));

if (!localStorage.getItem("cards")) {
    localStorage.setItem("cards", JSON.stringify(cards));
}
if (!localStorage.getItem("carts")) {
    localStorage.setItem("carts", JSON.stringify(carts));
}
if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(categories));
}
if (!localStorage.getItem("customers")) {
    localStorage.setItem("customers", JSON.stringify(customers));
}
if (!localStorage.getItem("mails")) {
    localStorage.setItem("mails", JSON.stringify(mails));
}
if (!localStorage.getItem("messages")) {
    localStorage.setItem("messages", JSON.stringify(messages));
}
if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify(orders));
}
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products));
}
if (!localStorage.getItem("reviews")) {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users));
}
function encryptText(text) {
    if (!text) return '';
    let step1 = text.split('').reverse().join('');
        let step2 = '';
    for (let i = 0; i < step1.length; i += 2) {
        if (i + 1 < step1.length) {
            step2 += step1[i+1] + step1[i];
        } else {
            step2 += step1[i];
        }
    }
    
    let step3 = '';
    for (let i = 0; i < step2.length; i++) {
        let charCode = step2.charCodeAt(i);
        step3 += String.fromCharCode(charCode + 3);
    }
    
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + step3 + suffix;
}

function decryptText(encryptedText) {
    if (!encryptedText) return '';
    
    let step1 = encryptedText.substring(1, encryptedText.length - 1);
    
    let step2 = '';
    for (let i = 0; i < step1.length; i++) {
        let charCode = step1.charCodeAt(i);
        step2 += String.fromCharCode(charCode - 3);
    }
    
    let step3 = '';
    for (let i = 0; i < step2.length; i += 2) {
        if (i + 1 < step2.length) {
            step3 += step2[i+1] + step2[i];
        } else {
            step3 += step2[i];
        }
    }
    
    return step3.split('').reverse().join('');
}
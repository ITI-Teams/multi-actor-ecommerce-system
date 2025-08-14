// Load data from localStorage
const session = JSON.parse(localStorage.getItem("session")) || {};
const products = JSON.parse(localStorage.getItem("products")) || [];
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const users = JSON.parse(localStorage.getItem("users")) || [];
const customers = JSON.parse(localStorage.getItem("customers")) || [];
const messages = JSON.parse(localStorage.getItem("messages")) || [];

// Filter data based on role
let filteredOrders = orders;
let filteredProducts = products;

if (session.role === "seller") {
    filteredProducts = products.filter(p => p.seller_id === session.id);
    const sellerProductIds = filteredProducts.map(p => p.id);
    filteredOrders = orders.filter(o => sellerProductIds.includes(o.product_id));
}

// Calculate stats
const totalEarnings = filteredOrders.reduce((sum, o) => sum + (o.totalPrice * o.quntity), 0);
const totalSales = filteredOrders.length;
const totalUsers = session.role === "admin" ? users.length : 0;
const totalMessages = session.role === "admin" ? messages.length : messages.filter(m => m.email === session.email).length;

// Update DOM
document.getElementById("totalEarnings").textContent = `$${totalEarnings}`;
document.getElementById("totalSales").textContent = totalSales;
document.getElementById("totalUsers").textContent = totalUsers;
document.getElementById("totalMessages").textContent = totalMessages;

// Chart.js: Sales Over Time
const salesCtx = document.getElementById("salesChart").getContext("2d");
new Chart(salesCtx, {
    type: "line",
    data: {
        labels: filteredOrders.map((_, i) => `Order ${i+1}`),
        datasets: [{
            label: "Sales ($)",
            data: filteredOrders.map(o => o.totalPrice * o.quntity),
            borderColor: "#0f7fd9",
            backgroundColor: "rgba(15, 127, 217, 0.2)",
            tension: 0.4,
            fill: true
        }]
    }
});

// Chart.js: Visitors by Country (Dummy data for now)
const countryCtx = document.getElementById("countryChart").getContext("2d");
new Chart(countryCtx, {
    type: "doughnut",
    data: {
        labels: ["Egypt", "Saudi Arabia", "UAE", "USA", "Other"],
        datasets: [{
            data: [120, 90, 70, 50, 30],
            backgroundColor: ["#0f7fd9", "#f3e53d", "#44ff00", "#ff1414", "#999999"]
        }]
    }
});

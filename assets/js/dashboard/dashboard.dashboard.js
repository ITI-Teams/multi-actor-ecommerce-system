// Load data from localStorage
const session = JSON.parse(localStorage.getItem("session")) || {};
const products = JSON.parse(localStorage.getItem("products")) || [];
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const users = JSON.parse(localStorage.getItem("users")) || [];
const customers = JSON.parse(localStorage.getItem("customers")) || [];
const messages = JSON.parse(localStorage.getItem("messages")) || [];
const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

// Filter data based on role
let filteredOrders = orders;
let filteredProducts = products;
let averageRating;

if (session.role === "seller") {
    filteredProducts = products.filter(p => p.seller_id === session.id);
    const sellerProductIds = filteredProducts.map(p => p.id);
    filteredOrders = orders.filter(p => p.seller_id === session.id);
    filteredReviews = reviews.filter(r => sellerProductIds.includes(r.product_id));
    averageRating = filteredReviews.length > 0 
    ? (filteredReviews.reduce((sum, r) => sum + r.review, 0) / filteredReviews.length).toFixed(2) 
    : 0;
}

// Calculate stats
const totalEarnings = filteredOrders.filter(o => o.status === "Completed").reduce((sum, o) => sum + (o.totalPrice * o.quntity), 0);
const doneOrders = filteredOrders.filter(o => o.status === "Completed");
const totalSales = filteredOrders.length;
const totalUsers = session.role === "admin" ? users.length : 0;
const totalMessages = session.role === "admin" ? messages.length : messages.filter(m => m.email === session.email).length;



/** Create Dashboard */
const statsCards = document.getElementById("statsCards");
function renderStats() {
    if (!session) {
        statsCards.innerHTML = `<div class="col-12"><div class="alert alert-warning">لم يتم العثور على جلسة.</div></div>`;
        return;
    }

    if (session.role === "admin") {
        let ordersRows = "";
        filteredOrders.slice(0, 5).forEach(order => {
            const customer = customers.find(c => c.id === order.customer_id);
            const statusColors = {
                "Pending": "badge bg-primary",
                "Processing": "badge bg-warning text-dark",
                "Delivery": "badge bg-warning",
                "Completed": "badge bg-success",
                "Cancelled": "badge bg-danger"
            };

            ordersRows += `
                <tr>
                    <td>#${order.id}</td>
                    <td>${customer ? customer.name : 'Unknown'}</td>
                    <td><span class="${statusColors[order.status] || ''}">${order.status}</span></td>
                    <td>$${order.totalPrice}</td>
                </tr>
            `;
        });
        statsCards.innerHTML = `
            <!-- Row For Admin -->
            <div class="row align-items-start">
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        <div class="text-end">
                            <h3 class="mb-0">Users</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(totalUsers)}</p>
                        </div>
                        <div class="icon-container bg-primary p-3 rounded">
                            <i class="fas fa-users fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        
                        <div class="text-end">
                            <h3 class="mb-0">Sales</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(totalEarnings)}$</p>
                        </div>
                        <div class="icon-container bg-success p-3 rounded">
                            <i class="fas fa-shopping-cart fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        
                        <div class="text-end">
                            <h3 class="mb-0">Customers</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(customers.length)}</p>
                        </div>
                        <div class="icon-container bg-warning p-3 rounded">
                            <i class="fas fa-user fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        
                        <div class="text-end">
                            <h3 class="mb-0">Messages</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(totalMessages)}</p>
                        </div>
                        <div class="icon-container bg-danger p-3 rounded">
                            <i class="fas fa-inbox fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Row Two  -->
            <div class="row mt-4">
                <!-- Monthly Sales Chart -->
                <div class="col-12 col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-primary text-white">
                            <h5 class="card-title mb-0">Monthly Sales</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="monthlySalesChart" style="height: 300px; width: 100%"></canvas>
                        </div>
                    </div>
                </div>
                <!-- Sales by Country Map -->
                <div class="col-12 col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-success text-white">
                            <h5 class="card-title mb-0">Sales by Country</h5>
                        </div>
                        <div class="card-body p-0">  <!-- Remove padding for map to fill space -->
                            <div id="countryMap" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Orders Row -->
            <div class="row mt-4">
                <!-- Recent Orders -->
                <div class="col-12 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-info text-white">
                            <h5 class="card-title mb-0">Recent Orders</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover table-responsive overflow-auto">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody id="orderTBody">
                                    ${ordersRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Orders Status Chart -->
                <div class="col-12 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-info text-white">
                            <h5 class="card-title mb-0">Orders Status</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="ordersChart" style="height: 300px;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        let ordersRows = "";
        filteredOrders.forEach(order => {
            const customer = customers.find(c => c.id === order.customer_id);
            const statusColors = {
                "Pending": "badge bg-primary",
                "Processing": "badge bg-warning text-dark",
                "Delivery": "badge bg-warning",
                "Completed": "badge bg-success",
                "Cancelled": "badge bg-danger"
            };

            ordersRows += `
                <tr>
                    <td>#${order.id}</td>
                    <td>${customer ? customer.name : 'Unknown'}</td>
                    <td><span class="${statusColors[order.status] || ''}">${order.status}</span></td>
                    <td>$${order.totalPrice}</td>
                </tr>
            `;
        });
        statsCards.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    Hello ${session.name || 'Dear Seller'}, this is your Dashboard.
                    <br>To view full statistics, please log in as an <strong>administrator</strong>.
                </div>
            </div>
            <!-- Row For Seller -->
                <div class="row align-items-start">
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        <div class="text-end">
                            <h3 class="mb-0">orders</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(totalSales)}</p>
                        </div>
                        <div class="icon-container bg-primary p-3 rounded">
                            <i class="fas fa-paper-plane fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        
                        <div class="text-end">
                            <h3 class="mb-0">Sales</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(totalEarnings)}$</p>
                        </div>
                        <div class="icon-container bg-success p-3 rounded">
                            <i class="fas fa-shopping-cart fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        
                        <div class="text-end">
                            <h3 class="mb-0">Reviews</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(averageRating)}(${formatNumber(filteredReviews.length)})</p>
                        </div>
                        <div class="icon-container bg-warning p-3 rounded">
                            <i class="fas fa-star fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm bg-body-tertiary">
                        
                        <div class="text-end">
                            <h3 class="mb-0">Products</h3>
                            <p class="mb-0 fs-4 fw-bold text-muted">${formatNumber(filteredProducts.length)}</p>
                        </div>
                        <div class="icon-container bg-danger p-3 rounded">
                            <i class="fas fa-box fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Row Two  -->
            <div class="row mt-4">
                <!-- Monthly Sales Chart -->
                <div class="col-12 col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-primary text-white">
                            <h5 class="card-title mb-0">Monthly Sales</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="monthlySalesChart" style="height: 300px; width: 100%"></canvas>
                        </div>
                    </div>
                </div>
                <!-- Sales by Country Map -->
                <div class="col-12 col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-success text-white">
                            <h5 class="card-title mb-0">Sales by Country</h5>
                        </div>
                        <div class="card-body p-0">  <!-- Remove padding for map to fill space -->
                            <div id="countryMap" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Orders Row -->
            <div class="row mt-4">
                <!-- Recent Orders -->
                <div class="col-12 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-info text-white">
                            <h5 class="card-title mb-0">Recent Orders</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover table-responsive overflow-auto">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody id="orderTBody">
                                    ${ordersRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Orders Status Chart -->
                <div class="col-12 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-info text-white">
                            <h5 class="card-title mb-0">Orders Status</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="ordersChart" style="height: 300px;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!session) {
        window.location.href = "../login.html";
        return;
    }
    renderStats();
});
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// Monthly Sales Chart (Chart.js)
document.addEventListener('DOMContentLoaded', function() {
    // Monthly Sales Chart
    // Prepare array for 12 months
    let monthlyTotals = new Array(12).fill(0);
    // Fill monthly sales
    doneOrders.forEach(order => {
        if (!order.date) return;
        let orderDate = new Date(order.date);
        let monthIndex = orderDate.getMonth();
        monthlyTotals[monthIndex] += (order.totalPrice * order.quntity);
    });
    const monthlySalesCtx = document.getElementById('monthlySalesChart');
    monthlySalesCtx.height = 300;

    new Chart(monthlySalesCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales ($)',
                data: monthlyTotals,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Sales by Country Map (Plotly.js)
    let salesData = {};

    doneOrders.forEach(order => {
        let customer = customers.find(c => c.id === order.customer_id);
        if (!customer || !customer.country) return;
        let total = order.totalPrice * order.quntity;
        salesData[customer.country] = (salesData[customer.country] || 0) + total;
    });
    
    const countriesMap = {
        "USA": "United States",
        "GBR": "United Kingdom",
        "FRA": "France",
        "EGY": "Egypt",
        "SAU": "Saudi Arabia"
    };
    const locations = Object.keys(countriesMap);
    const zValues = locations.map(code => salesData[code] || null);
    const textValues = locations.map(code =>
        salesData[code]
            ? `${countriesMap[code]}: $${salesData[code].toLocaleString()}`
            : `${countriesMap[code]}: No sales data`
    );

    const countryData = [{
        type: 'choropleth',
        locations: locations,
        z: zValues,
        text: textValues,
        colorscale: [
            [0, 'rgba(11, 243, 204, 1)'],
            [0.01, 'rgba(46, 151, 88, 1)'],
            [1, 'rgba(0, 255, 0, 1)']
        ],
        zmin: 10000,
        zmax: 150000,
        autocolorscale: false,
        marker: {
            line: {
                color: 'rgb(100,100,100)',
                width: 1.2
            }
        },
        colorbar: {
            title: 'Sales in USD',
            tickprefix: '$'
        }
    }];

    const countryLayout = {
        geo: {
            showframe: true,
            framecolor: 'rgba(0,0,0,0.3)',
            framewidth: 1,
            showcoastlines: true,
            coastlinecolor: 'rgba(0,0,0,0.5)',
            coastlinewidth: 1.2,
            showcountries: true,
            countrycolor: 'rgba(0,0,0,0.8)',
            countrywidth: 1,
            projection: { type: 'natural earth', scale: 1.2 },
            landcolor: 'rgba(0,0,0,0.05)'
        },
        margin: { t: 0, b: 0, l: 0, r: 0 },
        height: 300,
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('countryMap', countryData, countryLayout, { responsive: true });

    window.addEventListener('resize', () => {
        Plotly.Plots.resize('countryMap');
    });

    // Orders Status Chart
    let statusCounts = {
        "Pending": 0,
        "Processing": 0,
        "Delivery": 0,
        "Completed": 0,
        "Cancelled": 0,
    };
    filteredOrders.forEach(order => {
        if (statusCounts[order.status] !== undefined) {
            statusCounts[order.status]++;
        }
    });
    const ordersCtx = document.getElementById('ordersChart');
    if (ordersCtx) {
        new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        'rgba(6, 27, 51, 0.8)',
                        'rgba(255, 193, 7, 0.8)',   
                        'rgba(23, 162, 184, 0.8)', 
                        'rgba(40, 167, 69, 1)',  
                        'rgba(220, 53, 69, 0.8)' , 
                    ],
                    borderColor: [
                        'rgba(6, 27, 51, 0.8)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(23, 162, 184, 1)',
                        'rgba(40, 167, 69, 1)',
                        'rgba(220, 53, 69, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }
    
});
let orders = JSON.parse(localStorage.getItem("orders")) || [
    { 
        id: 1, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery" 
    },
    { 
        id: 2, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery" 
    },
    { 
        id: 3, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery" 
    },
    { 
        id: 4, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery" 
    },
    { 
        id: 5, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery" 
    },
    { 
        id: 6, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery" 
    },
    
];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function renderTable() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const sellers = JSON.parse(localStorage.getItem("users")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    const searchValue = document.getElementById("searchOrder").value.toLowerCase();
    const filteredOrders = orders.filter(u =>
        u.status.toLowerCase().includes(searchValue)
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedOrders = filteredOrders.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("orderTableBody");
    tbody.innerHTML = "";

    paginatedOrders.forEach(order => {
        const product = products.find(p => p.id === order.product_id);
        const seller = sellers.find(s => s.id === order.seller_id);
        const customer = customers.find(c => c.id === order.customer_id);

        const statusColors = {
            "Pending": "bg-warning text-dark",
            "Processing": "bg-primary text-white",
            "Delivery": "bg-info text-dark",
            "Completed": "bg-success text-white",
            "Cancelled": "bg-danger text-white"
        };

        tbody.innerHTML += `
            <tr>
                <td>${product ? product.name : "Unknown Product"}</td>
                <td>${seller ? seller.name : "Unknown Seller"}</td>
                <td>${customer ? customer.name : "Unknown Customer"}</td>
                <td>
                    <select class="form-select ${statusColors[order.status] || ''}" 
                            onchange="updateOrderStatus(${order.id}, this.value)">
                        ${Object.keys(statusColors).map(status =>
                            `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`
                        ).join('')}
                    </select>
                </td>
                <td style="text-align: center;">
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredOrders.length);
}

function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders();
        renderTable();
    }
}

function renderPagination(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPagePagination ? "active" : ""}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
}

function changePage(page) {
    currentPagePagination = page;
    renderTable();
}

function deleteOrder(id) {
    if (confirm("Are you sure you want to delete this order?")) {
        const index = orders.findIndex(u => u.id === id);
        orders.splice(index, 1);
        saveOrders();
        renderTable();
    }
}

document.getElementById("searchOrder").addEventListener("input", renderTable);

renderTable();

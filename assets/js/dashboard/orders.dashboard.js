import { renderPagination } from "../include/pagination.js";

let orders = JSON.parse(localStorage.getItem("orders")) || [];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function renderTable() {
    const session = JSON.parse(localStorage.getItem("session")) || null;
    const tbody = document.getElementById("orderTableBody");

    if (!session) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-danger">No session found</td></tr>`;
        document.getElementById("pagination").innerHTML = "";
        return;
    }

    // base data
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const sellers = JSON.parse(localStorage.getItem("users")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    // filter by role
    let filteredOrders = orders;
    if (session.role === "seller") {
        filteredOrders = orders.filter(p => p.seller_id === session.id);
    }

    // search
    const searchValue = (document.getElementById("searchOrder").value || "").toLowerCase();
    filteredOrders = filteredOrders.filter(u => (u.status || "").toLowerCase().includes(searchValue));

    // paginate (show latest first without mutating original)
    const totalRows = filteredOrders.length;
    const start = (currentPagePagination - 1) * rowsPerPage;
    const pageOrders = [...filteredOrders].reverse().slice(start, start + rowsPerPage);

    // render rows
    tbody.innerHTML = "";
    if (pageOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No orders found</td></tr>`;
    } else {
        const statusColors = {
            Pending: "bg-warning text-dark",
            Processing: "bg-primary text-white",
            Delivery: "bg-info text-dark",
            Completed: "bg-success text-white",
            Cancelled: "bg-danger text-white",
        };

        pageOrders.forEach(order => {
            const product = products.find(p => p.id === order.product_id);
            const seller = sellers.find(s => s.id === order.seller_id);
            const customer = customers.find(c => c.id === order.customer_id);

            const selectCls = statusColors[order.status] || "";

            tbody.innerHTML += `
        <tr>
          <td>${product ? product.name : "Unknown Product"}</td>
          <td>${seller ? (seller.name ?? seller.email ?? "Seller") : "Unknown Seller"}</td>
          <td>${customer ? (customer.FirstName ? `${customer.FirstName} ${customer.lastName ?? ""}`.trim() : (customer.name ?? customer.email ?? "Customer")) : "Unknown Customer"}</td>
          <td>${order?.quntity ?? "-"}</td>
          <td>${(order?.totalPrice).toFixed(2) ?? "-"}</td>
          <td>
            <select class="form-select ${selectCls}"
                    onchange="updateOrderStatus(${order.id}, this.value)">
              ${Object.keys(statusColors)
                    .map(s => `<option value="${s}" ${order.status === s ? "selected" : ""}>${s}</option>`)
                    .join("")}
            </select>
          </td>
          <td class="text-center">
            <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
        });
    }

    // render pagination (compact with ellipses, disable active)
    renderPagination({
        containerId: "pagination",
        totalItems: totalRows,
        pageSize: rowsPerPage,
        currentPage: currentPagePagination,
        onPageChange: (next) => {
            currentPagePagination = next;
            renderTable();
        },
    });
}

function updateOrderStatus(orderId, newStatus) {
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;

    const current = orders[idx].status;
    if (current === "Completed") { alert("This order is already completed and cannot be changed."); renderTable(); return; }
    if (current === "Cancelled") { alert("This order is already Cancelled and cannot be changed."); renderTable(); return; }

    orders[idx].status = newStatus;
    saveOrders();
    renderTable();
}

function changePage(page) { // not used anymore, but keep if other pages rely on it
    currentPagePagination = page;
    renderTable();
}

function deleteOrder(id) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const index = orders.findIndex(u => u.id === id);
    if (index !== -1) {
        orders.splice(index, 1);
        saveOrders();
        // keep current page in range after deletion
        const totalPages = Math.max(1, Math.ceil(orders.length / rowsPerPage));
        if (currentPagePagination > totalPages) currentPagePagination = totalPages;
        renderTable();
    }
}

document.getElementById("searchOrder").addEventListener("input", () => {
    currentPagePagination = 1;
    renderTable();
});

renderTable();

window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;
window.changePage = changePage;

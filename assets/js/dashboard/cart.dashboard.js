import { renderPagination } from "../include/pagination.js";

let customers = JSON.parse(localStorage.getItem("customers")) || [];
let sellers = JSON.parse(localStorage.getItem("users")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let mails = JSON.parse(localStorage.getItem("mails")) || [];
let carts = JSON.parse(localStorage.getItem("carts")) || [];

let currentPagePagination = 1;
const rowsPerPage = 5;

(function () {
    emailjs.init("6SCuP-X4rdUdtYhaX");
})();

function SendMail() {
    localStorage.setItem("mails", JSON.stringify(mails));
}

function renderTable() {
    const session = JSON.parse(localStorage.getItem("session")) || null;
    if (!session) {
        document.getElementById("cartTableBody").innerHTML =
            `<tr><td colspan="10" class="text-center text-danger">No session found</td></tr>`;
        // clear pagination if no session
        const pager = document.getElementById("pagination");
        if (pager) pager.innerHTML = "";
        return;
    }

    // filter by role
    let filteredCarts = carts;
    if (session.role === "seller") {
        filteredCarts = carts.filter(p => p.seller_id === session.id);
    }

    // search
    const q = (document.getElementById("searchCart").value || "").toLowerCase();
    filteredCarts = filteredCarts.filter(c => {
        const customer = customers.find(cus => Number(cus.id) === Number(c.customer_id));
        const product = products.find(p => Number(p.id) === Number(c.product_id));
        return (
            (customer && (customer.name || "").toLowerCase().includes(q)) ||
            (product && (product.name || "").toLowerCase().includes(q))
        );
    });

    // sort newest first without mutating the array, then paginate
    const sorted = [...filteredCarts].reverse();
    const start = (currentPagePagination - 1) * rowsPerPage;
    const page = sorted.slice(start, start + rowsPerPage);

    // rows
    const tbody = document.getElementById("cartTableBody");
    tbody.innerHTML = "";

    if (page.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No carts found</td></tr>`;
    } else {
        page.forEach(cart => {
            const customer = customers.find(cus => Number(cus.id) === Number(cart.customer_id));
            const seller = sellers.find(sel => Number(sel.id) === Number(cart.seller_id));
            const product = products.find(p => Number(p.id) === Number(cart.product_id));

            tbody.innerHTML += `
        <tr>
          <td>${customer ? customer.name : "Unknown Customer"}</td>
          <td>${product ? product.name : "Unknown Product"}</td>
          <td>${seller ? seller.name : "Unknown Seller"}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="editCart(${cart.id})" title="Send mail">
              <i class="fas fa-paper-plane"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteCart(${cart.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>`;
        });
    }

    // pagination
    renderPagination({
        containerId: "pagination",
        totalItems: filteredCarts.length,
        pageSize: rowsPerPage,
        currentPage: currentPagePagination,
        onPageChange: (next) => {
            currentPagePagination = next;
            renderTable();
        },
    });
}

function showFormMessage(message, type = "danger") {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = `
    <div class="alert alert-${type} py-2 px-3" role="alert">${message}</div>`;
    msgDiv.style.display = "block";
}

function clearFormMessage() {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = "";
    msgDiv.style.display = "none";
}

function editCart(id) {
    const cart = carts.find(u => u.id === id);
    if (!cart) return;

    document.getElementById("cartId").value = cart.id;
    document.getElementById("sellertId").value = cart.seller_id;
    document.getElementById("customerId").value = cart.customer_id;
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";

    clearFormMessage();
    document.getElementById("cartModalTitle").textContent = "Send Mail";
    new bootstrap.Modal(document.getElementById("cartModal")).show();
}

document.getElementById("cartForm").addEventListener("submit", function (e) {
    e.preventDefault();
    clearFormMessage();

    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const seller_id = parseInt(document.getElementById("sellertId").value);
    const customer_id = parseInt(document.getElementById("customerId").value);

    const seller = sellers.find(s => s.id === seller_id);
    const customer = customers.find(c => c.id === customer_id);

    const invalidChars = /<.*?>|[{}[\]<>]/;
    if ([subject, message].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!subject || !message) {
        showFormMessage("All fields are required!");
        return;
    }

    mails.push({
        id: Date.now(),
        to: customer ? customer.email : "unknown@domain.com",
        from: seller ? seller.email : "unknown@domain.com",
        subject,
        message,
        date: new Date().toISOString(),
    });

    emailjs
        .send("service_2zkpunt", "template_k9jr8j9", {
            to_email: customer?.email,
            from_name: "Trendora",
            subject,
            message,
        })
        .then(
            (res) => console.log("SUCCESS", res),
            (err) => console.log("FAILED", err)
        );

    SendMail();
    bootstrap.Modal.getInstance(document.getElementById("cartModal")).hide();
    renderTable();
});

function deleteCart(id) {
    if (!confirm("Are you sure you want to delete this cart?")) return;
    const index = carts.findIndex(u => u.id === id);
    if (index > -1) {
        carts.splice(index, 1);
        localStorage.setItem("carts", JSON.stringify(carts));
        const totalPages = Math.max(1, Math.ceil(carts.length / rowsPerPage));
        if (currentPagePagination > totalPages) currentPagePagination = totalPages;
        renderTable();
    }
}

// search triggers
document.getElementById("searchCart").addEventListener("input", () => {
    currentPagePagination = 1;
    renderTable();
});

renderTable();

window.editCart = editCart;
window.deleteCart = deleteCart;

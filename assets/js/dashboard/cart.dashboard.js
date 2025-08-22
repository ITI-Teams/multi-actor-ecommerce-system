let customers = JSON.parse(localStorage.getItem("customers")) || [];
let sellers = JSON.parse(localStorage.getItem("users")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let mails = JSON.parse(localStorage.getItem("mails")) || [];
let carts = JSON.parse(localStorage.getItem("carts")) || [];
let currentPagePagination = 1;
const rowsPerPage = 5;
(function(){
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
        return;
    }

    let filteredCarts = carts;
    if (session.role === "seller") {
        filteredCarts = carts.filter(p => p.seller_id === session.id);
    }



    const searchValue = document.getElementById("searchCart").value.toLowerCase();

    filteredCarts = filteredCarts.filter(c => {
        const customer = customers.find(cus => cus.id === c.customer_id);
        const product = products.find(p => p.id === c.product_id);
        return (
            (customer && customer.name.toLowerCase().includes(searchValue)) ||
            (product && product.name.toLowerCase().includes(searchValue))
        );
    });

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedCarts = filteredCarts.reverse().slice(start, start + rowsPerPage);

    const tbody = document.getElementById("cartTableBody");
    tbody.innerHTML = "";

    paginatedCarts.forEach(cart => {
        const customer = customers.find(cus => Number(cus.id) === Number(cart.customer_id));
        const seller = sellers.find(sel => sel.id === cart.seller_id);
        const product = products.find(p => p.id === cart.product_id);

        tbody.innerHTML += `
            <tr>
                <td>${customer ? customer.name : "Unknown Customer"}</td>
                <td>${product ? product.name : "Unknown Product"}</td>
                <td>${seller ? seller.name : "Unknown Seller"}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editCart(${cart.id})">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCart(${cart.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredCarts.length);
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



function showFormMessage(message, type = "danger") {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = `
        <div class="alert alert-${type} py-2 px-3" role="alert">
            ${message}
        </div>
    `;
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

document.getElementById("cartForm").addEventListener("submit", function(e) {
    e.preventDefault();
    clearFormMessage();

    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const seller_id = parseInt(document.getElementById("sellertId").value);
    const customer_id = parseInt(document.getElementById("customerId").value);

    const seller = sellers.find(s => s.id === seller_id);
    const customer = customers.find(c => c.id === customer_id);

    // Validation
    const invalidChars = /<.*?>|[{}[\]<>]/;
    if ([ subject, message].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!subject || !message) {
        showFormMessage("All fields are required!");
        return;
    }

    const mailData = {
        id: Date.now(),
        to: customer ? customer.email : "unknown@domain.com",
        from: seller ? seller.email : "unknown@domain.com",
        subject: subject,
        message: message,
        date: new Date().toISOString()
    };

    mails.push(mailData);
    emailjs.send("service_2zkpunt", "template_k9jr8j9", {
        to_email: customer.email,
        from_name: "Trendora",
        subject: subject,
        message: message
    }).then(function(response) {
        console.log("SUCCESS", response);
    }, function(error) {
        console.log("FAILED", error);
    });
    SendMail();

    bootstrap.Modal.getInstance(document.getElementById("cartModal")).hide();
    renderTable();
});

function deleteCart(id) {
    if (confirm("Are you sure you want to delete this cart?")) {
        const index = carts.findIndex(u => u.id === id);
        if (index > -1) {
            carts.splice(index, 1);
            localStorage.setItem("carts", JSON.stringify(carts));
            renderTable();
        }
    }
}

document.getElementById("searchCart").addEventListener("input", renderTable);
renderTable();
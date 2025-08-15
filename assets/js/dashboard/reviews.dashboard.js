let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveReviews() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function renderTable() {
    const session = JSON.parse(localStorage.getItem("session")) || null;
    if (!session) return [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    if (session.role === "seller") {
        const sellerProductsIds = products
            .filter(p => p.seller_id === session.id)
            .map(p => p.id);
        reviews = reviews.filter(r => sellerProductsIds.includes(r.product_id));
    }

    const searchValue = document.getElementById("searchReview").value.toLowerCase();
    const filteredReviews = reviews.filter(u =>
        String(u.review).toLowerCase().includes(searchValue)
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedReviews = filteredReviews.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("reviewTableBody");
    tbody.innerHTML = "";

    paginatedReviews.forEach(review => {
        const product = products.find(p => p.id === review.product_id);
        const customer = customers.find(c => c.id === review.customer_id);
        tbody.innerHTML += `
            <tr>
                <td>${product ? product.name : "Unknown Product"}</td>
                <td>${customer ? customer.name : "Unknown Customer"}</td>
                <td class="text-center">${review ? getStarsHTML(review.review) : "Unknown Review"}</td>
                
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteReview(${review.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredReviews.length);
}
function getStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star" style="color: gold;"></i>';
        } else {
            starsHTML += '<i class="far fa-star" style="color: gold;"></i>';
        }
    }
    return starsHTML;
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

function deleteReview(id) {
    if (confirm("Are you sure you want to delete this review?")) {
        const index = reviews.findIndex(u => u.id === id);
        reviews.splice(index, 1);
        saveReviews();
        renderTable();
    }
}

document.getElementById("searchReview").addEventListener("input", renderTable);

renderTable();

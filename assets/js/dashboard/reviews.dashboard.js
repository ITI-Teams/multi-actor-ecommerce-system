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

    let filteredReviews = [...reviews];

    if (session.role === "seller") {
        const sellerProductsIds = products
            .filter(p => p.seller_id === session.id)
            .map(p => p.id);
        filteredReviews = filteredReviews.filter(r => sellerProductsIds.includes(r.product_id));
    }

    const searchValue = document.getElementById("searchReview").value.toLowerCase();
    filteredReviews = filteredReviews.filter(u =>
        String(u.review).toLowerCase().includes(searchValue)
    );

    const productRatings = {};
    filteredReviews.forEach(r => {
        if (!productRatings[r.product_id]) {
            productRatings[r.product_id] = [];
        }
        productRatings[r.product_id].push(Number(r.review));
    });

    const productAverages = Object.keys(productRatings).map(pid => {
        const ratings = productRatings[pid];
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        const product = products.find(p => p.id == pid);
        return {
            product_id: pid,
            product_name: product ? product.name : "Unknown Product",
            avg_rating: avg,
            count: ratings.length
        };
    });

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedProducts = productAverages.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("reviewTableBody");
    tbody.innerHTML = "";
    paginatedProducts.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.product_name}</td>
                <td class="text-center">${getStarsHTML(Math.round(item.avg_rating))} (${item.avg_rating.toFixed(1)})</td>
                <td class="text-center">${item.count} reviews</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteReview(${item.product_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(productAverages.length);
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

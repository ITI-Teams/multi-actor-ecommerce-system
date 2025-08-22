let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
let currentPagePagination = 1;
const rowsPerPage = 5;

function saveReviews() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function renderTable() {
    const session = JSON.parse(localStorage.getItem("session")) || null;
    if (!session) return;

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    let filteredReviews = [...reviews];

    if (session.role === "seller") {
        const sellerProductsIds = products
            .filter(p => Number(p.seller_id) === Number(session.id))
            .map(p => Number(p.id));
        filteredReviews = filteredReviews.filter(r =>
            sellerProductsIds.includes(Number(r.product_id))
        );
    }

    // search value
    const searchEl = document.getElementById("searchReview");
    const searchValue = (searchEl?.value || "").toLowerCase();

    // Filter by rating text/number
    filteredReviews = filteredReviews.filter(u => String(u.review ?? "").toLowerCase().includes(searchValue)
    );

    const productRatings = {};
    filteredReviews.forEach(r => {
        const pid = Number(r.product_id);
        const val = Number(r.review);
        if (!Number.isFinite(val)) return;
        (productRatings[pid] ||= []).push(val);
    });

    const productAverages = Object.keys(productRatings).map(pidStr => {
        const pid = Number(pidStr);
        const ratings = productRatings[pid];
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        const product = products.find(p => Number(p.id) === pid);
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
    if (!tbody) return;
    tbody.innerHTML = "";

    if (paginatedProducts.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">No reviews found.</td>
      </tr>
    `;
    } else {
        paginatedProducts.forEach(item => {
            tbody.innerHTML += `
        <tr>
          <td>${item.product_name}</td>
          <td class="text-center">
            ${getStarsHTML(Math.round(item.avg_rating))} (${item.avg_rating.toFixed(1)})
          </td>
          <td class="text-center">${item.count} reviews</td>
          <td class="text-center">
            <button class="btn btn-danger btn-sm" onclick="deleteReview(${item.product_id})" title="Delete all reviews for this product">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
        });
    }

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
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    if (currentPagePagination > totalPages) currentPagePagination = totalPages;

    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
      <li class="page-item ${i === currentPagePagination ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;
    }
}

function changePage(page) {
    currentPagePagination = page;
    renderTable();
}

function deleteReview(productId) {
    if (confirm("Delete ALL reviews for this product?")) {
        const pid = Number(productId);
        reviews = reviews.filter(u => Number(u.product_id) !== pid);
        saveReviews();
        currentPagePagination = 1;
        renderTable();
    }
}

const searchElInit = document.getElementById("searchReview");
if (searchElInit) {
    searchElInit.addEventListener("input", () => {
        currentPagePagination = 1;
        renderTable();
    });
}

renderTable();

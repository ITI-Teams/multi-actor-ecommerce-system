import prodcutCard from "./include/productCard.js";
import { renderPagination } from "./include/pagination.js";

let products = JSON.parse(localStorage.getItem("products")) || [];
let filteredProducts = [...products];
let currentPage = 1;
const rowsPerPage = 12;

// ---- URL search support ----
const urlParams = new URLSearchParams(location.search);
const searchQuery = urlParams.get("search");
if (searchQuery) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = searchQuery;
    filteredProducts = products.filter(p =>
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
}
displayTable(); // initial render

// ---- Live search ----
document.getElementById("searchInput")?.addEventListener("input", function (e) {
    const term = e.target.value.toLowerCase().replace(/[^a-z0-9\s]/gi, "");
    filteredProducts = term
        ? products.filter(p =>
            (p.name || "").toLowerCase().includes(term) ||
            (p.description || "").toLowerCase().includes(term)
        )
        : [...products];

    currentPage = 1;
    displayTable();
});

// ---- Ratings helpers (kept, in case productCard uses them later) ----
function getAverageRating(productId) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const productReviews = reviews.filter(r => r.product_id == productId);
    if (productReviews.length === 0) return { avg: 0, count: 0 };
    const avg = productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / productReviews.length;
    return { avg: Math.round(avg * 2) / 2, count: productReviews.length };
}
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let stars = "";
    for (let i = 0; i < full; i++) stars += '<i class="bi bi-star-fill text-warning"></i>';
    if (half) stars += '<i class="bi bi-star-half text-warning"></i>';
    for (let i = 0; i < empty; i++) stars += '<i class="bi bi-star text-secondary"></i>';
    return stars;
}

// ---- Render products + paginator ----
function displayTable() {
    const container = document.getElementById("productsWrapper");
    const paginationEl = document.getElementById("pagination");
    if (!container || !paginationEl) return;

    container.innerHTML = "";
    container.classList.add('pb-3')

    // Empty state
    const totalItems = filteredProducts.length;
    if (!totalItems) {
        paginationEl.innerHTML = `
      <div class="text-center py-5 my-5 w-50 mx-auto">
        <p class="alert alert-danger fs-6 fw-semibold text-capitalize">
          No Product Found with this name!
        </p>
      </div>`;
        return;
    }

    // Slice current page
    const start = (currentPage - 1) * rowsPerPage;
    const pageItems = filteredProducts.slice(start, start + rowsPerPage);

    // Render cards
    pageItems.forEach(product => {
        // keep available for future use; productCard already renders its own rating UI
        const { avg, count } = getAverageRating(product.id);
        const stars = renderStars(avg);
        container.innerHTML += prodcutCard(product);
    });

    renderPagination({
        containerId: "pagination",
        totalItems,
        pageSize: rowsPerPage,
        currentPage,
        onPageChange: (next) => {
            currentPage = next;
            displayTable();
        },
    });
}

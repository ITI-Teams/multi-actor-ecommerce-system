import { renderPagination } from "./include/pagination.js";
import prodcutCard from "./include/productCard.js";

// ===== categories.js =====
document.addEventListener("DOMContentLoaded", () => {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const categoriesRow = document.querySelector("#categoriesRow");
  const collapseEl = document.getElementById("productsContainer");
  const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

  let activeCategory = null;

  // Maps to normalize category IDs/names
  const nameToId = new Map(categories.map(c => [String(c.name), String(c.id)]));
  const idsSet   = new Set(categories.map(c => String(c.id)));

  // Render category cards
  categoriesRow.innerHTML = categories.map(category => {
    let imgSrc;
    const n = String(category.name || "").toLowerCase();
    if (n === "men") imgSrc = "/assets/img/men.jpeg";
    else if (n === "woman" || n === "women") imgSrc = "/assets/img/women.jpeg";
    else imgSrc = "/assets/img/logo_category.webp";

    return `
      <div class="col">
        <div class="category">
          <img src="${imgSrc}" class="card-img-top object-fit-cover" alt="Category">
          <p>
            <button class="mt-2 category-btn" data-id="${category.id}">
              ${category.name}
            </button>
          </p>
          <p class="">${category.description ?? ""}</p>
        </div>
      </div>
    `;
  }).join("");

  // Normalize product category id
  function getProductCategoryId(prod) {
    let v = prod.category_id ?? prod.categoryId ?? prod.category;
    if (v == null) return null;
    const s = String(v);
    if (idsSet.has(s)) return s;          // already an id
    if (nameToId.has(s)) return nameToId.get(s); // name -> id
    return null;
  }

  // (Optional) ratings helpers — kept as-is in case your card needs them
  function getAverageRating(productId) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const productReviews = reviews.filter(r => r.product_id == productId);
    if (!productReviews.length) return { avg: 0, count: 0 };
    const sum = productReviews.reduce((acc, r) => acc + Number(r.review), 0);
    const avg = sum / productReviews.length;
    return { avg: Math.round(avg * 2) / 2, count: productReviews.length };
  }
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let stars = "";
    for (let i = 0; i < full; i++) stars += '<i class="fa fa-star star" style="color: gold;"></i>';
    if (half) stars += '<i class="fa fa-star-half-alt star" style="color: gold;"></i>';
    for (let i = 0; i < empty; i++) stars += '<i class="fa fa-star star"></i>';
    return stars;
  }

  // ---------- LIST + PAGINATION (reusable renderer) ----------
  function renderList(filteredProducts) {
    const container = document.getElementById("productsContainer");
    if (!container) {
      console.error("Element #productsContainer not found in DOM.");
      return;
    }

    const itemsPerPage = 12; // 4 cols × 2 rows
    let currentPage = 1;

    function renderPage(page) {
      const total = filteredProducts.length;
      const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
      currentPage = Math.min(Math.max(page, 1), totalPages);

      // slice page items
      const start = (currentPage - 1) * itemsPerPage;
      const end   = start + itemsPerPage;
      const pageItems = filteredProducts.slice(start, end);

      // cards grid
      const rowsHtml = pageItems.map(prod => {
        // Keep hooks available for the card if needed
        const { avg } = getAverageRating(prod.id) || { avg: 0 };
        void renderStars(avg); // no-op here; your prodcutCard handles the markup
        return prodcutCard(prod);
      }).join("");

      // layout: wrapper + pagination mount
      container.innerHTML = `
        <div class="justify-content-center" id="productsWrapper">${rowsHtml}</div>
        <div class="mt-3 d-flex justify-content-center">
          <div id="categoryPagination"></div>
        </div>
      `;

      // render reusable pagination
      renderPagination({
        containerId: "categoryPagination",
        totalItems: total,
        pageSize: itemsPerPage,
        currentPage,
        siblingCount: 1,   // show 1 page around current
        boundaryCount: 2,  // keep 1 & 2 visible → avoids hiding page 2
        onPageChange: (next) => renderPage(next),
        labels: { prev: "«", next: "»" }
      });
    }

    if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) {
      container.innerHTML = `
        <p class="text-muted text-center my-3">There are no products in this category.</p>
        <div class="d-flex justify-content-center"><div id="categoryPagination"></div></div>
      `;
      // Empty pagination (optional)
      renderPagination({
        containerId: "categoryPagination",
        totalItems: 0,
        pageSize: itemsPerPage,
        currentPage: 1,
        onPageChange: () => {}
      });
      return;
    }

    // start at page 1
    renderPage(1);
  }

  // Category click (event delegation)
  categoriesRow.addEventListener("click", (e) => {
    const button = e.target.closest(".category-btn");
    if (!button) return;

    const categoryId = String(button.dataset.id);

    // toggle same open category
    if (activeCategory === categoryId && collapseEl.classList.contains("show")) {
      bsCollapse.hide();
      activeCategory = null;
      return;
    }
    activeCategory = categoryId;

    // filter by normalized id
    const filtered = products.filter(p => getProductCategoryId(p) === categoryId);

    renderList(filtered);
    bsCollapse.show();
    collapseEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

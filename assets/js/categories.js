const categories = JSON.parse(localStorage.getItem("categories")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
const categoriesRow = document.querySelector("#categoriesRow");

let productsContainer = document.querySelector("#productsContainer .card-body");
let collapseEl = document.getElementById("productsContainer");
let bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

let activeCategory = null;

categories.forEach((category) => {
  categoriesRow.innerHTML += `
  <div class="col ">
  <div class='category  '>
  <img src="/assets/img/logo_category.webp" class="card-img-top" alt="Category">
   
  <p><button class=" mt-2 category-btn" data-name="${category.name}">
          ${category.name}
       </button></p>
<p class='desc'>${category.description}</p>
 
</div>
</div>
 
`;
});
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let categoryName = e.target.dataset.name;

    if (
      activeCategory === categoryName &&
      collapseEl.classList.contains("show")
    ) {
      bsCollapse.hide();
      activeCategory = null;
      return;
    }
    activeCategory = categoryName;

    let filteredProducts = products.filter((p) => p.category === categoryName);

    productsContainer.innerHTML = `
      <div class="row" id="productsRow"></div>
      <nav class="mt-3 d-flex justify-content-center" aria-label="Category pages">
      <ul id="pagination" class="pagination mb-0"></ul>
      </nav>`;
    let row = productsContainer.querySelector("#productsRow");

    if (filteredProducts.length > 0) {
      function getAverageRating(productId) {
        const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        const productReviews = reviews.filter((r) => r.product_id == productId);
        if (productReviews.length === 0) return { avg: 0, count: 0 };
        const sum = productReviews.reduce(
          (acc, r) => acc + Number(r.review),
          0
        );

        const avg = sum / productReviews.length;
        return { avg: Math.round(avg * 2) / 2, count: productReviews.length };
      }
      function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        let stars = "";
        for (let i = 0; i < fullStars; i++) stars += '<i class="fa fa-star star" style="color: gold;"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="fa fa-star star" ></i>';
        if (hasHalf) stars += '<i class="fa fa-star star" style="color: gold;"></i>';

        return stars;
      }

      // ------------------ Pagination ------------------
      const itemsPerPage = 8; // يعني صفين (4 أعمدة × 2 صف)
      let currentPage = 1;
      let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

      function renderPage(page) {
        row.innerHTML = "";
        let start = (page - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        let pageItems = filteredProducts.slice(start, end);

        pageItems.forEach((prod) => {
          const { avg: rating, count } = getAverageRating(prod.id);
          const stars = renderStars(rating);

          row.innerHTML += `
            <div class="col-md-3 mb-4">
              <div class="card h-100 shadow">
                <img src="${
                  prod.images && prod.images[0]
                    ? prod.images[0].startsWith("data:")
                      ? prod.images[0]
                      : "/assets/img/products/" + prod.images[0]
                    : "/assets/img/women.png"
                }" 
                class="card-img-top" alt="${prod.name}">
                <div class="card-body">
                  <a href="/pages/onepage-product.html?product=${
                    prod.id
                  }" class="text-dark link-offset-1-hover text-uppercase">
                    <h5 class="card-title">${prod.name}</h5>
                  </a>
                  <p class="card-text">${
                    prod.description.trim().split(/\s+/).slice(0, 5).join(" ") +
                    "..."
                  }</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="h5 mb-0">${prod.price}$</span>
                    <div>
                      ${stars}
                      <small class="text-muted">(${count})</small>
                    </div>
                  </div>
                </div>
                <div class="card-footer d-flex flex-column bg-light">
                  <div class="mb-2 p-2 text-center text-white fw-bold rounded 
                    ${prod.stock > 0 ? "bg-secondary" : "bg-danger"}">
                    ${
                      prod.stock > 0
                        ? `In Stock: ${prod.stock}`
                        : "Out of Stock"
                    }
                  </div>
                  <button class="btn btn-dark btn-sm w-100" 
                          onclick="addToCart(${prod.id}, ${prod.seller_id})" 
                          ${prod.stock === 0 ? "disabled" : ""}>
                      Add to Cart
                  </button>
                </div>
              </div>
            </div>
          `;
        });

        // ----- render Bootstrap pagination like your snippet -----
        const pagination = document.getElementById("pagination");

        // recompute total pages (in case filteredProducts changes)
        totalPages = Math.max(
          1,
          Math.ceil(filteredProducts.length / itemsPerPage)
        );

        // clamp currentPage
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        pagination.innerHTML = `
  <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
    <a class="page-link" href="#" data-page="${
      currentPage - 1
    }" aria-label="Previous">&laquo;</a>
  </li>
`;

        for (let i = 1; i <= totalPages; i++) {
          pagination.innerHTML += `
    <li class="page-item ${i === currentPage ? "active" : ""}">
      <a class="page-link" href="#" data-page="${i}">${i}</a>
    </li>
  `;
        }

        pagination.innerHTML += `
  <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
    <a class="page-link" href="#" data-page="${
      currentPage + 1
    }" aria-label="Next">&raquo;</a>
  </li>
`;

        // single delegated listener (avoids rebinding many handlers)
        pagination.onclick = (e) => {
          const link = e.target.closest("a.page-link");
          if (!link) return;
          e.preventDefault();

          const page = parseInt(link.dataset.page, 10);
          if (!Number.isFinite(page)) return;
          if (page < 1 || page > totalPages || page === currentPage) return;

          currentPage = page;
          renderPage(currentPage);
        };
      }

      renderPage(currentPage);
    } else {
      productsContainer.innerHTML = `<p class="text-muted">لا توجد منتجات لهذا القسم.</p>`;
    }

    bsCollapse.show();
    collapseEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

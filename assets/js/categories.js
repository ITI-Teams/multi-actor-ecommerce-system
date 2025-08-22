// ===== categories.js =====
document.addEventListener("DOMContentLoaded", () => {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const categoriesRow = document.querySelector("#categoriesRow");
  const productsContainer = document.querySelector("#productsContainer .card-body");
  const collapseEl = document.getElementById("productsContainer");
  const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

  let activeCategory = null;

  // خرائط مساعدة لربط الاسم بالـ id ودعم أنماط التخزين المختلفة
  const nameToId = new Map(categories.map(c => [String(c.name), String(c.id)]));
  const idsSet = new Set(categories.map(c => String(c.id)));

  // توليد كروت الفئات باستخدام data-id الصحيح
categoriesRow.innerHTML = categories.map(category => {
  let imgSrc;

  if (category.name.toLowerCase() === "men") {
    imgSrc = "/assets/img/men.jpeg";
  } else if (category.name.toLowerCase() === "woman" || category.name.toLowerCase() === "women") {
    imgSrc = "/assets/img/women.jpeg";
  } else {
    imgSrc = "/assets/img/logo_category.webp";
  }

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

  // دالة: استخرج id الفئة من كائن المنتج مهما كان اسم الحقل
  function getProductCategoryId(prod) {
    let v = prod.category_id ?? prod.categoryId ?? prod.category; // قد يكون اسم أو رقم
    if (v == null) return null;
    const s = String(v);
    if (idsSet.has(s)) return s;           // المنتج يحمل id مباشرة
    if (nameToId.has(s)) return nameToId.get(s); // المنتج يحمل اسم الفئة
    return null;                           // غير معروف
  }

  function getAverageRating(productId) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const productReviews = reviews.filter(r => r.product_id == productId);
    if (productReviews.length === 0) return { avg: 0, count: 0 };
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

function renderList(filteredProducts) {
  const productsContainer = document.getElementById("productsContainer");
  if (!productsContainer) {
    console.error("Element #productsContainer not found in DOM.");
    return;
  }

  if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) {
    productsContainer.innerHTML = `<p class="text-muted">There are no products in this category.</p>`;
    return;
  }

  const itemsPerPage = 8; // 4 أعمدة × صفّين
  let currentPage = 1;

  // small helper to escape text (optional but recommended)
  function escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderPage(page) {
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    // make currentPage reflect the page we're rendering
    currentPage = page;

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredProducts.slice(start, end);

    const rowHtml = pageItems.map(prod => {
      const { avg: rating = 0, count = 0 } = (typeof getAverageRating === "function") ? getAverageRating(prod.id) : { avg: 0, count: 0 };
      const stars = (typeof renderStars === "function") ? renderStars(rating) : "";
      const imgSrc = prod.images && prod.images[0]
        ? (prod.images[0].startsWith && prod.images[0].startsWith('data:') ? prod.images[0] : window.location.origin + '/assets/img/products/' + prod.images[0])
        : '/assets/img/women.png';

      return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card shadow h-100">
            <img src="${imgSrc}" class="card-img-top prodcut-img shadow-sm" alt="${escapeHtml(prod.name)}">
            <div class="card-body">
              <a href="/pages/onepage-product.html?product=${prod.id}" class="text-dark text-decoration-none text-uppercase">
                <h5 class="card-title mb-1">${escapeHtml(prod.name)}</h5>
              </a>
              <p class="card-text">${escapeHtml((prod.description || "").trim().split(/\s+/).slice(0, 5).join(' '))}...</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 mb-0">${escapeHtml(prod.price)}$</span>
                <div>
                  ${stars}
                  <small class="text-muted">(${count || 0})</small>
                </div>
              </div>
            </div>
            <div class="card-footer d-flex flex-column bg-light">
              <div class="mb-2 p-2 text-center text-white fw-bold rounded ${prod.stock > 0 ? 'bg-secondary' : 'bg-danger'}">
                ${prod.stock > 0 ? `In Stock: ${prod.stock}` : 'Out of Stock'}
              </div>
              <button class="btn btn-dark btn-sm w-100" onclick="addToCart(${prod.id}, ${prod.seller_id})" ${prod.stock === 0 ? 'disabled' : ''}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // build pagination html
    let paginationHtml = `
      <nav class="mt-3 d-flex justify-content-center" aria-label="Category pages">
        <ul id="pagination" class="pagination mb-0">
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">&laquo;</a>
          </li>
    `;
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
    paginationHtml += `
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">&raquo;</a>
          </li>
        </ul>
      </nav>
    `;

    // render everything inside productsContainer
    productsContainer.innerHTML = `<div class="row" id="productsRow">${rowHtml}</div>${paginationHtml}`;

    // attach one click handler to the generated pagination
    const pagination = productsContainer.querySelector("#pagination");
    if (pagination) {
      pagination.onclick = (e) => {
        const link = e.target.closest("a.page-link");
        if (!link) return;
        e.preventDefault();
        const newPage = parseInt(link.dataset.page, 10);
        if (!Number.isFinite(newPage)) return;
        if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
        renderPage(newPage);
      };
    }
  }

  // بدء العرض من الصفحة الأولى
  renderPage(1);
}

  // تفويض الحدث للأزرار (أقوى من إضافة مستمع لكل زر)
  categoriesRow.addEventListener("click", (e) => {
    const button = e.target.closest(".category-btn");
    if (!button) return;

    const categoryId = String(button.dataset.id);

    // إغلاق/فتح نفس الفئة
    if (activeCategory === categoryId && collapseEl.classList.contains("show")) {
      bsCollapse.hide();
      activeCategory = null;
      return;
    }
    activeCategory = categoryId;

    // فلترة صحيحة بالـ id مع دعم البيانات القديمة
    const filteredProducts = products.filter(p => getProductCategoryId(p) === categoryId);

    // Debug مفيد أثناء التطوير
    console.log("[Category click]", { categoryId, filteredCount: filteredProducts.length, totalProducts: products.length });

    renderList(filteredProducts);

    // إظهار و التمرير
    bsCollapse.show();
    collapseEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

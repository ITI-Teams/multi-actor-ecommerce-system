import productCard from "./include/productCard.js";

let filteredProducts = [];
const products = JSON.parse(localStorage.getItem("products")) || []; // get products from local storage
filteredProducts = [...products]; // create a copy

const urlParams = new URLSearchParams(location.search); // get query parameters from URL
const pageNumber = urlParams.get("page"); // get page number
const categoryParam = urlParams.get("category"); // get category from URL
const priceParam = urlParams.get("price");
const sizeParams = urlParams.get("size");
let productPage = pageNumber ? parseInt(pageNumber) : 1; // convert page number to integer set 1 if not found
const productsPerPage = 12; // set products per page

// Load categories dynamically
const categories = JSON.parse(localStorage.getItem("categories")) || [];
const categorySelect = document.getElementById("category");
categorySelect.innerHTML =
  '<option value="all">All</option>' +
  categories.map((c) => `<option value="${c.name}">${c.name}</option>`).join("");

// Filter by category
function filterByCategory(category, list) {
  if (!category || category === "all") return [...list];
  return list.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

// Filter by price
function filterByPrice(price, list) {
  if (!price || price === "all") return [...list];
  const [min, max] = price.split("-").map(Number);
  return list.filter(
    (product) => product.price >= min && product.price <= max
  );
}

// Filter by size
function filterBySize(size, list) {
  if (!size || size === "all") return list;
  return list.filter((product) => {
    if (Array.isArray(product.size)) {
      return product.size.map((s) => s.toLowerCase()).includes(size.toLowerCase());
    }
    return product.size.toLowerCase() === size.toLowerCase();
  });
}

// Update URL without reload
function updateUrlParams(params) {
  const newUrl = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value) newUrl.searchParams.set(key, value);
    else newUrl.searchParams.delete(key);
  });
  window.history.pushState({}, "", newUrl); // ✅ تحديث الرابط فقط بدون reload
}

// Render products
function renderProducts(productsToRender, container) {
  const containerWrapper = document.getElementById(container);
  containerWrapper.innerHTML = "";

  if (!productsToRender.length) {
    containerWrapper.innerHTML =
      '<p class="alert alert-danger fs-5 fw-semibold text-capitalize">No Products Found</p>';
    return;
  }

  // Pagination
  const totalFilteredProducts = productsToRender.length;
  const paginatedProducts = productsToRender.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  // Render products
  paginatedProducts.forEach((product) => {
    containerWrapper.innerHTML += productCard(product);
  });

  renderPagination(totalFilteredProducts, productPage);
}

// Render pagination
function renderPagination(totalProductsCount, currentPage) {
  const paginationCount = Math.ceil(totalProductsCount / productsPerPage);
  const paginationWrapper = document.getElementById("paginationWrapper");
  paginationWrapper.innerHTML = "";

  // Prev button
  paginationWrapper.innerHTML += `
    <li class="page-item">
      <button class="page-link ${currentPage === 1 && "disabled"}" ${currentPage === 1 ? "disabled" : ""} data-page="${
    currentPage - 1
  }" >&laquo;</button>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= paginationCount; i++) {
    paginationWrapper.innerHTML += `
      <li class="page-item">
        <button class="page-link ${currentPage === i ? "active text-white" : ""}" data-page="${i}">
          ${i}
        </button>
      </li>
    `;
  }

  // Next button
  paginationWrapper.innerHTML += `
    <li class="page-item">
      <button class="page-link ${currentPage === paginationCount && 'disabled'}" ${
        currentPage === paginationCount ? "disabled" : ""
      } data-page="${currentPage + 1}">&raquo;</button>
    </li>
  `;

  // Handle clicks
  paginationWrapper.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      productPage = parseInt(btn.dataset.page);
      updateUrlParams({ page: productPage });
      renderProducts(filteredProducts, "productsWrapper");
    });
  });
}

// ✅ Apply all filters together
function applyFilters() {
  const selectedCategory = document.getElementById("category").value || "all";
  const selectedPrice = document.getElementById("price").value || "all";
  const selectedSize = document.getElementById("size").value || "all";

  let temp = [...products];
  temp = filterByCategory(selectedCategory, temp);
  temp = filterByPrice(selectedPrice, temp);
  temp = filterBySize(selectedSize, temp);

  filteredProducts = temp;

  updateUrlParams({
    category: selectedCategory !== "all" ? selectedCategory : null,
    price: selectedPrice !== "all" ? selectedPrice : null,
    size: selectedSize !== "all" ? selectedSize : null,
    page: productPage,
  });

  renderProducts(filteredProducts, "productsWrapper");
}

window.addEventListener("load", () => {
  // اضبط dropdowns من URL لو موجودة
  if (categoryParam) document.getElementById("category").value = categoryParam;
  if (priceParam) document.getElementById("price").value = priceParam;
  if (sizeParams) document.getElementById("size").value = sizeParams;

  applyFilters();

  // Listen for changes
  document.getElementById("category").addEventListener("change", () => {
    productPage = 1;
    applyFilters();
  });

  document.getElementById("price").addEventListener("change", () => {
    productPage = 1;
    applyFilters();
  });

  document.getElementById("size").addEventListener("change", () => {
    productPage = 1;
    applyFilters();
  });
});

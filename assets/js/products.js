import prodcutCard from "./include/productCard.js";

let filteredProducts = [];
const products = JSON.parse(localStorage.getItem("products")) || []; // get products from local storage
filteredProducts = [...products]; // create a copy

const urlParams = new URLSearchParams(location.search); // get query parameters from URL
const pageNumber = urlParams.get("page"); // get page number
const categoryParam = urlParams.get("category"); // get category from URL
const priceParam = urlParams.get("price");
const sizeParams = urlParams.get("size");
const prodcutPage = pageNumber ? parseInt(pageNumber) : 1; // convert page number to integer set 1 if not found
const productsPerPage = 12; // set products per page

// Function to filter products by category
function filterByCategory(category) {
  if (!category || category === "all") {
    return [...products]; // return all products if no category selected
  }

  return products.filter((product) => product.category.startsWith(category));
}

// Function to update URL without reloading
function updateUrlParams(params) {
  const newUrl = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      newUrl.searchParams.set(key, value);
    } else {
      newUrl.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", newUrl);
  location.reload();
}

// Function to filter products by price
function filterByPrice(price, productsToFilter) {
  const myprice = price.split("-").map((e) => {
    return Number(e);
  });

  if (!price || price === "all") {
    return [...productsToFilter];
  } else {
    return productsToFilter.filter(
      (product) => product.price < myprice[1] && product.price > myprice[0]
    );
  }
}

// Function to filter products by size
function filterBySize(size, productsToFilter) {
  if (size === "all") {
    return productsToFilter;
  } else {
    return productsToFilter.filter((product) =>
      product.size.includes(size.toLowerCase())
    );
  }
}

function renderProducts(productsToRender, container) {
  const containerWrapper = document.getElementById(container);
  containerWrapper.innerHTML = "";

  if (!productsToRender.length) {
    containerWrapper.innerHTML =
      '<p class="alert alert-danger fs-5 fw-semibold text-capitalize">No Products Found With this category</p>';
    return;
  }

  // Calculate pagination for the current filtered products
  const totalFilteredProducts = productsToRender.length;
  const paginatedProducts = productsToRender.slice(
    (prodcutPage - 1) * productsPerPage,
    prodcutPage * productsPerPage
  );

  // Render products
  paginatedProducts.forEach((product) => {
    containerWrapper.innerHTML += prodcutCard(product);
  });

  renderPagination(totalFilteredProducts, prodcutPage);
}

function renderPagination(totalProductsCount, currentPage) {
  const paginationCount = Math.ceil(totalProductsCount / productsPerPage);
  const paginationWrapper = document.getElementById("paginationWrapper");
  paginationWrapper.innerHTML = "";

  // Add Prev button
  paginationWrapper.innerHTML += `
    <li class="page-item">
      <a class="page-link ${currentPage === 1 ? "disabled" : ""}" 
         href="/pages/products.html?${getCurrentQueryString({
           page: currentPage - 1,
         })}">
         Prev
      </a>
    </li>
  `;

  // Add page numbers
  for (let i = 1; i <= paginationCount; i++) {
    paginationWrapper.innerHTML += `
      <li class="page-item">
        <a class="page-link ${
          currentPage === i ? "active disabled text-white" : ""
        }" 
           href="/pages/products.html?${getCurrentQueryString({ page: i })}">
           ${i}
        </a>
      </li>
    `;
  }

  // Add Next button
  paginationWrapper.innerHTML += `
    <li class="page-item">
      <a class="page-link ${currentPage === paginationCount ? "disabled" : ""}" 
         href="/pages/products.html?${getCurrentQueryString({
           page: currentPage + 1,
         })}">
         Next
      </a>
    </li>
  `;
}

// Helper function to maintain current query parameters
function getCurrentQueryString(updates = {}) {
  const params = new URLSearchParams(window.location.search);
  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  return params.toString();
}

window.addEventListener("load", () => {
  // Apply filters in sequence
  filteredProducts = [...products];
  // Apply initial params filter if present in URL
  if (categoryParam) {
    filteredProducts = filterByCategory(categoryParam);
    document.getElementById("category").value = categoryParam;
  }
  if (priceParam) {
    filteredProducts = filterByPrice(priceParam, filteredProducts);
    document.getElementById("price").value = priceParam;
  }
  if (sizeParams) {
    filteredProducts = filterBySize(sizeParams, filteredProducts);
    document.getElementById("size").value = sizeParams;
  }

  renderProducts(filteredProducts, "productsWrapper");

  // Handle category dropdown change
  const selectCategory = document.getElementById("category");
  selectCategory.addEventListener("change", function () {
    const selectedCategory = this.value;

    // Update URL with new category
    updateUrlParams({
      category: selectedCategory !== "all" ? selectedCategory : null,
      size: null,
      price: null,
      page: 1, // Reset to first page when changing category
    });

    // Filter products
    filteredProducts = filterByCategory(selectedCategory);

    // Render products with new filter
    renderProducts(filteredProducts, "productsWrapper");
  });

  // Handle size dropdown change
  const selectPrice = document.getElementById("price");
  selectPrice.addEventListener("change", function () {
    const selectedPrice = this.value;
    let tempProducts = filterByCategory(categoryParam || "all");
    tempProducts = filterByPrice(selectedPrice, tempProducts);
    updateUrlParams({
      category: categoryParam,
      size: sizeParams,
      price: selectedPrice !== "all" ? selectedPrice : null,
      page: 1, // Reset to first page when changing price
    });
    filteredProducts = tempProducts;
    renderProducts(filteredProducts, "productsWrapper");
  });

  // Handle size dropdown change
  const selectSize = document.getElementById("size");
  selectSize.addEventListener("change", function () {
    const selectedSize = this.value;
    let tempProducts = filterByCategory(categoryParam || "all");
    tempProducts = filterByPrice(priceParam || "all", tempProducts);
    tempProducts = filterBySize(selectedSize, tempProducts);
    updateUrlParams({
      category: categoryParam,
      price: priceParam,
      size: selectedSize !== "all" ? selectedSize : null,
      page: 1,
    });
  });
});

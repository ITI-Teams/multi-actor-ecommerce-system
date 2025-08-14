const productContainer = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.querySelector('.pagination');
let products = [];
let filteredProducts = [];
let currentPage = 1;

// Fetch products
async function fetchProducts() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=200');
    const data = await res.json();
    products = data.products;
    filteredProducts = [...products];
    displayProducts();
    setupPagination();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Display products for current page
function displayProducts() {
  productContainer.innerHTML = '';
  const start = (currentPage - 1) * 12;
  const end = start + 12;
  const items = filteredProducts.slice(start, end);

  if (items.length === 0) {
    productContainer.innerHTML = '<p class="text-center text-muted">No products found.</p>';
    return;
  }

  items.forEach(product => {
    const col = document.createElement('div');
    col.className = 'product col-md-4 col-lg-3 mb-4';
    col.innerHTML = `
      <a href="#" class="text-decoration-none">
        <div class="card h-100 shadow-sm">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text text-truncate">${product.description}</p>
            <p class="fw-bold">$${product.price}</p>
          </div>
        </div>
      </a>
    `;
    productContainer.appendChild(col);
  });
}

// Setup pagination buttons
function setupPagination() {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(filteredProducts.length / 12);

  // Prev button
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevLi.innerHTML = `<a class="page-link text-dark" href="#">&laquo;</a>`;
  prevLi.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayProducts();
      setupPagination();
    }
  });
  paginationContainer.appendChild(prevLi);

  // Numbered pages
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${currentPage === i ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link text-dark" href="#">${i}</a>`;
    li.addEventListener('click', () => {
      currentPage = i;
      displayProducts();
      setupPagination();
    });
    paginationContainer.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextLi.innerHTML = `<a class="page-link text-dark" href="#">&raquo;</a>`;
  nextLi.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayProducts();
      setupPagination();
    }
  });
  paginationContainer.appendChild(nextLi);
}

// Search filter
searchInput.addEventListener('input', () => {
  const search = searchInput.value.toLowerCase();
  filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search) || 
    p.description.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search)
  );
  currentPage = 1;
  displayProducts();
  setupPagination();
});

fetchProducts();


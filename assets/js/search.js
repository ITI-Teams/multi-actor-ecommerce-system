let products = JSON.parse(localStorage.getItem("products")) || [];
let filteredProducts = [...products];
let currentPage = 1;
const rowsPerPage = 12;

const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);


const urlParams = new URLSearchParams(location.search);
const searchQuery = urlParams.get("search");
if (searchQuery) {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = searchQuery;
    filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    currentPage = 1;
    displayTable();
} else {
    filteredProducts = [...products]; 
    displayTable();
}



document.getElementById("searchInput").addEventListener("input", function (e) {
    const term = e.target.value.toLowerCase();

    if (term) {
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );
    } else {
        filteredProducts = [...products];
    }

    currentPage = 1; 
    displayTable();
});
function getAverageRating(productId) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const productReviews = reviews.filter(r => r.product_id == productId);
  
  if (productReviews.length === 0) return { avg: 0, count: 0 };

  const avg = productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / productReviews.length;
  return { avg: Math.round(avg * 2) / 2, count: productReviews.length }; 
}
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '<i class="bi bi-star-fill text-warning"></i>';
  if (hasHalf) stars += '<i class="bi bi-star-half text-warning"></i>';
  for (let i = 0; i < emptyStars; i++) stars += '<i class="bi bi-star text-secondary"></i>';

  return stars;
}
// دالة عرض الجدول مع pagination
function displayTable() {
    const Container = document.getElementById("productContainer");
    Container.innerHTML = "";     
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = filteredProducts.slice(start, end);
    console.log(pageItems);
    

    pageItems.forEach(product => {
      const { avg: rating, count } = getAverageRating(product.id);
      const stars = renderStars(rating);
      Container.innerHTML += `
              <div class="card" style="max-width: 320px;margin: 3px">
                <img src="${product.images && product.images[0] ? (product.images[0].startsWith('data:') ? product.images[0] : '/assets/img/products/' + product.images[0]) : '/assets/img/women.png'}" 
                class="card-img-top prodcut-img" alt="${product.name}">
                <div class="card-body">
                    <a href="/pages/onepage-product.html?product=${product.id}" class="text-dark link-offset-1-hover text-uppercase">
                        <h5 class="card-title">${product.name}</h5>
                    </a>
                    <p class="card-text">${product.description.trim().split(/\s+/).slice(0, 5).join(' ') + '...'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0">${product.price}$</span>
                        <div>
                            ${stars}
                            <small class="text-muted">(${product.count || 0})</small>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex flex-column bg-light">
                    <div class="mb-2 p-2 text-center text-white fw-bold rounded 
                        ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                        ${product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </div>
                    <button class="btn btn-primary btn-sm w-100" 
                            onclick="addToCart(${product.id}, ${product.seller_id})" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

    });

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
        </li>
    `;
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
        </li>
    `;
    document.querySelectorAll("#pagination a").forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const page = parseInt(a.dataset.page);
            if (page > 0 && page <= totalPages) {
                currentPage = page;
                displayTable(currentPage);
                renderPagination();
            }
        });
    });
}
renderPagination();
displayTable();

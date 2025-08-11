
    const productContainer = document.getElementById('productContainer');
    const searchInput = document.getElementById('searchInput');
    let products = [];

    async function fetchProducts() {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=200');
        const data = await res.json();
        products = data.products;
        displayProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    // products
    function displayProducts(items) {
      productContainer.innerHTML = '';
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
          </div></a>
        `;
        productContainer.appendChild(col);
      });
    }

 
    searchInput.addEventListener('input', () => {
      const search = searchInput.value.toLowerCase();
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
      displayProducts(filtered);
    });
    
    fetchProducts();
  
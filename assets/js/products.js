let filteredProducts = [];
const products = JSON.parse(localStorage.getItem("products")); // get products from local storage
filteredProducts = products.filter((prodcut) => {
  return prodcut.category.includes("men") || prodcut.category.includes("women");
}); // filter products by category men and women

const totalProductsCount = filteredProducts.length;

const urlParams = new URLSearchParams(location.search); // get query parameters from URL
const pageNumber = urlParams.get("page"); // get page number from query parameters
const prodcutPage = pageNumber ? parseInt(pageNumber) : 1; // convert page number to integer set 1 if not found
const productsPerPage = 12; // set products per page
filteredProducts = filteredProducts.slice(
  (prodcutPage - 1) * productsPerPage,
  prodcutPage * productsPerPage
); // slice filtered products to get products for current page

window.addEventListener("load", () => {
  filteredProducts.forEach(({ thumbnail, title, price, images, id }) => {
    const productsWrapper = document.getElementById("productsWrapper");
    productsWrapper.innerHTML += `<div>
          <div class="img-container position-relative">
              <a href="/pages/onepage-product.html?product=${id}" class="text-dark link-offset-1-hover text-uppercase" ><img class="prodcut-img bg-secondary-subtle mb-2 primary-img" 
              src="${thumbnail}" 
              alt="${title}"
              data-original="${thumbnail}"
              data-hover="${images[1] || images[0]}"
              onmouseover="this.src=this.dataset.hover" onmouseout="this.src=this.dataset.original">
            </div>
          ${title.slice(
            0,
            10
          )}</a>
          <p>${price}$</p>
          </div>`;
  }); // create product elements and append to products wrapper


  const paginationCount = Math.ceil((totalProductsCount / 12)); // calculate pagination count
  
  const paginationWrapper = document.getElementById("paginationWrapper");
  paginationWrapper.innerHTML += `
            <li class="page-item">
                <a class="page-link ${prodcutPage === 1 && 'disabled'}" href="/pages/products.html?page=${prodcutPage - 1}">Prev</a>
            </li>
    `; // add prev button to pagination
  for (i = 1; i <= paginationCount; i++) {
    paginationWrapper.innerHTML += `
    <li class="page-item">
        <a class="page-link ${prodcutPage === i && 'active disabled text-white'} " href="/pages/products.html?page=${i}">${i}</a>
        </li>
    `; // create pagination links
  }


  paginationWrapper.innerHTML += `
            <li class="page-item">
                <a class="page-link ${prodcutPage === paginationCount && 'disabled'}" href="/pages/products.html?page=${prodcutPage + 1}">Next</a>
            </li>
    `; // add next button to pagination
});

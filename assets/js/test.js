const url = "https://dummyjson.com/products?limit=200"; // get 194 products
fetch(url)
  .then((res) => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then((data) => {
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(data.products)); // set the products in local storage
    }
  })
  .catch((error) => console.error("Error:", error));
window.addEventListener("load", () => {
  const products = localStorage.getItem("products");
  if (products) {
    const productsArray = JSON.parse(products);
    let index = 0;
    let index2 = 0;

    productsArray.forEach(({ thumbnail, title, price, category, rating, images, id }) => {
      if (category.includes("men") || category.includes("women")) {
        // if the category is men or women
        if (index < 10) {
          // get 10 products only
          ++index;
          // adding product to new arrivals section
          const newArrivlesWrapper =
            document.getElementById("newArrivlesWrapper");
            if (newArrivlesWrapper) {
          newArrivlesWrapper.innerHTML += `<div>
          <div class="img-container position-relative">
            <a href="/pages/onepage-product.html?product=${id}" class="text-dark link-offset-1-hover text-uppercase" >
              <img class="prodcut-img bg-secondary-subtle mb-2 primary-img" 
              src="${thumbnail}" 
              alt="${title}"
              data-original="${thumbnail}"
              data-hover="${images[1] || images[0]}"
              onmouseover="this.src=this.dataset.hover" onmouseout="this.src=this.dataset.original">
            </div>
            ${title}</a>
          <p>${price}$</p>
          </div>`;
        }
        }

        // adding products to best seller section
        if (rating > 4 && index2 < 12) { // getting the products with rating > 4 and 12 products only
          ++index2
          const bestSellerProductsWrapper = document.getElementById("bestSellerProductsWrapper");
          if (bestSellerProductsWrapper) {
          bestSellerProductsWrapper.innerHTML += `
          <div class="d-flex flex-column mt-3">
          <div class="img-container position-relative">
          <a href="/pages/onepage-product.html?product=${id}" class=" text-dark link-offset-1-hover text-uppercase" >
              <img class="prodcut-img bg-secondary-subtle mb-2 primary-img" 
              src="${thumbnail}" 
              alt="${title}"
              data-original="${thumbnail}"
              data-hover="${images[1] || images[0]}"
              onmouseover="this.src=this.dataset.hover" onmouseout="this.src=this.dataset.original">
            </div>
            ${title}</a>
            <p>${price}$</p>
          </div>`;
        }}
      }
    });
  }
});

import productCard from "./include/productCard.js";

window.addEventListener("load", () => {
  const products = localStorage.getItem("products");
  if (products) {

    const productsArray = JSON.parse(products);
    let index = 0;
    let index2 = 0;

    productsArray.forEach((product) => {

      // if the category is men or women
      if (index < 10) {
        // get 10 products only
        ++index;
        // adding product to new arrivals section
        const newArrivlesWrapper =
          document.getElementById("newArrivlesWrapper");
        if (newArrivlesWrapper) {
          newArrivlesWrapper.innerHTML += productCard(product);
        }
      }

      // adding products to best seller section
      if (product.reviews > 4 && index2 < 12) { // getting the products with rating > 4 and 12 products only
        ++index2
        const bestSellerProductsWrapper = document.getElementById("bestSellerProductsWrapper");
        if (bestSellerProductsWrapper) {
          bestSellerProductsWrapper.innerHTML += productCard(product);
        }
      }
    });
  }
});

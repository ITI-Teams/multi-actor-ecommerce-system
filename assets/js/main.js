import footer_content from "./include/footer.js";
import nav_content from "./include/header.js";
import productCard from "./include/productCard.js";

const main_header = document.getElementById("main-header");
const main_footer = document.getElementById("main-footer");
main_header.innerHTML = nav_content;
main_footer.innerHTML = footer_content;


window.addEventListener("load", () => {
    const products = localStorage.getItem("products");
    if (products) {

        const productsArray = JSON.parse(products);
        let index = 0;
        let index2 = 0;

        const newArrivalsArr = productsArray.reverse();
        newArrivalsArr.forEach((product) => {
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

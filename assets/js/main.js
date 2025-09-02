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
            initNewArrivalsCarousel();

            // adding products to best seller section
            if (product.reviews > 4 && index2 < 12) {
                // getting the products with rating > 4 and 12 products only
                ++index2;
                const bestSellerProductsWrapper = document.getElementById(
                    "bestSellerProductsWrapper"
                );
                if (bestSellerProductsWrapper) {
                    bestSellerProductsWrapper.innerHTML += productCard(product);
                }
            }
        });
    }
});

function initNewArrivalsCarousel() {
    const newArrivlesWrapper =
        document.getElementById("newArrivlesWrapper");
    if (!newArrivlesWrapper) return;

    const prevBtn = document.querySelector(".na-carousel .na-prev");
    const nextBtn = document.querySelector(".na-carousel .na-next");

    const isMobile = () => window.matchMedia("(max-width: 767.98px)").matches;

    function scrollByViewport(dir = 1) {
        if (!isMobile()) return;
        const amount = newArrivlesWrapper.clientWidth * 0.9;
        newArrivlesWrapper.scrollBy({ left: dir * amount, behavior: "smooth" });
    }

    prevBtn?.addEventListener("click", () => scrollByViewport(-1));
    nextBtn?.addEventListener("click", () => scrollByViewport(1));

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isMobile()) return;
            const children = Array.from(newArrivlesWrapper.children);
            if (!children.length) return;
            const first = children[0].getBoundingClientRect().left;
        }, 150);
    });
}

// Loading screen functionality
document.addEventListener("DOMContentLoaded", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const loadingText = document.querySelector(".loading-text");
    const texts = [
        "Selecting the latest trends...",
        "Preparing your personalized collection...",
        "Almost ready...",
        "Welcome to Trendora!",
    ];

    let index = 0;
    const textInterval = setInterval(() => {
        if (index < texts.length) {
            loadingText.textContent = texts[index];
            index++;
        } else {
            clearInterval(textInterval);
        }
    }, 900);

    let resourcesLoaded = false;
    let minDisplayTimeReached = false;
    setTimeout(() => {
        minDisplayTimeReached = true;
        hideLoadingScreenIfReady();
    }, 1000);

    window.addEventListener("load", () => {
        resourcesLoaded = true;
        hideLoadingScreenIfReady();
    });

    function hideLoadingScreenIfReady() {
        if (resourcesLoaded && minDisplayTimeReached) {
            document.body.classList.add("loaded");
            loadingScreen.style.opacity = "0";
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 500);
        }
    }

    setTimeout(hideLoadingScreenIfReady, 1500);
});

window.addEventListener("load", () => {
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

  const products = localStorage.getItem("products");
  if (products) {
    const productsArray = JSON.parse(products);
    let index = 0;

    productsArray.forEach(({ thumbnail, title, price, category, rating }) => {
      if (category.includes("men") || category.includes("women")) {
        // if the category is men or women
        if (index < 10) {
          // get 10 products only
          ++index;
          // adding product to new arrivals section
          const newArrivlesWrapper =
            document.getElementById("newArrivlesWrapper");
          newArrivlesWrapper.innerHTML += `<div>
          <img class="prodcut-img bg-secondary-subtle mb-2" src="${thumbnail}" alt="${title}">
          <a href="/" class="text-dark link-offset-1-hover text-uppercase" >${title}</a>
          <p>${price}$</p>
          </div>`;
        }

        // adding products to best seller section
        if (rating > 4) {
          const bestSellerProductsWrapper = document.getElementById(
            "bestSellerProductsWrapper"
          );
          bestSellerProductsWrapper.innerHTML += `<div class="col d-flex flex-column mt-3">
          <img class="prodcut-img bg-secondary-subtle mb-2" src="${thumbnail}" alt="${title}">
          <a href="/" class=" text-dark link-offset-1-hover text-uppercase" >${title}</a>
          <p>${price}$</p>
          </div>`;
        }
      }
    });
  }
});

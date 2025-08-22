import prodcutCard from "./include/productCard.js";

const productIdParams = new URLSearchParams(location.search).get("product");
if (!productIdParams) {
    location.pathname = "/";
}



/* ----------------------------
   Product Details + Reviews
----------------------------- */
const products = JSON.parse(localStorage.getItem("products")) || [];
const product = products.find((p) => p.id == productIdParams);

if (!product) {
    const mainWrapper = document.getElementById("mainWrapper");
    mainWrapper.innerHTML = `
        <div class="text-center py-5 my-5 w-50 mx-auto">
            <p class="alert alert-danger fs-6 fw-semibold text-capitalize">No Product Found!</p>
        </div>
    `;
} else {
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const productReviews = allReviews.filter((r) => r.product_id == product.id);

    let avgRating = 0;
    if (productReviews.length > 0) {
        const sum = productReviews.reduce(
            (acc, r) => acc + Number(r.review),
            0
        );
        avgRating = sum / productReviews.length;
    }

    document.getElementById("ratingValue").textContent =
        avgRating.toFixed(1) + " / 5";

    document.getElementById("product-reviews").textContent =
        productReviews.length > 0
            ? productReviews.length + " Reviews"
            : "No Reviews Yet";

    const ratingStars = document.querySelectorAll("#ratingStars .star");
    ratingStars.forEach((star) => {
        const value = parseInt(star.getAttribute("data-value"));
        if (value <= Math.round(avgRating)) {
            star.style.color = "gold";
        } else {
            star.style.color = "#ccc";
        }
    });

    document.getElementById("product-title").textContent = product.name;
    document.getElementById("product-price").textContent =
        "$" + product.price;
    document.getElementById("product-description").textContent =
        product.description;

    document.getElementById("main-Img").src =
        product.images[0].startsWith("data:")
            ? product.images[0]
            : "/assets/img/products/" + product.images[0];

    const thumbsWrapper = document.getElementById("thumbsWrapper");
    thumbsWrapper.innerHTML = "";
    product.images.forEach((image, index) => {
        const thumb = document.createElement("img");
        thumb.classList.add("thumb");
        const imgSrc = image.startsWith("data:") ? image : "/assets/img/products/" + image;
        thumb.src = imgSrc;
        thumb.dataset.src = imgSrc;
        thumb.alt = "thumb" + (index + 1);
        thumbsWrapper.appendChild(thumb);
    });

    document.querySelectorAll(".thumb").forEach((t) => {
        t.addEventListener("click", function () {
            document
                .querySelectorAll(".thumb")
                .forEach((x) => x.classList.remove("active"));
            this.classList.add("active");
            const src = this.dataset.src || this.src;
            const main = document.getElementById("main-Img");
            main.style.opacity = 0;
            setTimeout(() => {
                main.src = src;
                main.style.opacity = 1;
            }, 150);
        });
    });

    const productSizeWrapper = document.getElementById("product-size");
    const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
    productSizeWrapper.innerHTML = "";

    sizes.forEach((size) => {
        const button = document.createElement("button");
        button.classList = "size-btn text-uppercase";
        button.textContent = size;
        if (!product.size.includes(size)) {
            button.disabled = true;
            button.classList.add("disabled");
        }
        productSizeWrapper.appendChild(button);
    });

    const addtocartBtn = document.getElementById("addtocartBtn");
    document.querySelectorAll(".size-btn").forEach((b) => {
        if (b.classList.contains("disabled")) return;
        b.addEventListener("click", function () {
            document
                .querySelectorAll(".size-btn")
                .forEach((x) => x.classList.remove("selected"));
            this.classList.add("selected");
            addtocartBtn.disabled = false;
        });
    });
    /* ----------------------------
    Color Selection (highlight only)
    ----------------------------- */
    const productColor = document.getElementById("color-swatches");
    productColor.innerHTML = "";
    product.color.forEach((color) => {
        productColor.innerHTML += `
            <div class="swatch" data-color="${color}" title="${color}" style="background: ${color}"></div>
            `;
    });
    document.querySelectorAll(".swatch").forEach((s) => {
        s.addEventListener("click", function () {
            document.querySelectorAll(".swatch").forEach((x) =>
                x.classList.remove("selected")
            );
            this.classList.add("selected");
        });
    });

    // منتجات مرتبطة (بنفس الكاتيجوري)
    const relatedProductsWrapper =
        document.getElementById("relatedProductsWrapper");
    const relatedProducts = products.reverse().filter(
        (p) => Number(p.category) === Number(product.category) && p.id !== product.id
    ).slice(0, 12);
    relatedProductsWrapper.innerHTML = "";
    relatedProducts.forEach((p) => {
        relatedProductsWrapper.innerHTML += prodcutCard(p);
    });
}
document.getElementById('addtocartBtn').addEventListener('click', function () {
    const customerId = localStorage.getItem("customerSession");
    if (!customerId) {
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existing = guestCart.find(c => c.product_id == product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            const newCart = {
                id: guestCart.length ? Math.max(...carts.map(c => c.id)) + 1 : 1,
                product_id: product.id,
                seller_id: product.seller_id,
                quantity: 1
            };
            guestCart.push(newCart);
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        showFormMessage("The product has been added to the cart!");
        updateCartBadge();
    } else {
        const carts = JSON.parse(localStorage.getItem("carts")) || [];
        const existing = carts.find(c => c.product_id == product.id && c.customer_id == customerId);
        if (existing) {
            existing.quantity += 1;
        } else {
            const newCart = {
                id: carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1,
                customer_id: customerId,
                product_id: product.id,
                seller_id: product.seller_id,
                quantity: 1
            };
            carts.push(newCart);
        }
        localStorage.setItem("carts", JSON.stringify(carts));
        showFormMessage("The product has been added to the cart!");
        updateCartBadge();
    }

});
const mainImg = document.getElementById("main-Img");
const lens = document.createElement("div");
lens.classList.add("lens");
mainImg.parentElement.style.position = "relative";
mainImg.parentElement.appendChild(lens);

mainImg.addEventListener("mousemove", moveLens);
lens.addEventListener("mousemove", moveLens);
mainImg.addEventListener("mouseleave", () => {
    lens.style.display = "none";
});
mainImg.addEventListener("mouseenter", () => {
    lens.style.display = "block";
});

function moveLens(e) {
    const rect = mainImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = lens.offsetWidth / 2;

    let lensX = x - lensSize;
    let lensY = y - lensSize;

    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > rect.width - lens.offsetWidth) lensX = rect.width - lens.offsetWidth;
    if (lensY > rect.height - lens.offsetHeight) lensY = rect.height - lens.offsetHeight;

    lens.style.left = lensX + "px";
    lens.style.top = lensY + "px";

    lens.style.backgroundImage = `url(${mainImg.src})`;
    lens.style.backgroundSize = rect.width * 2 + "px " + rect.height * 2 + "px";
    lens.style.backgroundPosition = `-${x * 2 - lensSize}px -${y * 2 - lensSize}px`;
}
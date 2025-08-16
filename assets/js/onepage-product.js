import prodcutCard from "./include/productCard.js";

const productIdParams = new URLSearchParams(location.search).get('product');
if (!productIdParams) {
    // redirect to home page
    const newUrl = new URL(location);
    location.pathname = '/';
    history.push(newUrl);
}


// color selection (highlight only)
document.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', function () {
        document.querySelectorAll('.swatch').forEach(x => x.classList.remove('selected'));
        this.classList.add('selected');
    })
})


// Rating Logic
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
let currentRating = 0;

// Handle mouse hover
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const value = parseInt(star.dataset.value);
        highlightStars(value);
    });

    star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });

    // Handle click (selection)
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.value);
        highlightStars(currentRating);
        ratingValue.textContent = `${currentRating} / 5`;
    });

    // Mobile tap simulation (touch)
    star.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click delay
        const value = parseInt(star.dataset.value);
        currentRating = value;
        highlightStars(currentRating);
        ratingValue.textContent = `${currentRating} / 5`;
    });
});

function highlightStars(rating) {
    stars.forEach(star => {
        star.classList.toggle('selected', parseInt(star.dataset.value) <= rating);
    });
}

window.addEventListener('load', () => {
    const products = localStorage.getItem('products');
    if (products) {
        const parsedProducts = JSON.parse(products);
        const product = parsedProducts.filter(product => product.id == productIdParams)[0]
        console.log(product);

        if (!product) {
            const mainWrapper = document.getElementById('mainWrapper');
            mainWrapper.innerHTML = '';
            const div = document.createElement('div');
            div.className = 'text-center py-5 my-5 w-50 mx-auto';
            div.innerHTML = '<p class="alert alert-danger fs-6 fw-semibold text-capitalize">No Product Found!</p>';
            mainWrapper.append(div);
        }
        // handle product data to the page
        document.getElementById('product-title').innerHTML = product.name;
        document.getElementById('product-price').innerHTML = '$' + product.price;
        document.getElementById('product-description').innerHTML = product.description;
        document.getElementById('product-reviews').innerHTML = product.reviews + ' Reviews';
        document.getElementById('main-Img').src = '/assets/img/' + product.images[0];
        const thumbsWrapper = document.getElementById('thumbsWrapper');
        product.images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.classList.add('thumb');
            thumb.src = '/assets/img/' + image;
            thumb.dataset.src = '/assets/img/' + image;
            thumb.alt = 'thumb' + ++index;

            thumbsWrapper.innerHTML += thumb.outerHTML;
        })

        // thumbnail -> main image
        document.querySelectorAll('.thumb').forEach(t => {
            t.addEventListener('click', function () {
                document.querySelectorAll('.thumb').forEach(x => x.classList.remove('active'));
                this.classList.add('active');
                const src = this.dataset.src || this.src;
                const main = document.getElementById('main-Img');
                // smooth fade
                main.style.opacity = 0; setTimeout(() => { main.src = src; main.style.opacity = 1 }, 150);
            })
        })

        // sizes
        const productSizeWrapper = document.getElementById('product-size');
        const sizes = ['S', 'M', 'L', 'XL']

        productSizeWrapper.innerHTML = '';
        sizes.forEach(size => {
            const button = document.createElement('button');
            button.classList = 'size-btn text-uppercase';
            button.textContent = size.toUpperCase();
            if (!product.size.includes(size)) {
                button.disabled = 'true';
                button.classList.add('disabled');
            }
            productSizeWrapper.appendChild(button);
        });

        // sizes
        const addtocartBtn = document.getElementById('addtocartBtn')
        addtocartBtn.addEventListener('click', function () {
            let Carts = localStorage.getItem('carts');
            Carts = JSON.parse(Carts);
            const lastcartid = Carts[Carts.length - 1].id
            const newcartid = lastcartid + 1;
            const newcart = {
                id: newcartid,
                customer_id: 1,
                seller_id: 1,
                product_id: product.id,
                quantity: 1,
            }
            Carts.push(newcart);
            localStorage.setItem('carts', JSON.stringify(Carts));
            alert('Product added to cart')
        })
        document.querySelectorAll('.size-btn').forEach(b => {
            if (b.classList.contains('disabled')) return;
            b.addEventListener('click', function () {
                document.querySelectorAll('.size-btn').forEach(x => x.classList.remove('selected'));
                this.classList.add('selected');
                addtocartBtn.disabled = false;
            })
        })

        // add to related wrapper the products filtered by category of the product without the product itself
        const productCategory = product.category;
        const relatedProductsWrapper = document.getElementById('relatedProductsWrapper');
        const relatedProducts = JSON.parse(products).filter(p => p.category === productCategory && p.id !== product.id);
        relatedProducts.forEach(product => {
            relatedProductsWrapper.innerHTML += prodcutCard(product);
        });
    }
})
function addToCart(productId, sellerId, customerId = localStorage.getItem("customerSession")) {
    if (!customerId) {
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existing = guestCart.find(item => item.product_id === productId);
        
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products.find(item => item.id === productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            const newProduct = {
                id: guestCart.length ? Math.max(...guestCart.map(c => c.id)) + 1 : 1,
                product_id: productId,
                seller_id: sellerId,
                quantity: 1
            };
            guestCart.push(newProduct);
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        updateCartBadge(); 
        return;
    }
    const carts = JSON.parse(localStorage.getItem("carts")) || [];
    const existing = carts.find(c => c.product_id == productId && c.customer_id == customerId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const newCart = {
            id: carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1,
            customer_id: customerId,
            product_id: productId,
            seller_id: sellerId,
            quantity: 1
        };
        carts.push(newCart);
    }
    localStorage.setItem("carts", JSON.stringify(carts));
    showFormMessage("The product has been added to the cart!");
    updateCartBadge(); 
}

function updateCartBadge() {
    const customerId = localStorage.getItem("customerSession");
    if (!customerId) {
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const count = guestCart.filter(c => c.customer_id == customerId).reduce((sum, c) => sum + c.quantity, 0);
        const badge = document.getElementById('CartCount');
        if (badge) badge.textContent = count;
        return;
    }

    const carts = JSON.parse(localStorage.getItem("carts")) || [];
    const count = carts.filter(c => c.customer_id == customerId).reduce((sum, c) => sum + c.quantity, 0);
    const badge = document.getElementById('CartCount');
    if (badge) badge.textContent = count;
}
window.updateCartBadge = updateCartBadge;
function showFormMessage(message, type = "success") {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = `
        <div class="alert alert-${type} d-flex align-items-center" role="alert" >
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
            <div>
                ${message}
            </div>
        </div>
    `;
    msgDiv.style.display = "block";
    setTimeout(() => {
        msgDiv.style.display = "none";
    }, 2000);
}



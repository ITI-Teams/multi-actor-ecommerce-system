let close = document.getElementById('CloseCart');
close.addEventListener('click', () => {
    let cartBox = document.querySelector('body > main > div');
    cartBox.classList.add('fade-out');
    setTimeout(() => {
        cartBox.remove();
        if (window.history.length > 1) {
            history.back();
        } else {
            location.href = '../index.html';
        }
    }, 500);  
});

const currentSession = localStorage.getItem("customerSession");
if (!currentSession) {
  let guestCarts = JSON.parse(localStorage.getItem("guestCart")) || [];
  let guestCart = guestCarts.filter(guestCart => guestCart.customer_id == currentSession);
  let products = JSON.parse(localStorage.getItem("products")) || [];
  const cartList = document.getElementById('cart-list');
  function renderguestCart() {
    cartList.innerHTML = '';
    guestCart.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) return;
      const imgStr = String(
        product?.images?.src || 
        (Array.isArray(product?.images) ? product.images[0] : product?.images) || ''
      ).trim();

      const finalSrc = (/^data:|^https?:\/\/|^\/\//i.test(imgStr))
        ? imgStr
        : (imgStr
            ? `/assets/img/products/${imgStr}`
            : '/assets/img/products/women.png');
      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${finalSrc}" class="card-img-top" alt="${escapeHtml(product.name)}">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title mb-1">${escapeHtml(product.name)}</h6>
            <div class="input-group">
              <input type="number" min="1" value="${item.quantity}" data-id="${item.id}"
                class="form-control form-control-sm item-qty">
              <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">
                Remove
              </button>
            </div>
          </div>
          <div class="card-footer text-end fw-bold">
            $${(product.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
      cartList.appendChild(col);
    });
    updateguestCartTotals();
    updateguestCartBadge();
  }

  cartList.addEventListener('input', (e) => {
      if (e.target.classList.contains('item-qty')) {
          const id = Number(e.target.dataset.id);
          const qty = Math.max(1, Number(e.target.value) || 1);
          const it = guestCart.find(i => i.id === id);
          if (it) it.quantity = qty;
          guestCarts = guestCarts.map(c => c.id === id ? { ...c, quantity: qty } : c);
          localStorage.setItem("guestCart", JSON.stringify(guestCart));

          renderguestCart(); 
      }
  });

  cartList.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        const id = Number(e.target.dataset.id);
        guestCart = guestCart.filter(i => i.id !== id);
        guestCarts = guestCarts.filter(c => c.id !== id);
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        renderguestCart();
      }
  });

  function escapeHtml(s) {
      return String(s)
          .replace(/[&<>"']/g, c => ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;'
          }[c]));
  }

  function updateguestCartTotals() {
      let subtotal = 0, items = 0;
      guestCart.forEach(i => { 
          const product = products.find(p => p.id === i.product_id);
          if (!product) return;
          subtotal += product.price * i.quantity; 
          items += i.quantity; 
      });
      const shipping = subtotal > 0 ? 1 : 0;
      document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById('item-count').textContent = items;
      document.getElementById('total-price').textContent = `USD $${(subtotal + shipping).toFixed(2)}`;
  }
  function updateguestCartBadge() {
      const customerId = localStorage.getItem("customerSession");
      if (!customerId){
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const count = guestCart.filter(c => c.customer_id == customerId).reduce((sum, c) => sum + c.quantity, 0);
        const badge = document.getElementById('CartCount');
        if (badge) badge.textContent = count;
        return;

      };

      const guestCarts = JSON.parse(localStorage.getItem("guestCart")) || [];
      const count = guestCarts
        .filter(c => c.customer_id == customerId)
        .reduce((sum, c) => sum + c.quantity, 0);

      const badge = document.getElementById('CartCount');
      if (badge) badge.textContent = count;
  }
  renderguestCart();
  updateguestCartBadge();
}
else{
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const currentCustomer = customers.find(c => String(c.id) === String(currentSession));

  let carts = JSON.parse(localStorage.getItem("carts")) || [];
  let cart = carts.filter(cart => cart.customer_id == currentSession);

  let products = JSON.parse(localStorage.getItem("products")) || [];
  const cartList = document.getElementById('cart-list');

  function renderCart() {
    cartList.innerHTML = '';
    cart.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) return;
      const imgStr = String(
        product?.images?.src || 
        (Array.isArray(product?.images) ? product.images[0] : product?.images) || ''
      ).trim();

      const finalSrc = (/^data:|^https?:\/\/|^\/\//i.test(imgStr))
        ? imgStr
        : (imgStr
            ? `/assets/img/products/${imgStr}`
            : '/assets/img/products/women.png');



        
      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${finalSrc}" class="card-img-top object-fit-cover" alt="${escapeHtml(product.name)}">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title mb-1">${escapeHtml(product.name)}</h6>
            <div class="input-group">
              <input type="number" min="1" value="${item.quantity}" data-id="${item.id}"
                class="form-control form-control-sm item-qty">
              <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">
                Remove
              </button>
            </div>
          </div>
          <div class="card-footer text-end fw-bold">
            $${(product.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
      cartList.appendChild(col);
    });
    updateTotals();
    updateCartBadge();
  }

  // ✅ تحديث الكمية
  cartList.addEventListener('input', (e) => {
      if (e.target.classList.contains('item-qty')) {
          const id = Number(e.target.dataset.id);
          const qty = Math.max(1, Number(e.target.value) || 1);

          // تحديث في cart الخاص بالعميل
          const it = cart.find(i => i.id === id);
          if (it) it.quantity = qty;

          // تحديث في carts (الكل) + localStorage
          carts = carts.map(c => c.id === id ? { ...c, quantity: qty } : c);
          localStorage.setItem("carts", JSON.stringify(carts));

          renderCart(); 
      }
  });

  // ✅ إزالة منتج
  cartList.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
          const id = Number(e.target.dataset.id);

          // تحديث cart الخاص بالعميل
          cart = cart.filter(i => i.id !== id);

          // تحديث carts (الكل) + localStorage
          carts = carts.filter(c => c.id !== id);
          localStorage.setItem("carts", JSON.stringify(carts));

          renderCart();
      }
  });

  function escapeHtml(s) {
      return String(s)
          .replace(/[&<>"']/g, c => ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;'
          }[c]));
  }

  function updateTotals() {
      let subtotal = 0, items = 0;
      cart.forEach(i => { 
          const product = products.find(p => p.id === i.product_id);
          if (!product) return;
          subtotal += product.price * i.quantity; 
          items += i.quantity; 
      });
      const shipping = subtotal > 0 ? 1 : 0;
      document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById('item-count').textContent = items;
      document.getElementById('total-price').textContent = `USD $${(subtotal + shipping).toFixed(2)}`;
  }

  // ✅ تحديث البادج
  function updateCartBadge() {
      const customerId = localStorage.getItem("customerSession");
      if (!customerId) return;

      const carts = JSON.parse(localStorage.getItem("carts")) || [];
      const count = carts
        .filter(c => c.customer_id == customerId)
        .reduce((sum, c) => sum + c.quantity, 0);

      const badge = document.getElementById('CartCount');
      if (badge) badge.textContent = count;
  }

  // أول تشغيل
  renderCart();
  updateCartBadge();


}

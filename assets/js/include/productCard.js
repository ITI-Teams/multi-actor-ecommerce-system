function getAverageRating(productId) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const productReviews = reviews.filter(r => r.product_id == productId);
  
  if (productReviews.length === 0) return { avg: 0, count: 0 };
  const sum = productReviews.reduce(
      (acc, r) => acc + Number(r.review),
      0
  );

  const avg = sum / productReviews.length;
  return { avg: Math.round(avg * 2) / 2, count: productReviews.length }; 
}
function renderStars(rating) {
  
  

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '<i class="fa fa-star star" style="color: gold;"></i>';
  for (let i = 0; i < emptyStars; i++) stars += '<i class="fa fa-star star" ></i>';
  if (hasHalf) stars += '<i class="fa fa-star star" style="color: gold;"></i>';

  return stars;
}
export default function prodcutCard({id, name, images, price,description,seller_id,stock}) {
    const { avg: rating, count } = getAverageRating(id);
    const stars = renderStars(rating);
    return `
      <div class="card shadow" style="min-width: auto;">
          <img src="${images && images[0] ? (images[0].startsWith('data:') ? images[0] : window.location.origin + '/assets/img/products/' + images[0]) : '../../img/women.png'}" 
          class="card-img-top prodcut-img shadow-sm" alt="${name}">
          <div class="card-body">
              <a href="../../../pages/onepage-product.html?product=${id}" class="text-dark link-offset-1-hover text-uppercase" />
                <h5 class="card-title">${name}</h5>
              </a>
              <p class="card-text">${description.trim().split(/\s+/).slice(0, 5).join(' ') + '...'}</p>
              <div class="d-flex justify-content-between align-items-center">
                  <span class="h5 mb-0">${price}$</span>
                  <div>
                      ${stars}
                      <small class="text-muted">(${count || 0})</small>
                  </div>
              </div>
          </div>
          <div class="card-footer d-flex flex-column bg-light">
              <div class="mb-2 p-2 text-center text-white fw-bold rounded 
                  ${stock > 0 ? 'bg-secondary' : 'bg-danger'}">
                  ${stock > 0 ? `In Stock: ${stock}` : 'Out of Stock'}
              </div>
              <button class="btn btn-dark btn-sm w-100" 
                      onclick="addToCart(${id}, ${seller_id})" 
                      ${stock === 0 ? 'disabled' : ''}>
                  Add to Cart
              </button>
          </div>
      </div>
    
    `;
}

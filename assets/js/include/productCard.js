export default function prodcutCard({id, name, images, price}) {
    return `<div>
        <a href="/pages/onepage-product.html?product=${id}" class="text-dark link-offset-1-hover text-uppercase" />
          <div class="img-container position-relative">
          <img class="prodcut-img bg-secondary-subtle mb-2 primary-img object-fit-cover" 
              src="/assets/img/${images[1] || images[0]}" 
              alt="${name}"
              data-original="/assets/img/${images[1] || images[0]}"
              data-hover="/assets/img/${images[1] || images[0]}"
              onmouseover="this.src=this.dataset.hover" onmouseout="this.src=this.dataset.original">
          </div>
        ${name.slice(0, 10)}</a>
        <p>${price}$</p>
      </div>`;
}

 
const categories=JSON.parse(localStorage.getItem('categories'))|| [];
let products = JSON.parse(localStorage.getItem('products')) || [];
const categoriesRow = document.querySelector('#categoriesRow');

let productsContainer = document.querySelector("#productsContainer .card-body");
let collapseEl = document.getElementById("productsContainer");
let bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

let activeCategory = null; 


  

   

categories.forEach((category)=>{
  
categoriesRow.innerHTML+=`
  <div class="col ">
  <div class='category  '>
  <img src="/assets/img/logo_category.webp" class="card-img-top" alt="Category">
   
  <p><button class=" mt-2 category-btn" data-name="${category.name}">
          ${category.name}
       </button></p>
<p class='desc'>${category.description}</p>
 
</div>
</div>
 
`
 
 


})

document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    let categoryName = e.target.dataset.name;

     
    if (activeCategory === categoryName && collapseEl.classList.contains("show")) {
      bsCollapse.hide();
      activeCategory = null;
      return;
    }
    activeCategory = categoryName;

      let filteredProducts = products.filter(p => p.category === categoryName);
       productsContainer.innerHTML = "<div class='row'></div";
       let row = productsContainer.querySelector(".row");
        if (filteredProducts.length > 0) {
      filteredProducts.forEach(prod => {
         row.innerHTML += `
            <div class='col-lg-4 col-sm-12 mb-4'>
          <div class="product p-2 mb-3   rounded ">
          
         
            <img src=${prod.images[0]} width='200px' height='200px'>
             
             
            <h5 class='title'>${prod.title}</h5>
          
            
            <p class='desc'>${prod.description}</p>
           

            <span class="text-success fw-bold price">${prod.price} EGP</span>
            </div>
          </div>
          </div>
        `;
      });
    } else {
      productsContainer.innerHTML = `<p class="text-muted">لا توجد منتجات لهذا القسم.</p>`;
    }
      bsCollapse.show();

       collapseEl.scrollIntoView({ behavior: "smooth", block: "start" });
  })
})
 
   $(document).ready(function () {
       
      $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
          $("#toTop").fadeIn();
        } else {
          $("#toTop").fadeOut();
        }
      });

      
      $("#toTop").click(function () {
        $("html, body").animate({ scrollTop: 0 },300);
        return false;
      });
    });
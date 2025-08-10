document.addEventListener("DOMContentLoaded", function () {
    const main_nav = document.getElementById('main-nav')
    const main_section=document.getElementById('main-section')
    const main_footer = document.getElementById('main-footer')
    const nav_content = `<div class="container">
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand fw-bold fs-4" href="#">Trendora</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item nav-home1">
                            <a class="nav-link active nav-home" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-man" href="#">MEN</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-women" href="#">WOMEN</a>
                        </li>
                          <li class="nav-item">
                            <a class="nav-link nav-usa" href="#">MADE IN USA</a>
                        </li>
                    </ul>
                </div>

                <!-- profile -->
                <div class="d-flex flex-row gap-2">
                    <div class="dropdown bg-nav-transparent">
                        <button class="btn btn-link text-black text-decoration-none dropdown-toggle" type="button"
                            id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end profile" aria-labelledby="profileDropdown">
                            <li><a class="dropdown-item" href="#">Sign Up</a></li>
                            <li><a class="dropdown-item" href="#">Login</a></li>
                        </ul>
                    </div>
                </div>

                <!-- search -->
                <div class="collapse align-content-center me-2" id="searchIcon">
                    <div class="input-group">
                        <input class="form-control bg-transparent text-white border-light" type="search"
                            placeholder="Search" aria-label="Search">
                    </div>
                </div>
                <p class="mt-3">
                    <i class="fa fa-search" type="button" data-bs-toggle="collapse" data-bs-target="#searchIcon"
                        aria-expanded="false" aria-controls="searchIcon" aria-hidden="true">
                    </i>
                </p>

                <!-- cart -->
                <div class="dropdown">
                    <button class="btn btn-link text-black text-decoration-none position-relative" type="button"
                        id="cartDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger">
                            0
                        </span>
                    </button>
                
                    <ul class="dropdown-menu" aria-labelledby="cartDropdown">
    </ul>
                </div>
            </div>`;
    const footer_content = `<div class="container">
            <div class="row justify-content-center">
                <div class="col-sm mb-4 d-flex flex-column gap-1">
                    <h1>Trendora</h1>
                    <h3>Subscribe</h3>
                    <p>Get 10% off your first order</p>
                    <input type="email" class="subscribe-input" placeholder="Enter your email">
                </div>

                <div class="col-sm md pt-2 mb-4">
                    <h3>Support</h3>
                    <div class="support-info d-flex flex-column gap-1">
                        <a target="_blank" class="" href="https://maps.app.goo.gl/uQVUpHbPq2LidsDE9">Ill Bijby sarani,
                            Dhaka,<br />DH 1515, Bangladesh.</a>
                        <a target="_blank" class="" href="mailto:exclusive@gmail.com">exclusive@gmail.com</a>
                        <a href="tel:+88015-88888-9999">+88015-88888-9999</a>
                    </div>
                </div>

                <div class="col-sm md pt-2 mb-4">
                    <h3>Account</h3>
                    <div class="account-info d-flex flex-column gap-1">
                        <a href="/" class="nav-link">My Account</a>
                        <a href="/" class="nav-link">Login / Register</a>
                        <a href="/" class="nav-link">Cart</a>
                        <a href="/" class="nav-link">Wishlist</a>
                        <a href="/" class="nav-link">Shop</a>
                    </div>
                </div>

                <div class="col-sm md pt-2 mb-4">
                    <h3>Quick Link</h3>
                    <div class="quick-link d-flex flex-column gap-1">
                        <a href="/" class="nav-link">Privacy Policy</a>
                        <a href="/" class="nav-link">Terms Of Use</a>
                        <a href="/" class="nav-link">FAQ</a>
                        <a href="/" class="nav-link">Contact</a>
                    </div>
                </div>
            </div>

            <div class="copyright text-secondary">
                <p>© Copyright Rimel 2022. All right reserved.</p>
            </div>
        </div>`;       
   

    
    // adding the nav
    main_nav.innerHTML = nav_content;
    // adding the footer
    main_footer.innerHTML = footer_content;
    
let myElement = document.querySelector('.fa-shopping-cart');
if (myElement) {
    myElement.addEventListener('click',()=>{
        location.href='../pages/cart.html';

    })
    }

// category section
 

let home=document.querySelector('.nav-home');
home.addEventListener('mouseenter',()=>{
    
    menEl.style.display='none';
})

let man_cat=document.querySelector('.nav-man');
  let menEl = document.querySelector('.men');

man_cat.addEventListener('mouseenter', () => {
 

 
 menEl.style.display='block';
  womensEl.style.display='none';
  menEl.innerHTML = `
   <div class='container1'>
   <div class='boxes'>
   <div class='box1'>
        <p><a href='#'>New Arrivals</a></p>
        <p><a href='#'>Best Sellers</a></p>
        <p><a href='#'>Made in USA</a></p>
        <p><a href='#'>The August Delivery</a></p>
   </div>
   <div class='box2'>
   <p><a href='#'>New Arrivals</a></p>
        <p><a href='#'>Tees</a></p>
        <p><a href='#'>Long Sleeves & Henleys</a></p>
        <p><a href='#'>Shirts</a></p>
        <p><a href='#'>Sweaters</a></p>
        <p><a href='#'>Polos</a></p>
        <p><a href='#'>Jackets & Outerwear</a></p>
        <p><a href='#'>Tailoring</a></p>
        <p><a href='#'>Sweats</a></p>
        
   </div>
   <div class='box3'>
<p><a href='#'>Denim</a></p>
<p><a href='#'>Pants</a></p>
<p><a href='#'>Shorts</a></p>
<p><a href='#'>Swim</a></p>
<p><a href='#'>Shoes</a></p>
<p><a href='#'>Accessories</a></p>
<p><a href='#'>Eyewear</a></p>
<p><a href='#'>Gift Cards</a></p>
   </div>
   <div class='box4'>
   <h6>Collaborations</h6>
<p><a href='#'>Red Rabbit<a href='#'></p>
<p><a href='#'>Moonstar</a></p>
<h6>Featured</h6>
<p><a href='#'>Carry-On Suiting</a></p>
<p><a href='#'>Tee Fit Guide</a></p>
<p><a href='#'>Denim Fit Guide</a></p>
   </div>
   <div class='box5'>
   <div>
   <img src='../assets/img/man2.png'>
   <p><a href='#'>Wornwell Camp Shirts</a></p>
   </div>
   <div>
    <img src='../assets/img/man3.png'>
    <p><a href='#'>SWIM</a></p>
    </div>
   </div>
   </div>
   </div>
  `;
})
 
document.querySelector('.men').addEventListener('mouseleave',()=>{
document.querySelector('.men').style.display='none';
 document.querySelector('#bg-video').style.opacity='1';
})   
document.querySelector('.men').addEventListener('mouseenter',()=>{
    document.querySelector('#bg-video').style.opacity='0.6';

})
 
  
 let women_cat=document.querySelector('.nav-women');
  let womensEl = document.querySelector('.womens');

women_cat.addEventListener('mouseenter', () => {
 

 
 womensEl.style.display='block';
 menEl.style.display='none';
  womensEl.innerHTML = `
   <div class='container1'>
   <div class='boxes'>
   <div class='box1'>
        <p><a href='#'>New Arrivals</a></p>
        <p><a href='#'>Best Sellers</a></p>
        <p><a href='#'>Made in USA</a></p>
        <p><a href='#'>The August Delivery</a></p>
        <p><a href='#'>The Summer Collection</a></p>
        <p><a href='#'>The Linen Shop</a></p>
        <p><a href='#'>Tee Fit Guide</a></p>
   </div>
   <div class='box2'>
   <p><a href='#'>New Arrivals</a></p>
    <p><a href='#'>Tees</a></p>
<p><a href='#'>Tanks</a></p>
<p><a href='#'>Tops & Shirts</a></p>
<p><a href='#'>Long Sleeve Tees</a></p>
<p><a href='#'>Sweaters</a></p>
<p><a href='#'>Sweats</a></p>
<p><a href='#'>Tailoring</a></p>
<p><a href='#'>Jackets & Outerwear</a></p>
        
</div>
<div class='box3'>
<p><a href='#'>Bottoms</a></p>
<p><a href='#'>Denim</a></p>
<p><a href='#'>Shorts</a></p>
<p><a href='#'>Dresses</a></p>
<p><a href='#'>Shoes</a></p>
<p><a href='#'>Accessories</a></p>
<p><a href='#'>Eyewear</a></p>
<p><a href='#'>Gift Cards</a></p>
   </div>
   <div class='box4'>
<h6> Featured</h6>
<p><a href='#'>Heirloom Rib</a></p>
<p><a href='#'>Soft Spun Cotton</a></p>
<p><a href='#'>Tee Fit Guide</a></p>
   </div>
   <div class='box5'>
   <div>
   <img src='../assets/img/w1.png'>
   <p><a href='#'>Matching Sets</a></p>
   </div>
   <div>
    <img src='../assets/img/w2.png'>
    <p><a href='#'>Dresses</a></p>
    </div>
   </div>
   </div>
   </div>
  `;
})

document.querySelector('.womens').addEventListener('mouseleave',()=>{
document.querySelector('.womens').style.display='none';
 document.querySelector('#bg-video').style.opacity='1';
})   
document.querySelector('.womens').addEventListener('mouseenter',()=>{
    document.querySelector('#bg-video').style.opacity='0.6';

})

const navUsa=document.querySelector('.nav-usa');
navUsa.addEventListener('mouseenter',()=>{

    document.querySelector('.womens').style.display='none';
})


// end of Category section
})
 
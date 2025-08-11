let maincontainer1=document.querySelector('.container');

document.addEventListener("DOMContentLoaded", function () {

    const maincontainer = `
 <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand nav-trendora" href="../index.html">Trendora</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav1" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav1">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link nav-man" aria-current="page" href="#">MEN</a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-women" href="#">WOMEN</a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-child" href="#">CHILDEREN</a>
        </li>
       
      </ul>
    </div>
  </div>
</nav>

    `
    // adding the nav
    maincontainer1.innerHTML = maincontainer;
// category section

 

let man_cat=document.querySelector('.nav-man');

  let menEl = document.querySelector('.men');


  let trendora=document.querySelector('.nav-trendora');

trendora.addEventListener('mouseenter',()=>{
     document.querySelector('.men').style.display='none';
})

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
  
})   
  

const navUsa=document.querySelector('.nav-child');
navUsa.addEventListener('mouseenter',()=>{

    document.querySelector('.womens').style.display='none';
})

let mainCategory = document.querySelector('.main_category');
 

let mediaQuery = window.matchMedia("(max-width: 992px)");
 
 

function handleScreenChange(e) {
    if (e.matches) {
        mainCategory.style.width = '400px';
        
      
         
    }else {
      
        mainCategory.style.width = '';
      
    }


 
  }
handleScreenChange(mediaQuery);
mediaQuery.addListener(handleScreenChange);

})


 

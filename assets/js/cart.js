
 
let close = document.querySelector('.fa-xmark');

close.addEventListener('click', () => {
    let cart = document.querySelector('.cart');
    cart.classList.add('fade-out');

    
    setTimeout(() => {
        cart.remove();
        location.href = '../index.html';
    }, 500);  
});
  
// let myElement = document.querySelector('.fa-shopping-cart');
// console.log(myElement);
// if (myElement) {
//     myElement.addEventListener('click',()=>{
//         location.href='../pages/cart.html';

//     })
//     }
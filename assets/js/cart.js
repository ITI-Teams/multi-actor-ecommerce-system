    // let close=document.querySelector('.fa-xmark');
    // close.addEventListener('click',(e)=>{
        
    //         document.querySelector('.cart').remove();
       
         
    //       location.href='../index.html';
    // })
   
let close = document.querySelector('.fa-xmark');

close.addEventListener('click', () => {
    let cart = document.querySelector('.cart');
    cart.classList.add('fade-out');

    // بعد الانيميشن يروح للصفحة
    setTimeout(() => {
        cart.remove();
        location.href = '../index.html';
    }, 500); // نفس مدة الـ transition
});
    

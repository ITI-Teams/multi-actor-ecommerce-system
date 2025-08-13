let card=document.querySelector('.card');
fetch('https://dummyjson.com/products?limit=194')
.then((myData)=>{
  let result=myData.json();
  
   return result;
   
})
.then((myData)=>{

const mainProducts=myData.products;
 mainProducts.forEach(product => {
    if(product.category=='mens-shirts'|| product.category=='mens-shoes'|| product.category=='mens-watches'){
      document.querySelector('.card').innerHTML+=`

      
        <div class='product-item'>
    
      
      <img src=${product.images[0]} width='200px' height='200px'>
      
     
        <p class='title'>${product.title}</p>
      <p>${product.price}$</p>
      <p><button>Add to card</button></p>
      
      </div>
      
    
      `
     
    }else if(product.category=='womens-bags'|| product.category=='womens-dresses'|| product.category=='womens-shoes'|| product.category=='womens-watches'){
  
        
      
       document.querySelector('.card2').innerHTML+=`

      
        <div class='product-item'>
    
      
      <img src=${product.images[0]} width='200px' height='200px'>
      
     
      <p class='title'>${product.title}</p>
      <p>${product.price}$</p>
      <p><button>Add to card</button></p>
      
      </div>
      
    
      `
    
    }
      
  

    
    
 
 });
 
})
 let men=document.querySelector('.men');
 let women=document.querySelector('.women');
  let mens=document.querySelector('.mens');
 let womens=document.querySelector('.womens');

 men.addEventListener('click', () => {
     mens.style.display = 'block';
    womens.style.display = 'none';
});

document.querySelector('.women').addEventListener('click', () => {
     mens.style.display = 'none';
     womens.style.display = 'block';
});

 
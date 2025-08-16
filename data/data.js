// ======  تحميل الببانات ======
let carts = JSON.parse(localStorage.getItem("carts")) || [
    { 
        id: 1, 
        customer_id: 1, 
        product_id: 1, 
        seller_id: 1,
        quantity: 1, 
    },
    { 
        id: 2, 
        customer_id: 2, 
        product_id: 2, 
        seller_id: 2,
        quantity: 1, 
    },
    { 
        id: 3, 
        customer_id: 1, 
        product_id: 2, 
        seller_id: 1,
        quantity: 1, 
    },
    { 
        id: 4, 
        customer_id: 2, 
        product_id: 1, 
        seller_id: 1,
        quantity: 1, 
    },
    
];
let categories = JSON.parse(localStorage.getItem("categories")) || [
    { 
        id: 1,
        name: "men", 
        description: "This Category is for men's clothing, offers and discounts.", 
    },
    { 
        id: 2,
        name: "women", 
        description: "This Category is for women's clothing, offers and discounts.", 
    }
];
let customers = JSON.parse(localStorage.getItem("customers")) || [
    { 
        id: 1, 
        name: "Ahmed",
        FirstName: "Ahmed",
        lastName: "Ahmed",
        name: "Ahmed", 
        gender : "male",
        email: "Ahmed@trendora.com", 
        country: "EGY",
        city: "Cairo",
        zip:'31589',
        address: "12 street - cairo",
        birthday: "1999-07-15",
        phone: "01124252789",
        password: encryptText("@A1234s"),
    },
    { 
        id: 2, 
        name: "mohamed", 
        FirstName: "Ahmed",
        lastName: "Ahmed",
        gender : "male",
        email: "mohamed@trendora.com", 
        country: "EGY",
        city: "Alex",
        zip:'31589',
        address: "16 street - Alex",
        birthday: "1999-07-15",
        phone: "01257462789",
        password: encryptText("s1234@A"),
    },
];
let mails = JSON.parse(localStorage.getItem("mails")) || [
    { 
        id: 1, 
        to: "abdullah@gmail.com", 
        from: "admin@gmail.com", 
        subject: "new product", 
        message: "Hi how are You this new product has 25% discount", 
        date: "2025-11-15", 
    },
    { 
        id: 2, 
        to: "mahmoud@gmail.com", 
        from: "admin@gmail.com", 
        subject: "New discount 50%", 
        message: "Hi how are You this new product has 50% discount", 
        date: "2025-11-20", 
    },
    
];
let messages = JSON.parse(localStorage.getItem("messages")) || [
    { 
        id: 1, 
        name: "Abdullah Shokr", 
        email: "abdullah@gmail.com", 
        phone: "01027251057",
        subject: "greating", 
        message: "hi How are You ?",
        date : "2025-08-15",
    },
    { 
        id: 2, 
        name: "Mahmoud", 
        email: "mahmoud@gmail.com", 
        phone: "01127283620",
        subject: "greating", 
        message: "hi How are You ?",
        date : "2025-08-20",
    },
    { 
        id: 2, 
        name: "sss", 
        email: "sss@gmail.com", 
        phone: "01127283620",
        subject: "greating", 
        message: "hi How are You ?",
        date : "2025-08-20",
    },
];
let orders = JSON.parse(localStorage.getItem("orders")) || [
    { 
        id: 1, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery",
        quntity:1,
        totalPrice:500, 
        date: "2025-08-14"
    },
    { 
        id: 2, 
        product_id: 1, 
        seller_id: 2, 
        customer_id: 1, 
        status: "Delivery" ,
        quntity:1,
        totalPrice:500,
        date: "2025-08-14" 
    },
    { 
        id: 3, 
        product_id: 1, 
        seller_id: 2, 
        customer_id: 1, 
        status: "Delivery",
        quntity:5,
        totalPrice:500,
        date: "2025-08-14"  
    },
    { 
        id: 4, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery",
        quntity:4,
        totalPrice:500,
        date: "2025-08-14"  
    },
    { 
        id: 5, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery",
        quntity:1,
        totalPrice:500,
        date: "2025-08-14"  
    },
    { 
        id: 6, 
        product_id: 1, 
        seller_id: 1, 
        customer_id: 1, 
        status: "Delivery",
        quntity:3,
        totalPrice:500,
        date: "2025-08-14"  
    },
    
];
let products = JSON.parse(localStorage.getItem("products")) || [
    { 
        id: 1,
        name: "Cotton Dobby Studio Shirt", 
        description: "Relaxed-fit sheer shirt made from breathable, airy cotton dobby.", 
        category: "men",
        reviews: 5,
        price: "148",
        size: ['xs','s','m','L','XL','XXL'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg','product02.jpg'],
        seller_id : 2,
        stock:5,
    },
    { 
        id: 2,
        name: "Cotton Dobby Studio Shirt", 
        description: "Relaxed-fit sheer shirt made from breathable, airy cotton dobby.", 
        category: "Women",
        reviews: 4,
        price: "148",
        size: ['xs','s','m','L','XL','XXL'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['img/product01.jpg','product02.jpg'],
        seller_id : 1,
        stock:5,
    }
];
let reviews = JSON.parse(localStorage.getItem("reviews")) || [
    { 
        id: 1, 
        product_id: 1, 
        customer_id: 1, 
        review: 5
    },
    { 
        id: 2, 
        product_id: 2, 
        customer_id: 2, 
        review: 3 
    },
    { 
        id: 3, 
        product_id: 1, 
        customer_id: 2, 
        review: 4 
    },
];
let users = JSON.parse(localStorage.getItem("users")) || [
    { 
        id: 1, 
        name: "John Doe", 
        email: "john@example.com", 
        role: "admin", 
        phone: "123456789",
        password: encryptText("Password123!")
    },
    { 
        id: 2, 
        name: "Jane Smith", 
        email: "jane@example.com", 
        role: "seller", 
        phone: "987654321",
        password: encryptText("Password123!") 
    },
    { 
        id: 3, 
        name: "ahmed", 
        email: "ahmed@example.com", 
        role: "seller", 
        phone: "435345",
        password: encryptText("Password123!") 
    }
];

if (!localStorage.getItem("carts")) {
    localStorage.setItem("carts", JSON.stringify(carts));
}
if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(categories));
}
if (!localStorage.getItem("customers")) {
    localStorage.setItem("customers", JSON.stringify(customers));
}
if (!localStorage.getItem("mails")) {
    localStorage.setItem("mails", JSON.stringify(mails));
}
if (!localStorage.getItem("messages")) {
    localStorage.setItem("messages", JSON.stringify(messages));
}
if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify(orders));
}
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products));
}
if (!localStorage.getItem("reviews")) {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users));
}
function encryptText(text) {
    if (!text) return '';
    let step1 = text.split('').reverse().join('');
        let step2 = '';
    for (let i = 0; i < step1.length; i += 2) {
        if (i + 1 < step1.length) {
            step2 += step1[i+1] + step1[i];
        } else {
            step2 += step1[i];
        }
    }
    
    let step3 = '';
    for (let i = 0; i < step2.length; i++) {
        let charCode = step2.charCodeAt(i);
        step3 += String.fromCharCode(charCode + 3);
    }
    
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + step3 + suffix;
}

function decryptText(encryptedText) {
    if (!encryptedText) return '';
    
    let step1 = encryptedText.substring(1, encryptedText.length - 1);
    
    let step2 = '';
    for (let i = 0; i < step1.length; i++) {
        let charCode = step1.charCodeAt(i);
        step2 += String.fromCharCode(charCode - 3);
    }
    
    let step3 = '';
    for (let i = 0; i < step2.length; i += 2) {
        if (i + 1 < step2.length) {
            step3 += step2[i+1] + step2[i];
        } else {
            step3 += step2[i];
        }
    }
    
    return step3.split('').reverse().join('');
}
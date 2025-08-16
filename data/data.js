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
        gender: "male",
        email: "Ahmed@trendora.com",
        country: "EGY",
        city: "Cairo",
        zip: '31589',
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
        gender: "male",
        email: "mohamed@trendora.com",
        country: "EGY",
        city: "Alex",
        zip: '31589',
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
        date: "2025-08-15",
    },
    {
        id: 2,
        name: "Mahmoud",
        email: "mahmoud@gmail.com",
        phone: "01127283620",
        subject: "greating",
        message: "hi How are You ?",
        date: "2025-08-20",
    },
    {
        id: 2,
        name: "sss",
        email: "sss@gmail.com",
        phone: "01127283620",
        subject: "greating",
        message: "hi How are You ?",
        date: "2025-08-20",
    },
];
let orders = JSON.parse(localStorage.getItem("orders")) || [
    {
        id: 1,
        product_id: 1,
        seller_id: 1,
        customer_id: 1,
        status: "Delivery",
        quntity: 1,
        totalPrice: 500,
        date: "2025-08-14"
    },
    {
        id: 2,
        product_id: 1,
        seller_id: 2,
        customer_id: 1,
        status: "Delivery",
        quntity: 1,
        totalPrice: 500,
        date: "2025-08-14"
    },
    {
        id: 3,
        product_id: 1,
        seller_id: 2,
        customer_id: 1,
        status: "Delivery",
        quntity: 5,
        totalPrice: 500,
        date: "2025-08-14"
    },
    {
        id: 4,
        product_id: 1,
        seller_id: 1,
        customer_id: 1,
        status: "Delivery",
        quntity: 4,
        totalPrice: 500,
        date: "2025-08-14"
    },
    {
        id: 5,
        product_id: 1,
        seller_id: 1,
        customer_id: 1,
        status: "Delivery",
        quntity: 1,
        totalPrice: 500,
        date: "2025-08-14"
    },
    {
        id: 6,
        product_id: 1,
        seller_id: 1,
        customer_id: 1,
        status: "Delivery",
        quntity: 3,
        totalPrice: 500,
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
        size: ['xs', 's', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 5
    },
    {
        id: 2,
        name: "Slim Fit Denim Jeans",
        description: "Classic blue denim jeans with a modern slim fit.",
        category: "women",
        reviews: 4,
        price: "89",
        size: ['xs', 's', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 12
    },
    {
        id: 3,
        name: "Wool Blend Overcoat",
        description: "Warm winter overcoat with premium wool blend fabric.",
        category: "men",
        reviews: 7,
        price: "249",
        size: ['xs', 's', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 8
    },
    {
        id: 4,
        name: "Silk Evening Dress",
        description: "Elegant silk dress perfect for formal occasions.",
        category: "women",
        reviews: 9,
        price: "199",
        size: ['xs', 's', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 3
    },
    {
        id: 5,
        name: "Casual Linen Shirt",
        description: "Breathable linen shirt for summer comfort.",
        category: "men",
        reviews: 6,
        price: "75",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 15
    },
    {
        id: 6,
        name: "Athletic Yoga Pants",
        description: "Stretchy and comfortable pants for yoga and workouts.",
        category: "women",
        reviews: 8,
        price: "65",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 20
    },
    {
        id: 7,
        name: "Leather Crossbody Bag",
        description: "Genuine leather bag with adjustable strap.",
        category: "accessories",
        reviews: 12,
        price: "120",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 7
    },
    {
        id: 8,
        name: "Cashmere Sweater",
        description: "Luxurious 100% cashmere sweater for winter.",
        category: "women",
        reviews: 15,
        price: "179",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 4
    },
    {
        id: 9,
        name: "Canvas Sneakers",
        description: "Classic white canvas sneakers with rubber sole.",
        category: "footwear",
        reviews: 22,
        price: "55",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 18
    },
    {
        id: 10,
        name: "Wool Fedora Hat",
        description: "Stylish wool fedora hat for all seasons.",
        category: "accessories",
        reviews: 3,
        price: "45",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 9
    },
    {
        id: 11,
        name: "Performance Running Shorts",
        description: "Lightweight shorts with moisture-wicking technology.",
        category: "men",
        reviews: 17,
        price: "40",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 25
    },
    {
        id: 12,
        name: "Knit Beanie",
        description: "Warm acrylic knit beanie for cold weather.",
        category: "accessories",
        reviews: 6,
        price: "25",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 30
    },
    {
        id: 13,
        name: "Denim Jacket",
        description: "Classic blue denim jacket with metal buttons.",
        category: "women",
        reviews: 11,
        price: "95",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 6
    },
    {
        id: 14,
        name: "Cotton Polo Shirt",
        description: "Classic polo shirt made from premium cotton.",
        category: "men",
        reviews: 8,
        price: "60",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 14
    },
    {
        id: 15,
        name: "Silk Scarf",
        description: "Luxurious silk scarf with floral pattern.",
        category: "accessories",
        reviews: 4,
        price: "85",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 10
    },
    {
        id: 16,
        name: "Cargo Pants",
        description: "Utility cargo pants with multiple pockets.",
        category: "men",
        reviews: 9,
        price: "78",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 11
    },
    {
        id: 17,
        name: "Wrap Dress",
        description: "Flattering wrap dress with v-neck design.",
        category: "women",
        reviews: 13,
        price: "110",
        size: ['s', 'm', 'l', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 5
    },
    {
        id: 18,
        name: "Leather Belt",
        description: "Genuine leather belt with metal buckle.",
        category: "accessories",
        reviews: 7,
        price: "50",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 22
    },
    {
        id: 19,
        name: "Hooded Sweatshirt",
        description: "Comfortable cotton sweatshirt with hood.",
        category: "men",
        reviews: 10,
        price: "65",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 17
    },
    {
        id: 20,
        name: "Pleated Skirt",
        description: "Elegant pleated midi skirt for office wear.",
        category: "women",
        reviews: 5,
        price: "88",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 8
    },
    {
        id: 21,
        name: "Oxford Shirt",
        description: "Classic button-down shirt in oxford cloth.",
        category: "men",
        reviews: 14,
        price: "72",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 13
    },
    {
        id: 22,
        name: "Maxi Dress",
        description: "Flowy maxi dress with floral print.",
        category: "women",
        reviews: 6,
        price: "105",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 7
    },
    {
        id: 23,
        name: "Chino Shorts",
        description: "Casual chino shorts with belt loops.",
        category: "men",
        reviews: 8,
        price: "48",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 19
    },
    {
        id: 24,
        name: "Turtleneck Sweater",
        description: "Warm ribbed turtleneck sweater.",
        category: "women",
        reviews: 11,
        price: "92",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 6
    },
    {
        id: 25,
        name: "Bomber Jacket",
        description: "Stylish bomber jacket with ribbed cuffs.",
        category: "men",
        reviews: 16,
        price: "135",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 4
    },
    {
        id: 26,
        name: "A-line Dress",
        description: "Flattering A-line dress with cap sleeves.",
        category: "women",
        reviews: 7,
        price: "115",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 9
    },
    {
        id: 27,
        name: "Puffer Vest",
        description: "Quilted puffer vest for layering.",
        category: "men",
        reviews: 5,
        price: "99",
        size: ['xs', 's', 'm', 'xl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 12
    },
    {
        id: 28,
        name: "Blouse with Bow",
        description: "Elegant blouse with bow detail at neck.",
        category: "women",
        reviews: 9,
        price: "78",
        size: ['xs', 's', 'm', 'xl', 'xxl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 5
    },
    {
        id: 29,
        name: "Linen Blazer",
        description: "Lightweight linen blazer for summer.",
        category: "men",
        reviews: 12,
        price: "165",
        size: ['xs', 's', 'm', 'xl', 'xxl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 2,
        stock: 3
    },
    {
        id: 30,
        name: "Wrap Top",
        description: "Flattering wrap top with v-neckline.",
        category: "women",
        reviews: 8,
        price: "65",
        size: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
        color: ["#171111", "#ff1414", "#ffffff"],
        images: ['product01.jpg', 'product02.jpg'],
        seller_id: 1,
        stock: 16
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
            step2 += step1[i + 1] + step1[i];
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
            step3 += step2[i + 1] + step2[i];
        } else {
            step3 += step2[i];
        }
    }

    return step3.split('').reverse().join('');
}
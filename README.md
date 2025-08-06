# 🛒 Multi-Actor E-commerce System

A responsive and interactive e-commerce web application designed for **Customers**, **Sellers**, and **Admins**. Built using **HTML**, **CSS**, **JavaScript**, and **Bootstrap**, the system provides a complete shopping experience, user dashboards, and role-based access.

## 🚀 Features

- 👤 User Authentication (Customer, Seller, Admin)
- 🏠 Homepage with Featured Products
- 🛍️ Product Catalog and Details Page
- 🛒 Shopping Cart and Checkout Process
- 📊 Seller Dashboard (Add/Edit/Delete Products, View Analytics)
- 🛡️ Admin Panel (Manage Users, Products, and Support)
- 📱 Fully Responsive Design (Desktop, Tablet, Mobile)
- 💾 LocalStorage-based Data Handling
- 📈 Sales Analytics using Chart.js

## 📁 File Structure

```bash
ecommerce-multi-actor/
│
├── index.html                      # Optional redirect to pages/home.html
│
├── pages/
│   ├── home.html                   # Home page
│   ├── catalog.html                # Product catalog
│   ├── product.html                # Product details
│   ├── cart.html                   # Shopping cart
│   ├── checkout.html               # Checkout process
│   ├── login.html                  # User login
│   ├── register.html               # User registration
│   └── dashboard/
│       ├── customer.html           # Customer dashboard
│       ├── seller.html             # Seller dashboard
│       ├── admin.html              # Admin panel
│       └── analytics.html          # Sales analytics (Chart.js)
│
├── assets/
│   ├── css/
│   │   ├── style.css               # Custom styles
│   │   └── bootstrap.min.css       # Bootstrap CSS
│   ├── js/
│   │   ├── main.js                 # General JS logic
│   │   ├── cart.js                 # Cart functionality
│   │   ├── auth.js                 # Login/role validation
│   │   ├── seller.js               # Seller features
│   │   └── admin.js                # Admin functions
│   ├── img/
│   │   ├── logo.png                # Site logo
│   │   └── [product images]        # Product images
│   └── fonts/
│       └── [custom fonts]          # Optional web fonts
│
├── data/
│   ├── products.json               # Product data
│   ├── users.json                  # User data
│   └── orders.json                 # Orders data
│
├── README.md                       # Project overview and structure
├── LICENSE                         # License (optional)
├── .gitignore                      # Git ignored files
└── package.json                    # npm config (if used)


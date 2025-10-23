# 🎁 Custom Gift Shop - Complete E-commerce Solution

A fully functional custom gift shop built with modern web technologies, featuring a beautiful responsive UI, complete admin panel, and comprehensive reporting system.

## 🌟 Features

### 🛍️ **Frontend Features**
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Beautiful Bootstrap 5.3.0 design
- **Product Catalog** - Dynamic product loading from database
- **Category Pages** - Individual pages for each product category
- **Product Details** - Comprehensive product information with image galleries
- **Shopping Cart** - Full cart functionality with persistence
- **Checkout Process** - Multi-step checkout with form validation
- **Search & Filter** - Advanced product search and filtering
- **Contact Form** - Integrated contact system

### 🔧 **Admin Panel Features**
- **Secure Authentication** - Admin login system
- **Dashboard** - Comprehensive admin dashboard with statistics
- **Category Management** - Add, edit, delete product categories
- **Product Management** - Complete product CRUD operations
- **Order Management** - Track and manage customer orders
- **User Management** - Customer account management
- **Reports & Analytics** - Detailed business reports and charts
- **Export Functionality** - PDF, Excel, CSV export options

### 📊 **Reporting System**
- **Sales Reports** - Revenue trends and performance analytics
- **Product Analytics** - Product performance and category distribution
- **Customer Analytics** - Customer growth and segmentation
- **Inventory Reports** - Stock levels and low stock alerts
- **Interactive Charts** - Chart.js powered visualizations
- **Real-time Data** - Live database integration

## 🛠️ **Technology Stack**

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Modern JavaScript features
- **Bootstrap 5.3.0** - Responsive framework
- **Font Awesome 6.4.0** - Icon library
- **Chart.js** - Interactive charts and graphs

### **Backend**
- **PHP 8.0+** - Server-side scripting
- **MySQL 8.0** - Database management
- **PDO** - Database abstraction layer
- **RESTful API** - Clean API endpoints

### **Development Tools**
- **XAMPP** - Local development environment
- **phpMyAdmin** - Database management
- **Git** - Version control

## 📁 **Project Structure**

```
custom-gift/
├── assets/
│   ├── css/
│   │   ├── style.css              # Main stylesheet
│   │   ├── admin.css              # Admin panel styles
│   │   └── product-detail.css     # Product detail styles
│   └── js/
│       ├── script.js              # Main JavaScript
│       ├── products.js            # Product functionality
│       ├── product-detail.js      # Product detail page
│       ├── cart.js                # Shopping cart
│       ├── checkout.js            # Checkout process
│       ├── categories.js          # Category management
│       ├── admin-login.js         # Admin authentication
│       ├── admin-dashboard.js     # Admin dashboard
│       └── admin-reports.js       # Reports system
├── php/
│   ├── config.php                 # Database configuration
│   └── api.php                    # RESTful API endpoints
├── index.html                     # Homepage
├── products.html                  # Product listing
├── product-detail.html            # Product detail page
├── cart.html                      # Shopping cart
├── checkout.html                  # Checkout process
├── admin-login.html               # Admin login
├── admin-dashboard.html           # Admin dashboard
├── admin-reports.html             # Reports dashboard
├── database-setup.sql             # Database schema
└── README.md                      # This file
```

## 🚀 **Installation & Setup**

### **Prerequisites**
- **XAMPP** (Apache + MySQL + PHP)
- **MySQL Server 8.0**
- **Web Browser** (Chrome, Firefox, Safari, Edge)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/yourusername/custom-gift-shop.git
cd custom-gift-shop
```

### **Step 2: Database Setup**
1. **Start XAMPP** services (Apache + MySQL)
2. **Open phpMyAdmin** (http://localhost/phpmyadmin)
3. **Create Database** named `custom_gift_shop`
4. **Import** `database-setup.sql` file
5. **Update** `php/config.php` with your database credentials

### **Step 3: Configure Database**
Edit `php/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'custom_gift_shop');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
```

### **Step 4: Deploy to XAMPP**
1. **Copy** project folder to `C:\xampp\htdocs\custom-gift`
2. **Access** via `http://localhost/custom-gift`

## 🔑 **Default Login Credentials**

### **Admin Panel**
- **Username:** `admin`
- **Password:** `admin123`
- **URL:** `http://localhost/custom-gift/admin-login.html`

## 📊 **Database Schema**

### **Tables**
- `categories` - Product categories
- `products` - Product information
- `users` - Customer accounts
- `admin_users` - Admin accounts
- `orders` - Order information
- `order_items` - Order line items
- `product_reviews` - Product reviews
- `contact_messages` - Contact form submissions

## 🎯 **Key Features Explained**

### **Dynamic Content Loading**
- All products and categories loaded from database
- Real-time API integration
- Responsive image handling with fallbacks

### **Admin Panel**
- Secure authentication system
- Complete CRUD operations
- Real-time statistics and analytics
- Export functionality for reports

### **Shopping Cart**
- LocalStorage persistence
- Quantity management
- Coupon system
- Recently viewed products

### **Responsive Design**
- Mobile-first approach
- Bootstrap 5.3.0 framework
- Custom CSS for enhanced styling
- Cross-browser compatibility

## 🔧 **API Endpoints**

### **Products**
- `GET /php/api.php?action=get-products` - Get all products
- `GET /php/api.php?action=get-product&id={id}` - Get single product
- `GET /php/api.php?action=get-products-by-category&category_id={id}` - Get products by category

### **Categories**
- `GET /php/api.php?action=get-categories` - Get all categories
- `POST /php/api.php/categories` - Create category
- `PUT /php/api.php/categories/{id}` - Update category
- `DELETE /php/api.php/categories/{id}` - Delete category

### **Admin**
- `POST /php/api.php/admin/login` - Admin login
- `GET /php/api.php/admin/stats` - Get admin statistics
- `GET /php/api.php/admin/reports` - Get reports data

## 🎨 **Customization**

### **Styling**
- Modify `assets/css/style.css` for main styling
- Update `assets/css/admin.css` for admin panel
- Customize Bootstrap variables in CSS

### **Functionality**
- Extend JavaScript files for new features
- Add new API endpoints in `php/api.php`
- Modify database schema as needed

## 📱 **Browser Support**

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 **Acknowledgments**

- **Bootstrap** - For the responsive framework
- **Font Awesome** - For the icon library
- **Chart.js** - For interactive charts
- **Unsplash** - For sample product images
- **XAMPP** - For the development environment

## 📞 **Support**

If you have any questions or need help with the project:

1. **Check** the documentation above
2. **Search** existing issues
3. **Create** a new issue with detailed description
4. **Contact** the author directly

---

**⭐ Star this repository if you found it helpful!**

**🎁 Happy Coding!**
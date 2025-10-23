# Custom Gift Shop - Installation Guide

## Prerequisites

Before installing the Custom Gift Shop, make sure you have the following installed on your system:

### Required Software:
1. **Web Server** (Apache/Nginx)
2. **PHP 7.4 or higher**
3. **MySQL 5.7 or higher**
4. **Web Browser** (Chrome, Firefox, Safari, Edge)

### Recommended Setup:
- **XAMPP** (Windows/Mac/Linux) - Includes Apache, PHP, MySQL
- **WAMP** (Windows)
- **MAMP** (Mac)
- **LAMP** (Linux)

## Installation Steps

### Step 1: Download and Extract Files
1. Download all project files
2. Extract to your web server directory:
   - **XAMPP**: `C:\xampp\htdocs\custom-gift\`
   - **WAMP**: `C:\wamp64\www\custom-gift\`
   - **MAMP**: `/Applications/MAMP/htdocs/custom-gift/`

### Step 2: Start Web Server and MySQL
1. Start XAMPP/WAMP/MAMP
2. Start **Apache** service
3. Start **MySQL** service

### Step 3: Create Database
1. Open **phpMyAdmin** in your browser: `http://localhost/phpmyadmin`
2. Click **"New"** to create a new database
3. Enter database name: `custom_gift_shop`
4. Select collation: `utf8mb4_general_ci`
5. Click **"Create"**

### Step 4: Import Database Schema
1. In phpMyAdmin, select the `custom_gift_shop` database
2. Click **"Import"** tab
3. Click **"Choose File"** and select `database-setup.sql`
4. Click **"Go"** to import

### Step 5: Configure Database Connection
1. Open `php/config.php`
2. Update database settings if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Your MySQL password
   define('DB_NAME', 'custom_gift_shop');
   ```

### Step 6: Set File Permissions
1. Create `uploads` directory in project root
2. Set permissions to 755 (or 777 if needed)
3. Create subdirectories:
   - `uploads/products/`
   - `uploads/categories/`
   - `uploads/users/`

### Step 7: Test Installation
1. Open browser and go to: `http://localhost/custom-gift/`
2. You should see the Custom Gift Shop homepage
3. Test admin login: `http://localhost/custom-gift/admin-login.html`
   - Username: `admin`
   - Password: `admin123`

## Configuration Options

### Database Settings (`php/config.php`)
```php
// Database connection
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'custom_gift_shop');

// Site settings
define('SITE_NAME', 'Custom Gift Shop');
define('SITE_URL', 'http://localhost/custom-gift');
define('ADMIN_EMAIL', 'admin@customgift.com');
```

### Email Settings (for contact form)
```php
// SMTP settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
```

## Default Data

The installation includes sample data:

### Categories:
- Personalized Mugs
- Photo Frames
- Custom Apparel
- Jewelry
- Phone Accessories
- Home Decor

### Sample Products:
- Personalized Coffee Mug ($24.99)
- Custom Travel Mug ($29.99)
- Custom Photo Frame ($19.99)
- Personalized T-Shirt ($29.99)
- Custom Jewelry Box ($39.99)
- Personalized Phone Case ($18.99)
- Custom Wall Art ($49.99)

### Admin Account:
- **Username**: `admin`
- **Password**: `admin123`

### Sample Users:
- john@example.com (password: password123)
- jane@example.com (password: password123)
- mike@example.com (password: password123)

## Troubleshooting

### Common Issues:

#### 1. Database Connection Error
- Check if MySQL service is running
- Verify database credentials in `php/config.php`
- Ensure database `custom_gift_shop` exists

#### 2. File Upload Issues
- Check `uploads` directory permissions
- Ensure PHP `file_uploads` is enabled
- Check `upload_max_filesize` in php.ini

#### 3. Admin Login Not Working
- Verify admin user exists in database
- Check if password is correctly hashed
- Clear browser cache and cookies

#### 4. Images Not Loading
- Check image URLs in database
- Verify image files exist
- Check file permissions

#### 5. PHP Errors
- Enable error reporting in `php/config.php`
- Check PHP error logs
- Verify PHP version compatibility

### Error Logs Location:
- **XAMPP**: `C:\xampp\apache\logs\error.log`
- **WAMP**: `C:\wamp64\logs\apache_error.log`
- **MAMP**: `/Applications/MAMP/logs/apache_error.log`

## Security Considerations

### For Production Deployment:

1. **Change Default Passwords**
   - Update admin password
   - Use strong passwords for all accounts

2. **Database Security**
   - Use strong database passwords
   - Limit database user permissions
   - Enable SSL for database connections

3. **File Permissions**
   - Set proper file permissions (644 for files, 755 for directories)
   - Restrict access to sensitive files

4. **PHP Security**
   - Disable `display_errors` in production
   - Use HTTPS for all connections
   - Enable CSRF protection

5. **Server Security**
   - Keep server software updated
   - Use firewall protection
   - Regular security audits

## Support

If you encounter any issues during installation:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Check error logs for specific error messages
4. Ensure all files are properly uploaded
5. Test with a fresh installation

## Features Overview

### Frontend Features:
- Responsive homepage with hero section
- Product categories with dynamic loading
- Individual product detail pages
- Shopping cart functionality
- Checkout process
- Contact form
- User reviews and ratings

### Admin Features:
- Secure admin login system
- Dashboard with statistics
- Category management (CRUD)
- Product management (CRUD)
- Order management
- User management
- Contact message management

### Technical Features:
- MySQL database with proper relationships
- PHP backend with REST API
- Bootstrap 5 responsive design
- JavaScript for dynamic functionality
- Image upload and management
- Session management
- Form validation
- Error handling

## Next Steps

After successful installation:

1. **Customize Content**
   - Update site information
   - Add your own products and categories
   - Customize colors and branding

2. **Configure Email**
   - Set up SMTP for contact form
   - Configure order notifications

3. **Add More Features**
   - Payment gateway integration
   - Advanced search functionality
   - User registration system
   - Newsletter subscription

4. **Deploy to Production**
   - Set up production server
   - Configure domain and SSL
   - Optimize for performance
   - Set up backups

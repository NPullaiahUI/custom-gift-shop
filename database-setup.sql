-- Custom Gift Shop Database Setup
-- Run this script in MySQL to create the complete database

-- Create database
CREATE DATABASE IF NOT EXISTS custom_gift_shop;
USE custom_gift_shop;

-- Drop existing tables if they exist (for fresh installation)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS contact_messages;

-- Create categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    images TEXT, -- JSON array of additional images
    category_id INT NOT NULL,
    stock INT DEFAULT 0,
    features TEXT, -- JSON array of features
    sizes VARCHAR(500), -- Comma separated sizes
    colors VARCHAR(500), -- Comma separated colors
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admin_users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator') DEFAULT 'admin',
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create order_items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    customization TEXT, -- Custom text/design for the product
    options JSON, -- Size, color, material options
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create product_reviews table
CREATE TABLE product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create contact_messages table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_customer ON orders(customer_email);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_status ON product_reviews(status);

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Personalized Mugs', 'personalized-mugs', 'Custom ceramic mugs with personal designs', 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1),
('Photo Frames', 'photo-frames', 'Beautiful frames for your memories', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 2),
('Custom Apparel', 'custom-apparel', 'Personalized clothing and accessories', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 3),
('Jewelry', 'jewelry', 'Custom jewelry and accessories', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4),
('Phone Accessories', 'phone-accessories', 'Custom phone cases and accessories', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 5),
('Home Decor', 'home-decor', 'Personalized home decoration items', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 6);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category_id, stock, features, sizes, colors, rating, review_count) VALUES
('Personalized Coffee Mug', 'Custom ceramic mug with your favorite photo or text. Perfect for coffee lovers! Made from premium ceramic material that\'s dishwasher and microwave safe.', 24.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 1, 50, '["Dishwasher safe", "Microwave safe", "High quality ceramic", "Comes with gift box"]', '11oz,15oz,20oz', 'White,Black,Navy,Gray', 4.5, 128),
('Custom Travel Mug', 'Insulated travel mug with custom design. Keeps drinks hot or cold for hours. Perfect for on-the-go lifestyle.', 29.99, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 1, 30, '["Insulated design", "Leak-proof lid", "Custom design printing", "Easy to clean"]', '12oz,16oz,20oz', 'White,Black,Stainless Steel', 4.7, 95),
('Custom Photo Frame', 'Elegant wooden frame with personalized engraving. Perfect for displaying precious memories.', 19.99, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 2, 25, '["Handcrafted wooden frame", "Custom engraving available", "High-quality glass included", "Ready to hang"]', '4x6,5x7,8x10,11x14', 'Oak,Walnut,Cherry,Bamboo', 4.8, 95),
('Personalized T-Shirt', 'High-quality cotton t-shirt with custom design. Available in multiple sizes and colors.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 3, 40, '["100% cotton material", "Custom design printing", "Machine washable", "Comfortable fit"]', 'S,M,L,XL,XXL', 'White,Black,Navy,Gray,Red', 4.3, 156),
('Custom Jewelry Box', 'Beautiful wooden jewelry box with personal engraving. Perfect for storing precious items.', 39.99, 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 4, 20, '["Handcrafted wooden construction", "Velvet-lined interior", "Custom engraving available", "Multiple compartments"]', 'Small,Medium,Large', 'Wood,Velvet Lined', 4.7, 87),
('Personalized Phone Case', 'Protective phone case with your custom design. Compatible with all major phone models.', 18.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 5, 60, '["Shock-absorbing material", "Custom design printing", "Precise cutouts", "Easy installation"]', 'iPhone 15,iPhone 14,Samsung Galaxy S24,Google Pixel 8', 'Clear,Black,White,Transparent', 4.4, 203),
('Custom Wall Art', 'Personalized wall art with your photos or custom design. Perfect for home decoration.', 49.99, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 6, 15, '["High-quality printing", "Multiple material options", "Ready to hang", "Custom design available"]', '8x10,11x14,16x20,20x24', 'Canvas,Metal,Wood', 4.6, 156);

-- Insert admin user
INSERT INTO admin_users (username, password, email, full_name, role) VALUES
('admin', MD5('admin123'), 'admin@customgift.com', 'Administrator', 'admin');

-- Insert sample users
INSERT INTO users (name, email, password, phone, address, city, state, zip_code, country) VALUES
('John Doe', 'john@example.com', MD5('password123'), '+1-555-0123', '123 Main St', 'New York', 'NY', '10001', 'USA'),
('Jane Smith', 'jane@example.com', MD5('password123'), '+1-555-0124', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'USA'),
('Mike Johnson', 'mike@example.com', MD5('password123'), '+1-555-0125', '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA');

-- Insert sample orders
INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, payment_status, order_status) VALUES
('ORD-001', 1, 'John Doe', 'john@example.com', '+1-555-0123', '123 Main St, New York, NY 10001', 89.97, 'Credit Card', 'paid', 'processing'),
('ORD-002', 2, 'Jane Smith', 'jane@example.com', '+1-555-0124', '456 Oak Ave, Los Angeles, CA 90210', 45.98, 'PayPal', 'paid', 'shipped'),
('ORD-003', 3, 'Mike Johnson', 'mike@example.com', '+1-555-0125', '789 Pine Rd, Chicago, IL 60601', 67.50, 'Credit Card', 'pending', 'pending');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, customization, options) VALUES
(1, 1, 'Personalized Coffee Mug', 24.99, 2, 'Happy Birthday John!', '{"size": "15oz", "color": "Black"}'),
(1, 3, 'Custom Photo Frame', 19.99, 1, 'Family Photo', '{"size": "8x10", "material": "Oak"}'),
(1, 5, 'Custom Jewelry Box', 39.99, 1, 'For Mom', '{"size": "Medium", "material": "Wood"}'),
(2, 2, 'Custom Travel Mug', 29.99, 1, 'Work Mug', '{"size": "16oz", "color": "White"}'),
(2, 4, 'Personalized T-Shirt', 29.99, 1, 'Team Logo', '{"size": "L", "color": "Navy"}'),
(3, 6, 'Personalized Phone Case', 18.99, 2, 'Custom Design', '{"model": "iPhone 15", "color": "Clear"}'),
(3, 7, 'Custom Wall Art', 49.99, 1, 'Living Room Art', '{"size": "16x20", "material": "Canvas"}');

-- Insert sample reviews
INSERT INTO product_reviews (product_id, user_id, reviewer_name, reviewer_email, rating, title, review_text, status) VALUES
(1, 1, 'John Doe', 'john@example.com', 5, 'Perfect coffee mug!', 'Love this mug! The quality is excellent and the custom printing looks amazing. Perfect for my morning coffee.', 'approved'),
(1, 2, 'Jane Smith', 'jane@example.com', 4, 'Great quality', 'Good mug, nice quality ceramic. The custom text came out clear and crisp. Would recommend!', 'approved'),
(3, 1, 'John Doe', 'john@example.com', 5, 'Beautiful frame', 'The wooden frame is beautifully crafted and the engraving looks perfect. Great gift for family photos.', 'approved'),
(4, 2, 'Jane Smith', 'jane@example.com', 4, 'Comfortable shirt', 'Nice quality t-shirt. The custom design looks great and it\'s very comfortable to wear.', 'approved');

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('Sarah Wilson', 'sarah@example.com', 'Custom Order Inquiry', 'Hi, I would like to place a custom order for 50 personalized mugs for our company event. Can you provide a quote?', 'unread'),
('David Brown', 'david@example.com', 'Product Question', 'Do you offer bulk discounts for large orders? We need about 100 custom t-shirts for our team.', 'read'),
('Lisa Davis', 'lisa@example.com', 'Shipping Information', 'What are your shipping options to Canada? I need to know the estimated delivery time.', 'unread');

-- Create a view for product statistics
CREATE VIEW product_stats AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock,
    p.rating,
    p.review_count,
    c.name as category_name,
    COUNT(oi.id) as total_orders,
    SUM(oi.quantity) as total_quantity_sold
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.price, p.stock, p.rating, p.review_count, c.name;

-- Create a view for order statistics
CREATE VIEW order_stats AS
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value
FROM orders
WHERE order_status != 'cancelled'
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Show completion message
SELECT 'Database setup completed successfully!' as message;
SELECT 'Admin login: username=admin, password=admin123' as admin_info;
SELECT 'Sample data inserted for testing' as data_info;

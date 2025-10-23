<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'custom_gift_shop');

// Create database connection
class Database {
    private $host = DB_HOST;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $dbname = DB_NAME;
    private $conn;
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        try {
            $this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
}

// Database setup and initialization
class DatabaseSetup {
    private $conn;
    
    public function __construct() {
        try {
            // Connect without database first
            $this->conn = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    public function createDatabase() {
        try {
            $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
            $this->conn->exec($sql);
            echo "Database created successfully<br>";
            
            // Select the database
            $this->conn->exec("USE " . DB_NAME);
            
            // Create tables
            $this->createTables();
            
        } catch(PDOException $e) {
            echo "Error creating database: " . $e->getMessage() . "<br>";
        }
    }
    
    private function createTables() {
        $tables = [
            // Categories table
            "CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                image_url VARCHAR(255),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Products table
            "CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                image_url VARCHAR(255),
                category_id INT,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )",
            
            // Contact messages table
            "CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                status ENUM('read', 'unread') DEFAULT 'unread',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )",
            
            // Orders table
            "CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(100) NOT NULL,
                customer_email VARCHAR(100) NOT NULL,
                customer_phone VARCHAR(20),
                total_amount DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                shipping_address TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Order items table
            "CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10,2) NOT NULL,
                customization_details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )",
            
            // Users table (for admin)
            "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )"
        ];
        
        foreach ($tables as $table) {
            try {
                $this->conn->exec($table);
                echo "Table created successfully<br>";
            } catch(PDOException $e) {
                echo "Error creating table: " . $e->getMessage() . "<br>";
            }
        }
    }
    
    public function insertSampleData() {
        try {
            // Insert sample categories
            $categories = [
                ['Personalized Mugs', 'Custom ceramic mugs with photos and text', 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                ['Photo Frames', 'Elegant frames with custom engravings', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                ['Custom Apparel', 'Personalized t-shirts and clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                ['Jewelry', 'Custom jewelry and accessories', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                ['Phone Accessories', 'Custom phone cases and accessories', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                ['Home Decor', 'Custom home decoration items', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80']
            ];
            
            $stmt = $this->conn->prepare("INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)");
            foreach ($categories as $category) {
                $stmt->execute($category);
            }
            echo "Sample categories inserted<br>";
            
            // Insert sample products
            $products = [
                ['Personalized Coffee Mug', 'Custom ceramic mug with your favorite photo or text. Perfect for coffee lovers!', 24.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 1],
                ['Custom Photo Frame', 'Elegant wooden frame with personalized engraving. Perfect for displaying precious memories.', 19.99, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 2],
                ['Personalized T-Shirt', 'High-quality cotton t-shirt with custom design. Available in multiple sizes and colors.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 3],
                ['Custom Jewelry Box', 'Beautiful wooden jewelry box with personal engraving. Perfect for storing precious items.', 39.99, 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 4],
                ['Personalized Phone Case', 'Protective phone case with your custom design. Compatible with all major phone models.', 18.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 5],
                ['Custom Canvas Print', 'High-quality canvas print of your favorite photo. Perfect for home decoration.', 34.99, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 6],
                ['Personalized Keychain', 'Custom metal keychain with your name or message. Durable and stylish.', 12.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 4],
                ['Custom Notebook', 'Personalized notebook with your name or design. Perfect for students and professionals.', 16.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 6]
            ];
            
            $stmt = $this->conn->prepare("INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)");
            foreach ($products as $product) {
                $stmt->execute($product);
            }
            echo "Sample products inserted<br>";
            
            // Insert admin user
            $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
            $stmt = $this->conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
            $stmt->execute(['admin', 'admin@customgift.com', $adminPassword, 'admin']);
            echo "Admin user created (username: admin, password: admin123)<br>";
            
        } catch(PDOException $e) {
            echo "Error inserting sample data: " . $e->getMessage() . "<br>";
        }
    }
}

// Run setup if accessed directly
if (basename($_SERVER['PHP_SELF']) == 'setup.php') {
    echo "<h2>Custom Gift Shop Database Setup</h2>";
    echo "<p>Setting up database and tables...</p>";
    
    $setup = new DatabaseSetup();
    $setup->createDatabase();
    $setup->insertSampleData();
    
    echo "<p><strong>Setup completed successfully!</strong></p>";
    echo "<p>You can now use the Custom Gift Shop application.</p>";
    echo "<p><a href='../index.html'>Go to Home Page</a></p>";
}
?>

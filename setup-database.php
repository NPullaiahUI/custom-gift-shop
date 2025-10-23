<?php
// Database Setup Script
// Run this file to automatically set up the database

require_once 'config.php';

echo "<h2>Custom Gift Shop - Database Setup</h2>";

try {
    // Test database connection
    $database = new Database();
    
    if ($database->testConnection()) {
        echo "<p style='color: green;'>✓ Database connection successful!</p>";
        
        // Get database info
        $info = $database->getDatabaseInfo();
        if ($info) {
            echo "<p><strong>Database:</strong> " . $info['db_name'] . "</p>";
            echo "<p><strong>MySQL Version:</strong> " . $info['version'] . "</p>";
        }
        
        // Check if tables exist
        $conn = $database->getConnection();
        $tables = ['categories', 'products', 'users', 'admin_users', 'orders', 'order_items', 'product_reviews', 'contact_messages'];
        
        echo "<h3>Checking Tables:</h3>";
        $allTablesExist = true;
        
        foreach ($tables as $table) {
            $stmt = $conn->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() > 0) {
                echo "<p style='color: green;'>✓ Table '$table' exists</p>";
            } else {
                echo "<p style='color: red;'>✗ Table '$table' missing</p>";
                $allTablesExist = false;
            }
        }
        
        if ($allTablesExist) {
            echo "<h3>Checking Sample Data:</h3>";
            
            // Check categories
            $stmt = $conn->query("SELECT COUNT(*) as count FROM categories");
            $categoryCount = $stmt->fetch()['count'];
            echo "<p>Categories: $categoryCount</p>";
            
            // Check products
            $stmt = $conn->query("SELECT COUNT(*) as count FROM products");
            $productCount = $stmt->fetch()['count'];
            echo "<p>Products: $productCount</p>";
            
            // Check admin users
            $stmt = $conn->query("SELECT COUNT(*) as count FROM admin_users");
            $adminCount = $stmt->fetch()['count'];
            echo "<p>Admin Users: $adminCount</p>";
            
            if ($categoryCount > 0 && $productCount > 0 && $adminCount > 0) {
                echo "<h3 style='color: green;'>✓ Database setup complete!</h3>";
                echo "<p><strong>Admin Login:</strong></p>";
                echo "<ul>";
                echo "<li>URL: <a href='admin-login.html'>admin-login.html</a></li>";
                echo "<li>Username: admin</li>";
                echo "<li>Password: admin123</li>";
                echo "</ul>";
                
                echo "<p><strong>Frontend:</strong></p>";
                echo "<ul>";
                echo "<li>Homepage: <a href='index.html'>index.html</a></li>";
                echo "<li>Products: <a href='products.html'>products.html</a></li>";
                echo "</ul>";
            } else {
                echo "<h3 style='color: orange;'>⚠ Database exists but sample data is missing</h3>";
                echo "<p>Please run the database-setup.sql file to insert sample data.</p>";
            }
            
        } else {
            echo "<h3 style='color: red;'>✗ Database tables are missing</h3>";
            echo "<p>Please run the database-setup.sql file to create all tables.</p>";
        }
        
    } else {
        echo "<p style='color: red;'>✗ Database connection failed!</p>";
        echo "<p>Please check your database configuration in php/config.php</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h3>Setup Instructions:</h3>";
echo "<ol>";
echo "<li>Make sure MySQL service is running</li>";
echo "<li>Create database 'custom_gift_shop' in phpMyAdmin</li>";
echo "<li>Import database-setup.sql file</li>";
echo "<li>Check database configuration in php/config.php</li>";
echo "<li>Create 'uploads' directory with proper permissions</li>";
echo "</ol>";

echo "<h3>Quick Setup Commands:</h3>";
echo "<pre>";
echo "# Create database\n";
echo "mysql -u root -p -e \"CREATE DATABASE custom_gift_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;\"\n\n";
echo "# Import schema\n";
echo "mysql -u root -p custom_gift_shop < database-setup.sql\n\n";
echo "# Create uploads directory\n";
echo "mkdir uploads\n";
echo "mkdir uploads/products\n";
echo "mkdir uploads/categories\n";
echo "chmod 755 uploads\n";
echo "</pre>";
?>

<?php
// Database Connection Test Script
// Run this to test your MySQL connection

echo "<h2>MySQL Database Connection Test</h2>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; }
    .error { color: red; }
    .info { color: blue; }
    .warning { color: orange; }
</style>";

// Test different password combinations
$passwords = ['', 'root', 'password', 'admin', '123456'];

foreach ($passwords as $password) {
    echo "<h3>Testing with password: '" . ($password ?: 'empty') . "'</h3>";
    
    try {
        $dsn = "mysql:host=localhost;charset=utf8mb4";
        $pdo = new PDO($dsn, 'root', $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        echo "<p class='success'>✓ Connection successful!</p>";
        
        // Get MySQL version
        $stmt = $pdo->query("SELECT VERSION() as version");
        $version = $stmt->fetch()['version'];
        echo "<p class='info'>MySQL Version: $version</p>";
        
        // Check if database exists
        $stmt = $pdo->query("SHOW DATABASES LIKE 'custom_gift_shop'");
        if ($stmt->rowCount() > 0) {
            echo "<p class='success'>✓ Database 'custom_gift_shop' exists</p>";
            
            // Connect to the specific database
            $dsn = "mysql:host=localhost;dbname=custom_gift_shop;charset=utf8mb4";
            $pdo = new PDO($dsn, 'root', $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Check tables
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            if (count($tables) > 0) {
                echo "<p class='success'>✓ Database has " . count($tables) . " tables</p>";
                echo "<p class='info'>Tables: " . implode(', ', $tables) . "</p>";
            } else {
                echo "<p class='warning'>⚠ Database exists but has no tables</p>";
            }
            
        } else {
            echo "<p class='warning'>⚠ Database 'custom_gift_shop' does not exist</p>";
            echo "<p>You need to create the database first.</p>";
        }
        
        echo "<hr>";
        break; // Stop testing once we find a working password
        
    } catch (PDOException $e) {
        echo "<p class='error'>✗ Connection failed: " . $e->getMessage() . "</p>";
    }
}

echo "<h3>Next Steps:</h3>";
echo "<ol>";
echo "<li>If connection is successful, update php/config.php with the correct password</li>";
echo "<li>If database doesn't exist, create it using phpMyAdmin or command line</li>";
echo "<li>Import database-setup.sql to create tables and sample data</li>";
echo "<li>Test the application</li>";
echo "</ol>";

echo "<h3>Create Database Commands:</h3>";
echo "<pre>";
echo "# Using MySQL command line (if available):\n";
echo "mysql -u root -p -e \"CREATE DATABASE custom_gift_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;\"\n\n";
echo "# Or using phpMyAdmin:\n";
echo "1. Go to http://localhost/phpmyadmin\n";
echo "2. Click 'New' to create database\n";
echo "3. Enter name: custom_gift_shop\n";
echo "4. Select collation: utf8mb4_general_ci\n";
echo "5. Click 'Create'\n";
echo "</pre>";

echo "<h3>Import Database Schema:</h3>";
echo "<pre>";
echo "# Using MySQL command line:\n";
echo "mysql -u root -p custom_gift_shop < database-setup.sql\n\n";
echo "# Or using phpMyAdmin:\n";
echo "1. Select custom_gift_shop database\n";
echo "2. Click 'Import' tab\n";
echo "3. Choose database-setup.sql file\n";
echo "4. Click 'Go'\n";
echo "</pre>";
?>

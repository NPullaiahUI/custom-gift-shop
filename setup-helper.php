<?php
// Database Setup Helper Script
// This script will help you create the database and import the schema

echo "<h2>Custom Gift Shop - Database Setup Helper</h2>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; }
    .error { color: red; }
    .info { color: blue; }
    .warning { color: orange; }
    .step { background: #f0f0f0; padding: 10px; margin: 10px 0; border-left: 4px solid #007cba; }
</style>";

// Function to test connection
function testConnection($password) {
    try {
        $dsn = "mysql:host=localhost;charset=utf8mb4";
        $pdo = new PDO($dsn, 'root', $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return ['success' => true, 'pdo' => $pdo];
    } catch (PDOException $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// Function to create database
function createDatabase($pdo) {
    try {
        $pdo->exec("CREATE DATABASE IF NOT EXISTS custom_gift_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
        return true;
    } catch (PDOException $e) {
        return false;
    }
}

// Function to check if database exists
function databaseExists($pdo) {
    try {
        $stmt = $pdo->query("SHOW DATABASES LIKE 'custom_gift_shop'");
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

// Test different passwords
$passwords = ['', 'root', 'password', 'admin', '123456'];
$workingPassword = null;
$pdo = null;

echo "<h3>Step 1: Testing MySQL Connection</h3>";

foreach ($passwords as $password) {
    echo "<p>Testing with password: '" . ($password ?: 'empty') . "'</p>";
    
    $result = testConnection($password);
    if ($result['success']) {
        echo "<p class='success'>✓ Connection successful!</p>";
        $workingPassword = $password;
        $pdo = $result['pdo'];
        break;
    } else {
        echo "<p class='error'>✗ Connection failed: " . $result['error'] . "</p>";
    }
}

if (!$pdo) {
    echo "<p class='error'>Could not connect to MySQL. Please check:</p>";
    echo "<ul>";
    echo "<li>MySQL service is running</li>";
    echo "<li>Correct username and password</li>";
    echo "<li>MySQL is accessible on localhost:3306</li>";
    echo "</ul>";
    exit;
}

echo "<h3>Step 2: Database Setup</h3>";

// Check if database exists
if (databaseExists($pdo)) {
    echo "<p class='success'>✓ Database 'custom_gift_shop' already exists</p>";
} else {
    echo "<p class='warning'>Database 'custom_gift_shop' does not exist. Creating...</p>";
    
    if (createDatabase($pdo)) {
        echo "<p class='success'>✓ Database 'custom_gift_shop' created successfully</p>";
    } else {
        echo "<p class='error'>✗ Failed to create database</p>";
        exit;
    }
}

// Connect to the specific database
try {
    $dsn = "mysql:host=localhost;dbname=custom_gift_shop;charset=utf8mb4";
    $pdo = new PDO($dsn, 'root', $workingPassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p class='success'>✓ Connected to custom_gift_shop database</p>";
} catch (PDOException $e) {
    echo "<p class='error'>✗ Failed to connect to database: " . $e->getMessage() . "</p>";
    exit;
}

echo "<h3>Step 3: Checking Tables</h3>";

// Check if tables exist
$requiredTables = ['categories', 'products', 'users', 'admin_users', 'orders', 'order_items', 'product_reviews', 'contact_messages'];
$existingTables = [];

try {
    $stmt = $pdo->query("SHOW TABLES");
    $existingTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<p>Found " . count($existingTables) . " tables in database</p>";
    
    $missingTables = array_diff($requiredTables, $existingTables);
    
    if (empty($missingTables)) {
        echo "<p class='success'>✓ All required tables exist</p>";
        
        // Check for sample data
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM categories");
        $categoryCount = $stmt->fetch()['count'];
        
        if ($categoryCount > 0) {
            echo "<p class='success'>✓ Sample data found ($categoryCount categories)</p>";
            echo "<p class='info'>Database setup is complete!</p>";
        } else {
            echo "<p class='warning'>⚠ Tables exist but no sample data found</p>";
            echo "<p>You need to import the database-setup.sql file</p>";
        }
        
    } else {
        echo "<p class='warning'>⚠ Missing tables: " . implode(', ', $missingTables) . "</p>";
        echo "<p>You need to import the database-setup.sql file</p>";
    }
    
} catch (PDOException $e) {
    echo "<p class='error'>✗ Error checking tables: " . $e->getMessage() . "</p>";
}

echo "<h3>Step 4: Configuration Update</h3>";

if ($workingPassword !== null) {
    echo "<p class='info'>Update your php/config.php file with:</p>";
    echo "<pre>";
    echo "define('DB_HOST', 'localhost');\n";
    echo "define('DB_USER', 'root');\n";
    echo "define('DB_PASS', '" . $workingPassword . "');\n";
    echo "define('DB_NAME', 'custom_gift_shop');\n";
    echo "</pre>";
}

echo "<h3>Step 5: Next Steps</h3>";

if (count($existingTables) < count($requiredTables)) {
    echo "<div class='step'>";
    echo "<h4>Import Database Schema:</h4>";
    echo "<p>You need to import the database-setup.sql file. Choose one method:</p>";
    echo "<h5>Method 1: Using phpMyAdmin</h5>";
    echo "<ol>";
    echo "<li>Go to <a href='http://localhost/phpmyadmin' target='_blank'>http://localhost/phpmyadmin</a></li>";
    echo "<li>Select 'custom_gift_shop' database</li>";
    echo "<li>Click 'Import' tab</li>";
    echo "<li>Choose 'database-setup.sql' file</li>";
    echo "<li>Click 'Go'</li>";
    echo "</ol>";
    
    echo "<h5>Method 2: Using Command Line</h5>";
    echo "<pre>";
    echo "mysql -u root -p" . ($workingPassword ? " -p" . $workingPassword : "") . " custom_gift_shop < database-setup.sql";
    echo "</pre>";
    echo "</div>";
}

echo "<div class='step'>";
echo "<h4>Test the Application:</h4>";
echo "<ul>";
echo "<li><a href='index.html'>Homepage</a></li>";
echo "<li><a href='admin-login.html'>Admin Login</a> (admin/admin123)</li>";
echo "<li><a href='setup-database.php'>Database Setup Check</a></li>";
echo "</ul>";
echo "</div>";

echo "<div class='step'>";
echo "<h4>Create Uploads Directory:</h4>";
echo "<pre>";
echo "mkdir uploads\n";
echo "mkdir uploads/products\n";
echo "mkdir uploads/categories\n";
echo "chmod 755 uploads";
echo "</pre>";
echo "</div>";
?>

<?php
/**
 * Custom Gift Shop - Quick Setup Script
 * Run this file to verify your installation
 */

// Check PHP version
if (version_compare(PHP_VERSION, '7.4.0', '<')) {
    die('PHP 7.4 or higher is required. Current version: ' . PHP_VERSION);
}

// Check if required extensions are loaded
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'curl'];
$missing_extensions = [];

foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        $missing_extensions[] = $ext;
    }
}

if (!empty($missing_extensions)) {
    die('Missing required PHP extensions: ' . implode(', ', $missing_extensions));
}

// Test database connection
try {
    require_once 'php/config.php';
    $db = new Database();
    $conn = $db->getConnection();
    echo "✅ Database connection successful!\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "Please check your database configuration in php/config.php\n";
}

// Check if database tables exist
try {
    $stmt = $conn->query("SHOW TABLES LIKE 'categories'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Database tables found!\n";
    } else {
        echo "⚠️  Database tables not found. Please run database-setup.sql\n";
    }
} catch (Exception $e) {
    echo "❌ Error checking database tables: " . $e->getMessage() . "\n";
}

// Check file permissions
$writable_dirs = ['assets/', 'php/'];
foreach ($writable_dirs as $dir) {
    if (is_writable($dir)) {
        echo "✅ Directory $dir is writable\n";
    } else {
        echo "⚠️  Directory $dir is not writable\n";
    }
}

echo "\n🎉 Setup verification complete!\n";
echo "📖 For detailed setup instructions, see README.md\n";
echo "🚀 Your Custom Gift Shop is ready to use!\n";
?>

<?php
// Database Configuration File
// Update these settings according to your MySQL server

// Database connection settings
define('DB_HOST', 'localhost');        // MySQL server host
define('DB_USER', 'root');             // MySQL username
define('DB_PASS', '12345');            // MySQL password
define('DB_NAME', 'custom_gift_shop'); // Database name
define('DB_CHARSET', 'utf8mb4');       // Character set

// Database connection class
if (!class_exists('Database')) {
class Database {
    private $host = DB_HOST;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $dbname = DB_NAME;
    private $charset = DB_CHARSET;
    private $conn;
    private $error;
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->charset}"
            ];
            
            $this->conn = new PDO($dsn, $this->user, $this->pass, $options);
        } catch(PDOException $e) {
            $this->error = $e->getMessage();
            die("Database Connection Failed: " . $this->error);
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    public function getError() {
        return $this->error;
    }
    
    // Test database connection
    public function testConnection() {
        try {
            $stmt = $this->conn->query("SELECT 1");
            return true;
        } catch(PDOException $e) {
            return false;
        }
    }
    
    // Get database info
    public function getDatabaseInfo() {
        try {
            $stmt = $this->conn->query("SELECT DATABASE() as db_name, VERSION() as version");
            return $stmt->fetch();
        } catch(PDOException $e) {
            return false;
        }
    }
}

// Site configuration
define('SITE_NAME', 'Custom Gift Shop');
define('SITE_URL', 'http://localhost/custom-gift');
define('ADMIN_EMAIL', 'admin@customgift.com');

// Security settings
define('SESSION_TIMEOUT', 3600); // 1 hour in seconds
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_TIME', 900); // 15 minutes

// File upload settings
define('UPLOAD_PATH', 'uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Email settings (for contact form)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_FROM_EMAIL', 'noreply@customgift.com');
define('SMTP_FROM_NAME', 'Custom Gift Shop');

// Pagination settings
define('ITEMS_PER_PAGE', 12);
define('ADMIN_ITEMS_PER_PAGE', 20);

// Currency settings
define('CURRENCY_SYMBOL', '$');
define('CURRENCY_CODE', 'USD');

// Timezone
date_default_timezone_set('America/New_York');

// Error reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS

// Create upload directory if it doesn't exist
if (!file_exists(UPLOAD_PATH)) {
    mkdir(UPLOAD_PATH, 0755, true);
}

// Helper functions
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function formatPrice($price) {
    return CURRENCY_SYMBOL . number_format($price, 2);
}

function generateOrderNumber() {
    return 'ORD-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function isValidImage($file) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return in_array($file['type'], $allowedTypes);
}

function uploadImage($file, $directory = 'products') {
    if (!isValidImage($file)) {
        return ['success' => false, 'message' => 'Invalid image type'];
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => 'File too large'];
    }
    
    $uploadDir = UPLOAD_PATH . $directory . '/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return ['success' => true, 'filename' => $filename, 'path' => $filepath];
    } else {
        return ['success' => false, 'message' => 'Upload failed'];
    }
}
} // End of class_exists check

// Initialize database connection
try {
    $database = new Database();
    if (!$database->testConnection()) {
        die("Database connection test failed. Please check your configuration.");
    }
} catch(Exception $e) {
    die("Database initialization failed: " . $e->getMessage());
}
?>
<?php
// Include database configuration
require_once 'config.php';

// Database connection is handled by config.php

// Product class
class Product {
    private $conn;
    
    public function __construct($database) {
        $this->conn = $database->getConnection();
    }
    
    // Get all products
    public function getAllProducts() {
        $query = "SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    // Get all products for admin
    public function getAllProductsAdmin() {
        $query = "SELECT p.*, c.name as category_name FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  ORDER BY p.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    // Get product by ID
    public function getProductById($id) {
        $query = "SELECT * FROM products WHERE id = :id AND status = 'active'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }
    
    // Search products
    public function searchProducts($searchTerm) {
        $query = "SELECT * FROM products WHERE (name LIKE :search OR description LIKE :search) AND status = 'active'";
        $stmt = $this->conn->prepare($query);
        $searchTerm = "%{$searchTerm}%";
        $stmt->bindParam(':search', $searchTerm);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    // Get products by category
    public function getProductsByCategory($categoryId, $limit = 50) {
        $query = "SELECT * FROM products WHERE category_id = :category_id AND status = 'active' ORDER BY created_at DESC LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $categoryId);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    // Add new product
    public function addProduct($data) {
        $query = "INSERT INTO products (name, description, price, image_url, category_id, stock, features, sizes, colors, status) 
                  VALUES (:name, :description, :price, :image_url, :category_id, :stock, :features, :sizes, :colors, :status)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':stock', $data['stock']);
        $stmt->bindParam(':features', $data['features']);
        $stmt->bindParam(':sizes', $data['sizes']);
        $stmt->bindParam(':colors', $data['colors']);
        $stmt->bindParam(':status', $data['status']);
        return $stmt->execute();
    }
    
    // Update product
    public function updateProduct($id, $data) {
        $query = "UPDATE products SET name = :name, description = :description, price = :price, 
                  image_url = :image_url, category_id = :category_id, stock = :stock, 
                  features = :features, sizes = :sizes, colors = :colors, status = :status 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':stock', $data['stock']);
        $stmt->bindParam(':features', $data['features']);
        $stmt->bindParam(':sizes', $data['sizes']);
        $stmt->bindParam(':colors', $data['colors']);
        $stmt->bindParam(':status', $data['status']);
        return $stmt->execute();
    }
    
    // Delete product
    public function deleteProduct($id) {
        $query = "DELETE FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}

// Category class
class Category {
    private $conn;
    
    public function __construct($database) {
        $this->conn = $database->getConnection();
    }
    
    // Get all categories
    public function getAllCategories() {
        $query = "SELECT * FROM categories WHERE status = 'active' ORDER BY sort_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    // Get all categories for admin
    public function getAllCategoriesAdmin() {
        $query = "SELECT c.*, COUNT(p.id) as product_count FROM categories c 
                  LEFT JOIN products p ON c.id = p.category_id 
                  GROUP BY c.id ORDER BY c.sort_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    // Get category by ID
    public function getCategoryById($id) {
        $query = "SELECT * FROM categories WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }
    
    // Add new category
    public function addCategory($data) {
        $query = "INSERT INTO categories (name, slug, description, image_url, status, sort_order) 
                  VALUES (:name, :slug, :description, :image_url, :status, :sort_order)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':sort_order', $data['sort_order']);
        return $stmt->execute();
    }
    
    // Update category
    public function updateCategory($id, $data) {
        $query = "UPDATE categories SET name = :name, slug = :slug, description = :description, 
                  image_url = :image_url, status = :status, sort_order = :sort_order 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':sort_order', $data['sort_order']);
        return $stmt->execute();
    }
    
    // Delete category
    public function deleteCategory($id) {
        $query = "DELETE FROM categories WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}

// Contact class
class Contact {
    private $conn;
    
    public function __construct($database) {
        $this->conn = $database->getConnection();
    }
    
    // Save contact message
    public function saveMessage($data) {
        $query = "INSERT INTO contact_messages (name, email, subject, message, status) 
                  VALUES (:name, :email, :subject, :message, 'unread')";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':subject', $data['subject']);
        $stmt->bindParam(':message', $data['message']);
        return $stmt->execute();
    }
    
    // Get all messages
    public function getAllMessages() {
        $query = "SELECT * FROM contact_messages ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

// Order class
class Order {
    private $conn;
    
    public function __construct($database) {
        $this->conn = $database->getConnection();
    }
    
    // Create new order
    public function createOrder($data) {
        $this->conn->beginTransaction();
        
        try {
            // Insert order
            $query = "INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount, status) 
                      VALUES (:customer_name, :customer_email, :customer_phone, :total_amount, 'pending')";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':customer_name', $data['customer_name']);
            $stmt->bindParam(':customer_email', $data['customer_email']);
            $stmt->bindParam(':customer_phone', $data['customer_phone']);
            $stmt->bindParam(':total_amount', $data['total_amount']);
            $stmt->execute();
            
            $orderId = $this->conn->lastInsertId();
            
            // Insert order items
            foreach ($data['items'] as $item) {
                $query = "INSERT INTO order_items (order_id, product_id, quantity, price) 
                          VALUES (:order_id, :product_id, :quantity, :price)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':order_id', $orderId);
                $stmt->bindParam(':product_id', $item['product_id']);
                $stmt->bindParam(':quantity', $item['quantity']);
                $stmt->bindParam(':price', $item['price']);
                $stmt->execute();
            }
            
            $this->conn->commit();
            return $orderId;
            
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }
    
    // Get order by ID
    public function getOrderById($id) {
        $query = "SELECT o.*, oi.*, p.name as product_name 
                  FROM orders o 
                  LEFT JOIN order_items oi ON o.id = oi.order_id 
                  LEFT JOIN products p ON oi.product_id = p.id 
                  WHERE o.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

// Admin class
class Admin {
    private $conn;
    
    public function __construct($database) {
        $this->conn = $database->getConnection();
    }
    
    // Admin login
    public function login($username, $password) {
        $query = "SELECT * FROM admin_users WHERE username = :username AND password = :password AND status = 'active'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', md5($password)); // In production, use proper password hashing
        $stmt->execute();
        return $stmt->fetch();
    }
    
    // Get admin stats
    public function getStats() {
        $stats = [];
        
        // Total products
        $query = "SELECT COUNT(*) as count FROM products";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_products'] = $stmt->fetch()['count'];
        
        // Total categories
        $query = "SELECT COUNT(*) as count FROM categories";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_categories'] = $stmt->fetch()['count'];
        
        // Total orders
        $query = "SELECT COUNT(*) as count FROM orders";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_orders'] = $stmt->fetch()['count'];
        
        // Total users
        $query = "SELECT COUNT(*) as count FROM users";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_users'] = $stmt->fetch()['count'];
        
        return $stats;
    }
}

// API endpoints
class API {
    private $database;
    private $product;
    private $category;
    private $contact;
    private $order;
    private $admin;
    
    public function __construct() {
        $this->database = new Database();
        $this->product = new Product($this->database);
        $this->category = new Category($this->database);
        $this->contact = new Contact($this->database);
        $this->order = new Order($this->database);
        $this->admin = new Admin($this->database);
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $path = str_replace('/php/', '', $path);
        
        header('Content-Type: application/json');
        
        try {
            // Handle test connection
            if (isset($_GET['action']) && $_GET['action'] === 'test-connection') {
                $this->testConnection();
                return;
            }
            
            // Handle get categories
            if (isset($_GET['action']) && $_GET['action'] === 'get-categories') {
                $this->getCategories();
                return;
            }
            
            // Handle get products
            if (isset($_GET['action']) && $_GET['action'] === 'get-products') {
                $this->getProducts();
                return;
            }
            
            // Handle get product by ID
            if (isset($_GET['action']) && $_GET['action'] === 'get-product') {
                $this->getProductById();
                return;
            }
            
            // Handle get products by category
            if (isset($_GET['action']) && $_GET['action'] === 'get-products-by-category') {
                $this->getProductsByCategory();
                return;
            }
            
            switch ($path) {
                case 'products':
                    if ($method === 'GET') {
                        $this->getProducts();
                    } elseif ($method === 'POST') {
                        $this->addProduct();
                    } elseif ($method === 'PUT') {
                        $this->updateProduct();
                    } elseif ($method === 'DELETE') {
                        $this->deleteProduct();
                    }
                    break;
                    
                case 'products/search':
                    if ($method === 'GET') {
                        $this->searchProducts();
                    }
                    break;
                    
                case 'categories':
                    if ($method === 'GET') {
                        $this->getCategories();
                    } elseif ($method === 'POST') {
                        $this->addCategory();
                    } elseif ($method === 'PUT') {
                        $this->updateCategory();
                    } elseif ($method === 'DELETE') {
                        $this->deleteCategory();
                    }
                    break;
                    
                case 'contact':
                    if ($method === 'POST') {
                        $this->saveContactMessage();
                    }
                    break;
                    
                case 'orders':
                    if ($method === 'GET') {
                        $this->getOrders();
                    } elseif ($method === 'POST') {
                        $this->createOrder();
                    } elseif ($method === 'PUT') {
                        $this->updateOrderStatus();
                    }
                    break;
                    
                case 'admin/login':
                    if ($method === 'POST') {
                        $this->adminLogin();
                    }
                    break;
                    
                case 'admin/logout':
                    if ($method === 'POST') {
                        $this->adminLogout();
                    }
                    break;
                    
                case 'admin/stats':
                    if ($method === 'GET') {
                        $this->getAdminStats();
                    }
                    break;
                    
                case 'admin/reports':
                    if ($method === 'GET') {
                        $this->getReports();
                    }
                    break;
                    
                default:
                    $this->sendResponse(['error' => 'Endpoint not found'], 404);
            }
        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }
    
    private function getProducts() {
        $products = $this->product->getAllProducts();
        $this->sendResponse(['success' => true, 'data' => $products]);
    }
    
    private function getCategories() {
        $categories = $this->category->getAllCategories();
        $this->sendResponse(['success' => true, 'data' => $categories]);
    }
    
    private function addCategory() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->validateCategoryData($input)) {
            $this->sendResponse(['error' => 'Invalid category data'], 400);
            return;
        }
        
        $result = $this->category->addCategory($input);
        $this->sendResponse(['success' => $result, 'message' => 'Category added successfully']);
    }
    
    private function updateCategory() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id || !$this->validateCategoryData($input)) {
            $this->sendResponse(['error' => 'Invalid category data'], 400);
            return;
        }
        
        $result = $this->category->updateCategory($id, $input);
        $this->sendResponse(['success' => $result, 'message' => 'Category updated successfully']);
    }
    
    private function deleteCategory() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            $this->sendResponse(['error' => 'Category ID required'], 400);
            return;
        }
        
        $result = $this->category->deleteCategory($id);
        $this->sendResponse(['success' => $result, 'message' => 'Category deleted successfully']);
    }
    
    private function addProduct() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->validateProductData($input)) {
            $this->sendResponse(['error' => 'Invalid product data'], 400);
            return;
        }
        
        $result = $this->product->addProduct($input);
        $this->sendResponse(['success' => $result, 'message' => 'Product added successfully']);
    }
    
    private function updateProduct() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id || !$this->validateProductData($input)) {
            $this->sendResponse(['error' => 'Invalid product data'], 400);
            return;
        }
        
        $result = $this->product->updateProduct($id, $input);
        $this->sendResponse(['success' => $result, 'message' => 'Product updated successfully']);
    }
    
    private function deleteProduct() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            $this->sendResponse(['error' => 'Product ID required'], 400);
            return;
        }
        
        $result = $this->product->deleteProduct($id);
        $this->sendResponse(['success' => $result, 'message' => 'Product deleted successfully']);
    }
    
    private function getOrders() {
        $orders = $this->order->getAllOrders();
        $this->sendResponse(['success' => true, 'data' => $orders]);
    }
    
    private function updateOrderStatus() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id || !isset($input['status'])) {
            $this->sendResponse(['error' => 'Order ID and status required'], 400);
            return;
        }
        
        $result = $this->order->updateOrderStatus($id, $input['status']);
        $this->sendResponse(['success' => $result, 'message' => 'Order status updated successfully']);
    }
    
    private function adminLogin() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['username']) || !isset($input['password'])) {
            $this->sendResponse(['error' => 'Username and password required'], 400);
            return;
        }
        
        $admin = $this->admin->login($input['username'], $input['password']);
        
        if ($admin) {
            session_start();
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            
            $this->sendResponse(['success' => true, 'message' => 'Login successful', 'admin' => $admin]);
        } else {
            $this->sendResponse(['error' => 'Invalid credentials'], 401);
        }
    }
    
    private function adminLogout() {
        session_start();
        session_destroy();
        $this->sendResponse(['success' => true, 'message' => 'Logged out successfully']);
    }
    
    private function getAdminStats() {
        $stats = $this->admin->getStats();
        $this->sendResponse(['success' => true, 'data' => $stats]);
    }
    
    private function searchProducts() {
        $searchTerm = $_GET['q'] ?? '';
        
        if (empty($searchTerm)) {
            $this->sendResponse(['error' => 'Search term required'], 400);
            return;
        }
        
        $products = $this->product->searchProducts($searchTerm);
        $this->sendResponse(['success' => true, 'data' => $products]);
    }
    
    private function saveContactMessage() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->validateContactData($input)) {
            $this->sendResponse(['error' => 'Invalid contact data'], 400);
            return;
        }
        
        $result = $this->contact->saveMessage($input);
        $this->sendResponse(['success' => $result, 'message' => 'Message sent successfully']);
    }
    
    private function createOrder() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$this->validateOrderData($input)) {
            $this->sendResponse(['error' => 'Invalid order data'], 400);
            return;
        }
        
        $orderId = $this->order->createOrder($input);
        $this->sendResponse(['success' => true, 'order_id' => $orderId, 'message' => 'Order created successfully']);
    }
    
    private function validateCategoryData($data) {
        return isset($data['name']) && isset($data['slug']) && 
               !empty($data['name']) && !empty($data['slug']);
    }
    
    private function validateProductData($data) {
        return isset($data['name']) && isset($data['description']) && 
               isset($data['price']) && isset($data['image_url']) &&
               !empty($data['name']) && !empty($data['description']) &&
               !empty($data['price']) && !empty($data['image_url']);
    }
    
    private function validateContactData($data) {
        return isset($data['name']) && isset($data['email']) && 
               isset($data['subject']) && isset($data['message']);
    }
    
    private function validateOrderData($data) {
        return isset($data['customer_name']) && isset($data['customer_email']) && 
               isset($data['customer_phone']) && isset($data['total_amount']) && 
               isset($data['items']) && is_array($data['items']);
    }
    
    private function testConnection() {
        try {
            // Test database connection
            $database = new Database();
            $conn = $database->getConnection();
            
            // Test query
            $stmt = $conn->query("SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = '" . DB_NAME . "'");
            $result = $stmt->fetch();
            
            $this->sendResponse([
                'success' => true,
                'message' => 'Database connection successful! Found ' . $result['table_count'] . ' tables.',
                'database' => DB_NAME,
                'host' => DB_HOST
            ]);
        } catch (Exception $e) {
            $this->sendResponse([
                'success' => false,
                'error' => 'Database connection failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    private function getProductById() {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->sendResponse(['error' => 'Product ID required'], 400);
            return;
        }
        
        $product = $this->product->getProductById($id);
        if ($product) {
            $this->sendResponse(['success' => true, 'data' => $product]);
        } else {
            $this->sendResponse(['error' => 'Product not found'], 404);
        }
    }
    
    private function getProductsByCategory() {
        $categoryId = $_GET['category_id'] ?? null;
        $limit = $_GET['limit'] ?? 50;
        
        if (!$categoryId) {
            $this->sendResponse(['error' => 'Category ID required'], 400);
            return;
        }
        
        $products = $this->product->getProductsByCategory($categoryId, $limit);
        $this->sendResponse(['success' => true, 'data' => $products]);
    }
    
    private function getReports() {
        $reportType = $_GET['type'] ?? 'overview';
        $dateRange = $_GET['date_range'] ?? 'month';
        $categoryId = $_GET['category_id'] ?? null;
        
        $reports = [];
        
        switch ($reportType) {
            case 'overview':
                $reports = $this->getOverviewReport($dateRange, $categoryId);
                break;
            case 'sales':
                $reports = $this->getSalesReport($dateRange, $categoryId);
                break;
            case 'products':
                $reports = $this->getProductReport($dateRange, $categoryId);
                break;
            case 'customers':
                $reports = $this->getCustomerReport($dateRange, $categoryId);
                break;
            case 'inventory':
                $reports = $this->getInventoryReport($dateRange, $categoryId);
                break;
            default:
                $reports = $this->getOverviewReport($dateRange, $categoryId);
        }
        
        $this->sendResponse(['success' => true, 'data' => $reports]);
    }
    
    private function getOverviewReport($dateRange, $categoryId) {
        // Get basic stats
        $totalRevenue = $this->getTotalRevenue($dateRange, $categoryId);
        $totalOrders = $this->getTotalOrders($dateRange, $categoryId);
        $totalProducts = $this->getTotalProducts();
        $totalCustomers = $this->getTotalCustomers();
        
        // Get recent orders
        $recentOrders = $this->getRecentOrders(5);
        
        // Get top products
        $topProducts = $this->getTopProducts(5);
        
        return [
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers
            ],
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts
        ];
    }
    
    private function getSalesReport($dateRange, $categoryId) {
        // Generate sample sales data for the last 12 months
        $salesData = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        for ($i = 0; $i < 12; $i++) {
            $salesData[] = [
                'month' => $months[$i],
                'revenue' => rand(2000, 7000),
                'orders' => rand(20, 70),
                'avg_order_value' => rand(30, 80),
                'conversion_rate' => round(rand(20, 50) / 10, 1)
            ];
        }
        
        return ['sales_data' => $salesData];
    }
    
    private function getProductReport($dateRange, $categoryId) {
        $products = $this->product->getAllProductsAdmin();
        
        // Add analytics data to products
        foreach ($products as &$product) {
            $product['sales'] = rand(5, 50);
            $product['revenue'] = $product['sales'] * $product['price'];
            $product['rating'] = round(rand(30, 50) / 10, 1);
        }
        
        return ['products' => $products];
    }
    
    private function getCustomerReport($dateRange, $categoryId) {
        // Generate sample customer data
        $customers = [];
        $names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
        
        for ($i = 1; $i <= 20; $i++) {
            $customers[] = [
                'id' => $i,
                'name' => $names[array_rand($names)],
                'email' => "customer{$i}@example.com",
                'orders' => rand(1, 10),
                'total_spent' => rand(50, 500),
                'last_order' => date('Y-m-d', strtotime('-' . rand(1, 30) . ' days')),
                'status' => rand(0, 10) > 8 ? 'inactive' : 'active'
            ];
        }
        
        return ['customers' => $customers];
    }
    
    private function getInventoryReport($dateRange, $categoryId) {
        $products = $this->product->getAllProductsAdmin();
        
        // Add inventory data
        foreach ($products as &$product) {
            $product['current_stock'] = rand(0, 100);
            $product['min_threshold'] = 10;
            $product['max_threshold'] = 100;
            $product['status'] = $product['current_stock'] < 10 ? 'low' : 
                               ($product['current_stock'] > 100 ? 'high' : 'normal');
        }
        
        return ['inventory' => $products];
    }
    
    private function getTotalRevenue($dateRange, $categoryId) {
        // Sample revenue calculation
        return rand(10000, 50000);
    }
    
    private function getTotalOrders($dateRange, $categoryId) {
        // Sample orders calculation
        return rand(100, 500);
    }
    
    private function getTotalProducts() {
        $query = "SELECT COUNT(*) as count FROM products WHERE status = 'active'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result['count'];
    }
    
    private function getTotalCustomers() {
        $query = "SELECT COUNT(*) as count FROM users";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result['count'];
    }
    
    private function getRecentOrders($limit) {
        $query = "SELECT o.*, u.name as customer_name FROM orders o 
                  LEFT JOIN users u ON o.user_id = u.id 
                  ORDER BY o.created_at DESC LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    private function getTopProducts($limit) {
        $query = "SELECT p.*, c.name as category_name FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.status = 'active' 
                  ORDER BY p.created_at DESC LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Initialize API
$api = new API();
$api->handleRequest();
?>

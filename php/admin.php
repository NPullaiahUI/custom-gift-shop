<?php
// Admin panel for Custom Gift Shop
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

require_once 'config.php';
$database = new Database();
$product = new Product($database);
$contact = new Contact($database);
$order = new Order($database);

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    
    switch ($_POST['action']) {
        case 'get_products':
            $products = $product->getAllProducts();
            echo json_encode(['success' => true, 'data' => $products]);
            exit;
            
        case 'add_product':
            $data = [
                'name' => $_POST['name'],
                'description' => $_POST['description'],
                'price' => $_POST['price'],
                'image_url' => $_POST['image_url'],
                'category_id' => $_POST['category_id']
            ];
            $result = $product->addProduct($data);
            echo json_encode(['success' => $result]);
            exit;
            
        case 'get_messages':
            $messages = $contact->getAllMessages();
            echo json_encode(['success' => true, 'data' => $messages]);
            exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Custom Gift Shop</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .sidebar {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .sidebar .nav-link {
            color: rgba(255,255,255,0.8);
            padding: 12px 20px;
            margin: 5px 0;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            color: white;
            background: rgba(255,255,255,0.2);
        }
        .main-content {
            background: #f8f9fa;
            min-height: 100vh;
        }
        .card {
            border: none;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            border-radius: 10px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .stat-card .card-body {
            padding: 2rem;
        }
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 px-0">
                <div class="sidebar">
                    <div class="p-3">
                        <h4 class="text-white mb-4">
                            <i class="fas fa-gift me-2"></i>Admin Panel
                        </h4>
                        <nav class="nav flex-column">
                            <a class="nav-link active" href="#dashboard" data-section="dashboard">
                                <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                            </a>
                            <a class="nav-link" href="#products" data-section="products">
                                <i class="fas fa-box me-2"></i>Products
                            </a>
                            <a class="nav-link" href="#orders" data-section="orders">
                                <i class="fas fa-shopping-cart me-2"></i>Orders
                            </a>
                            <a class="nav-link" href="#messages" data-section="messages">
                                <i class="fas fa-envelope me-2"></i>Messages
                            </a>
                            <a class="nav-link" href="#settings" data-section="settings">
                                <i class="fas fa-cog me-2"></i>Settings
                            </a>
                            <a class="nav-link" href="logout.php">
                                <i class="fas fa-sign-out-alt me-2"></i>Logout
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="col-md-9 col-lg-10">
                <div class="main-content">
                    <div class="p-4">
                        <!-- Dashboard Section -->
                        <div id="dashboard-section" class="content-section">
                            <h2 class="mb-4">Dashboard</h2>
                            <div class="row mb-4">
                                <div class="col-md-3">
                                    <div class="card stat-card">
                                        <div class="card-body text-center">
                                            <i class="fas fa-box fa-2x mb-3"></i>
                                            <div class="stat-number" id="total-products">0</div>
                                            <div>Total Products</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card stat-card">
                                        <div class="card-body text-center">
                                            <i class="fas fa-shopping-cart fa-2x mb-3"></i>
                                            <div class="stat-number" id="total-orders">0</div>
                                            <div>Total Orders</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card stat-card">
                                        <div class="card-body text-center">
                                            <i class="fas fa-envelope fa-2x mb-3"></i>
                                            <div class="stat-number" id="total-messages">0</div>
                                            <div>Messages</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card stat-card">
                                        <div class="card-body text-center">
                                            <i class="fas fa-dollar-sign fa-2x mb-3"></i>
                                            <div class="stat-number" id="total-revenue">$0</div>
                                            <div>Revenue</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5>Recent Orders</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="table-responsive">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Customer</th>
                                                            <th>Amount</th>
                                                            <th>Status</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="recent-orders">
                                                        <tr>
                                                            <td colspan="5" class="text-center">Loading...</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5>Quick Actions</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="d-grid gap-2">
                                                <button class="btn btn-primary" onclick="showSection('products')">
                                                    <i class="fas fa-plus me-2"></i>Add New Product
                                                </button>
                                                <button class="btn btn-success" onclick="showSection('orders')">
                                                    <i class="fas fa-eye me-2"></i>View Orders
                                                </button>
                                                <button class="btn btn-info" onclick="showSection('messages')">
                                                    <i class="fas fa-envelope me-2"></i>Check Messages
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Products Section -->
                        <div id="products-section" class="content-section" style="display: none;">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h2>Products Management</h2>
                                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
                                    <i class="fas fa-plus me-2"></i>Add Product
                                </button>
                            </div>
                            
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Price</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="products-table">
                                                <tr>
                                                    <td colspan="6" class="text-center">Loading...</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Messages Section -->
                        <div id="messages-section" class="content-section" style="display: none;">
                            <h2 class="mb-4">Contact Messages</h2>
                            <div class="card">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Subject</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="messages-table">
                                                <tr>
                                                    <td colspan="7" class="text-center">Loading...</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Add Product Modal -->
    <div class="modal fade" id="addProductModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addProductForm">
                        <div class="mb-3">
                            <label class="form-label">Product Name</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" name="description" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Price</label>
                            <input type="number" class="form-control" name="price" step="0.01" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Image URL</label>
                            <input type="url" class="form-control" name="image_url" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Category</label>
                            <select class="form-control" name="category_id" required>
                                <option value="1">Personalized Mugs</option>
                                <option value="2">Photo Frames</option>
                                <option value="3">Custom Apparel</option>
                                <option value="4">Jewelry</option>
                                <option value="5">Phone Accessories</option>
                                <option value="6">Home Decor</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="addProduct()">Add Product</button>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Navigation
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                showSection(section);
                
                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        function showSection(section) {
            document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
            document.getElementById(section + '-section').style.display = 'block';
            
            // Load section data
            switch(section) {
                case 'products':
                    loadProducts();
                    break;
                case 'messages':
                    loadMessages();
                    break;
                case 'dashboard':
                    loadDashboard();
                    break;
            }
        }
        
        function loadDashboard() {
            // Load dashboard statistics
            fetch('api.php?action=get_stats')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('total-products').textContent = data.stats.products;
                        document.getElementById('total-orders').textContent = data.stats.orders;
                        document.getElementById('total-messages').textContent = data.stats.messages;
                        document.getElementById('total-revenue').textContent = '$' + data.stats.revenue;
                    }
                });
        }
        
        function loadProducts() {
            const formData = new FormData();
            formData.append('action', 'get_products');
            
            fetch('api.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const tbody = document.getElementById('products-table');
                    tbody.innerHTML = data.data.map(product => `
                        <tr>
                            <td>${product.id}</td>
                            <td><img src="${product.image_url}" width="50" height="50" class="rounded"></td>
                            <td>${product.name}</td>
                            <td>$${product.price}</td>
                            <td><span class="badge bg-${product.status === 'active' ? 'success' : 'secondary'}">${product.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary me-1">Edit</button>
                                <button class="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    `).join('');
                }
            });
        }
        
        function loadMessages() {
            const formData = new FormData();
            formData.append('action', 'get_messages');
            
            fetch('api.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const tbody = document.getElementById('messages-table');
                    tbody.innerHTML = data.data.map(message => `
                        <tr>
                            <td>${message.id}</td>
                            <td>${message.name}</td>
                            <td>${message.email}</td>
                            <td>${message.subject}</td>
                            <td><span class="badge bg-${message.status === 'unread' ? 'warning' : 'success'}">${message.status}</span></td>
                            <td>${new Date(message.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-info">View</button>
                                <button class="btn btn-sm btn-success">Mark Read</button>
                            </td>
                        </tr>
                    `).join('');
                }
            });
        }
        
        function addProduct() {
            const form = document.getElementById('addProductForm');
            const formData = new FormData(form);
            formData.append('action', 'add_product');
            
            fetch('api.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product added successfully!');
                    form.reset();
                    bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
                    loadProducts();
                } else {
                    alert('Error adding product: ' + data.error);
                }
            });
        }
        
        // Load dashboard on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboard();
        });
    </script>
</body>
</html>

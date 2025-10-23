// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initAdminDashboard();
    initFormEventListeners();
});

// Initialize admin dashboard
function initAdminDashboard() {
    console.log('Initializing admin dashboard...');
    
    // Check authentication
    const token = localStorage.getItem('admin_token');
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (!checkAuth()) {
        console.log('Authentication failed, redirecting to login...');
        window.location.href = 'admin-login.html';
        return;
    }
    
    console.log('Authentication successful, loading dashboard...');
    
    // Initialize dashboard
    loadDashboardData();
    loadCategories();
    loadProducts();
    loadOrders();
    loadUsers();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Dashboard initialization complete');
}

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('admin_token');
    return token && isValidToken(token);
}

// Validate auth token
function isValidToken(token) {
    if (!token || !token.startsWith('admin_')) {
        return false;
    }
    
    const tokenTime = parseInt(token.split('_')[1]);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    return (now - tokenTime) < twentyFourHours;
}

// Load dashboard data
function loadDashboardData() {
    // Load stats
    loadStats();
    
    // Load recent activity
    loadRecentActivity();
}

// Load stats
function loadStats() {
    // Simulate API call
    setTimeout(() => {
        document.getElementById('total-products').textContent = '36';
        document.getElementById('total-categories').textContent = '6';
        document.getElementById('total-orders').textContent = '24';
        document.getElementById('total-users').textContent = '12';
    }, 500);
}

// Load recent activity
function loadRecentActivity() {
    const activities = [
        {
            icon: 'fas fa-plus text-success',
            text: 'New product "Custom Phone Case" added',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-edit text-primary',
            text: 'Category "Personalized Mugs" updated',
            time: '4 hours ago'
        },
        {
            icon: 'fas fa-shopping-cart text-warning',
            text: 'New order #1234 received',
            time: '6 hours ago'
        },
        {
            icon: 'fas fa-user text-info',
            text: 'New user registered',
            time: '8 hours ago'
        }
    ];
    
    const container = document.getElementById('recent-activity');
    container.innerHTML = activities.map(activity => `
        <div class="d-flex align-items-center mb-3">
            <div class="activity-icon me-3">
                <i class="${activity.icon}"></i>
            </div>
            <div class="flex-grow-1">
                <p class="mb-1">${activity.text}</p>
                <small class="text-muted">${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Load categories
function loadCategories() {
    const categories = [
        {
            id: 1,
            name: 'Personalized Mugs',
            slug: 'personalized-mugs',
            description: 'Custom ceramic mugs with personal designs',
            products: 6,
            status: 'active'
        },
        {
            id: 2,
            name: 'Photo Frames',
            slug: 'photo-frames',
            description: 'Beautiful frames for your memories',
            products: 6,
            status: 'active'
        },
        {
            id: 3,
            name: 'Custom Apparel',
            slug: 'custom-apparel',
            description: 'Personalized clothing and accessories',
            products: 6,
            status: 'active'
        },
        {
            id: 4,
            name: 'Jewelry',
            slug: 'jewelry',
            description: 'Custom jewelry and accessories',
            products: 6,
            status: 'active'
        },
        {
            id: 5,
            name: 'Phone Accessories',
            slug: 'phone-accessories',
            description: 'Custom phone cases and accessories',
            products: 6,
            status: 'active'
        },
        {
            id: 6,
            name: 'Home Decor',
            slug: 'home-decor',
            description: 'Personalized home decoration items',
            products: 6,
            status: 'active'
        }
    ];
    
    const tbody = document.querySelector('#categories-table tbody');
    tbody.innerHTML = categories.map(category => `
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.slug}</td>
            <td>${category.description}</td>
            <td>${category.products}</td>
            <td><span class="status-badge status-${category.status}">${category.status}</span></td>
            <td>
                <button class="btn btn-action btn-edit" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-action btn-delete" onclick="deleteCategory(${category.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load products
function loadProducts() {
    const products = [
        {
            id: 1,
            name: 'Personalized Coffee Mug',
            category: 'Personalized Mugs',
            price: 24.99,
            stock: 50,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
            id: 2,
            name: 'Custom Travel Mug',
            category: 'Personalized Mugs',
            price: 29.99,
            stock: 30,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
            id: 7,
            name: 'Custom Photo Frame',
            category: 'Photo Frames',
            price: 19.99,
            stock: 25,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
            id: 13,
            name: 'Personalized T-Shirt',
            category: 'Custom Apparel',
            price: 29.99,
            stock: 40,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        }
    ];
    
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" class="img-preview">
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge status-${product.status}">${product.status}</span></td>
            <td>
                <button class="btn btn-action btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-action btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load orders
function loadOrders() {
    const orders = [
        {
            id: 'ORD-001',
            customer: 'John Doe',
            total: 89.97,
            status: 'pending',
            date: '2024-01-15'
        },
        {
            id: 'ORD-002',
            customer: 'Jane Smith',
            total: 45.98,
            status: 'completed',
            date: '2024-01-14'
        },
        {
            id: 'ORD-003',
            customer: 'Mike Johnson',
            total: 67.50,
            status: 'pending',
            date: '2024-01-13'
        }
    ];
    
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>$${order.total}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${order.date}</td>
            <td>
                <button class="btn btn-action btn-view" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-action btn-edit" onclick="updateOrderStatus('${order.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load users
function loadUsers() {
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'customer',
            status: 'active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'customer',
            status: 'active'
        },
        {
            id: 3,
            name: 'Admin User',
            email: 'admin@customgift.com',
            role: 'admin',
            status: 'active'
        }
    ];
    
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'primary'}">${user.role}</span></td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>
                <button class="btn btn-action btn-edit" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-action btn-delete" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Open category modal
function openCategoryModal(categoryId = null) {
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    const title = document.getElementById('categoryModalTitle');
    const form = document.getElementById('category-form');
    
    if (categoryId) {
        title.textContent = 'Edit Category';
        // Load category data
        loadCategoryData(categoryId);
    } else {
        title.textContent = 'Add New Category';
        form.reset();
        document.getElementById('category-id').value = '';
    }
    
    modal.show();
}

// Load category data for editing
function loadCategoryData(categoryId) {
    // Simulate loading category data
    const categoryData = {
        id: categoryId,
        name: 'Personalized Mugs',
        slug: 'personalized-mugs',
        description: 'Custom ceramic mugs with personal designs',
        image: 'https://example.com/image.jpg',
        status: 'active',
        sort_order: 1
    };
    
    document.getElementById('category-id').value = categoryData.id;
    document.getElementById('category-name').value = categoryData.name;
    document.getElementById('category-slug').value = categoryData.slug;
    document.getElementById('category-description').value = categoryData.description;
    document.getElementById('category-image').value = categoryData.image;
    document.getElementById('category-status').value = categoryData.status;
    document.getElementById('category-sort-order').value = categoryData.sort_order;
}

// Save category
async function saveCategory() {
    const form = document.getElementById('category-form');
    const formData = new FormData(form);
    
    const categoryData = {
        id: formData.get('id') || null,
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        image_url: formData.get('image'),
        status: formData.get('status'),
        sort_order: parseInt(formData.get('sort_order')) || 0
    };
    
    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
        showAlert('Please fill in all required fields!', 'error');
        return;
    }
    
    try {
        const isEdit = categoryData.id !== null;
        const url = isEdit ? `php/api.php/categories/${categoryData.id}` : 'php/api.php/categories';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(isEdit ? 'Category updated successfully!' : 'Category added successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
            modal.hide();
            
            // Clear form
            form.reset();
            
            // Reload categories
            loadCategories();
        } else {
            showAlert(result.error || 'Failed to save category!', 'error');
        }
    } catch (error) {
        console.error('Error saving category:', error);
        showAlert('Network error. Please try again.', 'error');
    }
}

// Edit category
function editCategory(categoryId) {
    openCategoryModal(categoryId);
}

// Delete category
async function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            const response = await fetch(`php/api.php/categories/${categoryId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('Category deleted successfully!', 'success');
                loadCategories();
            } else {
                showAlert(result.error || 'Failed to delete category!', 'error');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            showAlert('Network error. Please try again.', 'error');
        }
    }
}

// Open product modal
function openProductModal(productId = null) {
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('product-form');
    
    if (productId) {
        title.textContent = 'Edit Product';
        loadProductData(productId);
    } else {
        title.textContent = 'Add New Product';
        form.reset();
        document.getElementById('product-id').value = '';
    }
    
    // Load categories for dropdown
    loadCategoryDropdown();
    
    modal.show();
}

// Load category dropdown
function loadCategoryDropdown() {
    const categories = [
        { id: 1, name: 'Personalized Mugs' },
        { id: 2, name: 'Photo Frames' },
        { id: 3, name: 'Custom Apparel' },
        { id: 4, name: 'Jewelry' },
        { id: 5, name: 'Phone Accessories' },
        { id: 6, name: 'Home Decor' }
    ];
    
    const dropdown = document.getElementById('product-category');
    dropdown.innerHTML = '<option value="">Select Category</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// Load product data for editing
function loadProductData(productId) {
    const productData = {
        id: productId,
        name: 'Personalized Coffee Mug',
        description: 'Custom ceramic mug with your favorite photo or text.',
        price: 24.99,
        category_id: 1,
        stock: 50,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        images: 'https://example.com/img1.jpg, https://example.com/img2.jpg',
        features: 'Dishwasher safe, Microwave safe, High quality ceramic',
        sizes: '11oz, 15oz, 20oz',
        colors: 'White, Black, Navy, Gray'
    };
    
    document.getElementById('product-id').value = productData.id;
    document.getElementById('product-name').value = productData.name;
    document.getElementById('product-description').value = productData.description;
    document.getElementById('product-price').value = productData.price;
    document.getElementById('product-category').value = productData.category_id;
    document.getElementById('product-stock').value = productData.stock;
    document.getElementById('product-status').value = productData.status;
    document.getElementById('product-image').value = productData.image;
    document.getElementById('product-images').value = productData.images;
    document.getElementById('product-features').value = productData.features;
    document.getElementById('product-sizes').value = productData.sizes;
    document.getElementById('product-colors').value = productData.colors;
    
    // Show image preview
    const preview = document.getElementById('product-image-preview');
    preview.src = productData.image;
    preview.style.display = 'block';
}

// Save product
async function saveProduct() {
    const form = document.getElementById('product-form');
    const formData = new FormData(form);
    
    // Process images array
    const imagesText = formData.get('images');
    let imagesArray = [];
    if (imagesText && imagesText.trim()) {
        imagesArray = imagesText.split(',').map(url => url.trim()).filter(url => url);
    }
    
    // Process features array
    const featuresText = formData.get('features');
    let featuresArray = [];
    if (featuresText && featuresText.trim()) {
        featuresArray = featuresText.split(',').map(feature => feature.trim()).filter(feature => feature);
    }
    
    const productData = {
        id: formData.get('id') || null,
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category_id: parseInt(formData.get('category_id')),
        stock: parseInt(formData.get('stock')) || 0,
        status: formData.get('status'),
        image_url: formData.get('image'),
        images: JSON.stringify(imagesArray),
        features: JSON.stringify(featuresArray),
        sizes: formData.get('sizes'),
        colors: formData.get('colors'),
        rating: 4.0,
        reviews: 0
    };
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.category_id || !productData.image_url) {
        showAlert('Please fill in all required fields!', 'error');
        return;
    }
    
    try {
        const isEdit = productData.id !== null;
        const url = isEdit ? `php/api.php/products/${productData.id}` : 'php/api.php/products';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(isEdit ? 'Product updated successfully!' : 'Product added successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
            modal.hide();
            
            // Clear form
            form.reset();
            
            // Reload products
            loadProducts();
        } else {
            showAlert(result.error || 'Failed to save product!', 'error');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Network error. Please try again.', 'error');
    }
}

// Edit product
function editProduct(productId) {
    openProductModal(productId);
}

// Delete product
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`php/api.php/products/${productId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('Product deleted successfully!', 'success');
                loadProducts();
            } else {
                showAlert(result.error || 'Failed to delete product!', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showAlert('Network error. Please try again.', 'error');
        }
    }
}

// View order
function viewOrder(orderId) {
    showAlert(`Viewing order ${orderId}`, 'info');
}

// Update order status
function updateOrderStatus(orderId) {
    showAlert(`Updating status for order ${orderId}`, 'info');
}

// Edit user
function editUser(userId) {
    showAlert(`Editing user ${userId}`, 'info');
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        showAlert('User deleted successfully!', 'success');
        loadUsers();
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = 'admin-login.html';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Image preview for product form
    document.getElementById('product-image').addEventListener('input', function() {
        const preview = document.getElementById('product-image-preview');
        if (this.value) {
            preview.src = this.value;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
    
    // Auto-generate slug from category name
    document.getElementById('category-name').addEventListener('input', function() {
        const slug = this.value.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        document.getElementById('category-slug').value = slug;
    });
}

// Show alert
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 
                      type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                type === 'error' ? 'exclamation-circle' : 
                                type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.innerHTML = alertHtml;
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// Initialize form event listeners
function initFormEventListeners() {
    // Category image preview
    const categoryImageInput = document.getElementById('category-image');
    if (categoryImageInput) {
        categoryImageInput.addEventListener('input', function() {
            const preview = document.getElementById('category-image-preview');
            if (this.value && isValidUrl(this.value)) {
                preview.src = this.value;
                preview.style.display = 'block';
                preview.onerror = function() {
                    this.style.display = 'none';
                };
            } else {
                preview.style.display = 'none';
            }
        });
    }
    
    // Product image preview
    const productImageInput = document.getElementById('product-image');
    if (productImageInput) {
        productImageInput.addEventListener('input', function() {
            const preview = document.getElementById('product-image-preview');
            if (this.value && isValidUrl(this.value)) {
                preview.src = this.value;
                preview.style.display = 'block';
                preview.onerror = function() {
                    this.style.display = 'none';
                };
            } else {
                preview.style.display = 'none';
            }
        });
    }
    
    // Auto-generate slug from category name
    const categoryNameInput = document.getElementById('category-name');
    const categorySlugInput = document.getElementById('category-slug');
    if (categoryNameInput && categorySlugInput) {
        categoryNameInput.addEventListener('input', function() {
            if (!categorySlugInput.value || categorySlugInput.dataset.autoGenerated === 'true') {
                categorySlugInput.value = generateSlug(this.value);
                categorySlugInput.dataset.autoGenerated = 'true';
            }
        });
        
        categorySlugInput.addEventListener('input', function() {
            this.dataset.autoGenerated = 'false';
        });
    }
}

// Generate URL-friendly slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

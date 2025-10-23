// Categories JavaScript for index.html - Dynamic Database Loading

document.addEventListener('DOMContentLoaded', function() {
    initCategories();
    initCartFunctionality();
});

// Categories data (will be loaded from database)
let categoriesData = [];

// Initialize categories
function initCategories() {
    loadCategoriesFromDatabase();
}

// Load categories from database
async function loadCategoriesFromDatabase() {
    try {
        const response = await fetch('php/api.php?action=get-categories');
        const data = await response.json();
        
        if (data.success) {
            categoriesData = data.data;
            loadCategories();
        } else {
            console.error('Error loading categories:', data.error);
            showError('Failed to load categories. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        showError('Network error. Please check your connection.');
    }
}

// Load categories
function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    if (categoriesData.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No categories available at the moment.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = categoriesData.map(category => {
        const icon = getCategoryIcon(category.name);
        const link = getCategoryLink(category.slug);
        const productCount = category.product_count || 0;
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="category-card">
                    <div class="category-image">
                        <img src="${category.image_url || getDefaultCategoryImage(category.name)}" alt="${category.name}" loading="lazy">
                        <div class="category-overlay">
                            <div class="category-icon">
                                <i class="${icon} fa-3x text-white"></i>
                            </div>
                            <div class="category-actions">
                                <a href="${link}" class="btn btn-light me-2">
                                    <i class="fas fa-eye me-1"></i>View Products
                                </a>
                                <button class="btn btn-primary" onclick="quickViewCategory(${category.id})">
                                    <i class="fas fa-info-circle me-1"></i>Learn More
                                </button>
                            </div>
                        </div>
                        <div class="category-badge">
                            <span class="badge bg-primary">${productCount} Products</span>
                        </div>
                    </div>
                    <div class="category-content">
                        <h5 class="category-title">${category.name}</h5>
                        <p class="category-description">${category.description || 'Explore our amazing collection'}</p>
                        <div class="category-footer">
                            <a href="${link}" class="btn btn-outline-primary w-100">
                                <i class="fas fa-arrow-right me-2"></i>Explore Category
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Animate categories
    animateCategories();
}

// Get category icon based on name
function getCategoryIcon(categoryName) {
    const iconMap = {
        'Personalized Mugs': 'fas fa-coffee',
        'Photo Frames': 'fas fa-image',
        'Custom Apparel': 'fas fa-tshirt',
        'Jewelry': 'fas fa-gem',
        'Phone Accessories': 'fas fa-mobile-alt',
        'Home Decor': 'fas fa-home'
    };
    return iconMap[categoryName] || 'fas fa-gift';
}

// Get category link based on slug
function getCategoryLink(slug) {
    const linkMap = {
        'personalized-mugs': 'category-personalized-mugs.html',
        'photo-frames': 'category-photo-frames.html',
        'custom-apparel': 'category-custom-apparel.html',
        'jewelry': 'category-jewelry.html',
        'phone-accessories': 'category-phone-accessories.html',
        'home-decor': 'category-home-decor.html'
    };
    return linkMap[slug] || 'products.html';
}

// Get default category image
function getDefaultCategoryImage(categoryName) {
    const imageMap = {
        'Personalized Mugs': 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Photo Frames': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Custom Apparel': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Jewelry': 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Phone Accessories': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'Home Decor': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };
    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
}

// Show error message
function showError(message) {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        </div>
    `;
}

// Quick view category
function quickViewCategory(categoryId) {
    const category = categoriesData.find(c => c.id === categoryId);
    if (!category) return;
    
    const icon = getCategoryIcon(category.name);
    const link = getCategoryLink(category.slug);
    const productCount = category.product_count || 0;
    const imageUrl = category.image_url || getDefaultCategoryImage(category.name);
    
    // Create modal dynamically
    const modalHtml = `
        <div class="modal fade" id="categoryModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="${icon} me-2"></i>${category.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${imageUrl}" alt="${category.name}" class="img-fluid rounded">
                            </div>
                            <div class="col-md-6">
                                <h4>${category.name}</h4>
                                <p class="text-muted mb-4">${category.description || 'Explore our amazing collection'}</p>
                                
                                <div class="category-features mb-4">
                                    <h6>Key Features:</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-check text-success me-2"></i>Custom personalization</li>
                                        <li><i class="fas fa-check text-success me-2"></i>High-quality materials</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Fast production time</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Perfect gift option</li>
                                    </ul>
                                </div>
                                
                                <div class="category-stats mb-4">
                                    <div class="row text-center">
                                        <div class="col-4">
                                            <div class="stat-number">${productCount}</div>
                                            <div class="stat-label">Products</div>
                                        </div>
                                        <div class="col-4">
                                            <div class="stat-number">4.8</div>
                                            <div class="stat-label">Rating</div>
                                        </div>
                                        <div class="col-4">
                                            <div class="stat-number">500+</div>
                                            <div class="stat-label">Sold</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-grid gap-2">
                                    <a href="${link}" class="btn btn-primary btn-lg">
                                        <i class="fas fa-shopping-bag me-2"></i>View All Products
                                    </a>
                                    <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('categoryModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
    
    // Remove modal from DOM when hidden
    document.getElementById('categoryModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Animate categories
function animateCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Cart functionality
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Initialize cart functionality
function initCartFunctionality() {
    updateCartCount();
}

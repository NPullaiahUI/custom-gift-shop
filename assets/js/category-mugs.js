// Personalized Mugs category JavaScript - Dynamic Database Loading

document.addEventListener('DOMContentLoaded', function() {
    initMugsCategory();
    initCartFunctionality();
});

// Products data (will be loaded from database)
let mugsProducts = [];
const categoryId = 1; // Personalized Mugs category ID

// Initialize mugs category
async function initMugsCategory() {
    try {
        await loadMugsProductsFromDatabase();
        loadMugsProducts();
        updateCartCount();
    } catch (error) {
        console.error('Error initializing mugs category:', error);
        showError('Failed to load mugs products. Please try again.');
    }
}

// Load mugs products from database
async function loadMugsProductsFromDatabase() {
    try {
        const response = await fetch(`php/api.php?action=get-products-by-category&category_id=${categoryId}`);
        const data = await response.json();
        
        if (data.success) {
            mugsProducts = data.data;
        } else {
            console.error('Error loading mugs products:', data.error);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error fetching mugs products:', error);
        throw error;
    }
}

// Load mugs products
function loadMugsProducts() {
    const container = document.getElementById('mugs-products-container');
    if (!container) return;
    
    if (mugsProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-coffee fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No mugs available</h4>
                <p class="text-muted">Check back soon for new personalized mugs!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = mugsProducts.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image_url || getDefaultMugImage()}" alt="${product.name}" loading="lazy" 
                         onerror="this.src='${getDefaultMugImage()}'; this.onerror=null;">
                    <div class="product-overlay">
                        <button class="btn btn-light me-2" onclick="quickViewMug(${product.id})">
                            <i class="fas fa-eye me-1"></i>Quick View
                        </button>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                        </button>
                    </div>
                    <div class="product-badge">
                        <span class="badge bg-success">Custom</span>
                    </div>
                </div>
                <div class="product-content">
                    <div class="product-rating mb-2">
                        ${generateStars(product.rating || 4.0)}
                        <span class="ms-2 text-muted">(${product.reviews || 0})</span>
                    </div>
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price mb-2">$${product.price}</div>
                    <p class="product-description">${product.description || 'High-quality personalized mug'}</p>
                    <div class="product-features mb-3">
                        <small class="text-muted">
                            <i class="fas fa-check-circle me-1 text-success"></i>Dishwasher Safe
                            <i class="fas fa-check-circle me-1 text-success"></i>Microwave Safe
                        </small>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary w-100 mb-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary w-100">
                            <i class="fas fa-info-circle me-2"></i>View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Animate products
    animateProducts();
}

// Get default mug image
function getDefaultMugImage() {
    return 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

// Quick view mug
function quickViewMug(productId) {
    const product = mugsProducts.find(p => p.id == productId);
    if (!product) return;
    
    const rating = product.rating || 4.0;
    const reviews = product.reviews || 0;
    
    const modalHtml = `
        <div class="modal fade" id="quickViewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${product.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${product.image_url || getDefaultMugImage()}" alt="${product.name}" class="img-fluid rounded" onerror="this.src='${getDefaultMugImage()}'">
                            </div>
                            <div class="col-md-6">
                                <div class="product-rating mb-3">
                                    ${generateStars(rating)}
                                    <span class="ms-2 text-muted">(${reviews} reviews)</span>
                                </div>
                                <h4>${product.name}</h4>
                                <div class="product-price mb-3">
                                    <span class="h3 text-primary">$${product.price}</span>
                                </div>
                                <p class="text-muted mb-3">${product.description || 'High-quality personalized mug'}</p>
                                
                                <div class="mug-features mb-3">
                                    <h6>Features:</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-check text-success me-2"></i>Dishwasher Safe</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Microwave Safe</li>
                                        <li><i class="fas fa-check text-success me-2"></i>High-Quality Ceramic</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Custom Personalization</li>
                                    </ul>
                                </div>
                                
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary btn-lg" onclick="addToCart(${product.id})">
                                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                    </button>
                                    <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary">
                                        <i class="fas fa-info-circle me-2"></i>View Full Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('quickViewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
    
    // Remove modal from DOM when hidden
    document.getElementById('quickViewModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Add to cart functionality
function addToCart(productId) {
    const product = mugsProducts.find(p => p.id == productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url || getDefaultMugImage(),
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartMessage(product.name);
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Update cart count
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Show add to cart message
function showAddToCartMessage(productName) {
    // Create toast notification
    const toastHtml = `
        <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i>
                    ${productName} added to cart!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    // Add toast to container
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Show toast
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Initialize cart functionality
function initCartFunctionality() {
    updateCartCount();
}

// Show error message
function showError(message) {
    const container = document.getElementById('mugs-products-container');
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

// Animate products
function animateProducts() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}
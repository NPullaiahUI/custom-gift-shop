// Custom Apparel category JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initApparelCategory();
    initCartFunctionality();
});

// Apparel products data
const apparelProducts = [
    {
        id: 13,
        name: "Personalized T-Shirt",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "High-quality cotton t-shirt with custom design. Available in multiple sizes and colors.",
        rating: 4.3,
        reviews: 156,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Gray", "Red"]
    },
    {
        id: 14,
        name: "Custom Hoodie",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Comfortable hoodie with custom printing. Perfect for casual wear and gifts.",
        rating: 4.6,
        reviews: 87,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Gray", "Navy", "White"]
    },
    {
        id: 15,
        name: "Designer Tank Top",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Lightweight tank top with custom graphics. Great for summer and sports.",
        rating: 4.4,
        reviews: 203,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black", "Pink", "Blue"]
    },
    {
        id: 16,
        name: "Custom Polo Shirt",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Professional polo shirt with embroidered logo. Perfect for business and casual wear.",
        rating: 4.7,
        reviews: 142,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Gray"]
    },
    {
        id: 17,
        name: "Personalized Sweatshirt",
        price: 44.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Cozy sweatshirt with custom text or graphics. Available in various colors.",
        rating: 4.5,
        reviews: 78,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Gray", "Black", "Navy", "White"]
    },
    {
        id: 18,
        name: "Custom Baseball Cap",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Adjustable baseball cap with custom embroidery or printing.",
        rating: 4.2,
        reviews: 95,
        sizes: ["One Size"],
        colors: ["Black", "White", "Navy", "Red", "Gray"]
    }
];

let filteredProducts = [...apparelProducts];

// Initialize apparel category
function initApparelCategory() {
    loadProducts();
    initSorting();
}

// Load products
function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn btn-light me-2" onclick="quickViewProduct(${product.id})">
                            <i class="fas fa-eye me-1"></i>Quick View
                        </button>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                        </button>
                    </div>
                    <div class="product-badge">
                        <span class="badge bg-success">Trending</span>
                    </div>
                </div>
                <div class="product-content">
                    <div class="product-rating mb-2">
                        ${generateStars(product.rating)}
                        <span class="ms-2 text-muted">(${product.reviews})</span>
                    </div>
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price mb-2">$${product.price}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-options mb-3">
                        <small class="text-muted">
                            <strong>Sizes:</strong> ${product.sizes.join(', ')}<br>
                            <strong>Colors:</strong> ${product.colors.join(', ')}
                        </small>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary w-100 mb-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-primary w-100" onclick="viewProduct(${product.id})">
                            <i class="fas fa-eye me-2"></i>View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    animateProducts();
}

// Initialize sorting
function initSorting() {
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
        default:
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
    loadProducts();
}

// Quick view product
function quickViewProduct(productId) {
    const product = apparelProducts.find(p => p.id === productId);
    if (!product) return;
    
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
                                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
                            </div>
                            <div class="col-md-6">
                                <div class="product-rating mb-3">
                                    ${generateStars(product.rating)}
                                    <span class="ms-2">(${product.reviews} reviews)</span>
                                </div>
                                <h4 class="mb-3">$${product.price}</h4>
                                <p class="text-muted mb-4">${product.description}</p>
                                
                                <div class="mb-3">
                                    <label class="form-label">Size:</label>
                                    <select class="form-select" id="quick-size">
                                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Color:</label>
                                    <select class="form-select" id="quick-color">
                                        ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Quantity:</label>
                                    <div class="input-group" style="max-width: 150px;">
                                        <button class="btn btn-outline-secondary" type="button" onclick="decreaseQty()">-</button>
                                        <input type="number" class="form-control text-center" id="quick-qty" value="1" min="1" max="10">
                                        <button class="btn btn-outline-secondary" type="button" onclick="increaseQty()">+</button>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Custom Text/Design:</label>
                                    <textarea class="form-control" id="quick-design" rows="3" placeholder="Enter your custom text or design description..."></textarea>
                                </div>
                                
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary btn-lg" onclick="addToCartFromQuickView(${product.id})">
                                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="viewProduct(${product.id})">
                                        <i class="fas fa-eye me-2"></i>View Full Details
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

// Quantity controls for quick view
function increaseQty() {
    const qtyInput = document.getElementById('quick-qty');
    const currentValue = parseInt(qtyInput.value);
    if (currentValue < 10) {
        qtyInput.value = currentValue + 1;
    }
}

function decreaseQty() {
    const qtyInput = document.getElementById('quick-qty');
    const currentValue = parseInt(qtyInput.value);
    if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
    }
}

// Add to cart from quick view
function addToCartFromQuickView(productId) {
    const product = apparelProducts.find(p => p.id === productId);
    if (!product) return;
    
    const size = document.getElementById('quick-size').value;
    const color = document.getElementById('quick-color').value;
    const quantity = parseInt(document.getElementById('quick-qty').value);
    const design = document.getElementById('quick-design').value;
    
    addToCart(productId, quantity, design, { size, color });
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
    modal.hide();
}

// Add to cart
function addToCart(productId, quantity = 1, design = '', options = {}) {
    const product = apparelProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === options.size && 
        item.color === options.color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.design = design;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            design: design,
            size: options.size || '',
            color: options.color || ''
        });
    }
    
    saveCart(cart);
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

// View product details
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Generate stars
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

// Cart functionality
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Initialize cart functionality
function initCartFunctionality() {
    updateCartCount();
}

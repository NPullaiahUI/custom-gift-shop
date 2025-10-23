// Cart page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initCartPage();
    initCartFunctionality();
    initCouponSystem();
    initRecentlyViewed();
});

// Initialize cart page
function initCartPage() {
    loadCartItems();
    updateCartSummary();
    updateCartCount();
}

// Load cart items
function loadCartItems() {
    const cart = getCart();
    const cartTableBody = document.getElementById('cart-table-body');
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    
    cartTableBody.innerHTML = cart.map(item => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="me-3" width="60" height="60" style="object-fit: cover; border-radius: 8px;">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        ${item.size ? `<small class="text-muted">Size: ${item.size}</small>` : ''}
                        ${item.customization ? `<br><small class="text-muted">Custom: ${item.customization}</small>` : ''}
                    </div>
                </div>
            </td>
            <td>
                <span class="fw-bold">$${item.price}</span>
            </td>
            <td>
                <div class="input-group" style="max-width: 120px;">
                    <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="form-control form-control-sm text-center" value="${item.quantity}" min="1" max="10" onchange="updateQuantity(${item.id}, this.value)">
                    <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>
                <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
            </td>
            <td>
                <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('item-count').textContent = cart.length;
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        cart[itemIndex].quantity = parseInt(newQuantity);
        saveCart(cart);
        loadCartItems();
        updateCartSummary();
        updateCartCount();
    }
}

// Remove from cart
function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    showNotification('Item removed from cart', 'info');
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        saveCart([]);
        loadCartItems();
        updateCartSummary();
        updateCartCount();
        showNotification('Cart cleared', 'info');
    }
}

// Update cart summary
function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Cart is Empty';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Proceed to Checkout';
    }
}

// Initialize coupon system
function initCouponSystem() {
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponCode = document.getElementById('coupon-code');
    const couponMessage = document.getElementById('coupon-message');
    
    applyCouponBtn.addEventListener('click', () => {
        const code = couponCode.value.trim().toUpperCase();
        const validCoupons = {
            'SAVE10': { discount: 0.10, type: 'percentage' },
            'WELCOME': { discount: 5, type: 'fixed' },
            'FREESHIP': { discount: 5.99, type: 'shipping' }
        };
        
        if (validCoupons[code]) {
            const coupon = validCoupons[code];
            applyCoupon(coupon);
            couponMessage.innerHTML = `<div class="alert alert-success">Coupon applied! ${code}</div>`;
            couponCode.value = '';
        } else {
            couponMessage.innerHTML = `<div class="alert alert-danger">Invalid coupon code</div>`;
        }
    });
}

// Apply coupon
function applyCoupon(coupon) {
    // Store coupon in localStorage
    localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    updateCartSummary();
}

// Initialize recently viewed
function initRecentlyViewed() {
    loadRecentlyViewed();
}

// Load recently viewed products
function loadRecentlyViewed() {
    const recentlyViewed = getRecentlyViewed();
    const container = document.getElementById('recently-viewed-container');
    
    if (recentlyViewed.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No recently viewed products</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentlyViewed.slice(0, 4).map(product => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn btn-light me-2" onclick="quickView(${product.id})">
                            <i class="fas fa-eye me-1"></i>Quick View
                        </button>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price mb-2">$${product.price}</div>
                    <button class="btn btn-primary w-100" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye me-2"></i>View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Save cart for later
function saveCart() {
    const cart = getCart();
    localStorage.setItem('savedCart', JSON.stringify(cart));
    showNotification('Cart saved for later!', 'success');
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

// Recently viewed functionality
function getRecentlyViewed() {
    const recentlyViewed = localStorage.getItem('recentlyViewed');
    return recentlyViewed ? JSON.parse(recentlyViewed) : [];
}

function addToRecentlyViewed(product) {
    let recentlyViewed = getRecentlyViewed();
    recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);
    recentlyViewed.unshift(product);
    recentlyViewed = recentlyViewed.slice(0, 10); // Keep only last 10
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Add to cart
function addToCart(productId) {
    // This would typically fetch product data from API
    const sampleProducts = [
        {
            id: 1,
            name: "Personalized Coffee Mug",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            name: "Custom Photo Frame",
            price: 19.99,
            image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        }
    ];
    
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            customization: ''
        });
    }
    
    saveCart(cart);
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

// View product
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Quick view
function quickView(productId) {
    // This would open a quick view modal
    showNotification('Quick view feature coming soon!', 'info');
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
    
    // Add event listeners
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('save-cart').addEventListener('click', saveCart);
}

// Product Detail JavaScript - Dynamic Database Loading

document.addEventListener('DOMContentLoaded', function() {
    initProductDetail();
    initCartFunctionality();
});

// Product data (will be loaded from database)
let currentProduct = null;
let relatedProducts = [];

// Initialize product detail
async function initProductDetail() {
    try {
        const productId = getProductIdFromUrl();
        if (!productId) {
            showError('Product not found');
            return;
        }
        
        await loadProductFromDatabase(productId);
        await loadRelatedProducts();
        
        if (currentProduct) {
            displayProduct();
            initImageGallery();
            initCustomization();
            initQuantityControls();
            initProductTabs();
        } else {
            showError('Product not found');
        }
        
        updateCartCount();
    } catch (error) {
        console.error('Error initializing product detail:', error);
        showError('Failed to load product details. Please try again.');
    }
}

// Get product ID from URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load product from database
async function loadProductFromDatabase(productId) {
    try {
        const response = await fetch(`php/api.php?action=get-product&id=${productId}`);
        const data = await response.json();
        
        if (data.success) {
            currentProduct = data.data;
        } else {
            console.error('Error loading product:', data.error);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

// Load related products
async function loadRelatedProducts() {
    if (!currentProduct) return;
    
    try {
        const response = await fetch(`php/api.php?action=get-products-by-category&category_id=${currentProduct.category_id}&limit=4`);
        const data = await response.json();
        
        if (data.success) {
            relatedProducts = data.data.filter(p => p.id != currentProduct.id).slice(0, 3);
        }
    } catch (error) {
        console.error('Error fetching related products:', error);
    }
}

// Display product
function displayProduct() {
    if (!currentProduct) return;
    
    // Update page title
    document.title = `${currentProduct.name} - Custom Gift Shop`;
    
    // Create the entire product detail structure
    createProductDetailStructure();
    
    // Update breadcrumb
    updateBreadcrumb();
    
    // Update product images
    updateProductImages();
    
    // Update product info
    updateProductInfo();
    
    // Update related products
    updateRelatedProducts();
}

// Create the complete product detail HTML structure
function createProductDetailStructure() {
    const container = document.getElementById('product-detail-container');
    if (!container) return;
    
    const categoryName = getCategoryName(currentProduct.category_id);
    const rating = currentProduct.rating || 4.0;
    const reviews = currentProduct.reviews || 0;
    
    container.innerHTML = `
        <div class="col-lg-6">
            <div class="product-image-gallery">
                <div class="main-image-container mb-3">
                    <img id="main-product-image" src="${currentProduct.image_url || getDefaultProductImage()}" 
                         alt="${currentProduct.name}" class="img-fluid rounded shadow">
                </div>
                <div class="thumbnail-gallery">
                    <div id="thumbnail-container" class="d-flex gap-2">
                        <!-- Thumbnails will be populated by updateProductImages() -->
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="product-info">
                <div class="product-rating mb-3">
                    ${generateStars(rating)}
                    <span class="ms-2 text-muted">(${reviews} reviews)</span>
                </div>
                <h1 id="product-title" class="product-title mb-3">${currentProduct.name}</h1>
                <div id="product-price" class="product-price mb-4">
                    <span class="h3 text-primary">$${currentProduct.price}</span>
                </div>
                <p id="product-description" class="product-description mb-4">${currentProduct.description || 'High-quality custom product'}</p>
                
                <div class="product-category mb-4">
                    <strong>Category:</strong> ${categoryName}
                </div>
                
                <div class="customization-section mb-4">
                    <label for="customization-text" class="form-label">Customization (Optional)</label>
                    <textarea id="customization-text" class="form-control customization-textarea" 
                              placeholder="Enter your custom text or special instructions..."></textarea>
                </div>
                
                <div class="quantity-section mb-4">
                    <label class="form-label">Quantity</label>
                    <div class="quantity-input-group">
                        <button id="decrease-quantity" class="quantity-btn">-</button>
                        <input id="quantity" type="number" class="quantity-input" value="1" min="1" max="10">
                        <button id="increase-quantity" class="quantity-btn">+</button>
                    </div>
                </div>
                
                <div class="product-actions mb-4">
                    <button class="btn btn-primary btn-lg me-3" onclick="addToCart()">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-success btn-lg" onclick="buyNow()">
                        <i class="fas fa-bolt me-2"></i>Buy Now
                    </button>
                </div>
                
                <div class="product-features mb-4">
                    <h6>Key Features:</h6>
                    <ul id="product-features" class="list-unstyled">
                        <!-- Features will be populated by updateProductInfo() -->
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="col-12 mt-5">
            <div class="product-tabs">
                <ul class="nav nav-tabs" id="product-tabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="specifications-tab" data-bs-toggle="tab" 
                                data-bs-target="#specifications" type="button" role="tab">Specifications</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" 
                                data-bs-target="#reviews" type="button" role="tab">Reviews</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="shipping-tab" data-bs-toggle="tab" 
                                data-bs-target="#shipping" type="button" role="tab">Shipping</button>
                    </li>
                </ul>
                <div class="tab-content" id="product-tab-content">
                    <div class="tab-pane fade show active" id="specifications" role="tabpanel">
                        <div class="p-4">
                            <table class="table table-striped">
                                <tbody id="product-specifications">
                                    <!-- Specifications will be populated by updateProductInfo() -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="reviews" role="tabpanel">
                        <div class="p-4">
                            <h5>Customer Reviews</h5>
                            <p>No reviews yet. Be the first to review this product!</p>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="shipping" role="tabpanel">
                        <div class="p-4">
                            <h5>Shipping Information</h5>
                            <ul>
                                <li>Free shipping on orders over $50</li>
                                <li>Standard shipping: 3-5 business days</li>
                                <li>Express shipping: 1-2 business days</li>
                                <li>International shipping available</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get category name by ID
function getCategoryName(categoryId) {
    // This would normally come from categories data, but for now return a default
    const categoryMap = {
        1: 'Personalized Mugs',
        2: 'Photo Frames', 
        3: 'Custom Apparel',
        4: 'Jewelry',
        5: 'Phone Accessories',
        6: 'Home Decor'
    };
    return categoryMap[categoryId] || 'Uncategorized';
}

// Update breadcrumb
function updateBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
            <li class="breadcrumb-item"><a href="products.html">Products</a></li>
            <li class="breadcrumb-item active" aria-current="page">${currentProduct.name}</li>
        `;
    }
}

// Update product images
function updateProductImages() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    
    if (!mainImage || !thumbnailContainer) {
        console.warn('Image elements not found');
        return;
    }
    
    let images = [];
    
    // Try to parse images from database
    if (currentProduct.images && currentProduct.images !== 'null' && currentProduct.images !== 'NULL') {
        try {
            images = JSON.parse(currentProduct.images);
            console.log('Parsed images array:', images);
        } catch (e) {
            console.warn('Error parsing images JSON:', e);
            images = [];
        }
    }
    
    // If no images array or empty, use image_url
    if (images.length === 0 && currentProduct.image_url) {
        images = [currentProduct.image_url];
    }
    
    // If still no images, use default
    if (images.length === 0) {
        images = [getDefaultProductImage()];
    }
    
    console.log('Final images array:', images);
    
    // Update main image
    mainImage.src = images[0];
    mainImage.alt = currentProduct.name;
    mainImage.onerror = function() {
        this.src = getDefaultProductImage();
        this.onerror = null;
    };
    
    // Create thumbnails
    thumbnailContainer.innerHTML = images.map((image, index) => `
        <div class="thumbnail-item ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${image}', this)">
            <img src="${image}" alt="${currentProduct.name} - Image ${index + 1}" 
                 class="img-thumbnail" 
                 onerror="this.src='${getDefaultProductImage()}'; this.onerror=null;"
                 loading="lazy">
        </div>
    `).join('');
}

// Update product info
function updateProductInfo() {
    // Product title
    const titleElement = document.getElementById('product-title');
    if (titleElement) {
        titleElement.textContent = currentProduct.name;
    }
    
    // Product price
    const priceElement = document.getElementById('product-price');
    if (priceElement) {
        priceElement.innerHTML = `<span class="h3 text-primary">$${currentProduct.price}</span>`;
    }
    
    // Product rating
    const ratingElement = document.getElementById('product-rating');
    if (ratingElement) {
        const rating = currentProduct.rating || 4.0;
        const reviews = currentProduct.reviews || 0;
        ratingElement.innerHTML = `
            ${generateStars(rating)}
            <span class="ms-2 text-muted">(${reviews} reviews)</span>
        `;
    }
    
    // Product description
    const descriptionElement = document.getElementById('product-description');
    if (descriptionElement) {
        descriptionElement.textContent = currentProduct.description || 'High-quality custom product';
    }
    
    // Product features
    const featuresElement = document.getElementById('product-features');
    if (featuresElement) {
        const features = currentProduct.features ? JSON.parse(currentProduct.features) : [
            'High-quality materials',
            'Custom personalization',
            'Perfect gift option',
            'Fast production time'
        ];
        featuresElement.innerHTML = features.map(feature => `
            <li><i class="fas fa-check text-success me-2"></i>${feature}</li>
        `).join('');
    }
    
    // Product specifications
    const specificationsElement = document.getElementById('product-specifications');
    if (specificationsElement) {
        const specifications = currentProduct.specifications ? JSON.parse(currentProduct.specifications) : {
            'Material': 'High-quality materials',
            'Dimensions': 'Varies by product',
            'Weight': 'Varies by product',
            'Care Instructions': 'Follow care instructions'
        };
        specificationsElement.innerHTML = Object.entries(specifications).map(([key, value]) => `
            <tr>
                <td><strong>${key}</strong></td>
                <td>${value}</td>
            </tr>
        `).join('');
    }
}

// Update related products
function updateRelatedProducts() {
    const container = document.getElementById('related-products-container');
    if (!container || relatedProducts.length === 0) return;
    
    container.innerHTML = relatedProducts.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image_url || getDefaultProductImage()}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-primary">
                            <i class="fas fa-eye me-1"></i>View Details
                        </a>
                    </div>
                </div>
                <div class="product-content">
                    <h6 class="product-title">${product.name}</h6>
                    <div class="product-price">$${product.price}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Get default product image
function getDefaultProductImage() {
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
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

// Initialize image gallery
function initImageGallery() {
    // Image gallery functionality is already handled by updateProductImages
}

// Change main image
function changeMainImage(imageSrc, thumbnailElement) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail-item').forEach(item => {
        item.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
}

// Initialize customization
function initCustomization() {
    // Customization functionality can be added here
    const customizationTextarea = document.getElementById('customization-text');
    if (customizationTextarea) {
        customizationTextarea.placeholder = 'Enter your custom text or special instructions...';
    }
}

// Initialize quantity controls
function initQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value) || 1;
            quantityInput.value = currentValue + 1;
        });
    }
}

// Initialize product tabs
function initProductTabs() {
    // Tab functionality is handled by Bootstrap
}

// Add to cart functionality
function addToCart() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const customization = document.getElementById('customization-text').value || '';
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image_url || getDefaultProductImage(),
            quantity: quantity,
            customization: customization
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartMessage(currentProduct.name);
}

// Buy now functionality
function buyNow() {
    addToCart();
    window.location.href = 'checkout.html';
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
    const container = document.querySelector('.container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8 text-center py-5">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${message}
                </div>
                <a href="products.html" class="btn btn-primary">Back to Products</a>
            </div>
        </div>
    `;
}
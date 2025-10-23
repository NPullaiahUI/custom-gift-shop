// Products page JavaScript functionality - Dynamic Database Loading

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products page
    initProductsPage();
    initCartFunctionality();
    initSearchAndFilters();
    initQuickView();
});

// Products data (will be loaded from database)
let productsData = [];
let categoriesData = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Initialize products page
async function initProductsPage() {
    try {
        await loadProductsFromDatabase();
        await loadCategoriesFromDatabase();
        loadProducts();
        updateCartCount();
    } catch (error) {
        console.error('Error initializing products page:', error);
        showError('Failed to load products. Please try again.');
    }
}

// Load products from database
async function loadProductsFromDatabase() {
    try {
        const response = await fetch('php/api.php?action=get-products');
        const data = await response.json();
        
        if (data.success) {
            productsData = data.data;
            filteredProducts = [...productsData];
        } else {
            console.error('Error loading products:', data.error);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Load categories from database
async function loadCategoriesFromDatabase() {
    try {
        const response = await fetch('php/api.php?action=get-categories');
        const data = await response.json();
        
        if (data.success) {
            categoriesData = data.data;
            populateCategoryFilter();
        } else {
            console.error('Error loading categories:', data.error);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Populate category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    categoryFilter.innerHTML = `
        <option value="">All Categories</option>
        ${categoriesData.map(category => `
            <option value="${category.id}">${category.name}</option>
        `).join('')}
    `;
}

// Load products with pagination
function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
        container.innerHTML = '';
    }
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No products found</h4>
                <p class="text-muted">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        if (endIndex < filteredProducts.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Update results count
    updateResultsCount();
    
    // Animate new products
    animateProducts();
}

// Create product card element
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const categoryName = getCategoryName(product.category_id);
    const rating = product.rating || 4.0;
    const reviews = product.reviews || 0;
    
    col.innerHTML = `
        <div class="product-card">
                <div class="product-image">
                    <img src="${product.image_url || getDefaultProductImage()}" alt="${product.name}" loading="lazy" 
                         onerror="this.src='${getDefaultProductImage()}'; this.onerror=null;">
                <div class="product-overlay">
                    <button class="btn btn-light me-2" onclick="quickView(${product.id})">
                        <i class="fas fa-eye me-1"></i>Quick View
                    </button>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                    </button>
                </div>
                <div class="product-badge">
                    <span class="badge bg-success">New</span>
                </div>
            </div>
            <div class="product-content">
                <div class="product-rating mb-2">
                    ${generateStars(rating)}
                    <span class="ms-2 text-muted">(${reviews})</span>
                </div>
                <h5 class="product-title">${product.name}</h5>
                <div class="product-price mb-2">$${product.price}</div>
                <p class="product-description">${product.description || 'High-quality custom product'}</p>
                <div class="product-category mb-2">
                    <small class="text-muted">
                        <i class="fas fa-tag me-1"></i>${categoryName}
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
    `;
    
    return col;
}

// Get category name by ID
function getCategoryName(categoryId) {
    const category = categoriesData.find(c => c.id == categoryId);
    return category ? category.name : 'Uncategorized';
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

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filteredProducts.length} products`;
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('products-container');
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

// Load more products
function loadMoreProducts() {
    currentPage++;
    loadProducts();
}

// Search and filter functionality
function initSearchAndFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');
    const priceRange = document.getElementById('price-range');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    if (priceRange) {
        priceRange.addEventListener('input', debounce(handlePriceFilter, 300));
    }
}

// Handle search
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredProducts = productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    loadProducts();
}

// Handle category filter
function handleCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === '') {
        filteredProducts = [...productsData];
    } else {
        filteredProducts = productsData.filter(product => 
            product.category_id == selectedCategory
        );
    }
    
    currentPage = 1;
    loadProducts();
}

// Handle sort
function handleSort() {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
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
            filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    currentPage = 1;
    loadProducts();
}

// Handle price filter
function handlePriceFilter() {
    const priceRange = document.getElementById('price-range');
    const maxPrice = parseFloat(priceRange.value);
    
    filteredProducts = productsData.filter(product => 
        product.price <= maxPrice
    );
    
    currentPage = 1;
    loadProducts();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Quick view functionality
function initQuickView() {
    // Quick view will be handled by modal
}

// Quick view product
function quickView(productId) {
    const product = productsData.find(p => p.id == productId);
    if (!product) return;
    
    const categoryName = getCategoryName(product.category_id);
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
                                <img src="${product.image_url || getDefaultProductImage()}" alt="${product.name}" class="img-fluid rounded" 
                                     style="width: 100%; height: 300px; object-fit: cover;"
                                     onerror="this.src='${getDefaultProductImage()}'; this.onerror=null;">
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
                                <p class="text-muted mb-3">${product.description || 'High-quality custom product'}</p>
                                <div class="product-category mb-3">
                                    <strong>Category:</strong> ${categoryName}
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
    const product = productsData.find(p => p.id == productId);
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
            image: product.image_url || getDefaultProductImage(),
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
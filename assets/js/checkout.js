// Checkout page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initCheckoutPage();
    initCheckoutSteps();
    initFormValidation();
    initOrderSummary();
});

let currentStep = 1;
const totalSteps = 4;

// Initialize checkout page
function initCheckoutPage() {
    loadOrderSummary();
    updateStepDisplay();
    updateCartCount();
}

// Initialize checkout steps
function initCheckoutSteps() {
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const placeOrderBtn = document.getElementById('place-order');
    
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    placeOrderBtn.addEventListener('click', placeOrder);
    
    // Update step display on load
    updateStepDisplay();
}

// Next step
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    }
}

// Previous step
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

// Update step display
function updateStepDisplay() {
    // Update progress bar
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Show/hide steps
    document.querySelectorAll('.checkout-step').forEach((step, index) => {
        step.style.display = index + 1 === currentStep ? 'block' : 'none';
    });
    
    // Update navigation buttons
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const placeOrderBtn = document.getElementById('place-order');
    
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        placeOrderBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        placeOrderBtn.style.display = 'none';
    }
}

// Validate current step
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    // Additional validation for specific steps
    if (currentStep === 1) {
        isValid = validateCustomerInfo() && isValid;
    } else if (currentStep === 2) {
        isValid = validateShippingInfo() && isValid;
    } else if (currentStep === 3) {
        isValid = validatePaymentInfo() && isValid;
    }
    
    return isValid;
}

// Validate customer information
function validateCustomerInfo() {
    const email = document.querySelector('input[name="email"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    let isValid = true;
    
    if (!emailRegex.test(email)) {
        document.querySelector('input[name="email"]').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!phoneRegex.test(phone) || phone.length < 10) {
        document.querySelector('input[name="phone"]').classList.add('is-invalid');
        isValid = false;
    }
    
    return isValid;
}

// Validate shipping information
function validateShippingInfo() {
    const zip = document.querySelector('input[name="zip"]').value;
    const zipRegex = /^\d{5}(-\d{4})?$/;
    
    if (!zipRegex.test(zip)) {
        document.querySelector('input[name="zip"]').classList.add('is-invalid');
        return false;
    }
    
    return true;
}

// Validate payment information
function validatePaymentInfo() {
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    
    if (paymentMethod === 'credit') {
        const cardNumber = document.querySelector('input[name="card_number"]').value;
        const expiry = document.querySelector('input[name="expiry"]').value;
        const cvv = document.querySelector('input[name="cvv"]').value;
        
        const cardRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^\d{3,4}$/;
        
        let isValid = true;
        
        if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) {
            document.querySelector('input[name="card_number"]').classList.add('is-invalid');
            isValid = false;
        }
        
        if (!expiryRegex.test(expiry)) {
            document.querySelector('input[name="expiry"]').classList.add('is-invalid');
            isValid = false;
        }
        
        if (!cvvRegex.test(cvv)) {
            document.querySelector('input[name="cvv"]').classList.add('is-invalid');
            isValid = false;
        }
        
        return isValid;
    }
    
    return true;
}

// Initialize form validation
function initFormValidation() {
    // Real-time validation
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => {
            if (field.hasAttribute('required') && !field.value.trim()) {
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        field.addEventListener('input', () => {
            field.classList.remove('is-invalid');
        });
    });
    
    // Card number formatting
    const cardNumberInput = document.querySelector('input[name="card_number"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Expiry date formatting
    const expiryInput = document.querySelector('input[name="expiry"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Initialize order summary
function initOrderSummary() {
    loadOrderSummary();
}

// Load order summary
function loadOrderSummary() {
    const cart = getCart();
    const orderItemsContainer = document.getElementById('order-items');
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-muted">No items in cart</p>';
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" width="40" height="40" class="me-2 rounded" style="object-fit: cover;">
                <div>
                    <div class="fw-bold">${item.name}</div>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
            </div>
            <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    updateOrderTotals();
}

// Update order totals
function updateOrderTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    document.getElementById('order-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('order-shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('order-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
}

// Place order
function placeOrder() {
    if (!validateCurrentStep()) {
        showNotification('Please complete all required fields', 'error');
        return;
    }
    
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Show loading state
    const placeOrderBtn = document.getElementById('place-order');
    const originalText = placeOrderBtn.innerHTML;
    placeOrderBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        processOrder();
        placeOrderBtn.innerHTML = originalText;
        placeOrderBtn.disabled = false;
    }, 2000);
}

// Process order
function processOrder() {
    const orderData = collectOrderData();
    
    // In a real application, this would send data to the server
    console.log('Order data:', orderData);
    
    // Clear cart
    saveCart([]);
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Update cart count
    updateCartCount();
}

// Collect order data
function collectOrderData() {
    const formData = new FormData(document.getElementById('checkout-form'));
    const cart = getCart();
    
    return {
        customer: {
            firstName: formData.get('first_name'),
            lastName: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            country: formData.get('country')
        },
        payment: {
            method: formData.get('payment_method'),
            cardNumber: formData.get('card_number'),
            expiry: formData.get('expiry'),
            cvv: formData.get('cvv'),
            cardholderName: formData.get('cardholder_name')
        },
        items: cart,
        totals: calculateTotals(cart),
        orderDate: new Date().toISOString(),
        orderId: generateOrderId()
    };
}

// Calculate totals
function calculateTotals(cart) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
    };
}

// Generate order ID
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
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

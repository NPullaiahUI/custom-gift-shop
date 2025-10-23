// Admin Login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initAdminLogin();
});

// Initialize admin login
function initAdminLogin() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if already logged in
    checkAuthStatus();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password'),
        remember: document.getElementById('remember-me').checked
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';
    submitBtn.disabled = true;
    
    // Simulate login (replace with actual API call)
    setTimeout(() => {
        if (loginData.username === 'admin' && loginData.password === 'admin123') {
            // Store auth token
            const authToken = generateAuthToken();
            console.log('Generated token:', authToken);
            
            localStorage.setItem('admin_token', authToken);
            localStorage.setItem('admin_user', JSON.stringify({
                username: loginData.username,
                loginTime: new Date().toISOString()
            }));
            
            console.log('Token stored in localStorage');
            console.log('User data stored:', localStorage.getItem('admin_user'));
            
            showAlert('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
                window.location.href = 'admin-dashboard.html';
            }, 1000);
        } else {
            showAlert('Invalid username or password!', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('admin_token');
    if (token && isValidToken(token)) {
        // Already logged in, redirect to dashboard
        window.location.href = 'admin-dashboard.html';
    }
}

// Generate auth token (simple implementation)
function generateAuthToken() {
    return 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Validate auth token
function isValidToken(token) {
    if (!token || !token.startsWith('admin_')) {
        return false;
    }
    
    // Check if token is not expired (24 hours)
    const tokenTime = parseInt(token.split('_')[1]);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    return (now - tokenTime) < twentyFourHours;
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

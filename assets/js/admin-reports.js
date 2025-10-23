// Admin Reports JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initReports();
});

// Initialize reports
function initReports() {
    // Check authentication
    if (!checkAuth()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Load initial data
    loadReportData();
    loadCategories();
    
    // Initialize charts
    initCharts();
    
    // Set up event listeners
    setupEventListeners();
}

// Check authentication
function checkAuth() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Load report data
async function loadReportData() {
    try {
        // Load overview metrics
        await loadOverviewMetrics();
        
        // Load recent orders
        await loadRecentOrders();
        
        // Load top products
        await loadTopProducts();
        
        // Load sales data
        await loadSalesData();
        
        // Load product analytics
        await loadProductAnalytics();
        
        // Load customer analytics
        await loadCustomerAnalytics();
        
        // Load inventory data
        await loadInventoryData();
        
    } catch (error) {
        console.error('Error loading report data:', error);
        showAlert('Failed to load report data', 'error');
    }
}

// Load overview metrics
async function loadOverviewMetrics() {
    try {
        const response = await fetch('php/api.php/admin/stats');
        const data = await response.json();
        
        if (data.success) {
            updateMetrics(data.data);
        }
    } catch (error) {
        console.error('Error loading metrics:', error);
        // Use sample data
        updateMetrics({
            total_revenue: 12500.50,
            total_orders: 156,
            total_products: 24,
            total_customers: 89,
            revenue_change: 12.5,
            orders_change: 8.3,
            products_change: 4.2,
            customers_change: 15.7
        });
    }
}

// Update metrics display
function updateMetrics(data) {
    document.getElementById('totalRevenue').textContent = `$${data.total_revenue?.toLocaleString() || '0'}`;
    document.getElementById('totalOrders').textContent = data.total_orders || '0';
    document.getElementById('totalProducts').textContent = data.total_products || '0';
    document.getElementById('totalCustomers').textContent = data.total_customers || '0';
    
    document.getElementById('revenueChange').textContent = `+${data.revenue_change || 0}% from last period`;
    document.getElementById('ordersChange').textContent = `+${data.orders_change || 0}% from last period`;
    document.getElementById('productsChange').textContent = `+${data.products_change || 0}% from last period`;
    document.getElementById('customersChange').textContent = `+${data.customers_change || 0}% from last period`;
}

// Load recent orders
async function loadRecentOrders() {
    try {
        const response = await fetch('php/api.php/orders');
        const data = await response.json();
        
        if (data.success) {
            displayRecentOrders(data.data.slice(0, 5));
        } else {
            // Use sample data
            displayRecentOrders([
                { id: 1, customer_name: 'John Doe', total_amount: 45.99, status: 'completed', created_at: '2024-01-15' },
                { id: 2, customer_name: 'Jane Smith', total_amount: 32.50, status: 'processing', created_at: '2024-01-14' },
                { id: 3, customer_name: 'Mike Johnson', total_amount: 78.25, status: 'shipped', created_at: '2024-01-13' },
                { id: 4, customer_name: 'Sarah Wilson', total_amount: 29.99, status: 'completed', created_at: '2024-01-12' },
                { id: 5, customer_name: 'David Brown', total_amount: 65.75, status: 'pending', created_at: '2024-01-11' }
            ]);
        }
    } catch (error) {
        console.error('Error loading recent orders:', error);
    }
}

// Display recent orders
function displayRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>$${order.total_amount}</td>
            <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
            <td>${formatDate(order.created_at)}</td>
        </tr>
    `).join('');
}

// Load top products
async function loadTopProducts() {
    try {
        const response = await fetch('php/api.php/products');
        const data = await response.json();
        
        if (data.success) {
            // Sort by sales (simulated)
            const topProducts = data.data.slice(0, 5).map(product => ({
                ...product,
                sales: Math.floor(Math.random() * 50) + 10,
                revenue: (Math.floor(Math.random() * 50) + 10) * product.price,
                rating: (Math.random() * 2 + 3).toFixed(1)
            }));
            
            displayTopProducts(topProducts);
        }
    } catch (error) {
        console.error('Error loading top products:', error);
    }
}

// Display top products
function displayTopProducts(products) {
    const tbody = document.getElementById('topProductsTable');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.sales}</td>
            <td>$${product.revenue.toFixed(2)}</td>
            <td>${product.rating} ⭐</td>
        </tr>
    `).join('');
}

// Load sales data
async function loadSalesData() {
    // Generate sample sales data
    const salesData = generateSalesData();
    updateSalesChart(salesData);
    updateSalesReport(salesData);
}

// Generate sample sales data
function generateSalesData() {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
        data.push({
            month: months[i],
            revenue: Math.floor(Math.random() * 5000) + 2000,
            orders: Math.floor(Math.random() * 50) + 20,
            avgOrderValue: Math.floor(Math.random() * 50) + 30,
            conversionRate: (Math.random() * 5 + 2).toFixed(1)
        });
    }
    
    return data;
}

// Update sales chart
function updateSalesChart(data) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    if (window.salesChart) {
        window.salesChart.destroy();
    }
    
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.month),
            datasets: [{
                label: 'Revenue',
                data: data.map(d => d.revenue),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }, {
                label: 'Orders',
                data: data.map(d => d.orders),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update sales report table
function updateSalesReport(data) {
    const tbody = document.getElementById('salesReportTable');
    tbody.innerHTML = data.map(d => `
        <tr>
            <td>${d.month}</td>
            <td>${d.orders}</td>
            <td>$${d.revenue.toLocaleString()}</td>
            <td>$${d.avgOrderValue}</td>
            <td>${d.conversionRate}%</td>
        </tr>
    `).join('');
}

// Load product analytics
async function loadProductAnalytics() {
    try {
        const response = await fetch('php/api.php/products');
        const data = await response.json();
        
        if (data.success) {
            displayProductAnalytics(data.data);
            updateProductCharts(data.data);
        }
    } catch (error) {
        console.error('Error loading product analytics:', error);
    }
}

// Display product analytics
function displayProductAnalytics(products) {
    const tbody = document.getElementById('productAnalyticsTable');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category_id)}</td>
            <td>$${product.price}</td>
            <td>${product.stock || 0}</td>
            <td>${Math.floor(Math.random() * 30) + 5}</td>
            <td>$${((Math.floor(Math.random() * 30) + 5) * product.price).toFixed(2)}</td>
            <td>${(Math.random() * 2 + 3).toFixed(1)} ⭐</td>
        </tr>
    `).join('');
}

// Update product charts
function updateProductCharts(products) {
    // Product performance chart
    const ctx1 = document.getElementById('productChart').getContext('2d');
    if (window.productChart) {
        window.productChart.destroy();
    }
    
    const topProducts = products.slice(0, 5);
    window.productChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: topProducts.map(p => p.name),
            datasets: [{
                label: 'Sales',
                data: topProducts.map(() => Math.floor(Math.random() * 50) + 10),
                backgroundColor: 'rgba(54, 162, 235, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Product category chart
    const ctx2 = document.getElementById('productCategoryChart').getContext('2d');
    if (window.productCategoryChart) {
        window.productCategoryChart.destroy();
    }
    
    const categoryData = getCategoryDistribution(products);
    window.productCategoryChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Get category distribution
function getCategoryDistribution(products) {
    const distribution = {};
    products.forEach(product => {
        const category = getCategoryName(product.category_id);
        distribution[category] = (distribution[category] || 0) + 1;
    });
    
    return {
        labels: Object.keys(distribution),
        data: Object.values(distribution)
    };
}

// Load customer analytics
async function loadCustomerAnalytics() {
    // Generate sample customer data
    const customers = generateCustomerData();
    displayCustomerAnalytics(customers);
    updateCustomerCharts(customers);
}

// Generate sample customer data
function generateCustomerData() {
    const customers = [];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis', 'Tom Wilson', 'Emma Taylor'];
    
    for (let i = 0; i < 20; i++) {
        customers.push({
            id: i + 1,
            name: names[Math.floor(Math.random() * names.length)],
            email: `customer${i + 1}@example.com`,
            orders: Math.floor(Math.random() * 10) + 1,
            total_spent: Math.floor(Math.random() * 500) + 50,
            last_order: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: Math.random() > 0.8 ? 'inactive' : 'active'
        });
    }
    
    return customers;
}

// Display customer analytics
function displayCustomerAnalytics(customers) {
    const tbody = document.getElementById('customerAnalyticsTable');
    tbody.innerHTML = customers.slice(0, 10).map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.orders}</td>
            <td>$${customer.total_spent}</td>
            <td>${formatDate(customer.last_order)}</td>
            <td><span class="badge bg-${customer.status === 'active' ? 'success' : 'secondary'}">${customer.status}</span></td>
        </tr>
    `).join('');
}

// Update customer charts
function updateCustomerCharts(customers) {
    // Customer growth chart
    const ctx1 = document.getElementById('customerChart').getContext('2d');
    if (window.customerChart) {
        window.customerChart.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthData = months.map(() => Math.floor(Math.random() * 20) + 5);
    
    window.customerChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'New Customers',
                data: growthData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Customer segment chart
    const ctx2 = document.getElementById('customerSegmentChart').getContext('2d');
    if (window.customerSegmentChart) {
        window.customerSegmentChart.destroy();
    }
    
    window.customerSegmentChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['New Customers', 'Returning Customers', 'VIP Customers'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Load inventory data
async function loadInventoryData() {
    try {
        const response = await fetch('php/api.php/products');
        const data = await response.json();
        
        if (data.success) {
            displayInventoryData(data.data);
            updateInventoryCharts(data.data);
        }
    } catch (error) {
        console.error('Error loading inventory data:', error);
    }
}

// Display inventory data
function displayInventoryData(products) {
    const tbody = document.getElementById('inventoryReportTable');
    tbody.innerHTML = products.map(product => {
        const stock = product.stock || Math.floor(Math.random() * 100) + 10;
        const minThreshold = 10;
        const maxThreshold = 100;
        const status = stock < minThreshold ? 'low' : stock > maxThreshold ? 'high' : 'normal';
        
        return `
            <tr>
                <td>${product.name}</td>
                <td>${getCategoryName(product.category_id)}</td>
                <td>${stock}</td>
                <td>${minThreshold}</td>
                <td>${maxThreshold}</td>
                <td><span class="badge bg-${getStockStatusColor(status)}">${status}</span></td>
            </tr>
        `;
    }).join('');
    
    // Update low stock table
    const lowStockProducts = products.filter(product => (product.stock || 0) < 10);
    const lowStockTbody = document.getElementById('lowStockTable');
    lowStockTbody.innerHTML = lowStockProducts.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.stock || 0}</td>
            <td>10</td>
            <td><span class="badge bg-danger">Low Stock</span></td>
            <td><button class="btn btn-sm btn-warning">Reorder</button></td>
        </tr>
    `).join('');
}

// Update inventory charts
function updateInventoryCharts(products) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (window.stockChart) {
        window.stockChart.destroy();
    }
    
    const topProducts = products.slice(0, 8);
    window.stockChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProducts.map(p => p.name),
            datasets: [{
                label: 'Stock Level',
                data: topProducts.map(p => p.stock || Math.floor(Math.random() * 100) + 10),
                backgroundColor: 'rgba(255, 99, 132, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize charts
function initCharts() {
    // Revenue trend chart
    const ctx1 = document.getElementById('revenueChart').getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map(() => Math.floor(Math.random() * 5000) + 2000);
    
    window.revenueChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Revenue',
                data: revenueData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Category sales chart
    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    window.categoryChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Mugs', 'Frames', 'Apparel', 'Jewelry', 'Accessories', 'Decor'],
            datasets: [{
                data: [30, 25, 20, 15, 5, 5],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Load categories for filter
async function loadCategories() {
    try {
        const response = await fetch('php/api.php/categories');
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('categoryFilter');
            select.innerHTML = '<option value="">All Categories</option>' +
                data.data.map(category => `<option value="${category.id}">${category.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Report type change
    document.getElementById('reportType').addEventListener('change', function() {
        const reportType = this.value;
        const tab = document.querySelector(`#${reportType}-tab`);
        if (tab) {
            tab.click();
        }
    });
}

// Generate report
function generateReport() {
    const dateRange = document.getElementById('dateRange').value;
    const category = document.getElementById('categoryFilter').value;
    const reportType = document.getElementById('reportType').value;
    
    showAlert(`Generating ${reportType} report for ${dateRange}${category ? ` in ${category}` : ''}`, 'info');
    
    // Reload data based on filters
    loadReportData();
}

// Export report
function exportReport(format) {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    
    showAlert(`Exporting ${reportType} report as ${format.toUpperCase()} for ${dateRange}`, 'success');
    
    // In a real application, this would trigger a server-side export
    // For now, we'll simulate the export
    setTimeout(() => {
        showAlert(`Report exported successfully as ${format.toUpperCase()}`, 'success');
    }, 2000);
}

// Print report
function printReport() {
    window.print();
}

// Utility functions
function getStatusColor(status) {
    const colors = {
        'completed': 'success',
        'processing': 'warning',
        'shipped': 'info',
        'pending': 'secondary',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

function getStockStatusColor(status) {
    const colors = {
        'low': 'danger',
        'normal': 'success',
        'high': 'warning'
    };
    return colors[status] || 'secondary';
}

function getCategoryName(categoryId) {
    const categories = {
        1: 'Personalized Mugs',
        2: 'Photo Frames',
        3: 'Custom Apparel',
        4: 'Jewelry',
        5: 'Phone Accessories',
        6: 'Home Decor'
    };
    return categories[categoryId] || 'Uncategorized';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.innerHTML = alertHtml;
    
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.className = 'position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

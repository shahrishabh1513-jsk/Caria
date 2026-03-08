// Global variables
let products = [];
let cart = [];
let users = [];
let currentUser = null;
let orders = [];

// Product reviews data
const productReviews = {
    'm1': [
        { name: 'John D.', rating: 5, date: '2024-05-15', comment: 'Perfect fit and great quality! Highly recommended.' },
        { name: 'Sarah M.', rating: 4, date: '2024-05-10', comment: 'Nice shirt, comfortable fabric. Slightly large fit.' },
        { name: 'Mike R.', rating: 5, date: '2024-05-05', comment: 'Excellent value for money. Will buy again.' }
    ],
    'm2': [
        { name: 'David L.', rating: 5, date: '2024-05-12', comment: 'Best jeans I\'ve ever bought. Very comfortable.' },
        { name: 'Emma W.', rating: 4, date: '2024-05-08', comment: 'Good quality, true to size.' }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    loadUsers();
    loadOrders();
    updateCartCount();
    setupEventListeners();
    
    // Focus on email input if on index page
    const emailField = document.getElementById("email-address-input");
    if (emailField) {
        emailField.focus({ preventScroll: true });
    }
    
    // Load page-specific content
    loadPageContent();
    
    // Setup close modal button
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('product-modal').style.display = 'none';
        });
    }
});

// Load products data
function loadProducts() {
    products = [
        // Men's Products (8 items)
        { id: 'm1', name: 'Classic Fit Shirt', category: 'men', price: 45, brand: 'Allen solly', image: 'images/products/men/m1.jpg', images: ['images/products/men/m1.jpg', 'images/products/men/m1.jpg', 'images/products/men/m1.jpg'], rating: 4.5, description: 'Classic fit cotton shirt for men. Made with 100% premium cotton. Perfect for casual and formal occasions.', type: 'shirt', colors: ['White', 'Blue', 'Black'] },
        { id: 'm2', name: 'Slim Jeans', category: 'men', price: 65, brand: 'Levis', image: 'images/products/men/m2.jpg', images: ['images/products/men/m2.jpg', 'images/products/men/m2.jpg', 'images/products/men/m2.jpg'], rating: 4, description: 'Slim fit denim jeans. Classic blue color with stretchable fabric for maximum comfort.', type: 'pant', colors: ['Blue', 'Black', 'Gray'] },
        { id: 'm3', name: 'Leather Jacket', category: 'men', price: 120, brand: 'Zara', image: 'images/products/men/m3.jpg', images: ['images/products/men/m3.jpg', 'images/products/men/m3.jpg', 'images/products/men/m3.jpg'], rating: 5, description: 'Premium leather jacket. Genuine leather with soft inner lining. Perfect for winter.', type: 'jacket', colors: ['Black', 'Brown'] },
        { id: 'm4', name: 'Casual Hoodie', category: 'men', price: 55, brand: 'Adidas', image: 'images/products/men/m4.jpg', images: ['images/products/men/m4.jpg', 'images/products/men/m4.jpg', 'images/products/men/m4.jpg'], rating: 4, description: 'Comfortable cotton hoodie. Perfect for workouts and casual wear.', type: 'hoodie', colors: ['Gray', 'Black', 'Navy'] },
        { id: 'm5', name: 'Formal Blazer', category: 'men', price: 150, brand: 'H&M', image: 'images/products/men/m5.jpg', images: ['images/products/men/m5.jpg', 'images/products/men/m5.jpg', 'images/products/men/m5.jpg'], rating: 4.5, description: 'Elegant formal blazer for business meetings and special occasions.', type: 'blazer', colors: ['Navy', 'Black', 'Charcoal'] },
        { id: 'm6', name: 'Sports T-Shirt', category: 'men', price: 35, brand: 'Puma', image: 'images/products/men/m6.jpg', images: ['images/products/men/m6.jpg', 'images/products/men/m6.jpg', 'images/products/men/m6.jpg'], rating: 4, description: 'Breathable sports t-shirt. Moisture-wicking fabric for workouts.', type: 'shirt', colors: ['Red', 'Blue', 'Black'] },
        { id: 'm7', name: 'Chino Pants', category: 'men', price: 60, brand: 'Gap', image: 'images/products/men/m7.jpg', images: ['images/products/men/m7.jpg', 'images/products/men/m7.jpg', 'images/products/men/m7.jpg'], rating: 4.5, description: 'Comfortable chino pants for casual and semi-formal wear.', type: 'pant', colors: ['Khaki', 'Navy', 'Olive'] },
        { id: 'm8', name: 'Wool Sweater', category: 'men', price: 85, brand: 'Uniqlo', image: 'images/products/men/m8.jpg', images: ['images/products/men/m8.jpg', 'images/products/men/m8.jpg', 'images/products/men/m8.jpg'], rating: 4, description: 'Warm wool sweater for winter. Soft and comfortable.', type: 'sweater', colors: ['Gray', 'Navy', 'Burgundy'] },
        
        // Women's Products (8 items)
        { id: 'w1', name: 'Floral Dress', category: 'women', price: 75, brand: 'Zara', image: 'images/products/women/w1.jpg', images: ['images/products/women/w1.jpg', 'images/products/women/w1.jpg', 'images/products/women/w1.jpg'], rating: 4.5, description: 'Beautiful floral print dress for summer.', type: 'dress', colors: ['Pink', 'Blue', 'Yellow'] },
        { id: 'w2', name: 'Denim Skirt', category: 'women', price: 50, brand: 'Levis', image: 'images/products/women/w2.jpg', images: ['images/products/women/w2.jpg', 'images/products/women/w2.jpg', 'images/products/women/w2.jpg'], rating: 4, description: 'Stylish denim skirt. Perfect for casual outings.', type: 'skirt', colors: ['Blue', 'Black'] },
        { id: 'w3', name: 'Summer Top', category: 'women', price: 30, brand: 'H&M', image: 'images/products/women/w3.jpg', images: ['images/products/women/w3.jpg', 'images/products/women/w3.jpg', 'images/products/women/w3.jpg'], rating: 4, description: 'Light summer top with breathable fabric.', type: 'top', colors: ['White', 'Pink', 'Blue'] },
        { id: 'w4', name: 'Blazer Set', category: 'women', price: 140, brand: 'Mango', image: 'images/products/women/w4.jpg', images: ['images/products/women/w4.jpg', 'images/products/women/w4.jpg', 'images/products/women/w4.jpg'], rating: 5, description: 'Elegant blazer and pants set for office wear.', type: 'blazer', colors: ['Black', 'Navy'] },
        { id: 'w5', name: 'Cardigan', category: 'women', price: 55, brand: 'Gap', image: 'images/products/women/w5.jpg', images: ['images/products/women/w5.jpg', 'images/products/women/w5.jpg', 'images/products/women/w5.jpg'], rating: 4, description: 'Soft knit cardigan for layering.', type: 'cardigan', colors: ['Beige', 'Gray', 'Black'] },
        { id: 'w6', name: 'Leggings', category: 'women', price: 40, brand: 'Nike', image: 'images/products/women/w6.jpg', images: ['images/products/women/w6.jpg', 'images/products/women/w6.jpg', 'images/products/women/w6.jpg'], rating: 4.5, description: 'High-quality workout leggings with compression fit.', type: 'leggings', colors: ['Black', 'Navy', 'Gray'] },
        { id: 'w7', name: 'Evening Gown', category: 'women', price: 200, brand: 'Gucci', image: 'images/products/women/w7.jpg', images: ['images/products/women/w7.jpg', 'images/products/women/w7.jpg', 'images/products/women/w7.jpg'], rating: 5, description: 'Luxurious evening gown for special occasions.', type: 'dress', colors: ['Red', 'Black', 'Blue'] },
        { id: 'w8', name: 'Jean Jacket', category: 'women', price: 90, brand: 'Levis', image: 'images/products/women/w8.jpg', images: ['images/products/women/w8.jpg', 'images/products/women/w8.jpg', 'images/products/women/w8.jpg'], rating: 4, description: 'Classic denim jacket that never goes out of style.', type: 'jacket', colors: ['Blue', 'Black'] },
        
        // Accessories (8 items)
        { id: 'a1', name: 'Leather Belt', category: 'accessories', price: 30, brand: 'H&M', image: 'images/products/accessories/a1.jpg', images: ['images/products/accessories/a1.jpg'], rating: 4, description: 'Genuine leather belt with classic buckle.', type: 'belt', colors: ['Brown', 'Black'] },
        { id: 'a2', name: 'Sunglasses', category: 'accessories', price: 45, brand: 'Ray-Ban', image: 'images/products/accessories/a2.jpg', images: ['images/products/accessories/a2.jpg'], rating: 4.5, description: 'UV protection sunglasses with stylish design.', type: 'sunglasses', colors: ['Black', 'Brown'] },
        { id: 'a3', name: 'Watch', category: 'accessories', price: 120, brand: 'Casio', image: 'images/products/accessories/a3.jpg', images: ['images/products/accessories/a3.jpg'], rating: 5, description: 'Classic analog watch with leather strap.', type: 'watch', colors: ['Silver', 'Gold'] },
        { id: 'a4', name: 'Scarf', category: 'accessories', price: 25, brand: 'Zara', image: 'images/products/accessories/a4.jpg', images: ['images/products/accessories/a4.jpg'], rating: 4, description: 'Soft winter scarf in various colors.', type: 'scarf', colors: ['Red', 'Gray', 'Blue'] },
        { id: 'a5', name: 'Backpack', category: 'accessories', price: 70, brand: 'Nike', image: 'images/products/accessories/a5.jpg', images: ['images/products/accessories/a5.jpg'], rating: 4.5, description: 'Durable sport backpack with multiple compartments.', type: 'bag', colors: ['Black', 'Gray'] },
        { id: 'a6', name: 'Cap', category: 'accessories', price: 20, brand: 'Adidas', image: 'images/products/accessories/a6.jpg', images: ['images/products/accessories/a6.jpg'], rating: 4, description: 'Adjustable baseball cap with logo.', type: 'cap', colors: ['Black', 'White', 'Navy'] },
        { id: 'a7', name: 'Wallet', category: 'accessories', price: 35, brand: 'Gucci', image: 'images/products/accessories/a7.jpg', images: ['images/products/accessories/a7.jpg'], rating: 4.5, description: 'Luxury leather wallet with multiple card slots.', type: 'wallet', colors: ['Brown', 'Black'] },
        { id: 'a8', name: 'Necklace', category: 'accessories', price: 60, brand: 'Swarovski', image: 'images/products/accessories/a8.jpg', images: ['images/products/accessories/a8.jpg'], rating: 5, description: 'Elegant silver necklace with crystal pendant.', type: 'jewelry', colors: ['Silver', 'Gold'] },
        
        // Footwear (8 items)
        { id: 'f1', name: 'Running Shoes', category: 'footwear', price: 95, brand: 'Nike', image: 'images/products/footwear/f1.jpg', images: ['images/products/footwear/f1.jpg', 'images/products/footwear/f1.jpg', 'images/products/footwear/f1.jpg'], rating: 4.5, description: 'Comfortable running shoes with cushioning.', type: 'shoes', colors: ['Black/Red', 'Blue/White', 'Gray'] },
        { id: 'f2', name: 'Leather Boots', category: 'footwear', price: 140, brand: 'Timberland', image: 'images/products/footwear/f2.jpg', images: ['images/products/footwear/f2.jpg', 'images/products/footwear/f2.jpg', 'images/products/footwear/f2.jpg'], rating: 5, description: 'Durable leather boots for outdoor adventures.', type: 'boots', colors: ['Brown', 'Black'] },
        { id: 'f3', name: 'Sandals', category: 'footwear', price: 40, brand: 'Adidas', image: 'images/products/footwear/f3.jpg', images: ['images/products/footwear/f3.jpg', 'images/products/footwear/f3.jpg', 'images/products/footwear/f3.jpg'], rating: 4, description: 'Comfortable summer sandals with cushioned footbed.', type: 'sandals', colors: ['Black', 'Brown', 'Navy'] },
        { id: 'f4', name: 'Formal Shoes', category: 'footwear', price: 110, brand: 'Clarks', image: 'images/products/footwear/f4.jpg', images: ['images/products/footwear/f4.jpg', 'images/products/footwear/f4.jpg', 'images/products/footwear/f4.jpg'], rating: 4.5, description: 'Elegant formal shoes for office wear.', type: 'shoes', colors: ['Black', 'Brown'] },
        { id: 'f5', name: 'Sneakers', category: 'footwear', price: 80, brand: 'Puma', image: 'images/products/footwear/f5.jpg', images: ['images/products/footwear/f5.jpg', 'images/products/footwear/f5.jpg', 'images/products/footwear/f5.jpg'], rating: 4, description: 'Casual sneakers for everyday wear.', type: 'shoes', colors: ['White', 'Black', 'Red'] },
        { id: 'f6', name: 'High Heels', category: 'footwear', price: 120, brand: 'Jimmy Choo', image: 'images/products/footwear/f6.jpg', images: ['images/products/footwear/f6.jpg', 'images/products/footwear/f6.jpg', 'images/products/footwear/f6.jpg'], rating: 5, description: 'Stylish high heels for parties and events.', type: 'heels', colors: ['Black', 'Red', 'Nude'] },
        { id: 'f7', name: 'Loafers', category: 'footwear', price: 85, brand: 'H&M', image: 'images/products/footwear/f7.jpg', images: ['images/products/footwear/f7.jpg', 'images/products/footwear/f7.jpg', 'images/products/footwear/f7.jpg'], rating: 4, description: 'Comfortable loafers for casual and semi-formal wear.', type: 'shoes', colors: ['Brown', 'Black', 'Tan'] },
        { id: 'f8', name: 'Flip Flops', category: 'footwear', price: 15, brand: 'Havaianas', image: 'images/products/footwear/f8.jpg', images: ['images/products/footwear/f8.jpg', 'images/products/footwear/f8.jpg', 'images/products/footwear/f8.jpg'], rating: 4, description: 'Beach flip flops with comfortable sole.', type: 'sandals', colors: ['Blue', 'Green', 'Red'] },
        
        // Additional Products
        { id: 'f9', name: 'Winter Boots', category: 'footwear', price: 160, brand: 'UGG', image: 'images/products/footwear/f9.jpg', images: ['images/products/footwear/f9.jpg'], rating: 4.5, description: 'Warm winter boots', type: 'boots', colors: ['Brown', 'Black'] },
        { id: 'f10', name: 'Canvas Shoes', category: 'footwear', price: 50, brand: 'Converse', image: 'images/products/footwear/f10.jpg', images: ['images/products/footwear/f10.jpg'], rating: 4, description: 'Classic canvas shoes', type: 'shoes', colors: ['White', 'Black'] },
        { id: 'a9', name: 'Hat', category: 'accessories', price: 25, brand: 'Zara', image: 'images/products/accessories/a9.jpg', images: ['images/products/accessories/a9.jpg'], rating: 4, description: 'Summer sun hat', type: 'cap', colors: ['Beige', 'Black'] },
        { id: 'a10', name: 'Bracelet', category: 'accessories', price: 35, brand: 'Pandora', image: 'images/products/accessories/a10.jpg', images: ['images/products/accessories/a10.jpg'], rating: 4.5, description: 'Silver charm bracelet', type: 'jewelry', colors: ['Silver', 'Gold'] },
        { id: 'm9', name: 'Polo Shirt', category: 'men', price: 40, brand: 'Ralph Lauren', image: 'images/products/men/m9.jpg', images: ['images/products/men/m9.jpg'], rating: 4.5, description: 'Classic polo shirt', type: 'shirt', colors: ['White', 'Navy', 'Red'] },
        { id: 'm10', name: 'Cargo Pants', category: 'men', price: 70, brand: 'Zara', image: 'images/products/men/m10.jpg', images: ['images/products/men/m10.jpg'], rating: 4, description: 'Cargo pants with pockets', type: 'pant', colors: ['Khaki', 'Olive', 'Black'] },
        { id: 'w9', name: 'Maxi Dress', category: 'women', price: 95, brand: 'H&M', image: 'images/products/women/w9.jpg', images: ['images/products/women/w9.jpg'], rating: 4.5, description: 'Long maxi dress', type: 'dress', colors: ['Blue', 'Pink', 'Green'] },
        { id: 'w10', name: 'Crop Top', category: 'women', price: 25, brand: 'Zara', image: 'images/products/women/w10.jpg', images: ['images/products/women/w10.jpg'], rating: 4, description: 'Trendy crop top', type: 'top', colors: ['White', 'Black', 'Red'] }
    ];
    
    // Additional 10 filler products (using existing images creatively)
    for (let i = 1; i <= 10; i++) {
        products.push({
            id: `extra${i}`,
            name: `Fashion Item ${i}`,
            category: i % 4 === 0 ? 'men' : i % 4 === 1 ? 'women' : i % 4 === 2 ? 'accessories' : 'footwear',
            price: Math.floor(Math.random() * 100) + 20,
            brand: 'FashionHub',
            image: i % 2 === 0 ? 'images/products/f1.jpg' : 'images/products/f2.jpg',
            rating: 4,
            description: 'Quality fashion product',
            type: 'shirt',
            colors: ['Black', 'White']
        });
    }
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Load users from localStorage
function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Add default admin user if no users exist
    if (users.length === 0) {
        users.push({
            id: '1',
            name: 'Admin User',
            email: 'admin@fashionhub.com',
            password: 'admin123',
            isAdmin: true
        });
        saveUsers();
    }
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Load orders from localStorage
function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    orders = savedOrders ? JSON.parse(savedOrders) : [];
}

// Save orders to localStorage
function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuIcon = document.querySelector('.mobile-menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', toggleMobileMenu);
    }
    
    // Newsletter subscription
    const newsletterBtn = document.querySelector('#newsletter button');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', subscribeNewsletter);
    }
    
    // Login form
    const loginForm = document.getElementById('login-form-element');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form-element');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Tracking form
    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) {
        trackingForm.addEventListener('submit', handleOrderTracking);
    }
    
    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
    
    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentDetails);
    });
    
    // Shop filters
    const filterCheckboxes = document.querySelectorAll('.category-filter');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    const priceRadios = document.querySelectorAll('input[name="price"]');
    priceRadios.forEach(radio => {
        radio.addEventListener('change', filterProducts);
    });
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', filterProducts);
    }
    
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('.header-list-nav');
    nav.classList.toggle('active');
}

// Subscribe to newsletter
function subscribeNewsletter() {
    const emailInput = document.getElementById('email-address-input');
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // In a real app, this would send to backend
    alert('Thank you for subscribing to our newsletter!');
    emailInput.value = '';
}

// Validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        alert(`Welcome back, ${user.name}!`);
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
}

// Handle register
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsAgree = document.getElementById('terms-agree')?.checked || false;
    
    // Validation
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!termsAgree) {
        alert('You must agree to the Terms & Conditions');
        return;
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        isAdmin: false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
}

// Handle contact form submit
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const subject = document.getElementById('contact-subject')?.value;
    const message = document.getElementById('contact-message')?.value;
    
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, this would send to backend
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// Handle order tracking
function handleOrderTracking(e) {
    e.preventDefault();
    
    const orderNumber = document.getElementById('order-number')?.value;
    const email = document.getElementById('tracking-email')?.value;
    
    if (!orderNumber || !email) {
        alert('Please enter both order number and email');
        return;
    }
    
    // Find order
    const order = orders.find(o => o.orderNumber === orderNumber && o.email === email);
    
    if (order) {
        displayTrackingResult(order);
    } else {
        alert('Order not found. Please check your order number and email.');
    }
}

// Display tracking result
function displayTrackingResult(order) {
    const trackingResult = document.getElementById('tracking-result');
    if (!trackingResult) return;
    
    trackingResult.style.display = 'block';
    
    document.getElementById('track-order-number').textContent = order.orderNumber;
    document.getElementById('track-order-date').textContent = formatDate(order.orderDate);
    document.getElementById('track-order-status').textContent = order.status;
    
    // Update timeline based on status
    const statuses = ['Order Placed', 'Order Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(order.status);
    
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.remove('completed', 'active');
        if (index < currentIndex) {
            item.classList.add('completed');
        } else if (index === currentIndex) {
            item.classList.add('active');
        }
    });
    
    // Update dates if available
    if (order.timeline) {
        document.getElementById('timeline-placed').textContent = formatDate(order.timeline.placed) || 'Pending';
        document.getElementById('timeline-confirmed').textContent = formatDate(order.timeline.confirmed) || 'Pending';
        document.getElementById('timeline-processing').textContent = formatDate(order.timeline.processing) || 'Pending';
        document.getElementById('timeline-shipped').textContent = formatDate(order.timeline.shipped) || 'Pending';
        document.getElementById('timeline-delivered').textContent = formatDate(order.timeline.delivered) || 'Pending';
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();
    // Form validation will be done by placeOrder function
}

// Place order
function placeOrder() {
    // Validate cart
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Validate shipping information
    const firstName = document.getElementById('first-name')?.value;
    const lastName = document.getElementById('last-name')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    const city = document.getElementById('city')?.value;
    const state = document.getElementById('state')?.value;
    const zip = document.getElementById('zip')?.value;
    
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip) {
        alert('Please fill in all required shipping fields');
        return;
    }
    
    // Validate payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if (!paymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    if (paymentMethod === 'credit') {
        const cardName = document.getElementById('card-name')?.value;
        const cardNumber = document.getElementById('card-number')?.value;
        const expiry = document.getElementById('expiry')?.value;
        const cvv = document.getElementById('cvv')?.value;
        
        if (!cardName || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all credit card details');
            return;
        }
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    // Create order
    const orderNumber = 'FH-' + Date.now().toString().slice(-8);
    const order = {
        orderNumber,
        customerName: firstName + ' ' + lastName,
        email,
        phone,
        address: `${address}, ${city}, ${state} ${zip}`,
        items: [...cart],
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod,
        status: 'Order Placed',
        orderDate: new Date().toISOString(),
        timeline: {
            placed: new Date().toISOString(),
            confirmed: new Date().toISOString(),
            processing: null,
            shipped: null,
            delivered: null
        }
    };
    
    orders.push(order);
    saveOrders();
    
    // Clear cart
    cart = [];
    saveCart();
    
    // Store current order for confirmation page
    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    // Redirect to confirmation page
    window.location.href = 'order-confirmation.html';
}

// Toggle payment details
function togglePaymentDetails() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const creditCardDetails = document.getElementById('credit-card-details');
    
    if (creditCardDetails) {
        creditCardDetails.style.display = paymentMethod === 'credit' ? 'block' : 'none';
    }
}

// Update cart item quantity
function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        item.quantity = newQuantity;
        saveCart();
        displayCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
}

// Update cart summary
function updateCartSummary(subtotal) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    const shipping = subtotal > 0 ? 5.00 : 0;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    
    const tax = subtotal * 0.1;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    
    const total = subtotal + shipping + tax;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Load page-specific content
function loadPageContent() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop() || 'index.html';
    
    if (fileName === 'index.html' || fileName === '' || fileName === '/') {
        loadHomePage();
    } else if (fileName === 'shop.html') {
        loadShopPage();
    } else if (fileName === 'blog.html') {
        loadBlogPage();
    } else if (fileName === 'about.html') {
        loadAboutPage();
    } else if (fileName === 'contact.html') {
        loadContactPage();
    } else if (fileName === 'cart.html') {
        displayCart();
    } else if (fileName === 'checkout.html') {
        loadCheckoutPage();
    } else if (fileName === 'order-confirmation.html') {
        loadOrderConfirmation();
    } else if (fileName === 'order-tracking.html') {
        loadOrderTrackingPage();
    } else if (fileName === 'my-orders.html') {
        loadMyOrders();
    }
}

// Load home page content
function loadHomePage() {
    const featuredContainer = document.getElementById('featured-products');
    const newArrivalsContainer = document.getElementById('new-arrivals');
    
    if (featuredContainer) {
        const featured = products.slice(0, 8);
        displayProducts(featured, featuredContainer);
    }
    
    if (newArrivalsContainer) {
        // Shuffle products to get random selection from all categories
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const newArrivals = shuffled.slice(0, 8);
        displayProducts(newArrivals, newArrivalsContainer);
    }
}

// Load shop page content
function loadShopPage() {
    const allProductsContainer = document.getElementById('all-products');
    if (allProductsContainer) {
        displayProducts(products, allProductsContainer);
    }
}

// Load blog page content
function loadBlogPage() {
    const blogContainer = document.querySelector('.blog-posts-container');
    if (!blogContainer) return;
    
    const blogPosts = [
        {
            id: 1,
            title: 'The Ultimate Guide to Summer Fashion 2024',
            date: 'June 15, 2024',
            image: 'images/blog/b1.jpg',
            excerpt: 'Discover the hottest trends for summer 2024. From vibrant colors to sustainable fabrics, we cover everything you need to know to stay stylish this season.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
        },
        {
            id: 2,
            title: 'How to Style Your Denim Jacket',
            date: 'June 10, 2024',
            image: 'images/blog/b2.jpg',
            excerpt: 'The denim jacket is a timeless piece that never goes out of style. Learn how to style it for any occasion, from casual outings to formal events.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
        },
        {
            id: 3,
            title: 'Sustainable Fashion: A Guide to Eco-Friendly Brands',
            date: 'June 5, 2024',
            image: 'images/blog/b3.jpg',
            excerpt: 'Make a positive impact on the environment with sustainable fashion choices. We highlight the best eco-friendly brands and materials.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
        },
        {
            id: 4,
            title: 'Accessorizing 101: Complete Your Look',
            date: 'May 28, 2024',
            image: 'images/blog/b4.jpg',
            excerpt: 'The right accessories can transform any outfit. Learn the art of accessorizing with our comprehensive guide.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
        },
        {
            id: 5,
            title: 'Men\'s Fashion Trends You Need to Try',
            date: 'May 20, 2024',
            image: 'images/blog/b5.jpg',
            excerpt: 'Stay ahead of the curve with these must-try men\'s fashion trends. From streetwear to formal wear, we\'ve got you covered.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
        },
        {
            id: 6,
            title: 'Footwear Guide: Choosing the Perfect Shoes',
            date: 'May 15, 2024',
            image: 'images/blog/b6.jpg',
            excerpt: 'Find the perfect shoes for every occasion with our comprehensive footwear guide. Learn about different styles and how to choose the right fit.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
        }
    ];
    
    let html = '';
    blogPosts.forEach((post, index) => {
        html += `
            <div class="blog-post">
                <div class="blog-date">${post.date.split(' ')[1]}/${post.date.split(' ')[0]}</div>
                <div class="blog-img">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-details">
                    <h4>${post.title}</h4>
                    <p>${post.excerpt}</p>
                    <a href="#">CONTINUE READING <i class="fa fa-arrow-right"></i></a>
                </div>
            </div>
        `;
    });
    
    blogContainer.innerHTML = html;
}

// Load about page content
function loadAboutPage() {
    const teamContainer = document.getElementById('team-members');
    if (!teamContainer) return;
    
    const teamMembers = [
        {
            name: 'John Doe',
            position: 'Founder & CEO',
            image: 'images/team/team1.jpg',
            bio: 'With over 15 years in fashion retail, John founded FashionHub to make quality clothing accessible to everyone.'
        },
        {
            name: 'Jane Smith',
            position: 'Creative Director',
            image: 'images/team/team2.jpg',
            bio: 'Jane leads our design team with her innovative vision and passion for sustainable fashion.'
        },
        {
            name: 'Mike Johnson',
            position: 'Head of Operations',
            image: 'images/team/team3.jpg',
            bio: 'Mike ensures that every order reaches our customers quickly and safely.'
        },
        {
            name: 'Sarah Williams',
            position: 'Customer Experience Manager',
            image: 'images/team/team4.jpg',
            bio: 'Sarah and her team are dedicated to providing exceptional customer service.'
        }
    ];
    
    let html = '';
    teamMembers.forEach(member => {
        html += `
            <div class="team-member">
                <img src="${member.image}" alt="${member.name}">
                <h4>${member.name}</h4>
                <p>${member.position}</p>
                <p><small>${member.bio}</small></p>
            </div>
        `;
    });
    
    teamContainer.innerHTML = html;
}

// Load contact page content
function loadContactPage() {
    const faqList = document.getElementById('faq-list');
    if (!faqList) return;
    
    const faqs = [
        {
            question: 'How do I track my order?',
            answer: 'You can track your order by visiting the Order Tracking page and entering your order number and email address.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for all unworn items in their original packaging. Please visit our Returns page for more information.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
        },
        {
            question: 'How can I change or cancel my order?',
            answer: 'Orders can be modified or cancelled within 1 hour of placement. Please contact our customer support immediately for assistance.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, PayPal, and cash on delivery for select locations.'
        }
    ];
    
    let html = '';
    faqs.forEach((faq, index) => {
        html += `
            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    ${faq.question} <i class="fa fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `;
    });
    
    faqList.innerHTML = html;
}

// Toggle FAQ
function toggleFaq(element) {
    const faqItem = element.closest('.faq-item');
    faqItem.classList.toggle('active');
}

// Load checkout page
function loadCheckoutPage() {
    const orderItems = document.getElementById('order-items');
    if (!orderItems) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderItems.innerHTML = html;
    
    // Update totals
    const subtotalEl = document.getElementById('order-subtotal');
    const shippingEl = document.getElementById('order-shipping');
    const taxEl = document.getElementById('order-tax');
    const totalEl = document.getElementById('order-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    const shipping = subtotal > 0 ? 5.00 : 0;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    
    const tax = subtotal * 0.1;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    
    const total = subtotal + shipping + tax;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Load order confirmation
function loadOrderConfirmation() {
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    if (!order) return;
    
    document.getElementById('order-number').textContent = order.orderNumber;
    document.getElementById('order-date').textContent = formatDate(order.orderDate);
    document.getElementById('order-amount').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('payment-method').textContent = order.paymentMethod || 'Credit Card';
    document.getElementById('shipping-address').textContent = order.address || 'N/A';
    
    // Populate order items
    const itemsBody = document.getElementById('order-items-body');
    if (itemsBody) {
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `;
        });
        itemsBody.innerHTML = itemsHtml;
    }
}

// Load order tracking page
function loadOrderTrackingPage() {
    // Initial setup
}

// Display products in container
function displayProducts(productsToShow, container) {
    if (!container) return;
    
    let html = '';
    productsToShow.forEach(product => {
        html += `
            <div class="product-cart" onclick="openProductModal('${product.id}')">
                <img src="${product.image}" alt="${product.name}">
                <span>${product.brand}</span>
                <h4>${product.name}</h4>
                <div class="stars">
                    ${getStarRating(product.rating)}
                </div>
                <h4 class="price">$${product.price.toFixed(2)}</h4>
                <i class="fa-solid fa-cart-shopping buy-icon" onclick="event.stopPropagation(); openProductModal('${product.id}')"></i>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Get star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fa-solid fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fa-solid fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

// Filter products
function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="price"]:checked')?.value || 'all';
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    
    // Filter by price
    if (selectedPrice !== 'all') {
        const [min, max] = selectedPrice.split('-').map(Number);
        if (selectedPrice === '100+') {
            filtered = filtered.filter(p => p.price >= 100);
        } else {
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.brand.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort products
    const sortBy = document.getElementById('sort-by')?.value || 'default';
    if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    const container = document.getElementById('all-products');
    const noProducts = document.getElementById('no-products');
    
    if (filtered.length === 0) {
        container.innerHTML = '';
        if (noProducts) noProducts.style.display = 'block';
    } else {
        if (noProducts) noProducts.style.display = 'none';
        displayProducts(filtered, container);
    }
}

// Clear filters
function clearFilters() {
    // Clear category checkboxes
    document.querySelectorAll('.category-filter:checked').forEach(cb => {
        cb.checked = false;
    });
    
    // Clear price radio
    document.querySelector('input[name="price"][value="all"]').checked = true;
    
    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    // Reset sort
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) sortSelect.value = 'default';
    
    // Reload all products
    const container = document.getElementById('all-products');
    if (container) {
        displayProducts(products, container);
    }
    
    const noProducts = document.getElementById('no-products');
    if (noProducts) noProducts.style.display = 'none';
}

// Print bill from order confirmation page
function printBill() {
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    if (!order) {
        alert('No order found to print');
        return;
    }
    
    // Get customer info from checkout form or order
    const customerName = order.customerName || 'Customer';
    const customerEmail = order.email || 'N/A';
    const customerPhone = order.phone || 'N/A';
    const customerAddress = order.address || 'N/A';
    
    // Populate bill template
    document.getElementById('bill-customer-name').textContent = customerName;
    document.getElementById('bill-customer-email').textContent = customerEmail;
    document.getElementById('bill-customer-phone').textContent = customerPhone;
    document.getElementById('bill-customer-address').textContent = customerAddress;
    
    document.getElementById('bill-invoice-number').textContent = order.orderNumber;
    document.getElementById('bill-order-date').textContent = formatDate(order.orderDate);
    document.getElementById('bill-payment-method').textContent = order.paymentMethod || 'Credit Card';
    
    // Populate items
    const itemsBody = document.getElementById('bill-items-body');
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });
    itemsBody.innerHTML = itemsHtml;
    
    // Set totals
    document.getElementById('bill-subtotal').textContent = `$${order.subtotal.toFixed(2)}`;
    document.getElementById('bill-shipping').textContent = `$${order.shipping.toFixed(2)}`;
    document.getElementById('bill-tax').textContent = `$${order.tax.toFixed(2)}`;
    document.getElementById('bill-total').textContent = `$${order.total.toFixed(2)}`;
    
    // Get the printable bill HTML
    const billContent = document.getElementById('printable-bill').innerHTML;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice - FashionHub</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    @media print {
                        body { margin: 0; padding: 20px; }
                    }
                </style>
            </head>
            <body>
                ${billContent}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                <\/script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Print bill from order tracking page
function printTrackedOrderBill() {
    const orderNumber = document.getElementById('track-order-number').textContent;
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    // Create bill HTML dynamically
    const billHtml = generateBillHTML(order);
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice - FashionHub</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .bill-container { max-width: 800px; margin: 0 auto; padding: 30px; }
                    .bill-header { text-align: center; margin-bottom: 30px; }
                    .bill-header img { max-height: 60px; }
                    .bill-header h1 { color: #088178; margin: 10px 0; }
                    .bill-details { display: flex; justify-content: space-between; margin: 20px 0; }
                    .bill-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .bill-table th { background-color: #088178; color: white; padding: 12px; text-align: left; }
                    .bill-table td { padding: 8px; border-bottom: 1px solid #ddd; }
                    .bill-table .text-right { text-align: right; }
                    .bill-table .text-center { text-align: center; }
                    .grand-total { font-size: 18px; font-weight: bold; color: #088178; }
                    .bill-footer { margin-top: 40px; text-align: center; }
                    .bill-footer hr { border: 1px dashed #ccc; margin: 20px 0; }
                    @media print {
                        body { margin: 0; padding: 20px; }
                    }
                </style>
            </head>
            <body>
                ${billHtml}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                <\/script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Print bill from order history
function printOrderHistoryBill(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const billHtml = generateBillHTML(order);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice - FashionHub</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .bill-container { max-width: 800px; margin: 0 auto; padding: 30px; }
                    .bill-header { text-align: center; margin-bottom: 30px; }
                    .bill-header img { max-height: 60px; }
                    .bill-header h1 { color: #088178; margin: 10px 0; }
                    .bill-details { display: flex; justify-content: space-between; margin: 20px 0; }
                    .bill-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .bill-table th { background-color: #088178; color: white; padding: 12px; text-align: left; }
                    .bill-table td { padding: 8px; border-bottom: 1px solid #ddd; }
                    .bill-table .text-right { text-align: right; }
                    .bill-table .text-center { text-align: center; }
                    .grand-total { font-size: 18px; font-weight: bold; color: #088178; }
                    .bill-footer { margin-top: 40px; text-align: center; }
                    .bill-footer hr { border: 1px dashed #ccc; margin: 20px 0; }
                    @media print {
                        body { margin: 0; padding: 20px; }
                    }
                </style>
            </head>
            <body>
                ${billHtml}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                <\/script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Generate bill HTML for any order
function generateBillHTML(order) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');
    
    return `
        <div class="bill-container">
            <div class="bill-header">
                <img src="images/logo.png" alt="FashionHub Logo">
                <h1>FashionHub</h1>
                <p>123 Fashion Street, New York, NY 10001</p>
                <p>Phone: +1 (555) 123-4567 | Email: support@fashionhub.com</p>
                <hr style="border: 1px solid #088178; margin: 20px 0;">
            </div>
            
            <h2 style="text-align: center; color: #088178;">INVOICE</h2>
            
            <div class="bill-details">
                <div>
                    <h3>Bill To:</h3>
                    <p>${order.customerName || 'Customer'}</p>
                    <p>${order.email || 'N/A'}</p>
                    <p>${order.phone || 'N/A'}</p>
                    <p>${order.address || 'N/A'}</p>
                </div>
                <div style="text-align: right;">
                    <p><strong>Invoice Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Credit Card'}</p>
                </div>
            </div>
            
            <table class="bill-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                        <td style="padding: 10px; text-align: right;">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                        <td style="padding: 10px; text-align: right;">$${order.shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax (10%):</strong></td>
                        <td style="padding: 10px; text-align: right;">$${order.tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-size: 18px;"><strong>Grand Total:</strong></td>
                        <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold; color: #088178;">$${order.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="bill-footer">
                <p><strong>Thank you for shopping with FashionHub!</strong></p>
                <p>For any queries, please contact our customer support.</p>
                <hr>
                <p style="font-size: 12px; color: #777;">This is a computer-generated invoice. No signature is required.</p>
            </div>
        </div>
    `;
}

// Update displayTrackingResult to show items
function displayTrackingResult(order) {
    const trackingResult = document.getElementById('tracking-result');
    if (!trackingResult) return;
    
    trackingResult.style.display = 'block';
    
    document.getElementById('track-order-number').textContent = order.orderNumber;
    document.getElementById('track-order-date').textContent = formatDate(order.orderDate);
    document.getElementById('track-order-status').textContent = order.status;
    document.getElementById('track-order-total').textContent = `$${order.total.toFixed(2)}`;
    
    // Populate order items in tracking
    const itemsContainer = document.getElementById('track-order-items');
    if (itemsContainer) {
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
                </tr>
            `;
        });
        itemsContainer.innerHTML = itemsHtml;
    }
    
    // Update timeline based on status
    const statuses = ['Order Placed', 'Order Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(order.status);
    
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.remove('completed', 'active');
        if (index < currentIndex) {
            item.classList.add('completed');
        } else if (index === currentIndex) {
            item.classList.add('active');
        }
    });
    
    // Update dates if available
    if (order.timeline) {
        document.getElementById('timeline-placed').textContent = formatDate(order.timeline.placed) || 'Pending';
        document.getElementById('timeline-confirmed').textContent = formatDate(order.timeline.confirmed) || 'Pending';
        document.getElementById('timeline-processing').textContent = formatDate(order.timeline.processing) || 'Pending';
        document.getElementById('timeline-shipped').textContent = formatDate(order.timeline.shipped) || 'Pending';
        document.getElementById('timeline-delivered').textContent = formatDate(order.timeline.delivered) || 'Pending';
    }
}

// Add function to load my orders page
function loadMyOrders() {
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');
    
    if (!ordersList) return;
    
    // Get current user's orders (in a real app, filter by user ID)
    // For demo, show all orders
    if (orders.length === 0) {
        ordersList.innerHTML = '';
        if (noOrders) noOrders.style.display = 'block';
        return;
    }
    
    if (noOrders) noOrders.style.display = 'none';
    
    let html = '';
    orders.slice().reverse().forEach(order => {
        html += `
            <div class="order-card" style="border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
                <div style="background-color: #f8f8f8; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Order #${order.orderNumber}</strong>
                        <p style="margin: 5px 0 0; font-size: 14px; color: #777;">Placed on ${formatDate(order.orderDate)}</p>
                    </div>
                    <div>
                        <span class="status-badge" style="background-color: #088178; color: white; padding: 5px 10px; border-radius: 4px;">${order.status}</span>
                    </div>
                </div>
                <div style="padding: 15px;">
                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                    <p><strong>Items:</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                    <div style="margin-top: 10px;">
                        <button class="normal" onclick="printOrderHistoryBill('${order.orderNumber}')" style="padding: 8px 15px; font-size: 14px; margin-right: 10px;">
                            <i class="fa fa-print"></i> Print Bill
                        </button>
                        <button class="normal" onclick="window.location.href='order-tracking.html?order=${order.orderNumber}'" style="padding: 8px 15px; font-size: 14px; background-color: #f0f0f0; color: #333;">
                            Track Order
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    ordersList.innerHTML = html;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.querySelector('.toast-icon');
    
    if (!toast) return;
    
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastIcon.className = 'fa fa-check-circle toast-icon';
        toast.style.backgroundColor = '#088178';
    } else if (type === 'error') {
        toastIcon.className = 'fa fa-exclamation-circle toast-icon';
        toast.style.backgroundColor = '#dc3545';
    } else if (type === 'info') {
        toastIcon.className = 'fa fa-info-circle toast-icon';
        toast.style.backgroundColor = '#17a2b8';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Open product modal
function openProductModal(productId) {
    alert('Product clicked: ' + productId); // Add this line temporarily
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const container = document.getElementById('modal-product-container');
    
    if (!modal || !container) return;
    
    const reviews = productReviews[productId] || [
        { name: 'John D.', rating: 5, date: '2024-06-01', comment: 'Great product! Highly recommended.' },
        { name: 'Sarah M.', rating: 4, date: '2024-05-28', comment: 'Good quality and fast shipping.' },
        { name: 'Mike R.', rating: 5, date: '2024-05-15', comment: 'Excellent value for money.' }
    ];
    
    // Get suggested products (same category, different products)
    const suggestedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);
    
    // Get size options based on product type
    const sizeOptions = getSizeOptions(product.type);
    
    // Get color options
    const colorOptions = product.colors || ['Black', 'White', 'Blue'];
    
    // Generate stars HTML
    const starsHtml = getStarRating(product.rating);
    
    // Generate reviews HTML
    const reviewsHtml = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-rating">${getStarRating(review.rating)}</span>
            </div>
            <p class="review-text">${review.comment}</p>
            <span class="review-date">${formatDate(review.date)}</span>
        </div>
    `).join('');
    
    // Generate suggested products HTML
    const suggestedHtml = suggestedProducts.map(p => `
        <div class="suggested-product" onclick="openProductModal('${p.id}')">
            <img src="${p.image}" alt="${p.name}">
            <h5>${p.name}</h5>
            <span class="price">$${p.price}</span>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="modal-product-images">
            <img src="${product.image}" alt="${product.name}" class="modal-main-image" id="modal-main-image">
            <div class="modal-thumbnails">
                ${(product.images || [product.image, product.image, product.image]).map((img, index) => `
                    <img src="${img}" alt="Thumbnail" class="modal-thumbnail" onclick="document.getElementById('modal-main-image').src='${img}'">
                `).join('')}
            </div>
        </div>
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <span class="brand">${product.brand}</span>
            <div class="stars">${starsHtml}</div>
            <div class="price">$${product.price.toFixed(2)}</div>
            <p class="description">${product.description}</p>
            
            <div class="color-section">
                <h4>Select Color:</h4>
                <div class="color-options">
                    ${colorOptions.map(color => `
                        <div class="color-btn" style="background-color: ${getColorCode(color)};" onclick="selectColor(this, '${color}')"></div>
                    `).join('')}
                </div>
            </div>
            
            <div class="size-section">
                <h4>Select Size:</h4>
                <div class="size-options" id="size-options">
                    ${sizeOptions.map(size => `
                        <button class="size-btn" onclick="selectSize(this, '${size}')">${size}</button>
                    `).join('')}
                </div>
            </div>
            
            <div class="quantity-selector">
                <button class="quantity-btn" onclick="updateModalQuantity(-1)">-</button>
                <input type="number" class="quantity-input" id="modal-quantity" value="1" min="1" readonly>
                <button class="quantity-btn" onclick="updateModalQuantity(1)">+</button>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button class="add-to-cart-btn" onclick="addToCartFromModal('${product.id}')" style="flex: 1;">
                    <i class="fa fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="add-to-cart-btn" onclick="buyNowFromModal('${product.id}')" style="flex: 1; background-color: #ff6b6b;">
                    <i class="fa fa-bolt"></i> Buy Now
                </button>
            </div>
            
            <div class="reviews-section">
                <h4>Customer Reviews</h4>
                ${reviewsHtml}
            </div>
            
            ${suggestedProducts.length > 0 ? `
                <div class="suggested-products">
                    <h4>You May Also Like</h4>
                    <div class="suggested-grid">
                        ${suggestedHtml}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Store selected options
    window.selectedProduct = {
        id: product.id,
        color: colorOptions[0],
        size: sizeOptions[0]
    };
    
    // Auto-select first color and size
    setTimeout(() => {
        const firstColor = document.querySelector('.color-btn');
        const firstSize = document.querySelector('.size-btn');
        if (firstColor) firstColor.classList.add('active');
        if (firstSize) firstSize.classList.add('active');
    }, 100);
}

// Get size options based on product type
function getSizeOptions(type) {
    const shirtSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const pantSizes = ['28', '30', '32', '34', '36'];
    const shoeSizes = ['6', '7', '8', '9', '10', '11', '12'];
    
    if (type === 'shirt' || type === 'top' || type === 'hoodie' || type === 'sweater' || type === 'jacket' || type === 'blazer' || type === 'cardigan') {
        return shirtSizes;
    } else if (type === 'pant' || type === 'jeans' || type === 'leggings' || type === 'skirt' || type === 'shorts') {
        return pantSizes;
    } else if (type === 'shoes' || type === 'boots' || type === 'sandals' || type === 'heels' || type === 'sneakers') {
        return shoeSizes;
    } else {
        return ['One Size'];
    }
}

// Get color code from color name
function getColorCode(color) {
    const colorMap = {
        'White': '#ffffff',
        'Black': '#000000',
        'Blue': '#0000ff',
        'Red': '#ff0000',
        'Green': '#00ff00',
        'Yellow': '#ffff00',
        'Gray': '#808080',
        'Brown': '#8b4513',
        'Navy': '#000080',
        'Khaki': '#f0e68c',
        'Olive': '#808000',
        'Burgundy': '#800020',
        'Pink': '#ffc0cb',
        'Beige': '#f5f5dc',
        'Purple': '#800080',
        'Orange': '#ffa500',
        'Silver': '#c0c0c0',
        'Gold': '#ffd700',
        'Charcoal': '#36454F',
        'Tan': '#d2b48c',
        'Nude': '#f2d2bd'
    };
    return colorMap[color] || '#cccccc';
}

// Select color in modal
function selectColor(element, color) {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    if (window.selectedProduct) {
        window.selectedProduct.color = color;
    }
}

// Select size in modal
function selectSize(element, size) {
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    if (window.selectedProduct) {
        window.selectedProduct.size = size;
    }
}

// Update quantity in modal
function updateModalQuantity(change) {
    const input = document.getElementById('modal-quantity');
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    input.value = value;
}

// Add to cart from modal
function addToCartFromModal(productId) {
    const quantity = parseInt(document.getElementById('modal-quantity').value);
    const selectedSize = window.selectedProduct?.size || getSizeOptions(products.find(p => p.id === productId).type)[0];
    const selectedColor = window.selectedProduct?.color || (products.find(p => p.id === productId).colors || ['Black'])[0];
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = {
        id: product.id + '-' + selectedSize + '-' + selectedColor,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor
    };
    
    // Check if item already exists with same size and color
    const existingItemIndex = cart.findIndex(item => 
        item.productId === productId && 
        item.size === selectedSize && 
        item.color === selectedColor
    );
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    saveCart();
    showToast(`${product.name} (${selectedSize}, ${selectedColor}) added to cart!`);
    
    // Close modal
    document.getElementById('product-modal').style.display = 'none';
}

// Buy now from modal
function buyNowFromModal(productId) {
    // First add to cart
    addToCartFromModal(productId);
    
    // Show toast message
    showToast('Redirecting to checkout...', 'info');
    
    // Then redirect to checkout
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1000);
}

// Add to cart (quick add)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // For quick add from main page, use default size and color
    const defaultSize = getSizeOptions(product.type)[0];
    const defaultColor = (product.colors || ['Black'])[0];
    
    const cartItem = {
        id: product.id + '-' + defaultSize + '-' + defaultColor,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: defaultSize,
        color: defaultColor
    };
    
    const existingItemIndex = cart.findIndex(item => 
        item.productId === productId && 
        item.size === defaultSize && 
        item.color === defaultColor
    );
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push(cartItem);
    }
    
    saveCart();
    showToast(`${product.name} added to cart!`);
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>
                    ${item.name}<br>
                    <small>Size: ${item.size}, Color: ${item.color}</small>
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity('${item.id}', this.value)" readonly>
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><i class="fa fa-trash remove-item" onclick="removeFromCart('${item.id}')"></i></td>
            </tr>
        `;
    });
    
    cartItems.innerHTML = html;
    
    // Update summary
    updateCartSummary(subtotal);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
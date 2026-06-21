// =========================================================
// FashionHub India — main application script
// Currency: INR (₹) | Payments: Razorpay + Cash on Delivery
// =========================================================

// ---- Global state ----
let products = [];
let cart = [];
let users = [];
let currentUser = null;
let orders = [];

// ---- Store configuration ----
const STORE_NAME = 'FashionHub India';
const GST_RATE = 0.05;                 // 5% GST on apparel
const FREE_SHIPPING_THRESHOLD = 999;   // free shipping above ₹999
const SHIPPING_FEE = 49;               // flat shipping fee below threshold

// Razorpay Key ID — replace with YOUR key from the Razorpay Dashboard
// (Settings > API Keys). Use a rzp_test_... key while developing and
// switch to your rzp_live_... key only after KYC + go-live approval.
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID';

// ---- Product reviews data ----
const productReviews = {
    'm1': [
        { name: 'Rohit S.', rating: 5, date: '2024-05-15', comment: 'Perfect fit and great quality! Highly recommended.' },
        { name: 'Sarita M.', rating: 4, date: '2024-05-10', comment: 'Nice shirt, comfortable fabric. Slightly large fit.' },
        { name: 'Mihir R.', rating: 5, date: '2024-05-05', comment: 'Excellent value for money. Will buy again.' }
    ],
    'm2': [
        { name: 'Dev L.', rating: 5, date: '2024-05-12', comment: 'Best jeans I\'ve ever bought. Very comfortable.' },
        { name: 'Ekta W.', rating: 4, date: '2024-05-08', comment: 'Good quality, true to size.' }
    ]
};

// =========================================================
// Initialization
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadCart();
    loadUsers();
    loadOrders();
    updateCartCount(false);
    setupEventListeners();

    const emailField = document.getElementById('email-address-input');
    if (emailField) {
        emailField.focus({ preventScroll: true });
    }

    loadPageContent();

    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            document.getElementById('product-modal').style.display = 'none';
        });
    }

    initScrollEnhancements();
});

// =========================================================
// Product catalog
// =========================================================
function loadProducts() {
    products = [
        // ---------------- MEN (16) ----------------
        { id: 'm1', name: 'Classic Fit Cotton Shirt', category: 'men', price: 1299, brand: 'Allen Solly', image: 'images/products/men/m1.jpg', rating: 4.5, description: 'Classic fit cotton shirt for men, made with 100% premium cotton. Perfect for casual and formal occasions.', type: 'shirt', colors: ['White', 'Blue', 'Black'] },
        { id: 'm2', name: 'Slim Fit Jeans', category: 'men', price: 2199, brand: 'Levis', image: 'images/products/men/m2.jpg', rating: 4, description: 'Slim fit denim jeans in classic blue with stretchable fabric for maximum comfort.', type: 'pant', colors: ['Blue', 'Black', 'Gray'] },
        { id: 'm3', name: 'Premium Leather Jacket', category: 'men', price: 6999, brand: 'Zara', image: 'images/products/men/m3.jpg', rating: 5, description: 'Genuine leather jacket with soft inner lining. Perfect for the Delhi/Kashmir winter.', type: 'jacket', colors: ['Black', 'Brown'] },
        { id: 'm4', name: 'Casual Pullover Hoodie', category: 'men', price: 1899, brand: 'Adidas', image: 'images/products/men/m4.jpg', rating: 4, description: 'Comfortable cotton-fleece hoodie. Perfect for workouts and casual wear.', type: 'hoodie', colors: ['Gray', 'Black', 'Navy'] },
        { id: 'm5', name: 'Formal Blazer', category: 'men', price: 4999, brand: 'Van Heusen', image: 'images/products/men/m5.jpg', rating: 4.5, description: 'Elegant formal blazer for business meetings and special occasions.', type: 'blazer', colors: ['Navy', 'Black', 'Charcoal'] },
        { id: 'm6', name: 'Dri-FIT Sports T-Shirt', category: 'men', price: 999, brand: 'Puma', image: 'images/products/men/m6.jpg', rating: 4, description: 'Breathable sports t-shirt with moisture-wicking fabric for intense workouts.', type: 'shirt', colors: ['Red', 'Blue', 'Black'] },
        { id: 'm7', name: 'Chino Pants', category: 'men', price: 1799, brand: 'Peter England', image: 'images/products/men/m7.jpg', rating: 4.5, description: 'Comfortable chino pants for casual and semi-formal wear.', type: 'pant', colors: ['Khaki', 'Navy', 'Olive'] },
        { id: 'm8', name: 'Merino Wool Sweater', category: 'men', price: 2499, brand: 'Uniqlo', image: 'images/products/men/m8.jpg', rating: 4, description: 'Warm merino wool sweater for North Indian winters. Soft and comfortable.', type: 'sweater', colors: ['Gray', 'Navy', 'Burgundy'] },
        { id: 'm9', name: 'Classic Polo Shirt', category: 'men', price: 2999, brand: 'Ralph Lauren', image: 'images/products/men/m9.jpg', rating: 4.5, description: 'Timeless polo shirt in breathable pique cotton.', type: 'shirt', colors: ['White', 'Navy', 'Red'] },
        { id: 'm10', name: 'Cargo Pants', category: 'men', price: 2199, brand: 'Zara', image: 'images/products/men/m10.jpg', rating: 4, description: 'Utility cargo pants with multiple pockets.', type: 'pant', colors: ['Khaki', 'Olive', 'Black'] },
        { id: 'm11', name: 'Checked Casual Shirt', category: 'men', price: 1599, brand: 'Raymond', image: 'images/products/men/m1.jpg', rating: 4.2, description: 'Smart checked shirt for weekend outings, woven from breathable cotton.', type: 'shirt', colors: ['Blue', 'Gray', 'Maroon'] },
        { id: 'm12', name: 'Track Pants', category: 'men', price: 1699, brand: 'Nike', image: 'images/products/men/m2.jpg', rating: 4.4, description: 'Lightweight track pants for running and the gym.', type: 'pant', colors: ['Black', 'Navy', 'Gray'] },
        { id: 'm13', name: 'Denim Jacket', category: 'men', price: 3499, brand: 'Levis', image: 'images/products/men/m3.jpg', rating: 4.6, description: 'Rugged trucker-style denim jacket that pairs with everything.', type: 'jacket', colors: ['Blue', 'Black'] },
        { id: 'm14', name: 'Round Neck T-Shirt (Pack of 3)', category: 'men', price: 1199, brand: 'H&M', image: 'images/products/men/m4.jpg', rating: 4.1, description: 'Everyday essential pack of 3 round-neck cotton t-shirts.', type: 'shirt', colors: ['White', 'Black', 'Gray'] },
        { id: 'm15', name: 'Pure Linen Shirt', category: 'men', price: 1799, brand: 'Fabindia', image: 'images/products/men/m5.jpg', rating: 4.5, description: 'Breathable handwoven linen shirt, ideal for Indian summers.', type: 'shirt', colors: ['Beige', 'White', 'Olive'] },
        { id: 'm16', name: 'Joggers', category: 'men', price: 1599, brand: 'Adidas', image: 'images/products/men/m6.jpg', rating: 4.3, description: 'Tapered joggers with an elastic waistband for all-day comfort.', type: 'pant', colors: ['Black', 'Gray', 'Navy'] },

        // ---------------- WOMEN (16) ----------------
        { id: 'w1', name: 'Floral Print Dress', category: 'women', price: 2499, brand: 'Zara', image: 'images/products/women/w1.jpg', rating: 4.5, description: 'Beautiful floral print dress, perfect for summer brunches.', type: 'dress', colors: ['Pink', 'Blue', 'Yellow'] },
        { id: 'w2', name: 'Denim Skirt', category: 'women', price: 1699, brand: 'Levis', image: 'images/products/women/w2.jpg', rating: 4, description: 'Stylish denim skirt, perfect for casual outings.', type: 'skirt', colors: ['Blue', 'Black'] },
        { id: 'w3', name: 'Summer Top', category: 'women', price: 999, brand: 'H&M', image: 'images/products/women/w3.jpg', rating: 4, description: 'Light summer top with breathable fabric.', type: 'top', colors: ['White', 'Pink', 'Blue'] },
        { id: 'w4', name: 'Blazer Co-ord Set', category: 'women', price: 4999, brand: 'Mango', image: 'images/products/women/w4.jpg', rating: 5, description: 'Elegant blazer and trouser co-ord set for office wear.', type: 'blazer', colors: ['Black', 'Navy'] },
        { id: 'w5', name: 'Knit Cardigan', category: 'women', price: 1899, brand: 'Gap', image: 'images/products/women/w5.jpg', rating: 4, description: 'Soft knit cardigan, ideal for layering.', type: 'cardigan', colors: ['Beige', 'Gray', 'Black'] },
        { id: 'w6', name: 'High-Waist Leggings', category: 'women', price: 1399, brand: 'Nike', image: 'images/products/women/w6.jpg', rating: 4.5, description: 'High-quality workout leggings with compression fit.', type: 'leggings', colors: ['Black', 'Navy', 'Gray'] },
        { id: 'w7', name: 'Sequin Evening Gown', category: 'women', price: 12999, brand: 'Gucci', image: 'images/products/women/w7.jpg', rating: 5, description: 'Luxurious sequin evening gown for special occasions.', type: 'dress', colors: ['Red', 'Black', 'Blue'] },
        { id: 'w8', name: 'Classic Denim Jacket', category: 'women', price: 3299, brand: 'Levis', image: 'images/products/women/w8.jpg', rating: 4, description: 'Timeless denim jacket that never goes out of style.', type: 'jacket', colors: ['Blue', 'Black'] },
        { id: 'w9', name: 'Maxi Dress', category: 'women', price: 2999, brand: 'H&M', image: 'images/products/women/w9.jpg', rating: 4.5, description: 'Flowy floor-length maxi dress for festive evenings.', type: 'dress', colors: ['Blue', 'Pink', 'Green'] },
        { id: 'w10', name: 'Crop Top', category: 'women', price: 899, brand: 'Zara', image: 'images/products/women/w10.jpg', rating: 4, description: 'Trendy crop top to pair with high-waist bottoms.', type: 'top', colors: ['White', 'Black', 'Red'] },
        { id: 'w11', name: 'Wrap Dress', category: 'women', price: 1999, brand: 'Forever 21', image: 'images/products/women/w1.jpg', rating: 4.2, description: 'Flattering wrap dress that works from desk to dinner.', type: 'dress', colors: ['Maroon', 'Black', 'Navy'] },
        { id: 'w12', name: 'Palazzo Pants', category: 'women', price: 1499, brand: 'W', image: 'images/products/women/w2.jpg', rating: 4.3, description: 'Flowy wide-leg palazzo pants, comfortable for all-day wear.', type: 'pant', colors: ['Black', 'Mustard', 'Teal'] },
        { id: 'w13', name: 'Off-Shoulder Top', category: 'women', price: 1299, brand: 'Vero Moda', image: 'images/products/women/w3.jpg', rating: 4.1, description: 'Chic off-shoulder top for a night out.', type: 'top', colors: ['Black', 'Red', 'White'] },
        { id: 'w14', name: 'Co-ord Set', category: 'women', price: 2199, brand: 'Only', image: 'images/products/women/w4.jpg', rating: 4.4, description: 'Matching two-piece co-ord set for an effortless look.', type: 'top', colors: ['Beige', 'Pink'] },
        { id: 'w15', name: 'Printed Kaftan', category: 'women', price: 1799, brand: 'Global Desi', image: 'images/products/women/w5.jpg', rating: 4.3, description: 'Breezy printed kaftan, perfect for resort wear.', type: 'dress', colors: ['Turquoise', 'Orange', 'Pink'] },
        { id: 'w16', name: 'Denim Dungaree', category: 'women', price: 2599, brand: 'Pepe Jeans', image: 'images/products/women/w6.jpg', rating: 4, description: 'Playful denim dungaree dress with adjustable straps.', type: 'dress', colors: ['Blue', 'Black'] },

        // ---------------- ETHNIC WEAR (12) ----------------
        { id: 'e1', name: 'Embroidered Anarkali Kurta', category: 'ethnic', price: 2499, brand: 'Biba', image: 'images/products/women/w7.jpg', rating: 4.6, description: 'Floor-length embroidered Anarkali kurta with delicate thread work.', type: 'kurta', colors: ['Maroon', 'Teal', 'Mustard'] },
        { id: 'e2', name: 'Banarasi Silk Saree', category: 'ethnic', price: 5999, brand: 'FabIndia', image: 'images/products/women/w8.jpg', rating: 4.8, description: 'Handwoven Banarasi silk saree with a zari border, ideal for weddings.', type: 'saree', colors: ['Red', 'Gold', 'Green'] },
        { id: 'e3', name: 'Cotton Printed Kurta Set', category: 'ethnic', price: 1699, brand: 'W', image: 'images/products/women/w9.jpg', rating: 4.3, description: 'Comfortable cotton kurta with palazzo and dupatta, great for daily wear.', type: 'kurta', colors: ['Blue', 'Yellow', 'White'] },
        { id: 'e4', name: "Men's Sherwani", category: 'ethnic', price: 8999, brand: 'Manyavar', image: 'images/products/men/m7.jpg', rating: 4.7, description: 'Regal embroidered sherwani for weddings and grand celebrations.', type: 'sherwani', colors: ['Gold', 'Maroon', 'Ivory'] },
        { id: 'e5', name: 'Bandhani Print Saree', category: 'ethnic', price: 3499, brand: 'Soch', image: 'images/products/women/w10.jpg', rating: 4.4, description: 'Traditional Rajasthani bandhani print saree in vibrant colours.', type: 'saree', colors: ['Pink', 'Orange', 'Yellow'] },
        { id: 'e6', name: "Men's Nehru Jacket", category: 'ethnic', price: 2999, brand: 'Manyavar', image: 'images/products/men/m8.jpg', rating: 4.5, description: 'Classic Nehru jacket to elevate any kurta for festive occasions.', type: 'nehru-jacket', colors: ['Black', 'Navy', 'Maroon'] },
        { id: 'e7', name: 'Palazzo Suit Set', category: 'ethnic', price: 2199, brand: 'Libas', image: 'images/products/women/w1.jpg', rating: 4.2, description: '3-piece palazzo suit set with chiffon dupatta.', type: 'kurta', colors: ['Teal', 'Pink', 'Mustard'] },
        { id: 'e8', name: 'Designer Lehenga Choli', category: 'ethnic', price: 11999, brand: 'Mohey', image: 'images/products/women/w7.jpg', rating: 4.9, description: 'Heavily embellished bridal-inspired lehenga choli with dupatta.', type: 'lehenga', colors: ['Red', 'Maroon', 'Gold'] },
        { id: 'e9', name: "Men's Kurta Pajama Set", category: 'ethnic', price: 1999, brand: 'Fabindia', image: 'images/products/men/m9.jpg', rating: 4.4, description: 'Pure cotton kurta pajama set, perfect for festivals and pujas.', type: 'kurta-pajama', colors: ['White', 'Beige', 'Mustard'] },
        { id: 'e10', name: 'Chiffon Party Wear Saree', category: 'ethnic', price: 4499, brand: 'Soch', image: 'images/products/women/w8.jpg', rating: 4.5, description: 'Lightweight chiffon saree with sequin border for evening parties.', type: 'saree', colors: ['Black', 'Navy', 'Emerald'] },
        { id: 'e11', name: 'Indo-Western Jacket Kurta', category: 'ethnic', price: 4499, brand: 'Manyavar', image: 'images/products/men/m10.jpg', rating: 4.3, description: 'Fusion jacket-style kurta for a modern festive look.', type: 'indo-western', colors: ['Maroon', 'Charcoal'] },
        { id: 'e12', name: 'Block Print Cotton Saree', category: 'ethnic', price: 2799, brand: 'FabIndia', image: 'images/products/women/w9.jpg', rating: 4.4, description: 'Hand block-printed cotton saree, breathable and elegant.', type: 'saree', colors: ['Indigo', 'Mustard', 'White'] },

        // ---------------- ACCESSORIES (14) ----------------
        { id: 'a1', name: 'Genuine Leather Belt', category: 'accessories', price: 799, brand: 'H&M', image: 'images/products/accessories/a1.jpg', rating: 4, description: 'Genuine leather belt with a classic buckle.', type: 'belt', colors: ['Brown', 'Black'] },
        { id: 'a2', name: 'UV Protection Sunglasses', category: 'accessories', price: 4999, brand: 'Ray-Ban', image: 'images/products/accessories/a2.jpg', rating: 4.5, description: 'UV-protected sunglasses with a timeless aviator design.', type: 'sunglasses', colors: ['Black', 'Brown'] },
        { id: 'a3', name: 'Analog Watch', category: 'accessories', price: 2999, brand: 'Casio', image: 'images/products/accessories/a3.jpg', rating: 5, description: 'Classic analog watch with a genuine leather strap.', type: 'watch', colors: ['Silver', 'Gold'] },
        { id: 'a4', name: 'Winter Wool Scarf', category: 'accessories', price: 699, brand: 'Zara', image: 'images/products/accessories/a4.jpg', rating: 4, description: 'Soft winter scarf, available in multiple colours.', type: 'scarf', colors: ['Red', 'Gray', 'Blue'] },
        { id: 'a5', name: 'Sports Backpack', category: 'accessories', price: 2499, brand: 'Nike', image: 'images/products/accessories/a5.jpg', rating: 4.5, description: 'Durable sports backpack with multiple compartments.', type: 'bag', colors: ['Black', 'Gray'] },
        { id: 'a6', name: 'Adjustable Baseball Cap', category: 'accessories', price: 699, brand: 'Adidas', image: 'images/products/accessories/a6.jpg', rating: 4, description: 'Adjustable baseball cap with embroidered logo.', type: 'cap', colors: ['Black', 'White', 'Navy'] },
        { id: 'a7', name: 'Leather Wallet', category: 'accessories', price: 1499, brand: 'Tommy Hilfiger', image: 'images/products/accessories/a7.jpg', rating: 4.5, description: 'Premium leather wallet with multiple card slots.', type: 'wallet', colors: ['Brown', 'Black'] },
        { id: 'a8', name: 'Crystal Pendant Necklace', category: 'accessories', price: 4999, brand: 'Swarovski', image: 'images/products/accessories/a8.jpg', rating: 5, description: 'Elegant silver necklace with a crystal pendant.', type: 'jewelry', colors: ['Silver', 'Gold'] },
        { id: 'a9', name: 'Wide Brim Sun Hat', category: 'accessories', price: 799, brand: 'Zara', image: 'images/products/accessories/a9.jpg', rating: 4, description: 'Wide brim sun hat for beach holidays.', type: 'cap', colors: ['Beige', 'Black'] },
        { id: 'a10', name: 'Charm Bracelet', category: 'accessories', price: 3499, brand: 'Pandora', image: 'images/products/accessories/a10.jpg', rating: 4.5, description: 'Sterling silver charm bracelet, build your own story.', type: 'jewelry', colors: ['Silver', 'Gold'] },
        { id: 'a11', name: 'Aviator Sunglasses', category: 'accessories', price: 999, brand: 'Fastrack', image: 'images/products/accessories/a2.jpg', rating: 4.1, description: 'Budget-friendly aviator sunglasses with UV400 protection.', type: 'sunglasses', colors: ['Black', 'Gold'] },
        { id: 'a12', name: 'Smart Watch', category: 'accessories', price: 5999, brand: 'Titan', image: 'images/products/accessories/a3.jpg', rating: 4.4, description: 'Smartwatch with heart-rate tracking, calls and notifications.', type: 'watch', colors: ['Black', 'Silver'] },
        { id: 'a13', name: 'Tote Handbag', category: 'accessories', price: 2199, brand: 'Caprese', image: 'images/products/accessories/a5.jpg', rating: 4.3, description: 'Spacious tote handbag in vegan leather.', type: 'bag', colors: ['Black', 'Tan'] },
        { id: 'a14', name: 'Stud Earrings Set', category: 'accessories', price: 1999, brand: 'Tanishq', image: 'images/products/accessories/a8.jpg', rating: 4.6, description: 'Set of 3 stud earrings for everyday elegance.', type: 'jewelry', colors: ['Gold', 'Silver'] },

        // ---------------- FOOTWEAR (14) ----------------
        { id: 'f1', name: 'Running Shoes', category: 'footwear', price: 4999, brand: 'Nike', image: 'images/products/footwear/f1.jpg', rating: 4.5, description: 'Comfortable running shoes with responsive cushioning.', type: 'shoes', colors: ['Black/Red', 'Blue/White', 'Gray'] },
        { id: 'f2', name: 'Leather Boots', category: 'footwear', price: 5999, brand: 'Woodland', image: 'images/products/footwear/f2.jpg', rating: 5, description: 'Rugged leather boots built for outdoor adventures.', type: 'boots', colors: ['Brown', 'Black'] },
        { id: 'f3', name: 'Comfort Sandals', category: 'footwear', price: 1499, brand: 'Adidas', image: 'images/products/footwear/f3.jpg', rating: 4, description: 'Comfortable sandals with a cushioned footbed for Indian summers.', type: 'sandals', colors: ['Black', 'Brown', 'Navy'] },
        { id: 'f4', name: 'Formal Oxford Shoes', category: 'footwear', price: 4499, brand: 'Clarks', image: 'images/products/footwear/f4.jpg', rating: 4.5, description: 'Elegant formal oxford shoes for office and weddings.', type: 'shoes', colors: ['Black', 'Brown'] },
        { id: 'f5', name: 'Casual Sneakers', category: 'footwear', price: 3299, brand: 'Puma', image: 'images/products/footwear/f5.jpg', rating: 4, description: 'Casual sneakers for everyday wear.', type: 'shoes', colors: ['White', 'Black', 'Red'] },
        { id: 'f6', name: 'Stiletto High Heels', category: 'footwear', price: 4999, brand: 'Steve Madden', image: 'images/products/footwear/f6.jpg', rating: 5, description: 'Statement stiletto heels for parties and events.', type: 'heels', colors: ['Black', 'Red', 'Nude'] },
        { id: 'f7', name: 'Penny Loafers', category: 'footwear', price: 2499, brand: 'Bata', image: 'images/products/footwear/f7.jpg', rating: 4, description: 'Comfortable penny loafers for casual and semi-formal wear.', type: 'shoes', colors: ['Brown', 'Black', 'Tan'] },
        { id: 'f8', name: 'Beach Flip Flops', category: 'footwear', price: 899, brand: 'Havaianas', image: 'images/products/footwear/f8.jpg', rating: 4, description: 'Light, comfortable flip flops for the beach or at home.', type: 'sandals', colors: ['Blue', 'Green', 'Red'] },
        { id: 'f9', name: 'Insulated Winter Boots', category: 'footwear', price: 6999, brand: 'Woodland', image: 'images/products/footwear/f9.jpg', rating: 4.5, description: 'Insulated boots for the hills — Manali, Shimla and beyond.', type: 'boots', colors: ['Brown', 'Black'] },
        { id: 'f10', name: 'Classic Canvas Shoes', category: 'footwear', price: 2999, brand: 'Converse', image: 'images/products/footwear/f10.jpg', rating: 4, description: 'Timeless canvas sneakers that go with everything.', type: 'shoes', colors: ['White', 'Black'] },
        { id: 'f11', name: 'Running Sports Shoes', category: 'footwear', price: 5499, brand: 'ASICS', image: 'images/products/footwear/f1.jpg', rating: 4.6, description: 'Performance running shoes with gel cushioning.', type: 'shoes', colors: ['Black', 'Blue'] },
        { id: 'f12', name: 'Ethnic Mojaris', category: 'footwear', price: 1499, brand: 'Bata', image: 'images/products/footwear/f3.jpg', rating: 4.3, description: 'Traditional embroidered mojaris to pair with kurtas and sherwanis.', type: 'sandals', colors: ['Gold', 'Maroon', 'Tan'] },
        { id: 'f13', name: 'Block Heel Sandals', category: 'footwear', price: 2299, brand: 'Metro', image: 'images/products/footwear/f6.jpg', rating: 4.2, description: 'Comfortable block heel sandals for all-day wear.', type: 'heels', colors: ['Black', 'Nude', 'Gold'] },
        { id: 'f14', name: 'Slip-On Sneakers', category: 'footwear', price: 3499, brand: 'Skechers', image: 'images/products/footwear/f5.jpg', rating: 4.4, description: 'Easy slip-on sneakers with memory foam insoles.', type: 'shoes', colors: ['Gray', 'Black', 'White'] }
    ];
}

// =========================================================
// Cart persistence
// =========================================================
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(true);
}

function updateCartCount(animate) {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach(el => {
        el.textContent = totalItems;
        if (animate) {
            el.classList.remove('bump');
            // force reflow so the animation can restart
            void el.offsetWidth;
            el.classList.add('bump');
        }
    });
}

// =========================================================
// Users
// =========================================================
function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    users = savedUsers ? JSON.parse(savedUsers) : [];

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

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// =========================================================
// Orders
// =========================================================
function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    orders = savedOrders ? JSON.parse(savedOrders) : [];
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// =========================================================
// Event listeners
// =========================================================
function setupEventListeners() {
    const menuIcon = document.querySelector('.mobile-menu-icon');
    if (menuIcon) menuIcon.addEventListener('click', toggleMobileMenu);

    const newsletterBtn = document.querySelector('#newsletter button');
    if (newsletterBtn) newsletterBtn.addEventListener('click', subscribeNewsletter);

    const loginForm = document.getElementById('login-form-element');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const registerForm = document.getElementById('register-form-element');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) trackingForm.addEventListener('submit', handleOrderTracking);

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.addEventListener('submit', function (e) { e.preventDefault(); });

    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) placeOrderBtn.addEventListener('click', placeOrder);

    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentMethodInfo);
    });

    const filterCheckboxes = document.querySelectorAll('.category-filter');
    filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));

    const priceRadios = document.querySelectorAll('input[name="price"]');
    priceRadios.forEach(radio => radio.addEventListener('change', filterProducts));

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', filterProducts);

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) searchBtn.addEventListener('click', filterProducts);

    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) sortSelect.addEventListener('change', filterProducts);

    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
}

function toggleMobileMenu() {
    document.querySelector('.header-list-nav').classList.toggle('active');
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('email-address-input');
    const email = emailInput.value.trim();

    if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    showToast('Thank you for subscribing to our newsletter!');
    emailInput.value = '';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// =========================================================
// Auth
// =========================================================
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
        showToast(`Welcome back, ${user.name}!`);
        setTimeout(() => window.location.href = 'index.html', 800);
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsAgree = document.getElementById('terms-agree')?.checked || false;

    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    if (password.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    if (!termsAgree) {
        showToast('You must agree to the Terms & Conditions', 'error');
        return;
    }
    if (users.some(u => u.email === email)) {
        showToast('User with this email already exists', 'error');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name, email, password,
        isAdmin: false,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers();

    showToast('Registration successful! Please login.');
    setTimeout(() => window.location.href = 'login.html', 800);
}

function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const subject = document.getElementById('contact-subject')?.value;
    const message = document.getElementById('contact-message')?.value;

    if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    showToast('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// =========================================================
// Order tracking
// =========================================================
function handleOrderTracking(e) {
    e.preventDefault();

    const orderNumber = document.getElementById('order-number')?.value;
    const email = document.getElementById('tracking-email')?.value;

    if (!orderNumber || !email) {
        showToast('Please enter both order number and email', 'error');
        return;
    }

    const order = orders.find(o => o.orderNumber === orderNumber && o.email === email);

    if (order) {
        displayTrackingResult(order);
    } else {
        showToast('Order not found. Please check your order number and email.', 'error');
    }
}

function displayTrackingResult(order) {
    const trackingResult = document.getElementById('tracking-result');
    if (!trackingResult) return;

    trackingResult.style.display = 'block';

    document.getElementById('track-order-number').textContent = order.orderNumber;
    document.getElementById('track-order-date').textContent = formatDate(order.orderDate);
    document.getElementById('track-order-status').textContent = order.status;
    document.getElementById('track-order-total').textContent = formatPrice(order.total);

    const itemsContainer = document.getElementById('track-order-items');
    if (itemsContainer) {
        itemsContainer.innerHTML = order.items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
            </tr>
        `).join('');
    }

    const statuses = ['Order Placed', 'Order Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(order.status);

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.remove('completed', 'active');
        if (index < currentIndex) item.classList.add('completed');
        else if (index === currentIndex) item.classList.add('active');
    });

    if (order.timeline) {
        document.getElementById('timeline-placed').textContent = formatDate(order.timeline.placed) || 'Pending';
        document.getElementById('timeline-confirmed').textContent = formatDate(order.timeline.confirmed) || 'Pending';
        document.getElementById('timeline-processing').textContent = formatDate(order.timeline.processing) || 'Pending';
        document.getElementById('timeline-shipped').textContent = formatDate(order.timeline.shipped) || 'Pending';
        document.getElementById('timeline-delivered').textContent = formatDate(order.timeline.delivered) || 'Pending';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// =========================================================
// Currency formatting
// =========================================================
function formatPrice(amount) {
    const rounded = Math.round(amount || 0);
    return '₹' + rounded.toLocaleString('en-IN');
}

// =========================================================
// Checkout / Payment (Razorpay + COD)
// =========================================================
function togglePaymentMethodInfo() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const razorpayInfo = document.getElementById('razorpay-info');
    const codInfo = document.getElementById('cod-info');

    if (razorpayInfo) razorpayInfo.style.display = paymentMethod === 'razorpay' ? 'block' : 'none';
    if (codInfo) codInfo.style.display = paymentMethod === 'cod' ? 'block' : 'none';
}

function setPlaceOrderLoading(isLoading) {
    const btn = document.getElementById('place-order-btn');
    const text = document.getElementById('place-order-btn-text');
    if (!btn || !text) return;

    btn.disabled = isLoading;
    if (isLoading) {
        btn.classList.add('btn-loading');
        text.innerHTML = '<span class="btn-spinner"></span> Processing...';
    } else {
        btn.classList.remove('btn-loading');
        text.innerHTML = '<i class="fa-solid fa-lock"></i> Place Order Securely';
    }
}

function placeOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }

    const firstName = document.getElementById('first-name')?.value;
    const lastName = document.getElementById('last-name')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    const apartment = document.getElementById('apartment')?.value;
    const city = document.getElementById('city')?.value;
    const state = document.getElementById('state')?.value;
    const zip = document.getElementById('zip')?.value;

    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip) {
        showToast('Please fill in all required shipping fields', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    if (!/^\d{6}$/.test(zip)) {
        showToast('Please enter a valid 6-digit PIN code', 'error');
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if (!paymentMethod) {
        showToast('Please select a payment method', 'error');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = subtotal * GST_RATE;
    const total = subtotal + shipping + tax;

    const orderNumber = 'FH-' + Date.now().toString().slice(-8);
    const fullAddress = `${address}${apartment ? ', ' + apartment : ''}, ${city}, ${state} ${zip}, India`;

    const order = {
        orderNumber,
        customerName: firstName + ' ' + lastName,
        email,
        phone,
        address: fullAddress,
        items: [...cart],
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: paymentMethod === 'razorpay' ? 'Razorpay (Online)' : 'Cash on Delivery',
        paymentStatus: paymentMethod === 'razorpay' ? 'Pending' : 'Pending (Cash on Delivery)',
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

    if (paymentMethod === 'razorpay') {
        payWithRazorpay(order);
    } else {
        finalizeOrder(order);
    }
}

// Open the Razorpay Checkout modal.
//
// IMPORTANT — this is a front-end-only demo integration:
// Razorpay strongly recommends creating the Order on YOUR server via the
// Orders API (POST /v1/orders) and verifying the payment signature
// server-side after success, so the amount can't be tampered with in the
// browser. This static site has no backend, so it opens Checkout directly
// with the amount computed client-side. Before going live, add a small
// backend (Node/PHP/etc.) to create the order and verify
// razorpay_payment_id / razorpay_signature before fulfilling it.
function payWithRazorpay(order) {
    if (typeof Razorpay === 'undefined') {
        showToast('Payment gateway failed to load. Check your connection and try again.', 'error');
        return;
    }

    setPlaceOrderLoading(true);

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: Math.round(order.total * 100), // paise
        currency: 'INR',
        name: STORE_NAME,
        description: `Order ${order.orderNumber}`,
        image: 'images/logo.png',
        prefill: {
            name: order.customerName,
            email: order.email,
            contact: order.phone
        },
        notes: {
            address: order.address,
            order_number: order.orderNumber
        },
        theme: { color: '#088178' },
        handler: function (response) {
            order.paymentId = response.razorpay_payment_id;
            order.paymentStatus = 'Paid';
            finalizeOrder(order);
        },
        modal: {
            ondismiss: function () {
                setPlaceOrderLoading(false);
                showToast('Payment cancelled. You can try again whenever you\'re ready.', 'info');
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function () {
        setPlaceOrderLoading(false);
        showToast('Payment failed. Please try again or choose Cash on Delivery.', 'error');
    });
    rzp.open();
}

function finalizeOrder(order) {
    orders.push(order);
    saveOrders();

    cart = [];
    saveCart();

    localStorage.setItem('currentOrder', JSON.stringify(order));
    window.location.href = 'order-confirmation.html';
}

// =========================================================
// Cart item management
// =========================================================
function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        item.quantity = Number(newQuantity);
        saveCart();
        displayCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
}

function updateCartSummary(subtotal) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    const shipping = subtotal > 0 ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE) : 0;
    const tax = subtotal * GST_RATE;
    const total = subtotal + shipping + tax;

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// =========================================================
// Page router
// =========================================================
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
    } else if (fileName === 'product-detail.html') {
        loadProductDetailPage();
    }
}

function loadHomePage() {
    const featuredContainer = document.getElementById('featured-products');
    const newArrivalsContainer = document.getElementById('new-arrivals');

    if (featuredContainer) {
        displayProducts(products.slice(0, 8), featuredContainer);
    }

    if (newArrivalsContainer) {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        displayProducts(shuffled.slice(0, 8), newArrivalsContainer);
    }
}

function loadShopPage() {
    const allProductsContainer = document.getElementById('all-products');
    if (allProductsContainer) {
        displayProducts(products, allProductsContainer);
    }
}

// =========================================================
// Blog
// =========================================================
function loadBlogPage() {
    const blogContainer = document.querySelector('.blog-posts-container');
    if (!blogContainer) return;

    const blogPosts = [
        { id: 1, title: 'The Ultimate Guide to Indian Summer Fashion 2024', date: 'June 15, 2024', image: 'images/blog/b1.jpg', excerpt: 'Beat the heat in style — breathable fabrics, vibrant prints and the cotton kurtas every wardrobe needs this season.' },
        { id: 2, title: 'How to Style Your Denim Jacket with Indian Wear', image: 'images/blog/b2.jpg', date: 'June 10, 2024', excerpt: 'The denim jacket is a fusion-wear favourite. Learn how to pair it with kurtas, sarees and everything in between.' },
        { id: 3, title: 'Festive Season Ethnic Wear Trends', date: 'June 5, 2024', image: 'images/blog/b3.jpg', excerpt: 'From Diwali to wedding season, discover the sherwanis, lehengas and sarees trending across India this year.' },
        { id: 4, title: 'Accessorizing 101: Complete Your Look', date: 'May 28, 2024', image: 'images/blog/b4.jpg', excerpt: 'The right accessories can transform any outfit. Learn the art of accessorizing with our comprehensive guide.' },
        { id: 5, title: "Men's Fashion Trends You Need to Try", date: 'May 20, 2024', image: 'images/blog/b5.jpg', excerpt: 'Stay ahead of the curve with these must-try trends, from streetwear to bandhgalas.' },
        { id: 6, title: 'Footwear Guide: Choosing the Perfect Pair', date: 'May 15, 2024', image: 'images/blog/b6.jpg', excerpt: 'From mojaris to sneakers, find the perfect shoes for every Indian occasion with our footwear guide.' },
        { id: 7, title: 'Why We Switched to Razorpay & Cash on Delivery', date: 'May 8, 2024', image: 'images/blog/b1.jpg', excerpt: 'Pay the way you want — UPI, cards, NetBanking, wallets or cash at your doorstep. Here\'s how checkout works now.' }
    ];

    blogContainer.innerHTML = blogPosts.map(post => `
        <div class="blog-post reveal">
            <div class="blog-date">${post.date.split(' ')[1].replace(',', '')}/${post.date.split(' ')[0].slice(0, 3)}</div>
            <div class="blog-img">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-details">
                <h4>${post.title}</h4>
                <p>${post.excerpt}</p>
                <a href="#">CONTINUE READING <i class="fa fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');
}

// =========================================================
// About
// =========================================================
function loadAboutPage() {
    const teamContainer = document.getElementById('team-members');
    if (!teamContainer) return;

    const teamMembers = [
        { name: 'Arjun Kapoor', position: 'Founder & CEO', image: 'images/team/team1.jpg', bio: 'With over 15 years in fashion retail, Arjun founded FashionHub India to make quality clothing accessible to everyone.' },
        { name: 'Neha Reddy', position: 'Creative Director', image: 'images/team/team2.jpg', bio: 'Neha leads our design team with an innovative vision spanning western and ethnic wear.' },
        { name: 'Karan Malhotra', position: 'Head of Operations', image: 'images/team/team3.jpg', bio: 'Karan ensures that every order reaches our customers across India quickly and safely.' },
        { name: 'Ananya Iyer', position: 'Customer Experience Manager', image: 'images/team/team4.jpg', bio: 'Ananya and her team are dedicated to providing exceptional customer service, every single day.' }
    ];

    teamContainer.innerHTML = teamMembers.map(member => `
        <div class="team-member reveal">
            <img src="${member.image}" alt="${member.name}">
            <h4>${member.name}</h4>
            <p>${member.position}</p>
            <p><small>${member.bio}</small></p>
        </div>
    `).join('');
}

// =========================================================
// Contact / FAQ
// =========================================================
function loadContactPage() {
    const faqList = document.getElementById('faq-list');
    if (!faqList) return;

    const faqs = [
        { question: 'How do I track my order?', answer: 'You can track your order by visiting the Order Tracking page and entering your order number and email address.' },
        { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for all unworn items in their original packaging. Please visit our Returns page for more information.' },
        { question: 'Do you ship across India?', answer: 'Yes! We deliver to over 20,000 pin codes across India, including most Tier 2 and Tier 3 towns. Delivery times vary by location.' },
        { question: 'What payment methods do you accept?', answer: 'We accept Credit/Debit Cards, UPI, NetBanking and Wallets via Razorpay\'s secure checkout, as well as Cash on Delivery (COD) on most pin codes.' },
        { question: 'Is it safe to pay online on FashionHub India?', answer: 'Absolutely. All online payments are processed by Razorpay, a PCI-DSS Level 1 certified payment gateway. We never see or store your card, UPI or banking details.' },
        { question: 'Is GST included in the price?', answer: 'Yes, all prices shown are inclusive-ready — GST (5%) is calculated and shown separately at checkout for full transparency.' },
        { question: 'How can I change or cancel my order?', answer: 'Orders can be modified or cancelled within 1 hour of placement. Please contact our customer support immediately for assistance.' }
    ];

    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
                ${faq.question} <i class="fa fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

function toggleFaq(element) {
    element.closest('.faq-item').classList.toggle('active');
}

// =========================================================
// Checkout page
// =========================================================
function loadCheckoutPage() {
    const orderItems = document.getElementById('order-items');
    if (!orderItems) return;

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    let subtotal = 0;
    orderItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatPrice(itemTotal)}</span>
            </div>
        `;
    }).join('');

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = subtotal * GST_RATE;
    const total = subtotal + shipping + tax;

    const subtotalEl = document.getElementById('order-subtotal');
    const shippingEl = document.getElementById('order-shipping');
    const taxEl = document.getElementById('order-tax');
    const totalEl = document.getElementById('order-total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (totalEl) totalEl.textContent = formatPrice(total);

    togglePaymentMethodInfo();
}

// =========================================================
// Order confirmation
// =========================================================
function loadOrderConfirmation() {
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    if (!order) return;

    document.getElementById('order-number').textContent = order.orderNumber;
    document.getElementById('order-date').textContent = formatDate(order.orderDate);
    document.getElementById('order-amount').textContent = formatPrice(order.total);
    document.getElementById('payment-method').textContent = order.paymentMethod || 'Razorpay (Online)';
    document.getElementById('shipping-address').textContent = order.address || 'N/A';

    const itemsBody = document.getElementById('order-items-body');
    if (itemsBody) {
        itemsBody.innerHTML = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
            </tr>
        `).join('');
    }
}

function loadOrderTrackingPage() {
    // Initial setup only — results render on form submit.
}

// =========================================================
// Product grid rendering
// =========================================================
function displayProducts(productsToShow, container) {
    if (!container) return;

    if (productsToShow.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = productsToShow.map((product, index) => `
        <div class="product-cart fade-in-card" style="animation-delay:${Math.min(index * 0.06, 0.6)}s" onclick="openProductModal('${product.id}')">
            <div class="product-cart-img-wrap">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <span>${product.brand}</span>
            <h4>${product.name}</h4>
            <div class="stars">${getStarRating(product.rating)}</div>
            <h4 class="price">${formatPrice(product.price)}</h4>
            <i class="fa-solid fa-cart-shopping buy-icon" onclick="event.stopPropagation(); openProductModal('${product.id}')"></i>
        </div>
    `).join('');
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fa-solid fa-star"></i>';
    if (halfStar) stars += '<i class="fa-solid fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) stars += '<i class="fa-regular fa-star"></i>';
    return stars;
}

// =========================================================
// Filtering / Sorting (shop page)
// =========================================================
function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="price"]:checked')?.value || 'all';
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';

    let filtered = [...products];

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedPrice !== 'all') {
        if (selectedPrice === '4999+') {
            filtered = filtered.filter(p => p.price >= 4999);
        } else {
            const [min, max] = selectedPrice.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
    }

    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    const sortBy = document.getElementById('sort-by')?.value || 'default';
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

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

function clearFilters() {
    document.querySelectorAll('.category-filter:checked').forEach(cb => cb.checked = false);

    const allPriceRadio = document.querySelector('input[name="price"][value="all"]');
    if (allPriceRadio) allPriceRadio.checked = true;

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) sortSelect.value = 'default';

    const container = document.getElementById('all-products');
    if (container) displayProducts(products, container);

    const noProducts = document.getElementById('no-products');
    if (noProducts) noProducts.style.display = 'none';
}

// =========================================================
// Invoice / bill printing
// =========================================================
function generateBillHTML(order) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join('');

    return `
        <div class="bill-container">
            <div class="bill-header">
                <img src="images/logo.png" alt="FashionHub India Logo">
                <h1>FashionHub India</h1>
                <p>204 MG Road, Indiranagar, Bengaluru, Karnataka 560038</p>
                <p>Phone: +91 98765 43210 | Email: support@fashionhub.com | GSTIN: 29AAFCF1234R1ZP</p>
                <hr style="border: 1px solid #088178; margin: 20px 0;">
            </div>

            <h2 style="text-align: center; color: #088178;">TAX INVOICE</h2>

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
                    <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Razorpay (Online)'}</p>
                    <p><strong>Payment Status:</strong> ${order.paymentStatus || 'Pending'}</p>
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
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                        <td style="padding: 10px; text-align: right;">${formatPrice(order.subtotal)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                        <td style="padding: 10px; text-align: right;">${order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>GST (5%):</strong></td>
                        <td style="padding: 10px; text-align: right;">${formatPrice(order.tax)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-size: 18px;"><strong>Grand Total:</strong></td>
                        <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold; color: #088178;">${formatPrice(order.total)}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="bill-footer">
                <p><strong>Thank you for shopping with FashionHub India!</strong></p>
                <p>For any queries, please contact our customer support.</p>
                <hr>
                <p style="font-size: 12px; color: #777;">This is a computer-generated invoice. No signature is required.</p>
            </div>
        </div>
    `;
}

function openPrintWindow(billHtml) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice - FashionHub India</title>
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
                    .bill-footer { margin-top: 40px; text-align: center; }
                    .bill-footer hr { border: 1px dashed #ccc; margin: 20px 0; }
                    @media print { body { margin: 0; padding: 20px; } }
                </style>
            </head>
            <body>
                ${billHtml}
                <script>
                    window.onload = function () {
                        window.print();
                        window.onafterprint = function () { window.close(); };
                    };
                <\/script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function printBill() {
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    if (!order) {
        showToast('No order found to print', 'error');
        return;
    }
    openPrintWindow(generateBillHTML(order));
}

function printTrackedOrderBill() {
    const orderNumber = document.getElementById('track-order-number').textContent;
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) {
        showToast('Order not found', 'error');
        return;
    }
    openPrintWindow(generateBillHTML(order));
}

function printOrderHistoryBill(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) {
        showToast('Order not found', 'error');
        return;
    }
    openPrintWindow(generateBillHTML(order));
}

// =========================================================
// My orders
// =========================================================
function loadMyOrders() {
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');

    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = '';
        if (noOrders) noOrders.style.display = 'block';
        return;
    }

    if (noOrders) noOrders.style.display = 'none';

    ordersList.innerHTML = orders.slice().reverse().map(order => `
        <div class="order-card">
            <div style="background-color: #f8f8f8; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>Order #${order.orderNumber}</strong>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #777;">Placed on ${formatDate(order.orderDate)}</p>
                </div>
                <div>
                    <span class="status-badge">${order.status}</span>
                </div>
            </div>
            <div style="padding: 15px;">
                <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                <p><strong>Payment:</strong> ${order.paymentMethod || 'Razorpay (Online)'} — ${order.paymentStatus || 'Pending'}</p>
                <p><strong>Items:</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                <div style="margin-top: 10px;">
                    <button class="normal" onclick="printOrderHistoryBill('${order.orderNumber}')" style="padding: 8px 15px; font-size: 14px; margin-right: 10px;">
                        <i class="fa fa-print"></i> Print Bill
                    </button>
                    <button class="normal" onclick="window.location.href='order-tracking.html'" style="padding: 8px 15px; font-size: 14px; background-color: #f0f0f0; color: #333;">
                        Track Order
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// =========================================================
// Toast notifications
// =========================================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.querySelector('.toast-icon');

    if (!toast) {
        // Fall back gracefully on pages without the toast element
        console.log(message);
        return;
    }

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
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// =========================================================
// Product detail (modal + standalone page)
// =========================================================
function buildProductDetailHTML(product) {
    const reviews = productReviews[product.id] || [
        { name: 'Rohit D.', rating: 5, date: '2024-06-01', comment: 'Great product! Highly recommended.' },
        { name: 'Sarita M.', rating: 4, date: '2024-05-28', comment: 'Good quality and fast shipping.' },
        { name: 'Mihir R.', rating: 5, date: '2024-05-15', comment: 'Excellent value for money.' }
    ];

    const suggestedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const sizeOptions = getSizeOptions(product.type);
    const colorOptions = product.colors || ['Black', 'White', 'Blue'];
    const starsHtml = getStarRating(product.rating);

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

    const suggestedHtml = suggestedProducts.map(p => `
        <div class="suggested-product" onclick="openProductModal('${p.id}')">
            <img src="${p.image}" alt="${p.name}">
            <h5>${p.name}</h5>
            <span class="price">${formatPrice(p.price)}</span>
        </div>
    `).join('');

    const images = product.images || [product.image, product.image, product.image];

    return `
        <div class="modal-product-images">
            <img src="${product.image}" alt="${product.name}" class="modal-main-image" id="modal-main-image">
            <div class="modal-thumbnails">
                ${images.map(img => `<img src="${img}" alt="Thumbnail" class="modal-thumbnail" onclick="document.getElementById('modal-main-image').src='${img}'">`).join('')}
            </div>
        </div>
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <span class="brand">${product.brand}</span>
            <div class="stars">${starsHtml}</div>
            <div class="price">${formatPrice(product.price)} <span class="gst-note">(incl. GST applied at checkout)</span></div>
            <p class="description">${product.description}</p>

            <div class="color-section">
                <h4>Select Color:</h4>
                <div class="color-options">
                    ${colorOptions.map(color => `<div class="color-btn" style="background-color: ${getColorCode(color)};" onclick="selectColor(this, '${color}')" title="${color}"></div>`).join('')}
                </div>
            </div>

            <div class="size-section">
                <h4>Select Size:</h4>
                <div class="size-options" id="size-options">
                    ${sizeOptions.map(size => `<button class="size-btn" onclick="selectSize(this, '${size}')">${size}</button>`).join('')}
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
                <button class="add-to-cart-btn buy-now" onclick="buyNowFromModal('${product.id}')" style="flex: 1;">
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
                    <div class="suggested-grid">${suggestedHtml}</div>
                </div>
            ` : ''}
        </div>
    `;
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const container = document.getElementById('modal-product-container');
    if (!modal || !container) return;

    container.innerHTML = buildProductDetailHTML(product);
    modal.style.display = 'block';

    const sizeOptions = getSizeOptions(product.type);
    const colorOptions = product.colors || ['Black', 'White', 'Blue'];
    window.selectedProduct = { id: product.id, color: colorOptions[0], size: sizeOptions[0] };

    setTimeout(() => {
        const firstColor = document.querySelector('.color-btn');
        const firstSize = document.querySelector('.size-btn');
        if (firstColor) firstColor.classList.add('active');
        if (firstSize) firstSize.classList.add('active');
    }, 50);
}

function loadProductDetailPage() {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || (products[0] && products[0].id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = '<p style="padding:40px;text-align:center;">Product not found.</p>';
        return;
    }

    container.innerHTML = buildProductDetailHTML(product);

    const sizeOptions = getSizeOptions(product.type);
    const colorOptions = product.colors || ['Black', 'White', 'Blue'];
    window.selectedProduct = { id: product.id, color: colorOptions[0], size: sizeOptions[0] };

    setTimeout(() => {
        const firstColor = container.querySelector('.color-btn');
        const firstSize = container.querySelector('.size-btn');
        if (firstColor) firstColor.classList.add('active');
        if (firstSize) firstSize.classList.add('active');
    }, 50);

    const relatedContainer = document.getElementById('related-products-container');
    if (relatedContainer) {
        const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
        displayProducts(related, relatedContainer);
    }
}

function getSizeOptions(type) {
    const shirtSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const pantSizes = ['28', '30', '32', '34', '36'];
    const shoeSizes = ['6', '7', '8', '9', '10', '11', '12'];

    if (['shirt', 'top', 'hoodie', 'sweater', 'jacket', 'blazer', 'cardigan', 'kurta', 'sherwani', 'nehru-jacket', 'kurta-pajama', 'indo-western', 'lehenga'].includes(type)) {
        return shirtSizes;
    } else if (['pant', 'jeans', 'leggings', 'skirt', 'shorts'].includes(type)) {
        return pantSizes;
    } else if (['shoes', 'boots', 'sandals', 'heels', 'sneakers'].includes(type)) {
        return shoeSizes;
    } else if (type === 'saree') {
        return ['Free Size'];
    } else {
        return ['One Size'];
    }
}

function getColorCode(color) {
    const colorMap = {
        'White': '#ffffff', 'Black': '#000000', 'Blue': '#0000ff', 'Red': '#ff0000',
        'Green': '#00ff00', 'Yellow': '#ffff00', 'Gray': '#808080', 'Brown': '#8b4513',
        'Navy': '#000080', 'Khaki': '#f0e68c', 'Olive': '#808000', 'Burgundy': '#800020',
        'Pink': '#ffc0cb', 'Beige': '#f5f5dc', 'Purple': '#800080', 'Orange': '#ffa500',
        'Silver': '#c0c0c0', 'Gold': '#ffd700', 'Charcoal': '#36454F', 'Tan': '#d2b48c',
        'Nude': '#f2d2bd', 'Maroon': '#800000', 'Mustard': '#ffdb58', 'Teal': '#088178',
        'Emerald': '#50C878', 'Ivory': '#FFFFF0', 'Turquoise': '#40E0D0', 'Indigo': '#4B0082'
    };
    return colorMap[color] || '#cccccc';
}

function selectColor(element, color) {
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    if (window.selectedProduct) window.selectedProduct.color = color;
}

function selectSize(element, size) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    if (window.selectedProduct) window.selectedProduct.size = size;
}

function updateModalQuantity(change) {
    const input = document.getElementById('modal-quantity');
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    input.value = value;
}

function addToCartFromModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const quantity = parseInt(document.getElementById('modal-quantity').value) || 1;
    const selectedSize = window.selectedProduct?.size || getSizeOptions(product.type)[0];
    const selectedColor = window.selectedProduct?.color || (product.colors || ['Black'])[0];

    const cartItemId = product.id + '-' + selectedSize + '-' + selectedColor;
    const existingItemIndex = cart.findIndex(item => item.id === cartItemId);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            size: selectedSize,
            color: selectedColor
        });
    }

    saveCart();
    showToast(`${product.name} (${selectedSize}, ${selectedColor}) added to cart!`);

    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = 'none';
}

function buyNowFromModal(productId) {
    addToCartFromModal(productId);
    showToast('Redirecting to checkout...', 'info');
    setTimeout(() => window.location.href = 'checkout.html', 900);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const defaultSize = getSizeOptions(product.type)[0];
    const defaultColor = (product.colors || ['Black'])[0];
    const cartItemId = product.id + '-' + defaultSize + '-' + defaultColor;
    const existingItemIndex = cart.findIndex(item => item.id === cartItemId);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: defaultSize,
            color: defaultColor
        });
    }

    saveCart();
    showToast(`${product.name} added to cart!`);
}

// =========================================================
// Cart page rendering
// =========================================================
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

    let subtotal = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>
                    ${item.name}<br>
                    <small>Size: ${item.size}, Color: ${item.color}</small>
                </td>
                <td>${formatPrice(item.price)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity('${item.id}', this.value)" readonly>
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>${formatPrice(itemTotal)}</td>
                <td><i class="fa fa-trash remove-item" onclick="removeFromCart('${item.id}')"></i></td>
            </tr>
        `;
    }).join('');

    updateCartSummary(subtotal);
}

// Close product modal when clicking outside it
window.onclick = function (event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// =========================================================
// Visual polish: scroll reveal, progress bar, back-to-top
// =========================================================
function initScrollEnhancements() {
    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    // Back-to-top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
        backToTop.classList.toggle('visible', scrollTop > 400);
    }, { passive: true });

    // Scroll-triggered reveal animations
    const revealSelectors = '.f-box, .blog-post, .team-member, #about-head, #contact-details, #form-details, .faq-item, .order-card, #hero, .product-section h1, .product-section p, #brand-slider h2';
    document.querySelectorAll(revealSelectors).forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Re-observe dynamically injected reveal elements (e.g. blog/team cards)
    const mutationObserver = new MutationObserver(() => {
        document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}
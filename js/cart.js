/**
 * Caffeine Coffee Shop - Cart JavaScript
 * Shopping cart functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality
    initAddToCartButtons();

    // If on cart page, render cart
    if (document.getElementById('cartItems')) {
        renderCart();
    }
});

/**
 * Initialize "Add to Cart" buttons
 */
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart, .quick-add');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));

            addToCart(productName, productPrice);
        });
    });
}

/**
 * Add item to cart
 */
function addToCart(name, price, quantity = 1) {
    const cart = window.CaffeineApp.getCart();

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: quantity
        });
    }

    window.CaffeineApp.saveCart(cart);
    window.CaffeineApp.showNotification(`${name} added to cart!`, 'success');

    // Dispatch event for cart animation
    document.dispatchEvent(new CustomEvent('itemAddedToCart', { detail: { name, price, quantity } }));

    // If on cart page, re-render
    if (document.getElementById('cartItems')) {
        renderCart();
    }
}

/**
 * Remove item from cart
 */
function removeFromCart(itemId) {
    let cart = window.CaffeineApp.getCart();
    cart = cart.filter(item => item.id !== itemId);
    window.CaffeineApp.saveCart(cart);
    renderCart();
    window.CaffeineApp.showNotification('Item removed from cart', 'success');
}

/**
 * Update item quantity
 */
function updateQuantity(itemId, newQuantity) {
    const cart = window.CaffeineApp.getCart();
    const item = cart.find(item => item.id === itemId);

    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            window.CaffeineApp.saveCart(cart);
            renderCart();
        }
    }
}

/**
 * Render cart items on cart page
 */
function renderCart() {
    const cart = window.CaffeineApp.getCart();
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItemsList) return;

    // Clear existing items
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';

    // Render each cart item
    cart.forEach(item => {
        const itemElement = createCartItemElement(item);
        cartItemsList.appendChild(itemElement);
    });

    // Update cart summary
    updateCartSummary(cart);
}

/**
 * Create cart item HTML element
 */
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-image">
            <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200" alt="${item.name}">
        </div>
        <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p class="cart-item-price">${window.CaffeineApp.formatPrice(item.price)}</p>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="qty-input" value="${item.quantity}"
                       onchange="updateQuantity(${item.id}, parseInt(this.value))" min="1">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
        <div class="cart-item-actions">
            <p class="cart-item-price">${window.CaffeineApp.formatPrice(item.price * item.quantity)}</p>
            <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return div;
}

/**
 * Update cart summary
 */
function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const deliveryFee = getDeliveryFee();
    const discount = getDiscount();
    const total = subtotal + tax + deliveryFee - discount;

    // Update DOM elements
    document.getElementById('subtotal').textContent = window.CaffeineApp.formatPrice(subtotal);
    document.getElementById('tax').textContent = window.CaffeineApp.formatPrice(tax);
    document.getElementById('delivery').textContent = window.CaffeineApp.formatPrice(deliveryFee);
    document.getElementById('total').textContent = window.CaffeineApp.formatPrice(total);

    // Update discount if applicable
    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = '-' + window.CaffeineApp.formatPrice(discount);
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

/**
 * Get delivery fee based on selected option
 */
function getDeliveryFee() {
    const deliveryOption = document.querySelector('input[name="delivery"]:checked');
    if (deliveryOption && deliveryOption.value === 'pickup') {
        return 0;
    }
    return 3.99;
}

/**
 * Get discount amount
 */
function getDiscount() {
    const discountData = sessionStorage.getItem('discount');
    return discountData ? parseFloat(discountData) : 0;
}

/**
 * Apply promo code
 */
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim().toUpperCase();

    // Predefined promo codes
    const promoCodes = {
        'WELCOME15': 0.15,  // 15% off
        'COFFEE10': 0.10,   // 10% off
        'SAVE5': 0.05       // 5% off
    };

    if (promoCodes[code]) {
        const cart = window.CaffeineApp.getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * promoCodes[code];

        sessionStorage.setItem('discount', discount.toString());
        sessionStorage.setItem('promoCode', code);

        renderCart();
        window.CaffeineApp.showNotification('Promo code applied successfully!', 'success');
        promoInput.value = '';
    } else {
        window.CaffeineApp.showNotification('Invalid promo code', 'error');
    }
}

/**
 * Handle delivery option change
 */
function handleDeliveryChange() {
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            const cart = window.CaffeineApp.getCart();
            if (cart.length > 0) {
                updateCartSummary(cart);
            }

            // Update delivery fee display
            const deliveryElement = document.getElementById('delivery');
            if (this.value === 'pickup') {
                deliveryElement.textContent = 'FREE';
            } else {
                deliveryElement.textContent = '$3.99';
            }
        });
    });
}

/**
 * Initialize checkout button
 */
function initCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = window.CaffeineApp.getCart();
            if (cart.length === 0) {
                window.CaffeineApp.showNotification('Your cart is empty', 'error');
                return;
            }

            // Show checkout modal
            const modal = document.getElementById('checkoutModal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
}

/**
 * Initialize promo code button
 */
function initPromoCodeButton() {
    const applyBtn = document.querySelector('.btn-apply-promo');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyPromoCode);
    }

    const promoInput = document.getElementById('promoCode');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });
    }
}

// Initialize cart page specific functionality
if (document.getElementById('cartItems')) {
    handleDeliveryChange();
    initCheckoutButton();
    initPromoCodeButton();
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.renderCart = renderCart;

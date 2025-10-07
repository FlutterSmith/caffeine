/**
 * Caffeine Coffee Shop - Main JavaScript
 * General functionality and utilities
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Initialize all components
    initMobileMenu();
    initScrollEffects();
    initFormValidation();
    updateCartCount();
    initSmoothScroll();

    console.log('Caffeine website initialized successfully!');
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            const isExpanded = menu.classList.contains('active');
            toggle.setAttribute('aria-expanded', isExpanded);

            // Animate hamburger icon
            const hamburgers = toggle.querySelectorAll('.hamburger');
            if (isExpanded) {
                hamburgers[0].style.transform = 'rotate(45deg) translateY(8px)';
                hamburgers[1].style.opacity = '0';
                hamburgers[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                hamburgers[0].style.transform = '';
                hamburgers[1].style.opacity = '';
                hamburgers[2].style.transform = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            } else {
                header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.product-card, .testimonial-card, .menu-item, .gallery-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[novalidate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let errorMessage = '';
    let isValid = true;

    // Check if required field is empty
    if (field.required && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    // Password validation
    else if (type === 'password' && value && name === 'password') {
        if (value.length < 8) {
            errorMessage = 'Password must be at least 8 characters';
            isValid = false;
        }
    }
    // Confirm password validation
    else if (name === 'confirmPassword' && value) {
        const passwordField = field.form.querySelector('[name="password"]');
        if (passwordField && value !== passwordField.value) {
            errorMessage = 'Passwords do not match';
            isValid = false;
        }
    }

    // Display or clear error message
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }

    // Update field styling
    if (isValid) {
        field.style.borderColor = '';
    } else {
        field.style.borderColor = '#E53935';
    }

    return isValid;
}

/**
 * Update cart count in navigation
 */
function updateCartCount() {
    const cart = getCart();
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        if (totalItems > 0) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

/**
 * Get cart from localStorage
 */
function getCart() {
    const cartData = localStorage.getItem('caffeineCart');
    return cartData ? JSON.parse(cartData) : [];
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
    localStorage.setItem('caffeineCart', JSON.stringify(cart));
    updateCartCount();
}

/**
 * Show notification/toast message
 */
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.textContent = message;

    // Apply styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#4CAF50' : '#E53935',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        minWidth: '250px',
        textAlign: 'center'
    });

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Format price
 */
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

/**
 * Debounce function
 */
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

/**
 * Add CSS animation keyframes
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
window.CaffeineApp = {
    getCart,
    saveCart,
    updateCartCount,
    showNotification,
    formatPrice,
    validateForm,
    validateField,
    debounce
};

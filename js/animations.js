/**
 * Caffeine Coffee Shop - Advanced Animations & Gestures
 * Swipe gestures and interactive animations
 */

document.addEventListener('DOMContentLoaded', function() {
    initSwipeGestures();
    initScrollAnimations();
    initParallaxEffect();
    initCardFlip();
    initHoverAnimations();
    initLoadingAnimations();
});

/**
 * Swipe Gesture Support
 */
function initSwipeGestures() {
    const swipeableElements = document.querySelectorAll('.swipeable, .product-card, .menu-item, .gallery-item');

    swipeableElements.forEach(element => {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isDragging = false;
        let startTime = 0;

        element.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            startTime = Date.now();
            isDragging = true;
            element.classList.add('swiping');
        }, { passive: true });

        element.addEventListener('touchmove', function(e) {
            if (!isDragging) return;

            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Prevent vertical scrolling if horizontal swipe is detected
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                element.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;
                element.style.opacity = 1 - Math.abs(deltaX) / 500;
            }
        }, { passive: true });

        element.addEventListener('touchend', function(e) {
            if (!isDragging) return;

            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const deltaTime = Date.now() - startTime;

            element.classList.remove('swiping');

            // Determine swipe direction
            const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
            const isQuickSwipe = deltaTime < 300;
            const minSwipeDistance = 50;

            if (isHorizontalSwipe && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    handleSwipeRight(element);
                } else {
                    handleSwipeLeft(element);
                }
            } else {
                // Reset position
                element.style.transform = '';
                element.style.opacity = '';
            }

            isDragging = false;
        }, { passive: true });

        element.addEventListener('touchcancel', function() {
            isDragging = false;
            element.classList.remove('swiping');
            element.style.transform = '';
            element.style.opacity = '';
        });
    });
}

/**
 * Handle swipe right gesture
 */
function handleSwipeRight(element) {
    // Add animation class
    element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    element.style.transform = 'translateX(100%) rotate(20deg)';
    element.style.opacity = '0';

    // Show indicator
    showSwipeIndicator('right');

    // If it's a product, add to favorites
    if (element.classList.contains('product-card') || element.classList.contains('menu-item')) {
        const productName = element.querySelector('h3')?.textContent;
        if (productName) {
            addToFavorites(productName);
            window.CaffeineApp?.showNotification?.(`❤️ Added ${productName} to favorites!`, 'success');
        }
    }

    // Reset after animation
    setTimeout(() => {
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
    }, 300);
}

/**
 * Handle swipe left gesture
 */
function handleSwipeLeft(element) {
    element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    element.style.transform = 'translateX(-100%) rotate(-20deg)';
    element.style.opacity = '0';

    showSwipeIndicator('left');

    // Reset after animation
    setTimeout(() => {
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
    }, 300);
}

/**
 * Show swipe direction indicator
 */
function showSwipeIndicator(direction) {
    const indicator = document.createElement('div');
    indicator.className = `swipe-indicator ${direction}`;
    indicator.innerHTML = direction === 'right' ? '❤️' : '👈';
    document.body.appendChild(indicator);

    setTimeout(() => indicator.classList.add('active'), 10);

    setTimeout(() => {
        indicator.classList.remove('active');
        setTimeout(() => indicator.remove(), 300);
    }, 500);
}

/**
 * Add to favorites (localStorage)
 */
function addToFavorites(productName) {
    let favorites = JSON.parse(localStorage.getItem('caffeineFavorites') || '[]');
    if (!favorites.includes(productName)) {
        favorites.push(productName);
        localStorage.setItem('caffeineFavorites', JSON.stringify(favorites));
    }
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add reveal class
                element.classList.add('revealed');

                // Determine animation type
                if (element.classList.contains('scroll-reveal-left')) {
                    element.style.animation = 'slideInLeft 0.8s ease forwards';
                } else if (element.classList.contains('scroll-reveal-right')) {
                    element.style.animation = 'slideInRight 0.8s ease forwards';
                } else {
                    element.style.animation = 'fadeInScale 0.8s ease forwards';
                }

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all elements with scroll reveal classes
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    // Stagger animations
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    staggerContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.classList.add('stagger-item');
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

/**
 * Parallax scrolling effect
 */
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax, .hero, .cta-section');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Mouse parallax effect
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const parallaxElements = document.querySelectorAll('.parallax-mouse');
        parallaxElements.forEach(element => {
            const speed = element.dataset.mouseSpeed || 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/**
 * Card flip animation
 */
function initCardFlip() {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });

    // Auto-flip on hover for desktop
    if (window.innerWidth > 768) {
        flipCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('flipped');
            });

            card.addEventListener('mouseleave', function() {
                this.classList.remove('flipped');
            });
        });
    }
}

/**
 * Enhanced hover animations
 */
function initHoverAnimations() {
    // Add hover classes to elements
    const products = document.querySelectorAll('.product-card, .menu-item');
    products.forEach(product => {
        product.classList.add('hover-lift');

        // Add ripple effect on click
        product.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });

    // Animated icons
    const icons = document.querySelectorAll('.icon-circle i, .value-icon i, .info-icon i');
    icons.forEach((icon, index) => {
        if (index % 3 === 0) icon.classList.add('icon-float');
        else if (index % 3 === 1) icon.classList.add('icon-bounce');
        else icon.classList.add('icon-pulse');
    });

    // Button animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    });
}

/**
 * Create ripple effect
 */
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

/**
 * Loading animations
 */
function initLoadingAnimations() {
    // Skeleton loading for images
    const images = document.querySelectorAll('img[data-src]');

    images.forEach(img => {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton';
        skeleton.style.width = img.width + 'px';
        skeleton.style.height = img.height + 'px';
        img.parentNode.insertBefore(skeleton, img);
        img.style.display = 'none';

        img.addEventListener('load', function() {
            skeleton.remove();
            this.style.display = '';
            this.style.animation = 'fadeIn 0.3s ease';
        });

        img.src = img.dataset.src;
    });

    // Progress bar for page load
    window.addEventListener('load', function() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 9999;
        `;
        document.body.appendChild(progressBar);

        setTimeout(() => {
            progressBar.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => progressBar.remove(), 300);
        }, 500);
    });
}

/**
 * Animate cart icon when item is added
 */
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('updated');
        setTimeout(() => cartIcon.classList.remove('updated'), 500);
    }
}

/**
 * Smooth scroll with easing
 */
function smoothScrollTo(targetY, duration = 1000) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}

/**
 * Page transition effect
 */
function initPageTransition() {
    // Add transition on page load
    document.body.classList.add('page-transition-enter');

    // Add transition on navigation
    const links = document.querySelectorAll('a[href^="/"]:not([target="_blank"])');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                e.preventDefault();
                document.body.classList.add('page-transition-exit');
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}

/**
 * Animate numbers counting up
 */
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number, [data-count]');

    numbers.forEach(element => {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);

            element.textContent = element.textContent.replace(/[0-9,]+/, current.toLocaleString());

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }

        // Start animation when element is in view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateNumber);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    });
}

// Initialize number animations
animateNumbers();

// Export functions for use in other scripts
window.CaffeineAnimations = {
    animateCartIcon,
    smoothScrollTo,
    createRipple,
    showSwipeIndicator
};

// Call cart icon animation when items are added
document.addEventListener('itemAddedToCart', function() {
    animateCartIcon();
});

console.log('🎨 Advanced animations and swipe gestures initialized!');

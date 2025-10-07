/**
 * Caffeine Coffee Shop - Checkout JavaScript
 * Checkout process and Stripe payment integration
 */

// Initialize Stripe (replace with your actual publishable key)
const stripe = window.Stripe ? Stripe('pk_test_51234567890abcdefghijklmnop') : null;
let cardElement = null;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('checkoutModal')) {
        initCheckoutModal();
        initCheckoutSteps();
        initStripeElements();
    }
});

/**
 * Initialize checkout modal
 */
function initCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const closeBtn = modal.querySelector('.modal-close');

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCheckoutModal);
    }

    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCheckoutModal();
        }
    });

    // Prevent closing on Escape when processing payment
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            const processingPayment = document.querySelector('.btn-submit.loading');
            if (!processingPayment) {
                closeCheckoutModal();
            }
        }
    });
}

/**
 * Close checkout modal
 */
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    resetCheckoutForm();
}

/**
 * Initialize checkout steps navigation
 */
function initCheckoutSteps() {
    const nextToPayment = document.getElementById('nextToPayment');
    const backToInfo = document.getElementById('backToInfo');
    const nextToConfirm = document.getElementById('nextToConfirm');
    const backToPayment = document.getElementById('backToPayment');

    if (nextToPayment) {
        nextToPayment.addEventListener('click', function() {
            if (validateStep1()) {
                goToStep(2);
            }
        });
    }

    if (backToInfo) {
        backToInfo.addEventListener('click', function() {
            goToStep(1);
        });
    }

    if (nextToConfirm) {
        nextToConfirm.addEventListener('click', function() {
            if (validateStep2()) {
                populateReview();
                goToStep(3);
            }
        });
    }

    if (backToPayment) {
        backToPayment.addEventListener('click', function() {
            goToStep(2);
        });
    }

    // Handle final form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
}

/**
 * Navigate to specific checkout step
 */
function goToStep(stepNumber) {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < stepNumber - 1) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === stepNumber - 1) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Show/hide step content
    const stepContents = document.querySelectorAll('.checkout-step-content');
    stepContents.forEach((content, index) => {
        if (index === stepNumber - 1) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });

    // Scroll to top of modal
    const modalContent = document.querySelector('.checkout-modal');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

/**
 * Validate step 1 (customer information)
 */
function validateStep1() {
    const form = document.getElementById('checkoutForm');
    const fields = [
        'checkoutFirstName',
        'checkoutLastName',
        'checkoutEmail',
        'checkoutPhone',
        'checkoutAddress',
        'checkoutCity',
        'checkoutZip'
    ];

    let isValid = true;

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#E53935';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        window.CaffeineApp.showNotification('Please fill in all required fields', 'error');
    }

    return isValid;
}

/**
 * Validate step 2 (payment information)
 */
function validateStep2() {
    // Check if card element is complete
    // In production, you would check cardElement.value.complete
    // For demo, we'll just return true
    return true;
}

/**
 * Initialize Stripe Elements
 */
function initStripeElements() {
    if (!stripe) {
        console.warn('Stripe.js not loaded. Payment functionality will be limited.');
        return;
    }

    const elements = stripe.elements();
    cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#333333',
                fontFamily: '"Lato", sans-serif',
                '::placeholder': {
                    color: '#A8A8A8'
                }
            },
            invalid: {
                color: '#E53935'
            }
        }
    });

    const cardElementContainer = document.getElementById('card-element');
    if (cardElementContainer) {
        cardElement.mount('#card-element');

        // Handle real-time validation errors
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }
}

/**
 * Populate order review
 */
function populateReview() {
    const form = document.getElementById('checkoutForm');
    const cart = window.CaffeineApp.getCart();

    // Review address
    const reviewAddress = document.getElementById('reviewAddress');
    if (reviewAddress) {
        reviewAddress.innerHTML = `
            <p><strong>${form.checkoutFirstName.value} ${form.checkoutLastName.value}</strong></p>
            <p>${form.checkoutAddress.value}</p>
            <p>${form.checkoutCity.value}, ${form.checkoutZip.value}</p>
            <p>Email: ${form.checkoutEmail.value}</p>
            <p>Phone: ${form.checkoutPhone.value}</p>
        `;
    }

    // Review items
    const reviewItems = document.getElementById('reviewItems');
    if (reviewItems) {
        let itemsHTML = '<ul style="list-style: none; padding: 0;">';
        cart.forEach(item => {
            itemsHTML += `
                <li style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${window.CaffeineApp.formatPrice(item.price * item.quantity)}</span>
                </li>
            `;
        });
        itemsHTML += '</ul>';
        reviewItems.innerHTML = itemsHTML;
    }

    // Review summary
    const reviewSummary = document.getElementById('reviewSummary');
    if (reviewSummary) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const deliveryFee = document.querySelector('input[name="delivery"]:checked').value === 'pickup' ? 0 : 3.99;
        const discount = parseFloat(sessionStorage.getItem('discount') || '0');
        const total = subtotal + tax + deliveryFee - discount;

        reviewSummary.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal:</span>
                <span>${window.CaffeineApp.formatPrice(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Tax:</span>
                <span>${window.CaffeineApp.formatPrice(tax)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Delivery:</span>
                <span>${window.CaffeineApp.formatPrice(deliveryFee)}</span>
            </div>
            ${discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #4CAF50;">
                    <span>Discount:</span>
                    <span>-${window.CaffeineApp.formatPrice(discount)}</span>
                </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.25rem; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #E8D5C4;">
                <span>Total:</span>
                <span>${window.CaffeineApp.formatPrice(total)}</span>
            </div>
        `;
    }
}

/**
 * Handle checkout form submission
 */
async function handleCheckoutSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('placeOrder');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
        // In production, create payment intent on server first
        // Then confirm payment with Stripe
        if (stripe && cardElement) {
            const {paymentMethod, error} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                throw new Error(error.message);
            }

            // Process payment with backend API
            const orderData = collectOrderData(form, paymentMethod.id);
            await processPayment(orderData);
        } else {
            // Demo mode without Stripe
            const orderData = collectOrderData(form, 'demo-payment-method');
            await processPayment(orderData);
        }

        // Show success and clear cart
        showOrderSuccess();
        localStorage.removeItem('caffeineCart');
        sessionStorage.removeItem('discount');
        sessionStorage.removeItem('promoCode');
        window.CaffeineApp.updateCartCount();

    } catch (error) {
        window.CaffeineApp.showNotification(error.message || 'Payment failed. Please try again.', 'error');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

/**
 * Collect order data
 */
function collectOrderData(form, paymentMethodId) {
    const cart = window.CaffeineApp.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const deliveryFee = document.querySelector('input[name="delivery"]:checked').value === 'pickup' ? 0 : 3.99;
    const discount = parseFloat(sessionStorage.getItem('discount') || '0');
    const total = subtotal + tax + deliveryFee - discount;

    return {
        customer: {
            firstName: form.checkoutFirstName.value,
            lastName: form.checkoutLastName.value,
            email: form.checkoutEmail.value,
            phone: form.checkoutPhone.value
        },
        address: {
            street: form.checkoutAddress.value,
            city: form.checkoutCity.value,
            zip: form.checkoutZip.value
        },
        items: cart,
        deliveryType: document.querySelector('input[name="delivery"]:checked').value,
        notes: form.checkoutNotes.value,
        paymentMethodId: paymentMethodId,
        pricing: {
            subtotal,
            tax,
            deliveryFee,
            discount,
            total
        }
    };
}

/**
 * Process payment (API call)
 */
async function processPayment(orderData) {
    // In production, this would call your backend API
    // For demo, simulate API call
    return new Promise((resolve) => {
        console.log('Processing order:', orderData);
        setTimeout(resolve, 2000);
    });
}

/**
 * Show order success
 */
function showOrderSuccess() {
    // Hide form steps
    const stepContents = document.querySelectorAll('.checkout-step-content');
    stepContents.forEach(content => content.style.display = 'none');

    // Hide steps indicator
    const stepsIndicator = document.querySelector('.checkout-steps');
    if (stepsIndicator) {
        stepsIndicator.style.display = 'none';
    }

    // Show success message
    const successDiv = document.getElementById('orderSuccess');
    const orderNumber = 'CAFF' + Date.now().toString().slice(-8);
    document.getElementById('orderNumber').textContent = orderNumber;
    successDiv.style.display = 'block';
}

/**
 * Reset checkout form
 */
function resetCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.reset();
    }

    // Reset steps
    goToStep(1);

    // Hide success message
    const successDiv = document.getElementById('orderSuccess');
    if (successDiv) {
        successDiv.style.display = 'none';
    }

    // Show steps indicator
    const stepsIndicator = document.querySelector('.checkout-steps');
    if (stepsIndicator) {
        stepsIndicator.style.display = 'flex';
    }

    // Reset card element
    if (cardElement) {
        cardElement.clear();
    }
}

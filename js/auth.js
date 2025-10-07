/**
 * Caffeine Coffee Shop - Authentication JavaScript
 * Login and registration functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggles
    initPasswordToggles();

    // Initialize login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Initialize register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        initPasswordStrength();
    }

    // Initialize social login buttons
    initSocialLogin();
});

/**
 * Initialize password toggle buttons
 */
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Initialize password strength indicator
 */
function initPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthIndicator = document.getElementById('passwordStrength');

    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);

            strengthIndicator.className = 'password-strength ' + strength.level;
            strengthIndicator.querySelector('.strength-text').textContent = strength.text;
        });
    }
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password) {
    let score = 0;

    if (!password) {
        return { level: '', text: '' };
    }

    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Determine strength level
    if (score < 3) {
        return { level: 'weak', text: 'Weak' };
    } else if (score < 5) {
        return { level: 'medium', text: 'Medium' };
    } else {
        return { level: 'strong', text: 'Strong' };
    }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');

    // Get form data
    const email = form.email.value.trim();
    const password = form.password.value;
    const remember = form.remember.checked;

    // Validate
    if (!email || !password) {
        showAuthError(errorDiv, 'Please fill in all required fields');
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    errorDiv.style.display = 'none';

    // Simulate API call (replace with actual API call)
    try {
        await simulateAPICall();

        // Store auth token (in real app, this would come from API)
        const token = 'demo-token-' + Date.now();
        if (remember) {
            localStorage.setItem('authToken', token);
        } else {
            sessionStorage.setItem('authToken', token);
        }

        // Store user data
        const userData = {
            email: email,
            name: email.split('@')[0]
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show success message
        successDiv.style.display = 'block';

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        showAuthError(errorDiv, 'Invalid email or password');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

/**
 * Handle register form submission
 */
async function handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');

    // Get form data
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const terms = form.terms.checked;

    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAuthError(errorDiv, 'Please fill in all required fields');
        return;
    }

    if (password !== confirmPassword) {
        showAuthError(errorDiv, 'Passwords do not match');
        return;
    }

    if (!terms) {
        showAuthError(errorDiv, 'Please accept the terms of service');
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    errorDiv.style.display = 'none';

    // Simulate API call (replace with actual API call)
    try {
        await simulateAPICall();

        // Show success message
        successDiv.style.display = 'block';

        // Redirect to login page after short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        showAuthError(errorDiv, 'Registration failed. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

/**
 * Show authentication error
 */
function showAuthError(errorDiv, message) {
    if (errorDiv) {
        const messageElement = errorDiv.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        } else {
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${message}</p>`;
        }
        errorDiv.style.display = 'block';
    }
}

/**
 * Initialize social login buttons
 */
function initSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');

    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.textContent.toLowerCase();
            window.CaffeineApp.showNotification(
                `${provider} authentication will be implemented with OAuth`,
                'info'
            );
        });
    });
}

/**
 * Simulate API call (for demo purposes)
 */
function simulateAPICall() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    window.location.href = 'index.html';
}

/**
 * Get current user data
 */
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Export functions
window.AuthModule = {
    isLoggedIn,
    logout,
    getCurrentUser
};

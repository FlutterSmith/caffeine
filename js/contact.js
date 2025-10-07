/**
 * Caffeine Coffee Shop - Contact JavaScript
 * Contact form handling
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

/**
 * Handle contact form submission
 */
async function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successDiv = document.getElementById('formSuccess');

    // Get form data
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        subject: form.subject.value,
        message: form.message.value.trim(),
        newsletter: form.newsletter.checked
    };

    // Validate
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        window.CaffeineApp.showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    // Simulate API call (replace with actual API endpoint)
    try {
        await simulateFormSubmission(formData);

        // Show success message
        successDiv.style.display = 'block';
        form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);

        window.CaffeineApp.showNotification('Message sent successfully!', 'success');

    } catch (error) {
        window.CaffeineApp.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

/**
 * Simulate form submission (for demo)
 */
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Form data:', data);
        setTimeout(resolve, 1500);
    });
}

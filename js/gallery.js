/**
 * Caffeine Coffee Shop - Gallery JavaScript
 * Gallery filtering and lightbox functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.gallery-section')) {
        initGalleryFilter();
        initLightbox();
    }
});

/**
 * Initialize gallery filter
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.gallery-controls .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialize lightbox functionality
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    // Open lightbox when clicking on gallery items
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.gallery-view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openLightbox(index);
            });
        }

        // Also allow clicking on the item itself
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    // Close lightbox
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Previous image
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPreviousImage();
        });
    }

    // Next image
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextImage();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    /**
     * Open lightbox with specific image
     */
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    /**
     * Show previous image
     */
    function showPreviousImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }

    /**
     * Show next image
     */
    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }

    /**
     * Update lightbox content
     */
    function updateLightboxContent() {
        const currentItem = galleryItems[currentIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.querySelector('.gallery-overlay h3');
        const category = currentItem.querySelector('.gallery-overlay p');

        if (lightboxImage && img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
        }

        if (lightboxTitle && title) {
            lightboxTitle.textContent = title.textContent;
        }

        if (lightboxCategory && category) {
            lightboxCategory.textContent = category.textContent;
        }
    }
}

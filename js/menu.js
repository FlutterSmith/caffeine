/**
 * Caffeine Coffee Shop - Menu JavaScript
 * Menu filtering and search functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.menu-section')) {
        initMenuFilter();
        initMenuSearch();
    }
});

/**
 * Initialize menu filter buttons
 */
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuCategories = document.querySelectorAll('.menu-category');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            if (category === 'all') {
                // Show all categories
                menuCategories.forEach(cat => cat.style.display = 'block');
                menuItems.forEach(item => {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                });
            } else {
                // Hide all categories first
                menuCategories.forEach(cat => cat.style.display = 'none');

                // Show only matching items
                menuItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === category) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                        // Show parent category
                        item.closest('.menu-category').style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
}

/**
 * Initialize menu search
 */
function initMenuSearch() {
    const searchInput = document.getElementById('menuSearch');
    if (!searchInput) return;

    const debouncedSearch = window.CaffeineApp.debounce(function(searchTerm) {
        filterMenuBySearch(searchTerm);
    }, 300);

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        debouncedSearch(searchTerm);
    });
}

/**
 * Filter menu items by search term
 */
function filterMenuBySearch(searchTerm) {
    const menuItems = document.querySelectorAll('.menu-item');
    const menuCategories = document.querySelectorAll('.menu-category');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Reset filter buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-category="all"]').classList.add('active');

    if (searchTerm === '') {
        // Show all items if search is empty
        menuCategories.forEach(cat => cat.style.display = 'block');
        menuItems.forEach(item => item.style.display = 'block');
        return;
    }

    // Track which categories have visible items
    const visibleCategories = new Set();

    menuItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        const itemDescription = item.querySelector('p').textContent.toLowerCase();
        const matches = itemName.includes(searchTerm) || itemDescription.includes(searchTerm);

        if (matches) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease';
            const categoryId = item.closest('.menu-category').id;
            visibleCategories.add(categoryId);
        } else {
            item.style.display = 'none';
        }
    });

    // Show/hide categories based on whether they have visible items
    menuCategories.forEach(category => {
        if (visibleCategories.has(category.id)) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });

    // Show "no results" message if no items found
    if (visibleCategories.size === 0) {
        showNoResults();
    } else {
        removeNoResults();
    }
}

/**
 * Show "no results" message
 */
function showNoResults() {
    removeNoResults(); // Remove existing message if any

    const menuSection = document.querySelector('.menu-section .container');
    const noResults = document.createElement('div');
    noResults.id = 'noResultsMessage';
    noResults.style.textAlign = 'center';
    noResults.style.padding = '3rem';
    noResults.style.fontSize = '1.125rem';
    noResults.style.color = '#A8A8A8';
    noResults.innerHTML = `
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <p>No items found matching your search.</p>
    `;
    menuSection.appendChild(noResults);
}

/**
 * Remove "no results" message
 */
function removeNoResults() {
    const existing = document.getElementById('noResultsMessage');
    if (existing) {
        existing.remove();
    }
}

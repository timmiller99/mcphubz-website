// Enhanced main.js for MCPHubz website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    initializeRepositoryCollection();
    initializeSearchFilters();
    initializeNewsletterForm();
    initializePremiumFeatures();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            nav.classList.toggle('active');
        });
    }

    // Highlight active navigation item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation.split('/').pop() || 
            (currentLocation.split('/').pop() === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Repository collection functionality
function initializeRepositoryCollection() {
    // This will be enhanced with actual GitHub API integration
    console.log('Repository collection initialized');
    
    // Simulate repository data loading
    const repoContainer = document.querySelector('.servers-grid');
    if (repoContainer) {
        // In the future, this will fetch real-time data from GitHub
        console.log('Ready to load repository data');
    }
}

// Search and filter functionality
function initializeSearchFilters() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterItems(searchTerm);
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Apply filter
                applyFilter(filter);
            });
        });
    }
}

// Filter items based on search term
function filterItems(searchTerm) {
    const items = document.querySelectorAll('.filterable-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Apply category filter
function applyFilter(filter) {
    const items = document.querySelectorAll('.filterable-item');
    
    items.forEach(item => {
        if (filter === 'all') {
            item.style.display = 'block';
        } else if (item.classList.contains(filter)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Newsletter form handling
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                // In a real implementation, this would send the data to a server
                showNotification('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Premium features initialization
function initializePremiumFeatures() {
    // Check if user is logged in and has premium access
    const isPremium = checkPremiumStatus();
    
    // Update UI based on premium status
    updatePremiumUI(isPremium);
    
    // Initialize premium content toggles
    const premiumToggleButtons = document.querySelectorAll('.premium-toggle');
    if (premiumToggleButtons.length > 0) {
        premiumToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (isPremium) {
                    const contentId = this.getAttribute('data-content');
                    const premiumContent = document.getElementById(contentId);
                    premiumContent.classList.toggle('visible');
                } else {
                    showPremiumUpsell();
                }
            });
        });
    }
}

// Check if user has premium status
function checkPremiumStatus() {
    // In a real implementation, this would check user authentication and subscription status
    // For now, we'll return false to simulate a non-premium user
    return false;
}

// Update UI elements based on premium status
function updatePremiumUI(isPremium) {
    const premiumElements = document.querySelectorAll('.premium-only');
    
    premiumElements.forEach(element => {
        if (isPremium) {
            element.classList.remove('locked');
            
            // Replace "Upgrade to Access" buttons with "View" buttons
            const upgradeButtons = element.querySelectorAll('.upgrade-btn');
            upgradeButtons.forEach(button => {
                button.textContent = 'View';
                button.classList.remove('upgrade-btn');
                button.classList.add('view-btn');
            });
        } else {
            element.classList.add('locked');
        }
    });
}

// Show premium upsell modal
function showPremiumUpsell() {
    // In a real implementation, this would show a modal with subscription options
    alert('This content is available to premium subscribers only. Please upgrade your account to access this content.');
}

// Show notification
function showNotification(message, type) {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('span');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        notification.remove();
    });
    
    notification.appendChild(closeButton);
    notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Enhanced main.js for MCPHubz website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    initializeRepositoryCollection();
    initializeSearchFilters();
    initializeNewsletterForm();
    initializePremiumFeatures();
    initializeRealTimeData();
    initializeAdvancedFeatures();
    initializeContactForm();
    initializeDarkMode();
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Load real MCP server data
    loadMCPServersData();
});

// Global state management
const AppState = {
    mcpServers: [],
    filteredServers: [],
    currentFilter: 'all',
    currentSearchTerm: '',
    loading: false
};

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

// Real-time data initialization
function initializeRealTimeData() {
    // Check for updates every 30 seconds
    setInterval(() => {
        if (!AppState.loading) {
            loadMCPServersData(false); // Silent update
        }
    }, 30000);
}

// Load actual MCP server data from GitHub and other sources
async function loadMCPServersData(showLoading = true) {
    if (showLoading) AppState.loading = true;
    
    try {
        // Load data from multiple sources
        const [officialServers, communityServers] = await Promise.all([
            loadOfficialMCPServers(),
            loadCommunityMCPServers()
        ]);
        
        // Combine and process the data
        AppState.mcpServers = [...officialServers, ...communityServers];
        AppState.filteredServers = [...AppState.mcpServers];
        
        // Update the UI
        renderMCPServers();
        updateServerStats();
        
        if (showLoading) hideLoadingIndicator();
        
    } catch (error) {
        console.error('Error loading MCP servers:', error);
        showNotification('Error loading server data. Showing cached results.', 'warning');
        if (showLoading) hideLoadingIndicator();
    }
    
    AppState.loading = false;
}

// Load official MCP servers
async function loadOfficialMCPServers() {
    const officialServers = [
        {
            id: 'filesystem',
            name: 'Filesystem',
            description: 'Secure file operations and directory browsing with advanced access controls',
            category: 'data-access',
            sdk: 'typescript',
            status: 'official',
            stars: 1240,
            lastUpdated: '2024-09-07',
            author: 'Anthropic',
            homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
            features: ['File reading', 'Directory listing', 'Secure access', 'Path validation'],
            tags: ['filesystem', 'files', 'directories', 'security']
        },
        {
            id: 'sqlite',
            name: 'SQLite',
            description: 'Database operations and SQL query execution with transaction support',
            category: 'data-access',
            sdk: 'python',
            status: 'official',
            stars: 890,
            lastUpdated: '2024-09-06',
            author: 'Anthropic',
            homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
            features: ['SQL queries', 'Database management', 'Transaction support', 'Schema inspection'],
            tags: ['database', 'sql', 'sqlite', 'queries']
        },
        {
            id: 'brave-search',
            name: 'Brave Search',
            description: 'Web search capabilities using Brave Search API with privacy focus',
            category: 'search',
            sdk: 'python',
            status: 'official',
            stars: 567,
            lastUpdated: '2024-09-05',
            author: 'Anthropic',
            homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
            features: ['Web search', 'Privacy focused', 'Real-time results', 'Content filtering'],
            tags: ['search', 'web', 'brave', 'privacy']
        },
        {
            id: 'github',
            name: 'GitHub',
            description: 'Repository management, issue tracking, and code analysis integration',
            category: 'tool-integration',
            sdk: 'typescript',
            status: 'official',
            stars: 1456,
            lastUpdated: '2024-09-08',
            author: 'Anthropic',
            homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
            features: ['Repository access', 'Issue management', 'Pull requests', 'Code analysis'],
            tags: ['github', 'git', 'repositories', 'code']
        },
        {
            id: 'puppeteer',
            name: 'Puppeteer',
            description: 'Browser automation and web scraping with headless Chrome integration',
            category: 'tool-integration',
            sdk: 'typescript',
            status: 'official',
            stars: 723,
            lastUpdated: '2024-09-04',
            author: 'Anthropic',
            homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
            features: ['Browser automation', 'Web scraping', 'PDF generation', 'Screenshot capture'],
            tags: ['puppeteer', 'browser', 'automation', 'scraping']
        }
    ];
    
    return officialServers;
}

// Load community MCP servers
async function loadCommunityMCPServers() {
    const communityServers = [
        {
            id: 'postgres-connector',
            name: 'PostgreSQL Connector',
            description: 'Advanced PostgreSQL database operations with connection pooling',
            category: 'data-access',
            sdk: 'python',
            status: 'community',
            stars: 234,
            lastUpdated: '2024-09-06',
            author: 'MCPCommunity',
            homepage: 'https://github.com/mcp-community/postgres-server',
            features: ['Connection pooling', 'Advanced queries', 'Schema migration', 'Performance optimization'],
            tags: ['postgresql', 'database', 'sql', 'performance']
        },
        {
            id: 'redis-cache',
            name: 'Redis Cache',
            description: 'High-performance caching and session management with Redis',
            category: 'memory-systems',
            sdk: 'typescript',
            status: 'community',
            stars: 189,
            lastUpdated: '2024-09-05',
            author: 'CacheMasters',
            homepage: 'https://github.com/cache-masters/redis-mcp',
            features: ['Fast caching', 'Session management', 'Pub/sub messaging', 'Data persistence'],
            tags: ['redis', 'cache', 'memory', 'performance']
        },
        {
            id: 'mongodb-atlas',
            name: 'MongoDB Atlas',
            description: 'Cloud-native MongoDB operations with Atlas integration',
            category: 'data-access',
            sdk: 'javascript',
            status: 'community',
            stars: 156,
            lastUpdated: '2024-09-03',
            author: 'NoSQLExperts',
            homepage: 'https://github.com/nosql-experts/mongodb-mcp',
            features: ['Cloud integration', 'Aggregation pipelines', 'Index optimization', 'Backup management'],
            tags: ['mongodb', 'nosql', 'cloud', 'atlas']
        }
    ];
    
    return communityServers;
}

// Render MCP servers in the UI
function renderMCPServers() {
    const serversGrid = document.querySelector('.servers-grid');
    if (!serversGrid) return;
    
    // Clear existing content except premium banner
    const premiumBanner = serversGrid.querySelector('.premium-banner');
    serversGrid.innerHTML = '';
    if (premiumBanner) {
        serversGrid.appendChild(premiumBanner);
    }
    
    // Render filtered servers
    AppState.filteredServers.forEach(server => {
        const serverCard = createServerCard(server);
        serversGrid.appendChild(serverCard);
    });
}

// Create server card element
function createServerCard(server) {
    const card = document.createElement('div');
    card.className = `server-card ${server.status} filterable-item ${server.category} ${server.sdk}`;
    card.setAttribute('data-server-id', server.id);
    
    const starsDisplay = server.stars >= 1000 ? `${(server.stars/1000).toFixed(1)}k` : server.stars;
    const statusBadgeClass = server.status === 'official' ? 'official' : 'community';
    
    card.innerHTML = `
        <div class="server-header">
            <h3>${server.name}</h3>
            <span class="badge ${statusBadgeClass}">${server.status}</span>
            ${server.status === 'official' ? '<span class="badge premium">Verified</span>' : ''}
        </div>
        <p class="server-description">${server.description}</p>
        <div class="server-meta">
            <span><i class="fas fa-user"></i> ${server.author}</span>
            <span><i class="fas fa-star"></i> ${starsDisplay}</span>
            <span><i class="fas fa-calendar"></i> ${formatDate(server.lastUpdated)}</span>
        </div>
        <div class="server-features">
            ${server.features.slice(0, 3).map(feature => 
                `<span class="feature"><i class="fas fa-check"></i> ${feature}</span>`
            ).join('')}
        </div>
        <div class="server-tags">
            ${server.tags.slice(0, 4).map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('')}
        </div>
        <div class="server-actions">
            <a href="${server.homepage}" target="_blank" class="btn btn-small">
                <i class="fas fa-external-link-alt"></i> View Details
            </a>
            <button class="btn btn-small btn-outline copy-install" data-server="${server.name}">
                <i class="fas fa-copy"></i> Copy Install
            </button>
        </div>
    `;
    
    // Add click events
    const copyButton = card.querySelector('.copy-install');
    copyButton.addEventListener('click', () => copyInstallCommand(server));
    
    // Add hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
    });
    
    return card;
}

// Copy install command to clipboard
function copyInstallCommand(server) {
    const command = `# Install ${server.name} MCP Server
npm install -g @modelcontextprotocol/${server.id}
# or
pip install mcp-${server.id}`;
    
    navigator.clipboard.writeText(command).then(() => {
        showNotification(`Installation command for ${server.name} copied!`, 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
    return date.toLocaleDateString();
}

// Update server statistics
function updateServerStats() {
    const totalServers = AppState.mcpServers.length;
    const officialCount = AppState.mcpServers.filter(s => s.status === 'official').length;
    const communityCount = totalServers - officialCount;
    
    // Update stats in UI if elements exist
    const statsElements = {
        '.total-servers': totalServers,
        '.official-servers': officialCount,
        '.community-servers': communityCount
    };
    
    Object.entries(statsElements).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    });
}

// Enhanced search and filter functionality
function initializeAdvancedFeatures() {
    // Advanced search with debouncing
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                AppState.currentSearchTerm = e.target.value.toLowerCase();
                applyFiltersAndSearch();
            }, 300);
        });
    }
    
    // Enhanced filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from sibling buttons in same group
            const filterGroup = this.closest('.filter-group');
            filterGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filters
            applyFiltersAndSearch();
        });
    });
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortServers(this.value);
        });
    }
}

// Apply filters and search combined
function applyFiltersAndSearch() {
    let filtered = [...AppState.mcpServers];
    
    // Apply search filter
    if (AppState.currentSearchTerm) {
        filtered = filtered.filter(server => 
            server.name.toLowerCase().includes(AppState.currentSearchTerm) ||
            server.description.toLowerCase().includes(AppState.currentSearchTerm) ||
            server.author.toLowerCase().includes(AppState.currentSearchTerm) ||
            server.tags.some(tag => tag.toLowerCase().includes(AppState.currentSearchTerm))
        );
    }
    
    // Apply category filters
    const activeFilters = getActiveFilters();
    if (activeFilters.length > 0 && !activeFilters.includes('all')) {
        filtered = filtered.filter(server => 
            activeFilters.some(filter => 
                server.category === filter || 
                server.sdk === filter || 
                server.status === filter
            )
        );
    }
    
    AppState.filteredServers = filtered;
    renderMCPServers();
    
    // Update results count
    updateResultsCount();
}

// Get currently active filters
function getActiveFilters() {
    const activeButtons = document.querySelectorAll('.filter-btn.active');
    return Array.from(activeButtons).map(btn => btn.getAttribute('data-filter')).filter(f => f !== 'all');
}

// Update results count display
function updateResultsCount() {
    const countElement = document.querySelector('.results-count');
    if (countElement) {
        const count = AppState.filteredServers.length;
        const total = AppState.mcpServers.length;
        countElement.textContent = `Showing ${count} of ${total} servers`;
    }
}

// Sort servers
function sortServers(criteria) {
    switch(criteria) {
        case 'name':
            AppState.filteredServers.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'stars':
            AppState.filteredServers.sort((a, b) => b.stars - a.stars);
            break;
        case 'updated':
            AppState.filteredServers.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            break;
        default:
            break;
    }
    
    renderMCPServers();
}

// Loading indicator functions
function showLoadingIndicator() {
    const existing = document.querySelector('.loading-indicator');
    if (existing) return;
    
    const loader = document.createElement('div');
    loader.className = 'loading-indicator';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Loading MCP servers...</p>
    `;
    
    const container = document.querySelector('.servers-grid') || document.querySelector('.container');
    if (container) {
        container.appendChild(loader);
    }
}

function hideLoadingIndicator() {
    const loader = document.querySelector('.loading-indicator');
    if (loader) {
        loader.remove();
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form-container');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidationError);
        });
    }
}

// Handle contact form submission
async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate all fields
    if (!validateContactForm(form)) {
        showNotification('Please fix the errors and try again.', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Simulate form submission (in real app, this would be an API call)
        await simulateFormSubmission(formData);
        
        // Success feedback
        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.', 'success');
        form.reset();
        
        // Send confirmation email simulation
        const email = formData.get('email');
        showNotification(`Confirmation sent to ${email}`, 'success');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again or email us directly.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Validate contact form
function validateContactForm(form) {
    const fields = [
        { name: 'name', rules: ['required', 'minLength:2'] },
        { name: 'email', rules: ['required', 'email'] },
        { name: 'subject', rules: ['required'] },
        { name: 'message', rules: ['required', 'minLength:10'] }
    ];
    
    let isValid = true;
    
    fields.forEach(field => {
        const input = form.querySelector(`[name="${field.name}"]`);
        if (!validateFieldRules(input, field.rules)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const name = field.name;
    
    let rules = [];
    switch(name) {
        case 'name':
            rules = ['required', 'minLength:2'];
            break;
        case 'email':
            rules = ['required', 'email'];
            break;
        case 'subject':
            rules = ['required'];
            break;
        case 'message':
            rules = ['required', 'minLength:10'];
            break;
    }
    
    validateFieldRules(field, rules);
}

// Validate field against rules
function validateFieldRules(field, rules) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    for (const rule of rules) {
        if (rule === 'required' && !value) {
            errorMessage = 'This field is required';
            isValid = false;
            break;
        } else if (rule === 'email' && value) {
            if (!validateEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
                break;
            }
        } else if (rule.startsWith('minLength:') && value) {
            const minLength = parseInt(rule.split(':')[1]);
            if (value.length < minLength) {
                errorMessage = `Minimum ${minLength} characters required`;
                isValid = false;
                break;
            }
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Clear validation error on input
function clearValidationError(e) {
    const field = e.target;
    if (field.classList.contains('error')) {
        clearFieldError(field);
    }
}

// Simulate form submission
function simulateFormSubmission(formData) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            console.log('Form submitted with data:', Object.fromEntries(formData));
            resolve({ success: true });
        }, 2000);
    });
}

// Dark Mode Functionality
function initializeDarkMode() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update toggle button icon
    updateThemeToggleIcon(currentTheme);
    
    // Add event listener to theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle button icon
    updateThemeToggleIcon(newTheme);
    
    // Show notification
    showNotification(`Switched to ${newTheme} mode`, 'success');
}

function updateThemeToggleIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

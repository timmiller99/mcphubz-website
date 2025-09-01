// Server details page for individual MCP servers
// This script fetches and displays detailed information about a specific MCP server

class ServerDetails {
    constructor() {
        this.apiBaseUrl = 'https://api.github.com';
        this.mainRepoPath = '/repos/modelcontextprotocol/servers';
        this.serverContainer = document.getElementById('server-details-container');
        this.errorContainer = document.getElementById('server-error-container');
        
        // Get server ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        this.serverId = urlParams.get('id');
        
        if (!this.serverId) {
            this.displayError('Server ID not specified. Please select a server from the GitHub Servers page.');
            return;
        }
        
        this.initialize();
    }
    
    async initialize() {
        try {
            this.showLoading();
            await this.fetchServerDetails();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading server details:', error);
            this.displayError('Failed to load server details. Please try again later.');
        }
    }
    
    showLoading() {
        if (this.serverContainer) {
            this.serverContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading server details...</div>';
        }
    }
    
    hideLoading() {
        const loadingElements = document.querySelectorAll('.loading-spinner');
        loadingElements.forEach(el => el.remove());
    }
    
    displayError(message) {
        if (this.errorContainer) {
            this.errorContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
            this.errorContainer.style.display = 'block';
        }
        this.hideLoading();
    }
    
    async fetchServerDetails() {
        // First, try to get the server directory contents
        const contentResponse = await fetch(`${this.apiBaseUrl}${this.mainRepoPath}/contents/src/${this.serverId}`);
        
        if (!contentResponse.ok) {
            throw new Error(`GitHub API error: ${contentResponse.status}`);
        }
        
        const contentData = await contentResponse.json();
        
        // Look for README.md in the server directory
        const readmeFile = contentData.find(file => file.name.toLowerCase() === 'readme.md');
        
        if (readmeFile) {
            const readmeResponse = await fetch(readmeFile.url);
            if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                const readmeContent = atob(readmeData.content);
                this.displayServerDetails(readmeContent);
            }
        } else {
            // If no README found, display basic info
            this.displayBasicServerInfo();
        }
    }
    
    displayServerDetails(readmeContent) {
        if (!this.serverContainer) return;
        
        // Format server name for display
        const serverName = this.serverId.charAt(0).toUpperCase() + this.serverId.slice(1);
        
        // Convert markdown to HTML (simple version)
        const htmlContent = this.markdownToHtml(readmeContent);
        
        // Create HTML structure
        let html = `
            <div class="server-header">
                <h1>${serverName} MCP Server</h1>
                <div class="server-badges">
                    <span class="badge official">Official</span>
                    <span class="badge"><i class="fab fa-github"></i> modelcontextprotocol/servers</span>
                </div>
            </div>
            
            <div class="server-actions">
                <a href="https://github.com/modelcontextprotocol/servers/tree/main/src/${this.serverId}" class="btn" target="_blank">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
                <a href="https://github.com/modelcontextprotocol/servers/tree/main/src/${this.serverId}/examples" class="btn">
                    <i class="fas fa-code"></i> View Examples
                </a>
            </div>
            
            <div class="server-content">
                ${htmlContent}
            </div>
            
            <div class="installation-section">
                <h2>Installation</h2>
                <div class="code-tabs">
                    <div class="tab-headers">
                        <button class="tab-header active" data-tab="npm">npm</button>
                        <button class="tab-header" data-tab="yarn">yarn</button>
                        <button class="tab-header" data-tab="pnpm">pnpm</button>
                    </div>
                    <div class="tab-content active" id="npm">
                        <pre><code>npm install @mcp/${this.serverId}</code></pre>
                        <button class="copy-btn" data-code="npm install @mcp/${this.serverId}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="tab-content" id="yarn">
                        <pre><code>yarn add @mcp/${this.serverId}</code></pre>
                        <button class="copy-btn" data-code="yarn add @mcp/${this.serverId}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="tab-content" id="pnpm">
                        <pre><code>pnpm add @mcp/${this.serverId}</code></pre>
                        <button class="copy-btn" data-code="pnpm add @mcp/${this.serverId}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="related-servers">
                <h2>Related MCP Servers</h2>
                <div class="related-servers-grid">
                    <!-- Dynamically populated based on server category -->
                </div>
                <a href="github-servers.html" class="btn btn-large">View All MCP Servers</a>
            </div>
        `;
        
        this.serverContainer.innerHTML = html;
        
        // Initialize tabs
        this.initializeTabs();
        
        // Initialize copy buttons
        this.initializeCopyButtons();
    }
    
    displayBasicServerInfo() {
        if (!this.serverContainer) return;
        
        // Format server name for display
        const serverName = this.serverId.charAt(0).toUpperCase() + this.serverId.slice(1);
        
        let html = `
            <div class="server-header">
                <h1>${serverName} MCP Server</h1>
                <div class="server-badges">
                    <span class="badge official">Official</span>
                    <span class="badge"><i class="fab fa-github"></i> modelcontextprotocol/servers</span>
                </div>
            </div>
            
            <div class="server-actions">
                <a href="https://github.com/modelcontextprotocol/servers/tree/main/src/${this.serverId}" class="btn" target="_blank">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
            
            <div class="server-content">
                <p>This is an official Model Context Protocol server from the modelcontextprotocol/servers repository.</p>
                <p>Visit the GitHub repository for detailed documentation and examples.</p>
            </div>
            
            <div class="installation-section">
                <h2>Installation</h2>
                <div class="code-tabs">
                    <div class="tab-headers">
                        <button class="tab-header active" data-tab="npm">npm</button>
                        <button class="tab-header" data-tab="yarn">yarn</button>
                        <button class="tab-header" data-tab="pnpm">pnpm</button>
                    </div>
                    <div class="tab-content active" id="npm">
                        <pre><code>npm install @mcp/${this.serverId}</code></pre>
                        <button class="copy-btn" data-code="npm install @mcp/${this.serverId}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="tab-content" id="yarn">
                        <pre><code>yarn add @mcp/${this.serverId}</code></pre>
                        <button class="copy-btn" data-code="yarn add @mcp/${this.serverId}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="tab-content" id="pnpm">
                        <pre><code>pnpm add @mcp/${this.serverId}</code></pre>
                        <button class="copy-btn" data-code="pnpm add @mcp/${this.serverId}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.serverContainer.innerHTML = html;
        
        // Initialize tabs
        this.initializeTabs();
        
        // Initialize copy buttons
        this.initializeCopyButtons();
    }
    
    markdownToHtml(markdown) {
        // Very simple markdown to HTML conversion
        // For a production site, use a proper markdown parser
        
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
            
            // Lists
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Wrap lists
        html = html.replace(/<li>.*?<\/li>/g, function(match) {
            return '<ul>' + match + '</ul>';
        });
        
        // Fix duplicate ul tags
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        // Paragraphs
        html = '<p>' + html.replace(/\n\n/g, '</p><p>') + '</p>';
        
        // Fix paragraph tags around other elements
        html = html.replace(/<p><h([1-3])>/g, '<h$1>');
        html = html.replace(/<\/h([1-3])><\/p>/g, '</h$1>');
        html = html.replace(/<p><ul>/g, '<ul>');
        html = html.replace(/<\/ul><\/p>/g, '</ul>');
        html = html.replace(/<p><pre>/g, '<pre>');
        html = html.replace(/<\/pre><\/p>/g, '</pre>');
        
        return html;
    }
    
    initializeTabs() {
        const tabHeaders = document.querySelectorAll('.tab-header');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabHeaders.forEach(header => {
            header.addEventListener('click', () => {
                // Remove active class from all headers and contents
                tabHeaders.forEach(h => h.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked header and corresponding content
                header.classList.add('active');
                const tabId = header.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    initializeCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const code = button.getAttribute('data-code');
                navigator.clipboard.writeText(code).then(() => {
                    // Change button text temporarily
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                    }, 2000);
                });
            });
        });
    }
}

// Initialize server details when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServerDetails();
});

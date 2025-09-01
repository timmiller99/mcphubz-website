// GitHub Integration for MCP Servers
// This script automatically fetches and displays MCP servers from GitHub

class GitHubIntegration {
    constructor() {
        this.apiBaseUrl = 'https://api.github.com';
        this.mainRepoPath = '/repos/modelcontextprotocol/servers';
        this.serversContainer = document.getElementById('github-servers-container');
        this.officialIntegrationsContainer = document.getElementById('official-integrations-container');
        this.lastUpdatedElement = document.getElementById('last-updated');
        this.errorContainer = document.getElementById('github-error-container');
    }

    async initialize() {
        try {
            this.showLoading();
            await this.fetchRepositoryData();
            await this.fetchReadmeContent();
            this.parseAndDisplayServers();
            this.updateLastUpdated();
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing GitHub integration:', error);
            this.displayError('Failed to load MCP servers from GitHub. Please try again later.');
        }
    }

    showLoading() {
        if (this.serversContainer) {
            this.serversContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading MCP servers from GitHub...</div>';
        }
        if (this.officialIntegrationsContainer) {
            this.officialIntegrationsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading official integrations...</div>';
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

    async fetchRepositoryData() {
        const response = await fetch(`${this.apiBaseUrl}${this.mainRepoPath}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        this.repoData = await response.json();
    }

    async fetchReadmeContent() {
        const response = await fetch(`${this.apiBaseUrl}${this.mainRepoPath}/readme`);
        if (!response.ok) {
            throw new Error(`GitHub README fetch error: ${response.status}`);
        }
        const data = await response.json();
        
        // Decode base64 content
        this.readmeContent = atob(data.content);
    }

    parseAndDisplayServers() {
        // Extract core MCP servers from README
        const coreServersMatch = this.readmeContent.match(/\*\*\[(.*?)\]\(\)\*\* - (.*?)$/gm);
        const coreServers = coreServersMatch ? coreServersMatch.map(server => {
            const nameMatch = server.match(/\*\*\[(.*?)\]/);
            const descMatch = server.match(/\*\* - (.*?)$/);
            return {
                name: nameMatch ? nameMatch[1] : '',
                description: descMatch ? descMatch[1] : ''
            };
        }) : [];

        // Extract official integrations from README
        const officialIntegrationsMatch = this.readmeContent.match(/\[\]\(\) \*\*\[(.*?)\]\(\)\*\* - (.*?)$/gm);
        const officialIntegrations = officialIntegrationsMatch ? officialIntegrationsMatch.map(integration => {
            const nameMatch = integration.match(/\*\*\[(.*?)\]/);
            const descMatch = integration.match(/\*\* - (.*?)$/);
            return {
                name: nameMatch ? nameMatch[1] : '',
                description: descMatch ? descMatch[1] : ''
            };
        }) : [];

        this.displayCoreServers(coreServers);
        this.displayOfficialIntegrations(officialIntegrations);
    }

    displayCoreServers(servers) {
        if (!this.serversContainer) return;

        if (servers.length === 0) {
            this.serversContainer.innerHTML = '<p>No MCP servers found.</p>';
            return;
        }

        let html = '<div class="servers-grid">';
        
        servers.forEach(server => {
            html += `
                <div class="server-card filterable-item">
                    <div class="server-header">
                        <h3>${server.name}</h3>
                        <span class="badge official">Official</span>
                    </div>
                    <p>${server.description}</p>
                    <div class="server-meta">
                        <span><i class="fab fa-github"></i> modelcontextprotocol/servers</span>
                    </div>
                    <div class="server-actions">
                        <a href="https://github.com/modelcontextprotocol/servers/tree/main/src/${server.name.toLowerCase()}" class="btn btn-small" target="_blank">View on GitHub</a>
                        <a href="server-details.html?id=${server.name.toLowerCase()}" class="btn">View Details</a>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        this.serversContainer.innerHTML = html;
    }

    displayOfficialIntegrations(integrations) {
        if (!this.officialIntegrationsContainer) return;

        if (integrations.length === 0) {
            this.officialIntegrationsContainer.innerHTML = '<p>No official integrations found.</p>';
            return;
        }

        let html = '<div class="servers-grid">';
        
        // Display first 6 integrations
        integrations.slice(0, 6).forEach(integration => {
            html += `
                <div class="server-card filterable-item">
                    <div class="server-header">
                        <h3>${integration.name}</h3>
                        <span class="badge integration">Integration</span>
                    </div>
                    <p>${integration.description}</p>
                    <div class="server-meta">
                        <span><i class="fab fa-github"></i> Official Integration</span>
                    </div>
                    <a href="integration-details.html?id=${integration.name.toLowerCase().replace(/\s+/g, '-')}" class="btn">View Details</a>
                </div>
            `;
        });
        
        html += '</div>';
        
        if (integrations.length > 6) {
            html += `
                <div class="view-more-container">
                    <a href="integrations.html" class="btn btn-large">View All ${integrations.length} Integrations</a>
                </div>
            `;
        }
        
        this.officialIntegrationsContainer.innerHTML = html;
    }

    updateLastUpdated() {
        if (this.lastUpdatedElement && this.repoData) {
            const lastUpdated = new Date(this.repoData.updated_at);
            this.lastUpdatedElement.textContent = `Last updated: ${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`;
        }
    }
}

// Initialize GitHub integration when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const githubIntegration = new GitHubIntegration();
    githubIntegration.initialize();
});

// Community MCP Servers Integration
// This script fetches and displays community MCP servers

class CommunityServersIntegration {
    constructor() {
        this.communityServersContainer = document.getElementById('community-servers-container');
        this.errorContainer = document.getElementById('community-error-container');
        this.communityServers = [
            // Databases
            {
                name: "MySQL",
                description: "MySQL database integration with configurable access controls and schema inspection",
                category: "Databases",
                author: "Multiple implementations",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "MSSQL",
                description: "MSSQL database integration with configurable access controls and schema inspection",
                category: "Databases",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "BigQuery",
                description: "Google BigQuery integration for database access and querying capabilities",
                category: "Databases",
                author: "Multiple implementations",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Snowflake",
                description: "Interact with Snowflake databases, allowing for secure and controlled data operations",
                category: "Databases",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Pinecone",
                description: "Search and upload records to Pinecone with simple RAG features",
                category: "Databases",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            
            // Development & DevOps
            {
                name: "Docker",
                description: "Manage Docker containers, images, volumes, and networks",
                category: "DevOps",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Kubernetes",
                description: "Connect to Kubernetes cluster and manage pods, deployments, and services",
                category: "DevOps",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "AWS",
                description: "Perform operations on your AWS resources using an LLM",
                category: "DevOps",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Windows CLI",
                description: "Secure command-line interactions on Windows systems",
                category: "Development",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "OpenAPI",
                description: "Interact with OpenAPI APIs",
                category: "Development",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "OpenRPC",
                description: "Interact with and discover JSON-RPC APIs",
                category: "Development",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            
            // Productivity & Tools
            {
                name: "Todoist",
                description: "Interact with Todoist to manage your tasks",
                category: "Productivity",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Linear",
                description: "Project management with Linear's API for searching, creating, and updating issues",
                category: "Productivity",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Spotify",
                description: "Allow an LLM to play and use Spotify",
                category: "Entertainment",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "X (Twitter)",
                description: "Create, manage and publish X/Twitter posts directly through LLM chat",
                category: "Social Media",
                author: "Multiple implementations",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Obsidian Markdown Notes",
                description: "Read and search through your Obsidian vault or any directory containing Markdown notes",
                category: "Productivity",
                author: "Official Integration",
                url: "https://github.com/docker/mcp-servers#%EF%B8%8F-official-integrations"
            },
            {
                name: "XMind",
                description: "Read and search through your XMind directory containing XMind files",
                category: "Productivity",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            
            // Web & Search
            {
                name: "Tavily search",
                description: "MCP server for Tavily's search & news API, with explicit site inclusions/exclusions",
                category: "Search",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Playwright",
                description: "Browser automation and webscraping using Playwright",
                category: "Web",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "FireCrawl",
                description: "Advanced web scraping with JavaScript rendering, PDF support, and smart rate limiting",
                category: "Web",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "RAG Web Browser",
                description: "Web searches, URL scraping, and content retrieval in Markdown format",
                category: "Web",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            
            // Data & Analytics
            {
                name: "AlphaVantage",
                description: "MCP server for stock market data API",
                category: "Finance",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Vega-Lite",
                description: "Generate visualizations from fetched data using the VegaLite format and renderer",
                category: "Visualization",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "FlightRadar24",
                description: "Track flights in real-time using Flightradar24 data",
                category: "Travel",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "NS Travel Information",
                description: "Access Dutch Railways (NS) real-time train travel information and disruptions",
                category: "Travel",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            
            // AI & Utilities
            {
                name: "HuggingFace Spaces",
                description: "Server for using HuggingFace Spaces, supporting Open Source Image, Audio, Text Models",
                category: "AI",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "ChatSum",
                description: "Query and Summarize chat messages with LLM",
                category: "Communication",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Rememberizer AI",
                description: "Enhanced knowledge retrieval for LLMs",
                category: "AI",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Any Chat Completions",
                description: "Interact with any OpenAI SDK Compatible Chat Completions API",
                category: "AI",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "Pandoc",
                description: "Document format conversion using Pandoc",
                category: "Utilities",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            },
            {
                name: "MCP Installer",
                description: "A server that installs other MCP servers",
                category: "Utilities",
                author: "Community",
                url: "https://github.com/docker/mcp-servers#community-servers"
            }
        ];
    }
    
    initialize() {
        try {
            this.displayCommunityServers();
        } catch (error) {
            console.error('Error initializing community servers:', error);
            this.displayError('Failed to load community MCP servers. Please try again later.');
        }
    }
    
    displayError(message) {
        if (this.errorContainer) {
            this.errorContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
            this.errorContainer.style.display = 'block';
        }
    }
    
    displayCommunityServers() {
        if (!this.communityServersContainer) return;
        
        // Group servers by category
        const serversByCategory = this.groupServersByCategory();
        
        let html = '';
        
        // Create a section for each category
        for (const [category, servers] of Object.entries(serversByCategory)) {
            html += `
                <div class="server-category">
                    <h3>${category}</h3>
                    <div class="servers-grid">
            `;
            
            // Add servers in this category
            servers.forEach(server => {
                html += `
                    <div class="server-card filterable-item">
                        <div class="server-header">
                            <h3>${server.name}</h3>
                            <span class="badge community">Community</span>
                        </div>
                        <p>${server.description}</p>
                        <div class="server-meta">
                            <span><i class="fas fa-user"></i> ${server.author}</span>
                        </div>
                        <a href="${server.url}" class="btn" target="_blank">View Details</a>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        this.communityServersContainer.innerHTML = html;
    }
    
    groupServersByCategory() {
        const serversByCategory = {};
        
        this.communityServers.forEach(server => {
            if (!serversByCategory[server.category]) {
                serversByCategory[server.category] = [];
            }
            serversByCategory[server.category].push(server);
        });
        
        return serversByCategory;
    }
}

// Initialize community servers integration when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const communityServersIntegration = new CommunityServersIntegration();
    communityServersIntegration.initialize();
});

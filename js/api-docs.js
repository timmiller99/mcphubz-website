// API Documentation Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeAPIDocumentation();
});

function initializeAPIDocumentation() {
    initializeTabs();
    initializeCodeExamples();
    initializeInteractiveExamples();
    initializeAPIKeyGenerator();
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Code example functionality
function initializeCodeExamples() {
    const codeBlocks = document.querySelectorAll('.code-example');
    
    codeBlocks.forEach(block => {
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyButton.addEventListener('click', () => copyCodeToClipboard(block));
        
        // Add syntax highlighting
        highlightCode(block);
        
        // Add copy button to code block
        const codeContainer = block.parentNode;
        codeContainer.style.position = 'relative';
        codeContainer.appendChild(copyButton);
    });
}

// Interactive API examples
function initializeInteractiveExamples() {
    const tryButtons = document.querySelectorAll('.try-api-btn');
    
    tryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const endpoint = this.getAttribute('data-endpoint');
            const method = this.getAttribute('data-method') || 'GET';
            executeAPICall(endpoint, method, this);
        });
    });
}

// API Key Generator
function initializeAPIKeyGenerator() {
    const generateButton = document.querySelector('.generate-api-key');
    if (generateButton) {
        generateButton.addEventListener('click', generateDemoAPIKey);
    }
}

// Copy code to clipboard
function copyCodeToClipboard(codeBlock) {
    const code = codeBlock.textContent;
    navigator.clipboard.writeText(code).then(() => {
        // Show success feedback
        const copyButton = codeBlock.parentNode.querySelector('.copy-code-btn');
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(() => {
            copyButton.innerHTML = originalText;
            copyButton.classList.remove('copied');
        }, 2000);
    });
}

// Basic syntax highlighting
function highlightCode(codeBlock) {
    let code = codeBlock.innerHTML;
    
    // Highlight JSON keys
    code = code.replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>');
    
    // Highlight strings
    code = code.replace(/"([^"]+)"/g, '<span class="json-string">"$1"</span>');
    
    // Highlight numbers
    code = code.replace(/:\s*(\d+)/g, ': <span class="json-number">$1</span>');
    
    // Highlight HTTP methods
    code = code.replace(/(GET|POST|PUT|DELETE|PATCH)/g, '<span class="http-method">$1</span>');
    
    // Highlight URLs
    code = code.replace(/(https?:\/\/[^\s]+)/g, '<span class="url">$1</span>');
    
    codeBlock.innerHTML = code;
}

// Execute API call for demonstration
async function executeAPICall(endpoint, method, button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    try {
        // Simulate API call with demo data
        const response = await simulateAPICall(endpoint, method);
        displayAPIResponse(response, button);
        
    } catch (error) {
        displayAPIError(error, button);
    } finally {
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
    }
}

// Simulate API responses
async function simulateAPICall(endpoint, method) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
        '/api/v1/servers': {
            status: 200,
            data: {
                servers: [
                    {
                        id: 'filesystem',
                        name: 'Filesystem',
                        description: 'Secure file operations and directory browsing',
                        category: 'data-access',
                        sdk: 'typescript',
                        status: 'official',
                        stars: 1240,
                        author: 'Anthropic',
                        lastUpdated: '2024-09-08T10:30:00Z',
                        homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem'
                    },
                    {
                        id: 'sqlite',
                        name: 'SQLite',
                        description: 'Database operations and SQL query execution',
                        category: 'data-access',
                        sdk: 'python',
                        status: 'official',
                        stars: 890,
                        author: 'Anthropic',
                        lastUpdated: '2024-09-06T15:45:00Z',
                        homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite'
                    }
                ],
                total: 15,
                page: 1,
                limit: 10
            }
        },
        '/api/v1/servers/search': {
            status: 200,
            data: {
                servers: [
                    {
                        id: 'github',
                        name: 'GitHub',
                        description: 'Repository management and code analysis',
                        category: 'tool-integration',
                        sdk: 'typescript',
                        status: 'official',
                        stars: 1456,
                        relevanceScore: 0.95
                    }
                ],
                query: 'github',
                total: 1,
                processingTime: 23
            }
        },
        '/api/v1/servers/filesystem': {
            status: 200,
            data: {
                id: 'filesystem',
                name: 'Filesystem',
                description: 'Secure file operations and directory browsing with advanced access controls',
                longDescription: 'The Filesystem MCP server provides secure access to file operations...',
                category: 'data-access',
                sdk: 'typescript',
                status: 'official',
                stars: 1240,
                forks: 89,
                author: 'Anthropic',
                homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
                documentation: 'https://docs.mcphubz.com/servers/filesystem',
                installation: {
                    npm: 'npm install @modelcontextprotocol/filesystem',
                    pip: 'pip install mcp-filesystem'
                },
                features: [
                    'File reading and writing',
                    'Directory listing',
                    'Secure path validation',
                    'Permission checking'
                ],
                lastUpdated: '2024-09-08T10:30:00Z',
                createdAt: '2024-08-15T09:00:00Z'
            }
        },
        '/api/v1/analytics/popular': {
            status: 200,
            data: {
                topServers: [
                    { id: 'github', name: 'GitHub', downloads: 15240, trend: '+12%' },
                    { id: 'filesystem', name: 'Filesystem', downloads: 12890, trend: '+8%' },
                    { id: 'sqlite', name: 'SQLite', downloads: 9670, trend: '+5%' }
                ],
                totalDownloads: 127850,
                period: '30 days'
            }
        }
    };
    
    return responses[endpoint] || { status: 404, error: 'Endpoint not found' };
}

// Display API response
function displayAPIResponse(response, button) {
    // Find or create response container
    let responseContainer = button.parentNode.querySelector('.api-response');
    if (!responseContainer) {
        responseContainer = document.createElement('div');
        responseContainer.className = 'api-response';
        button.parentNode.appendChild(responseContainer);
    }
    
    const statusClass = response.status === 200 ? 'success' : 'error';
    
    responseContainer.innerHTML = `
        <div class="response-header ${statusClass}">
            <span class="status-code">HTTP ${response.status}</span>
            <span class="response-time">~1.5s</span>
        </div>
        <pre class="response-body"><code>${JSON.stringify(response.data || response, null, 2)}</code></pre>
    `;
    
    responseContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display API error
function displayAPIError(error, button) {
    let responseContainer = button.parentNode.querySelector('.api-response');
    if (!responseContainer) {
        responseContainer = document.createElement('div');
        responseContainer.className = 'api-response';
        button.parentNode.appendChild(responseContainer);
    }
    
    responseContainer.innerHTML = `
        <div class="response-header error">
            <span class="status-code">HTTP 500</span>
            <span class="response-time">Error</span>
        </div>
        <pre class="response-body error"><code>${JSON.stringify({ error: error.message }, null, 2)}</code></pre>
    `;
}

// Generate demo API key
function generateDemoAPIKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = 'mcp_';
    
    for (let i = 0; i < 32; i++) {
        apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const keyDisplay = document.querySelector('.api-key-display');
    if (keyDisplay) {
        keyDisplay.textContent = apiKey;
        keyDisplay.style.display = 'block';
        
        // Add copy functionality
        const copyKeyButton = document.querySelector('.copy-api-key');
        if (copyKeyButton) {
            copyKeyButton.style.display = 'inline-block';
            copyKeyButton.onclick = () => {
                navigator.clipboard.writeText(apiKey);
                copyKeyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyKeyButton.textContent = 'Copy Key';
                }, 2000);
            };
        }
    }
    
    // Show success message
    if (typeof showNotification === 'function') {
        showNotification('Demo API key generated! Note: This is for demonstration only.', 'success');
    }
}

// Language selector for code examples
function switchCodeLanguage(language, exampleId) {
    const codeExamples = document.querySelectorAll(`#${exampleId} .code-example`);
    const languageButtons = document.querySelectorAll(`#${exampleId} .language-btn`);
    
    // Hide all code examples
    codeExamples.forEach(example => example.style.display = 'none');
    
    // Remove active class from all buttons
    languageButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected language example
    const selectedExample = document.querySelector(`#${exampleId} .code-example[data-language="${language}"]`);
    if (selectedExample) {
        selectedExample.style.display = 'block';
    }
    
    // Add active class to selected button
    const selectedButton = document.querySelector(`#${exampleId} .language-btn[data-language="${language}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}
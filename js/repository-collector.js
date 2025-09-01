// Repository Collection System for MCP Hub
// This script automatically finds new MCP protocols on GitHub and updates the website

const GITHUB_API_BASE = 'https://api.github.com';
const SEARCH_TERMS = ['mcp-server', 'model-context-protocol', 'mcp server'];
const KNOWN_REPOSITORIES = [
  'modelcontextprotocol/servers',
  'wong2/awesome-mcp-servers',
  'topoteretes/mcp_servers',
  'browserbase/browserbase-servers'
];

// Configuration for GitHub API requests
const GITHUB_CONFIG = {
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'MCP-Hub-Collector'
  },
  // Add your GitHub token here if needed for higher rate limits
  // auth: 'YOUR_GITHUB_TOKEN'
};

// Main function to collect repositories
async function collectRepositories() {
  console.log('Starting MCP repository collection...');
  
  const repositories = [];
  
  // First, collect from known repositories
  await collectFromKnownRepositories(repositories);
  
  // Then search for new repositories
  await searchForNewRepositories(repositories);
  
  // Process and deduplicate repositories
  const processedRepos = processRepositories(repositories);
  
  // Save to data file
  saveRepositories(processedRepos);
  
  console.log(`Repository collection complete. Found ${processedRepos.length} repositories.`);
  
  return processedRepos;
}

// Collect repositories from known sources
async function collectFromKnownRepositories(repositories) {
  console.log('Collecting from known repositories...');
  
  for (const repo of KNOWN_REPOSITORIES) {
    try {
      const [owner, name] = repo.split('/');
      
      // Get repository details
      const repoDetails = await fetchRepositoryDetails(owner, name);
      repositories.push(repoDetails);
      
      // If this is a collection repository, extract referenced repositories
      if (name.includes('servers') || name.includes('awesome')) {
        await extractReferencedRepositories(owner, name, repositories);
      }
      
    } catch (error) {
      console.error(`Error collecting from ${repo}:`, error.message);
    }
  }
}

// Search for new repositories using GitHub search API
async function searchForNewRepositories(repositories) {
  console.log('Searching for new repositories...');
  
  for (const term of SEARCH_TERMS) {
    try {
      const searchResults = await fetch(
        `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(term)}+in:name,description,readme&sort=stars&order=desc`,
        GITHUB_CONFIG
      ).then(res => res.json());
      
      if (searchResults.items) {
        for (const item of searchResults.items) {
          repositories.push({
            owner: item.owner.login,
            name: item.name,
            fullName: item.full_name,
            description: item.description,
            url: item.html_url,
            stars: item.stargazers_count,
            forks: item.forks_count,
            updatedAt: item.updated_at,
            language: item.language
          });
        }
      }
    } catch (error) {
      console.error(`Error searching for "${term}":`, error.message);
    }
  }
}

// Extract repositories referenced in collection repositories
async function extractReferencedRepositories(owner, name, repositories) {
  try {
    // Get README content
    const readmeResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${name}/readme`,
      GITHUB_CONFIG
    ).then(res => res.json());
    
    if (readmeResponse.content) {
      // Decode content from base64
      const content = atob(readmeResponse.content);
      
      // Extract GitHub repository URLs using regex
      const repoRegex = /github\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-_]+)/g;
      let match;
      
      while ((match = repoRegex.exec(content)) !== null) {
        const extractedOwner = match[1];
        const extractedName = match[2];
        
        // Skip if this is one of the known repositories
        if (KNOWN_REPOSITORIES.includes(`${extractedOwner}/${extractedName}`)) {
          continue;
        }
        
        // Get repository details
        try {
          const repoDetails = await fetchRepositoryDetails(extractedOwner, extractedName);
          repositories.push(repoDetails);
        } catch (error) {
          console.error(`Error fetching details for ${extractedOwner}/${extractedName}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error(`Error extracting references from ${owner}/${name}:`, error.message);
  }
}

// Fetch repository details from GitHub API
async function fetchRepositoryDetails(owner, name) {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${name}`,
    GITHUB_CONFIG
  ).then(res => res.json());
  
  return {
    owner: owner,
    name: name,
    fullName: response.full_name,
    description: response.description,
    url: response.html_url,
    stars: response.stargazers_count,
    forks: response.forks_count,
    updatedAt: response.updated_at,
    language: response.language
  };
}

// Process and deduplicate repositories
function processRepositories(repositories) {
  // Remove duplicates based on fullName
  const uniqueRepos = [];
  const repoMap = new Map();
  
  for (const repo of repositories) {
    if (!repoMap.has(repo.fullName)) {
      repoMap.set(repo.fullName, true);
      uniqueRepos.push(repo);
    }
  }
  
  // Sort by stars (descending)
  uniqueRepos.sort((a, b) => b.stars - a.stars);
  
  return uniqueRepos;
}

// Save repositories to data file
function saveRepositories(repositories) {
  // In a browser environment, we would use localStorage or IndexedDB
  // For this example, we'll create a global variable
  window.mcpRepositories = repositories;
  
  // Save to localStorage for persistence
  localStorage.setItem('mcpRepositories', JSON.stringify(repositories));
  
  console.log(`Saved ${repositories.length} repositories to storage.`);
}

// Function to categorize repositories
function categorizeRepositories(repositories) {
  const categories = {
    'data-access': [],
    'search': [],
    'content-processing': [],
    'tool-integration': [],
    'memory-systems': [],
    'other': []
  };
  
  for (const repo of repositories) {
    // Categorize based on keywords in name and description
    const nameAndDesc = (repo.name + ' ' + (repo.description || '')).toLowerCase();
    
    if (nameAndDesc.includes('database') || nameAndDesc.includes('file') || 
        nameAndDesc.includes('storage') || nameAndDesc.includes('drive')) {
      categories['data-access'].push(repo);
    } else if (nameAndDesc.includes('search') || nameAndDesc.includes('find') || 
               nameAndDesc.includes('query')) {
      categories['search'].push(repo);
    } else if (nameAndDesc.includes('content') || nameAndDesc.includes('fetch') || 
               nameAndDesc.includes('scrape') || nameAndDesc.includes('puppeteer')) {
      categories['content-processing'].push(repo);
    } else if (nameAndDesc.includes('github') || nameAndDesc.includes('slack') || 
               nameAndDesc.includes('integration') || nameAndDesc.includes('api')) {
      categories['tool-integration'].push(repo);
    } else if (nameAndDesc.includes('memory') || nameAndDesc.includes('graph') || 
               nameAndDesc.includes('knowledge')) {
      categories['memory-systems'].push(repo);
    } else {
      categories['other'].push(repo);
    }
  }
  
  return categories;
}

// Function to update the website with repository data
function updateWebsiteWithRepositories() {
  // Load repositories from storage
  const repoData = localStorage.getItem('mcpRepositories');
  if (!repoData) {
    console.error('No repository data found in storage.');
    return;
  }
  
  const repositories = JSON.parse(repoData);
  const categories = categorizeRepositories(repositories);
  
  // Update directory listing
  updateDirectoryListing(repositories, categories);
  
  // Update featured servers on homepage
  updateFeaturedServers(repositories);
  
  console.log('Website updated with repository data.');
}

// Update directory listing page
function updateDirectoryListing(repositories, categories) {
  const directoryElement = document.getElementById('directory-listing');
  if (!directoryElement) return;
  
  // Clear existing content
  directoryElement.innerHTML = '';
  
  // Add repositories to the directory
  for (const repo of repositories) {
    const category = getCategoryForRepo(repo, categories);
    const sdk = getSDKForRepo(repo);
    
    const serverCard = document.createElement('div');
    serverCard.className = 'server-card';
    serverCard.dataset.category = category;
    serverCard.dataset.sdk = sdk;
    
    serverCard.innerHTML = `
      <div class="server-header">
        <h3>${repo.name}</h3>
        <span class="badge ${isOfficialRepo(repo) ? 'official' : 'community'}">${isOfficialRepo(repo) ? 'Official' : 'Community'}</span>
      </div>
      <p>${repo.description || 'No description available.'}</p>
      <div class="server-meta">
        <span><i class="fab fa-github"></i> ${repo.fullName}</span>
        <span><i class="fab fa-${getLanguageIcon(repo.language)}"></i> ${repo.language || 'Unknown'}</span>
        <span><i class="fas fa-star"></i> ${repo.stars} stars</span>
        <span><i class="fas fa-code-branch"></i> ${repo.forks} forks</span>
      </div>
      <a href="server.html?id=${encodeURIComponent(repo.fullName)}" class="btn">View Details</a>
    `;
    
    directoryElement.appendChild(serverCard);
  }
}

// Update featured servers on homepage
function updateFeaturedServers(repositories) {
  const featuredElement = document.querySelector('.server-grid');
  if (!featuredElement) return;
  
  // Clear existing content
  featuredElement.innerHTML = '';
  
  // Add top 4 repositories to featured section
  const featuredRepos = repositories.slice(0, 4);
  
  for (const repo of featuredRepos) {
    const serverCard = document.createElement('div');
    serverCard.className = 'server-card';
    
    serverCard.innerHTML = `
      <div class="server-header">
        <h3>${repo.name}</h3>
        <span class="badge ${isOfficialRepo(repo) ? 'official' : 'community'}">${isOfficialRepo(repo) ? 'Official' : 'Community'}</span>
      </div>
      <p>${repo.description || 'No description available.'}</p>
      <div class="server-meta">
        <span><i class="fab fa-github"></i> ${repo.fullName}</span>
        <span><i class="fab fa-${getLanguageIcon(repo.language)}"></i> ${repo.language || 'Unknown'}</span>
      </div>
      <a href="server.html?id=${encodeURIComponent(repo.fullName)}" class="btn">View Details</a>
    `;
    
    featuredElement.appendChild(serverCard);
  }
}

// Helper function to determine if a repository is official
function isOfficialRepo(repo) {
  return repo.owner === 'modelcontextprotocol';
}

// Helper function to get category for a repository
function getCategoryForRepo(repo, categories) {
  for (const [category, repos] of Object.entries(categories)) {
    if (repos.includes(repo)) {
      return category;
    }
  }
  return 'other';
}

// Helper function to guess SDK for a repository
function getSDKForRepo(repo) {
  const language = repo.language ? repo.language.toLowerCase() : '';
  
  if (language === 'typescript' || language === 'javascript') {
    return 'typescript';
  } else if (language === 'python') {
    return 'python';
  } else if (language === 'java') {
    return 'java';
  } else if (language === 'kotlin') {
    return 'kotlin';
  } else {
    return 'other';
  }
}

// Helper function to get icon for language
function getLanguageIcon(language) {
  if (!language) return 'code';
  
  const lang = language.toLowerCase();
  
  if (lang === 'typescript' || lang === 'javascript') {
    return 'js';
  } else if (lang === 'python') {
    return 'python';
  } else if (lang === 'java') {
    return 'java';
  } else {
    return 'code';
  }
}

// Initialize the repository collection system
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing repository collection system...');
  
  // Check if we need to refresh the data
  const lastUpdate = localStorage.getItem('mcpLastUpdate');
  const now = new Date().getTime();
  
  // Refresh data if it's older than 24 hours or doesn't exist
  if (!lastUpdate || (now - parseInt(lastUpdate)) > 24 * 60 * 60 * 1000) {
    collectRepositories().then(() => {
      localStorage.setItem('mcpLastUpdate', now.toString());
      updateWebsiteWithRepositories();
    });
  } else {
    // Use existing data
    updateWebsiteWithRepositories();
  }
  
  // Add refresh button functionality
  const refreshButton = document.getElementById('refresh-repos');
  if (refreshButton) {
    refreshButton.addEventListener('click', function() {
      this.disabled = true;
      this.textContent = 'Refreshing...';
      
      collectRepositories().then(() => {
        localStorage.setItem('mcpLastUpdate', new Date().getTime().toString());
        updateWebsiteWithRepositories();
        
        this.disabled = false;
        this.textContent = 'Refresh Repositories';
      });
    });
  }
});

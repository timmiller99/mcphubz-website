// Update index.html to include links to GitHub and Community servers
document.addEventListener('DOMContentLoaded', () => {
    // Add GitHub and Community servers links to the navigation menu
    const navMenus = document.querySelectorAll('nav ul');
    
    navMenus.forEach(menu => {
        // Find the position to insert the new links (before About link)
        const aboutLi = Array.from(menu.querySelectorAll('li')).find(li => 
            li.querySelector('a') && li.querySelector('a').textContent.trim() === 'About');
        
        if (aboutLi) {
            // Create GitHub Servers link
            const githubLi = document.createElement('li');
            const githubLink = document.createElement('a');
            githubLink.href = 'github-servers.html';
            githubLink.textContent = 'GitHub Servers';
            githubLi.appendChild(githubLink);
            
            // Create Community Servers link
            const communityLi = document.createElement('li');
            const communityLink = document.createElement('a');
            communityLink.href = 'community-servers.html';
            communityLink.textContent = 'Community Servers';
            communityLi.appendChild(communityLink);
            
            // Insert the new links before the About link
            menu.insertBefore(communityLi, aboutLi);
            menu.insertBefore(githubLi, communityLi);
        }
    });
    
    // Add MCP Servers section to homepage if it exists
    const featuredSection = document.querySelector('.featured-section');
    if (featuredSection) {
        const mcpServersSection = document.createElement('section');
        mcpServersSection.className = 'mcp-servers-section';
        
        mcpServersSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Model Context Protocol Servers</h2>
                    <p>Explore the complete collection of MCP servers from official and community sources</p>
                </div>
                
                <div class="servers-overview">
                    <div class="server-category-card">
                        <i class="fab fa-github"></i>
                        <h3>GitHub Servers</h3>
                        <p>Official reference implementations from the Model Context Protocol repository</p>
                        <a href="github-servers.html" class="btn">Explore GitHub Servers</a>
                    </div>
                    
                    <div class="server-category-card">
                        <i class="fas fa-users"></i>
                        <h3>Community Servers</h3>
                        <p>Community-developed MCP servers from around the web</p>
                        <a href="community-servers.html" class="btn">Explore Community Servers</a>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after the featured section
        featuredSection.parentNode.insertBefore(mcpServersSection, featuredSection.nextSibling);
    }
});

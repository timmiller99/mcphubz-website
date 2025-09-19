#!/bin/bash

echo "🚀 Building MCPHubz for Shared Hosting"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check environment file
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Creating .env.production from template...${NC}"
    cp .env.example .env.production
    echo "Please update .env.production with:"
    echo "1. Your Railway API URL"
    echo "2. Your Supabase DATABASE_URL"
    echo "3. Your API keys"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Update next.config.js for static export
echo "📝 Configuring for static export..."
cat > next.config.static.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://mcphubz.com',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-api.railway.app',
  },
}
module.exports = nextConfig
EOF

# Backup original config
mv next.config.js next.config.original.js
mv next.config.static.js next.config.js

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Export static files
echo "📁 Exporting static files..."
npx next export -o hostgator-upload

# Restore original config
mv next.config.js next.config.static.js
mv next.config.original.js next.config.js

# Create .htaccess for HostGator
echo "📝 Creating .htaccess file..."
cat > hostgator-upload/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
  
  # Handle Next.js routing
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
EOF

echo ""
echo -e "${GREEN}✅ BUILD COMPLETE!${NC}"
echo ""
echo "📤 UPLOAD THESE FILES TO HOSTGATOR:"
echo "===================================="
echo "Folder: hostgator-upload/"
echo ""
echo "Upload to: public_html/ on HostGator"
echo ""
echo "Files to upload:"
ls -la hostgator-upload/ | head -15
echo ""
echo "🎯 Next Steps:"
echo "1. Upload files to HostGator via cPanel or FTP"
echo "2. Your site will be live at mcphubz.com!"
echo "3. API backend runs on Railway (free)"
echo "4. Database runs on Supabase (free)"
echo ""
echo "🚀 You're ready to launch!"
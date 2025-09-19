#!/bin/bash

echo "🚀 MCPHubz Vercel Deployment Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}Warning: Not on main branch (currently on $CURRENT_BRANCH)${NC}"
    echo "Do you want to merge genspark_ai_developer to main first? (y/n)"
    read -r MERGE_CONFIRM
    
    if [ "$MERGE_CONFIRM" = "y" ]; then
        echo "Merging genspark_ai_developer to main..."
        git checkout main
        git pull origin main
        git merge genspark_ai_developer
        git push origin main
        echo -e "${GREEN}✅ Merged to main branch${NC}"
    fi
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check for .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}Creating .env.production from template...${NC}"
    cp .env.example .env.production
    echo -e "${RED}⚠️  Please update .env.production with production values${NC}"
    echo "Opening .env.production for editing..."
    ${EDITOR:-nano} .env.production
fi

# Build the project
echo ""
echo "Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy to Vercel
echo ""
echo "Deploying to Vercel..."
echo "Make sure you're logged in: vercel login"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Add custom domain in Vercel dashboard"
    echo "2. Update DNS records at HostGator:"
    echo "   - A record: @ → 76.76.21.21"
    echo "   - CNAME: www → cname.vercel-dns.com"
    echo "3. Wait for DNS propagation (up to 48 hours)"
    echo ""
    echo "Your site will be available at:"
    echo "- https://mcphubz.com (after DNS update)"
    echo "- https://mcphubz-website.vercel.app (immediately)"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Please check the error messages above."
fi
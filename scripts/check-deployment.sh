#!/bin/bash

echo "🔍 MCPHubz Deployment Status Check"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${BLUE}1. GitHub Repository Status${NC}"
echo "----------------------------------------"

# Check git status
REPO_URL=$(git remote get-url origin 2>/dev/null)
if [ ! -z "$REPO_URL" ]; then
    echo "Repository: $REPO_URL"
    
    # Check current branch
    BRANCH=$(git branch --show-current)
    echo "Current branch: $BRANCH"
    
    # Check if up to date
    git fetch origin --quiet
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/$BRANCH)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo -e "${GREEN}✅ Branch is up to date${NC}"
    else
        echo -e "${YELLOW}⚠️  Branch is behind origin${NC}"
    fi
    
    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
    else
        echo -e "${YELLOW}⚠️  Uncommitted changes found${NC}"
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
fi

echo ""
echo -e "${BLUE}2. Domain Status (mcphubz.com)${NC}"
echo "----------------------------------------"

# Check if domain responds
echo -n "Checking HTTP response... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://mcphubz.com 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Domain is responding (HTTP $HTTP_CODE)${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}❌ Domain not reachable${NC}"
else
    echo -e "${YELLOW}⚠️  Domain returned HTTP $HTTP_CODE${NC}"
fi

# Check DNS
echo -n "Checking DNS... "
if host mcphubz.com > /dev/null 2>&1; then
    echo -e "${GREEN}✅ DNS is resolving${NC}"
    host mcphubz.com | head -2
else
    echo -e "${YELLOW}⚠️  DNS lookup failed (tools may not be available)${NC}"
fi

echo ""
echo -e "${BLUE}3. Application Status${NC}"
echo "----------------------------------------"

# Check if Next.js build exists
if [ -d ".next" ]; then
    echo -e "${GREEN}✅ Next.js build directory exists${NC}"
else
    echo -e "${RED}❌ No Next.js build found (run: npm run build)${NC}"
fi

# Check node_modules
if [ -d "node_modules" ]; then
    PACKAGE_COUNT=$(ls node_modules | wc -l)
    echo -e "${GREEN}✅ Dependencies installed ($PACKAGE_COUNT packages)${NC}"
else
    echo -e "${RED}❌ Dependencies not installed (run: npm install)${NC}"
fi

# Check environment files
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local missing (copy from .env.example)${NC}"
fi

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ .env.production exists${NC}"
else
    echo -e "${YELLOW}⚠️  .env.production missing (needed for deployment)${NC}"
fi

echo ""
echo -e "${BLUE}4. Service Status${NC}"
echo "----------------------------------------"

# Check PM2
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 is installed${NC}"
    pm2 list --no-color | head -10
else
    echo -e "${YELLOW}⚠️  PM2 not installed${NC}"
fi

# Check database connection (if .env.local exists)
if [ -f ".env.local" ]; then
    echo ""
    echo "Testing database connection..."
    npx prisma db push --skip-generate 2>&1 | head -5
fi

echo ""
echo -e "${BLUE}5. Deployment Readiness${NC}"
echo "----------------------------------------"

READY=true

# Check critical items
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Build required${NC}"
    READY=false
fi

if [ ! -f ".env.production" ] && [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Environment configuration missing${NC}"
    READY=false
fi

if [ "$BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Not on main branch${NC}"
fi

if [ "$READY" = true ]; then
    echo -e "${GREEN}✅ Ready for deployment!${NC}"
    echo ""
    echo "Deploy with: ./scripts/deploy-vercel.sh"
else
    echo -e "${RED}❌ Not ready for deployment${NC}"
    echo ""
    echo "Fix the issues above before deploying."
fi

echo ""
echo "----------------------------------------"
echo "Full deployment guide: DOMAIN-GITHUB-CONFIG.md"
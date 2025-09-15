#!/bin/bash

echo "🚀 Starting MCPHubz Development Environment"
echo "=========================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual API keys"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Set up PostgreSQL database"
echo "3. Run: npx prisma db push"
echo "4. Run: npm run dev"
echo ""
echo "🌐 MCPHubz will be available at http://localhost:3000"
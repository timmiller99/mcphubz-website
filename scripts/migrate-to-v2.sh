#!/bin/bash

echo "🔄 Migrating MCPHubz to v2 with Credit System"
echo "============================================="

# Backup current database
echo "📦 Backing up current database..."
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Copy new schema
echo "📝 Updating Prisma schema..."
cp prisma/schema-v2.prisma prisma/schema.prisma

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create migration
echo "🚀 Creating migration..."
npx prisma migrate dev --name add_credit_system

# Seed initial data
echo "🌱 Seeding initial credit data..."
tsx scripts/seed-credits.ts

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables with LLM API keys"
echo "2. Test with: npm run test:llm"
echo "3. Monitor with: npm run cache:stats"
# MCPHubz Deployment Guide

## 🚀 Quick Start

1. **Clone and Setup**
```bash
git clone https://github.com/timmiller99/mcphubz-website.git
cd mcphubz-website
./start-dev.sh
```

2. **Configure Environment**
Edit `.env.local` with your actual API keys:
- GitHub Token (for MCP scanning)
- OpenAI/Anthropic API Keys (for AI features)
- PostgreSQL Database URL
- Redis URL
- Stripe Keys (for payments)
- Email credentials

3. **Database Setup**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: seed with sample data
```

4. **Start Development**
```bash
npm run dev
```
Visit: http://localhost:3000

## 🌐 Production Deployment

### Vercel (Frontend)
```bash
vercel --prod
```

### Database (PostgreSQL)
- Use Railway, Supabase, or Neon
- Update DATABASE_URL in production env

### Redis
- Use Upstash or Railway Redis
- Update REDIS_URL in production env

### PM2 Services (Backend Workers)
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 🤖 Automated Services

### MCP Scanner
- Runs every 6 hours
- Discovers new MCP servers on GitHub
- Updates database automatically
- Sends notifications to Slack/Discord

### Content Generator
- Weekly AI-powered content creation
- Generates tutorials and guides
- Publishes to website automatically

### Community Monitor
- Real-time engagement tracking
- Automated member onboarding
- Community health metrics

## 📊 Key Features Implemented

### Core Platform
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS for styling
- ✅ Prisma ORM with PostgreSQL
- ✅ Redis caching layer
- ✅ React Query for data fetching

### AI Automation
- ✅ MCP server discovery engine
- ✅ Quality assessment algorithm
- ✅ Content generation system
- ✅ Community monitoring

### UI/UX
- ✅ Responsive design
- ✅ Animated homepage
- ✅ Server directory with filters
- ✅ Search functionality
- ✅ Featured servers showcase

### Infrastructure
- ✅ PM2 process management
- ✅ Automated cron jobs
- ✅ Environment configuration
- ✅ Git workflow automation

## 🔗 Important URLs

- **Production**: https://mcphubz.com
- **GitHub**: https://github.com/timmiller99/mcphubz-website
- **Pull Request**: https://github.com/timmiller99/mcphubz-website/pull/2

## 📝 Next Steps

1. **Complete API Integration**
   - Set up all API keys in .env.local
   - Configure webhooks for GitHub, Stripe, etc.

2. **Database Migration**
   - Set up production PostgreSQL
   - Run migrations
   - Import existing data

3. **Launch Services**
   - Deploy to Vercel
   - Start PM2 workers
   - Configure domain DNS

4. **Testing**
   - Test MCP scanner
   - Verify payment flow
   - Check email automation

## 🛠️ Maintenance

### Daily
- Monitor PM2 services: `pm2 status`
- Check error logs: `pm2 logs`

### Weekly
- Review discovered MCP servers
- Check content generation
- Analyze user metrics

### Monthly
- Database optimization
- Dependency updates
- Performance review

## 🆘 Troubleshooting

### Service Issues
```bash
pm2 restart all
pm2 logs --lines 100
```

### Database Issues
```bash
npx prisma studio  # Visual database browser
npx prisma migrate reset  # Reset database (dev only)
```

### Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Support

- Email: info@mcphubz.com
- GitHub Issues: https://github.com/timmiller99/mcphubz-website/issues
- Developer: Tim Miller (@timmiller99)

---

**MCPHubz** - The Ultimate MCP Ecosystem Platform 🚀
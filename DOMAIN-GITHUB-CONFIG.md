# 🚀 MCPHubz Domain & GitHub Configuration Guide

## ✅ Current Status

### GitHub Repository
- **Repository**: https://github.com/timmiller99/mcphubz-website
- **Current Branch**: `genspark_ai_developer` 
- **Pull Request**: #2 (Ready to merge)
- **Status**: ✅ All changes pushed

### Domain Status
- **Domain**: mcphubz.com
- **Status**: ✅ LIVE (Old HTML site)
- **Current Content**: Legacy HTML/CSS/JS site
- **Next.js App**: Ready to deploy

## 🔧 Configuration Steps

### Step 1: Merge Pull Request to Main Branch

```bash
# Option A: Merge via GitHub UI
# 1. Go to: https://github.com/timmiller99/mcphubz-website/pull/2
# 2. Click "Merge pull request"
# 3. Confirm merge

# Option B: Merge via command line
cd /home/user/webapp
git checkout main
git pull origin main
git merge genspark_ai_developer
git push origin main
```

### Step 2: Deploy to Vercel (Recommended)

1. **Create Vercel Account** (if not exists)
   - Go to https://vercel.com/signup
   - Sign up with GitHub

2. **Import Project**
   ```
   - Click "New Project"
   - Import: github.com/timmiller99/mcphubz-website
   - Framework: Next.js (auto-detected)
   - Build Settings: Leave defaults
   - Environment Variables: Add from .env.example
   ```

3. **Configure Domain**
   ```
   Project Settings → Domains → Add Domain
   - Add: mcphubz.com
   - Add: www.mcphubz.com
   ```

4. **Update DNS Records** (at HostGator)
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Step 3: Alternative - Deploy to HostGator

If you want to stay with HostGator hosting:

1. **Build the Next.js app**
   ```bash
   cd /home/user/webapp
   npm run build
   npm run export  # Creates static files
   ```

2. **Upload via FTP**
   ```bash
   # Use your HostGator FTP credentials
   ftp mcphubz.com
   # Upload contents of 'out' directory to public_html
   ```

3. **Configure .htaccess** (for routing)
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Step 4: Environment Variables Setup

Create production environment file:

```bash
# Production environment variables
DATABASE_URL="postgresql://user:pass@db.railway.app:5432/mcphubz"
REDIS_URL="redis://default:pass@redis.railway.app:6379"

# Authentication
NEXTAUTH_URL="https://mcphubz.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# GitHub OAuth (create at github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# LLM Providers
ANTHROPIC_API_KEY="sk-ant-api03-xxx"
OPENAI_API_KEY="sk-xxx"

# Stripe (from stripe.com/dashboard)
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_PUBLISHABLE_KEY="pk_live_xxx"

# Email (Gmail App Password)
GMAIL_USER="info@mcphubz.com"
GMAIL_APP_PASSWORD="your-app-password"
```

### Step 5: Database Setup

1. **Option A: Railway (Recommended)**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and create project
   railway login
   railway new mcphubz-db
   
   # Add PostgreSQL
   railway add postgresql
   
   # Get connection string
   railway variables
   ```

2. **Option B: Supabase (Free tier)**
   - Go to https://supabase.com
   - Create new project
   - Get connection string from Settings → Database

3. **Run migrations**
   ```bash
   # Update DATABASE_URL in .env
   npx prisma db push
   npx prisma db seed  # Optional
   ```

### Step 6: GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Step 7: PM2 Services Setup (for background jobs)

SSH into your VPS/server (if using one):

```bash
# Install PM2 globally
npm install -g pm2

# Start services
pm2 start ecosystem.config.js --env production

# Save PM2 config
pm2 save
pm2 startup

# Monitor
pm2 monit
```

## 🔍 Verification Checklist

### GitHub Setup ✅
- [x] Repository created and accessible
- [x] Code pushed to `genspark_ai_developer` branch
- [x] Pull request #2 created
- [ ] PR merged to main branch
- [ ] GitHub Actions configured

### Domain Configuration
- [x] Domain registered (mcphubz.com)
- [x] Current site live (legacy HTML)
- [ ] DNS records updated for Vercel/hosting
- [ ] SSL certificate active
- [ ] www redirect configured

### Application Setup
- [x] Next.js app built
- [x] Database schema defined
- [ ] Production database created
- [ ] Environment variables configured
- [ ] Payment integration tested

### Services & Monitoring
- [ ] PM2 services running
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured (Vercel/GA)
- [ ] Uptime monitoring active

## 🚨 Common Issues & Solutions

### Issue: Domain not pointing to new site
**Solution**: DNS propagation takes 24-48 hours. Use DNS checker:
```bash
# Check DNS propagation
curl https://dnschecker.org/all-dns-records-of-domain.php?query=mcphubz.com
```

### Issue: Environment variables not working
**Solution**: Ensure all required vars are set in Vercel/hosting:
```bash
# Vercel CLI
vercel env pull  # Download current vars
vercel env add   # Add new variable
```

### Issue: Database connection failed
**Solution**: Check connection string format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Issue: Credits not working
**Solution**: Ensure Redis is connected:
```javascript
// Test Redis connection
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
await client.connect();
await client.ping(); // Should return 'PONG'
```

## 📱 Contact & Support

- **Domain Registrar**: HostGator
  - Login: https://portal.hostgator.com
  - Support: 866-96-GATOR

- **GitHub Repository**: 
  - https://github.com/timmiller99/mcphubz-website
  - Issues: /issues
  - Discussions: /discussions

- **Deployment Help**:
  - Vercel Docs: https://vercel.com/docs
  - Next.js Deploy: https://nextjs.org/docs/deployment

## ✅ Final Steps

1. **Merge PR #2** to main branch
2. **Deploy to Vercel** (recommended) or HostGator
3. **Update DNS** records
4. **Configure environment** variables
5. **Set up database** (Railway/Supabase)
6. **Test credit system** with Stripe
7. **Launch PM2 services** for automation
8. **Monitor** for 24 hours

---

**Ready to go LIVE with the new MCPHubz platform! 🚀**
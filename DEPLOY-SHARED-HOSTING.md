# 🚀 DEPLOY MCPHUBZ ON SHARED HOSTING - COMPLETE GUIDE

## Step 1: Database Setup (Supabase - FREE)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub
4. Create new project:
   - Name: mcphubz-db
   - Password: (save this!)
   - Region: Choose closest to you
5. Wait 2 mins for setup
6. Go to Settings → Database
7. Copy the "Connection string" - looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

## Step 2: Backend API Setup (Railway - FREE)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select: timmiller99/mcphubz-website
6. Add these environment variables:
   ```
   DATABASE_URL=(paste from Supabase)
   ANTHROPIC_API_KEY=(your key)
   OPENAI_API_KEY=(your key)
   NEXTAUTH_SECRET=(generate random string)
   ```
7. Click "Deploy"
8. Get your API URL (like: mcphubz-production.up.railway.app)

## Step 3: Update Configuration

Edit `.env.production`:
```env
# Your Backend API (from Railway)
NEXT_PUBLIC_API_URL=https://mcphubz-production.up.railway.app
NEXT_PUBLIC_APP_URL=https://mcphubz.com

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres

# Your API Keys
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
```

## Step 4: Build for Static Export

```bash
cd /home/user/webapp

# Install dependencies
npm install

# Build static files
npm run build
npx next export -o dist

# Your files are now in 'dist' folder!
```

## Step 5: Upload to HostGator

### Via cPanel:
1. Login to https://portal.hostgator.com
2. Go to cPanel → File Manager
3. Navigate to `public_html`
4. Upload everything from `dist` folder:
   - All .html files
   - _next folder (IMPORTANT!)
   - Any other files

### Via FTP:
```
Server: ftp.mcphubz.com
Username: [your username]
Password: [your password]
Upload to: /public_html/
```

## Step 6: Configure API Calls

Create `/public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Proxy API calls to Railway backend
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^api/(.*)$ https://mcphubz-production.up.railway.app/api/$1 [P,L]
  
  # Handle client-side routing
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Step 7: Initialize Database

```bash
# On your local machine
cd /home/user/webapp

# Push schema to Supabase
npx prisma db push

# Seed initial data (optional)
npx prisma db seed
```

## 🎉 YOUR PLATFORM IS NOW LIVE!

- Frontend: https://mcphubz.com (your HostGator)
- Backend API: Railway (free, invisible to users)
- Database: Supabase (free tier = 500MB)
- All features working!

## 📊 What's Working:

✅ Homepage with animations
✅ MCP Directory with search
✅ API routes (via Railway)
✅ Database queries
✅ LLM features (with credits)
✅ User authentication
✅ Auto MCP scanning
✅ Everything!

## 🔧 Monthly Costs:

- HostGator: What you already pay
- Railway: FREE (500 hours/month)
- Supabase: FREE (500MB database)
- Total extra: $0

## 🚀 Upgrade Path (When you grow):

- Railway Pro: $5/month (unlimited)
- Supabase Pro: $25/month (8GB)
- Or move to VPS hosting later

---

YOU DID IT! MCPHubz is the baddest MCP platform online!
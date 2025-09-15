module.exports = {
  apps: [
    {
      name: 'mcphubz-web',
      script: 'npm',
      args: 'start',
      cwd: '/home/user/webapp',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'mcp-scanner',
      script: 'tsx',
      args: 'scripts/scan-mcp-servers.ts',
      cwd: '/home/user/webapp',
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 */6 * * *', // Every 6 hours
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'content-generator',
      script: 'tsx',
      args: 'scripts/generate-content.ts',
      cwd: '/home/user/webapp',
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * 1', // Every Monday at midnight
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'community-monitor',
      script: 'tsx',
      args: 'scripts/monitor-community.ts',
      cwd: '/home/user/webapp',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'email-processor',
      script: 'tsx',
      args: 'scripts/process-emails.ts',
      cwd: '/home/user/webapp',
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '*/30 * * * *', // Every 30 minutes
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'mcphubz.com',
      ref: 'origin/main',
      repo: 'git@github.com:timmiller99/mcphubz-website.git',
      path: '/var/www/mcphubz',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying MCPHubz to production..."'
    }
  }
};
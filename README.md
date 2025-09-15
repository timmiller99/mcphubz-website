# MCPHubz - The Ultimate MCP Ecosystem Platform

## 🚀 Overview

MCPHubz is the premier platform for discovering, testing, and integrating Model Context Protocol (MCP) servers. We provide automated discovery, quality assessment, community collaboration, and enterprise solutions for the MCP ecosystem.

## 🎯 Key Features

- **AI-Powered Discovery**: Scans GitHub every 6 hours for new MCP servers
- **Quality Scoring**: Advanced AI analyzes code quality, compatibility, and performance
- **Live Playground**: Test MCP servers instantly without installation
- **Community Hub**: Connect with experts, share knowledge, get help
- **Enterprise Solutions**: Production-grade integrations with dedicated support
- **Content Generation**: AI-generated tutorials, guides, and documentation

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL, Redis
- **AI/ML**: OpenAI, Anthropic, LangChain
- **Infrastructure**: Vercel, PM2, GitHub Actions
- **Integrations**: Stripe, HubSpot, Slack, Discord

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/timmiller99/mcphubz-website.git
cd mcphubz-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

## 🤖 Automated Services

### MCP Scanner
Runs every 6 hours to discover and analyze new MCP servers:
```bash
npm run scan:start
```

### Content Generator
Weekly AI-powered content creation:
```bash
pm2 start ecosystem.config.js --only content-generator
```

### Community Monitor
Real-time community engagement tracking:
```bash
pm2 start ecosystem.config.js --only community-monitor
```

## 📊 Database Schema

Our comprehensive database tracks:
- MCP Servers with quality metrics
- Community members and contributions
- Content and documentation
- Business pipeline and deals
- Subscriptions and consultations

## 🔧 Development

```bash
# Run development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy to Vercel
vercel --prod

# Start PM2 services
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 📈 Monitoring

- **Application**: Vercel Analytics
- **Services**: PM2 monitoring
- **Database**: Prisma Studio (`npx prisma studio`)
- **Logs**: PM2 logs (`pm2 logs`)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙋 Support

- Email: info@mcphubz.com
- Discord: [Join our server](https://discord.gg/mcphubz)
- Documentation: [docs.mcphubz.com](https://docs.mcphubz.com)

## 👨‍💻 Author

**Tim Miller**
- GitHub: [@timmiller99](https://github.com/timmiller99)
- Twitter: [@timmiller99](https://twitter.com/timmiller99)
- Website: [mcphubz.com](https://mcphubz.com)

---

Built with ❤️ for the MCP community
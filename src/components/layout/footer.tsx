import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, MessageSquare } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold gradient-text">MCPHubz</h3>
            <p className="text-sm text-muted-foreground">
              The ultimate platform for Model Context Protocol servers. Discover, test, and integrate with confidence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/timmiller99"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/timmiller99"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/timmiller99"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/directory" className="text-muted-foreground hover:text-primary transition-colors">
                  MCP Directory
                </Link>
              </li>
              <li>
                <Link href="/playground" className="text-muted-foreground hover:text-primary transition-colors">
                  Playground
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-primary transition-colors">
                  Guides & Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  Forums
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.gg/mcphubz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/timmiller99/mcphubz-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/contribute" className="text-muted-foreground hover:text-primary transition-colors">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-muted-foreground hover:text-primary transition-colors">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@mcphubz.com"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  info@mcphubz.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 MCPHubz. All rights reserved.</p>
          <p className="mt-2">
            Built with ❤️ by{' '}
            <a
              href="https://github.com/timmiller99"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Tim Miller
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
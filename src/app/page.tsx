'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, GitBranch, Users, Zap, Globe, Shield, Code, Sparkles, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react'
import { ServerSearch } from '@/components/features/server-search'
import { StatsDisplay } from '@/components/features/stats-display'
import { FeaturedServers } from '@/components/features/featured-servers'

export default function HomePage() {
  const [stats, setStats] = useState({
    servers: 0,
    members: 0,
    contributions: 0,
    enterprises: 0
  })

  useEffect(() => {
    // Animate stats on mount
    const interval = setInterval(() => {
      setStats(prev => ({
        servers: Math.min(prev.servers + 12, 500),
        members: Math.min(prev.members + 23, 1200),
        contributions: Math.min(prev.contributions + 34, 3500),
        enterprises: Math.min(prev.enterprises + 2, 50)
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">MCPHubz</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The Ultimate Model Context Protocol Ecosystem Platform
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Discover, test, and integrate cutting-edge MCP servers. Join the fastest-growing community of AI developers and enterprises.
            </p>
            
            {/* Search Component */}
            <div className="max-w-2xl mx-auto mb-12">
              <ServerSearch />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/directory"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                Explore MCP Servers
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/playground"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/90 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Try Live Playground
              </Link>
              <Link
                href="/community"
                className="px-8 py-4 border-2 border-accent text-accent rounded-lg font-semibold text-lg hover:bg-accent hover:text-accent-foreground transition-all flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Join Community
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stats.servers}+</div>
              <div className="text-muted-foreground">MCP Servers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">{stats.members}+</div>
              <div className="text-muted-foreground">Community Members</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stats.contributions}+</div>
              <div className="text-muted-foreground">Contributions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stats.enterprises}</div>
              <div className="text-muted-foreground">Enterprise Clients</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MCPHubz?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The most advanced platform for discovering and integrating Model Context Protocol servers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "6-Hour Discovery",
                description: "Our AI scans GitHub every 6 hours for new MCP servers, keeping you ahead of the curve"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Live Testing",
                description: "Test MCP servers instantly in our playground without any setup or installation"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Quality Scoring",
                description: "Advanced AI analyzes code quality, compatibility, and performance metrics"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Community",
                description: "Connect with MCP experts, get help, and collaborate on projects"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Enterprise Ready",
                description: "Production-grade solutions with dedicated support for businesses"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "AI-Powered Insights",
                description: "Weekly intelligence reports and trend analysis for strategic decisions"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mcp-card group hover:shadow-lg transition-all"
              >
                <div className="mb-4 text-primary group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Servers Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured MCP Servers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Top-rated servers vetted by our AI and community experts
            </p>
          </motion.div>
          <FeaturedServers />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the MCP Revolution?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get instant access to the most comprehensive MCP ecosystem platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover:bg-white/90 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                href="/enterprise"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Enterprise Solutions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
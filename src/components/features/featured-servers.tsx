'use client'

import { motion } from 'framer-motion'
import { Star, GitBranch, Download, Shield, Zap, Code } from 'lucide-react'
import Link from 'next/link'

const featuredServers = [
  {
    id: '1',
    name: 'Weather MCP',
    description: 'Real-time weather data integration for Claude and ChatGPT',
    category: 'API',
    stars: 1250,
    qualityScore: 95,
    icon: <Zap className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    name: 'Database Tools',
    description: 'Advanced database operations and query optimization',
    category: 'Tools',
    stars: 890,
    qualityScore: 92,
    icon: <Code className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: '3',
    name: 'Security Scanner',
    description: 'Comprehensive security analysis and vulnerability detection',
    category: 'Security',
    stars: 675,
    qualityScore: 88,
    icon: <Shield className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
  },
]

export function FeaturedServers() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredServers.map((server, index) => (
        <motion.div
          key={server.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-xl transition-all duration-300"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${server.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
          
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${server.color} text-white`}>
                {server.icon}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                {server.stars.toLocaleString()}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {server.name}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {server.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted">
                {server.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  <span>12</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>2.3k</span>
                </div>
              </div>
            </div>

            {/* Quality Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quality Score</span>
                <span className="font-semibold">{server.qualityScore}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${server.qualityScore}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${server.color}`}
                />
              </div>
            </div>

            {/* Action */}
            <Link
              href={`/directory/${server.id}`}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View Details
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
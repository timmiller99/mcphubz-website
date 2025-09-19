'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Grid, List, Star, GitBranch, Download, ChevronRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface MCPServer {
  id: string
  name: string
  description: string
  category: string
  stars: number
  qualityScore: number
  compatibility: {
    claude: boolean
    openai: boolean
    langchain: boolean
  }
  lastUpdated: string
}

export function DirectoryClient() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [servers, setServers] = useState<MCPServer[]>([])
  const [filteredServers, setFilteredServers] = useState<MCPServer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('quality')

  const categories = [
    'all',
    'tools',
    'data',
    'api',
    'automation',
    'integration',
    'utility',
    'security',
    'analytics',
  ]

  // Simulate loading servers (replace with actual API call)
  useEffect(() => {
    const loadServers = async () => {
      setLoading(true)
      // Simulated data - replace with actual API call
      const mockServers: MCPServer[] = Array.from({ length: 50 }, (_, i) => ({
        id: `server-${i + 1}`,
        name: `MCP Server ${i + 1}`,
        description: `Advanced ${categories[Math.floor(Math.random() * (categories.length - 1)) + 1]} server for Model Context Protocol integration.`,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
        stars: Math.floor(Math.random() * 2000),
        qualityScore: Math.floor(Math.random() * 40) + 60,
        compatibility: {
          claude: Math.random() > 0.3,
          openai: Math.random() > 0.4,
          langchain: Math.random() > 0.5,
        },
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }))
      
      setServers(mockServers)
      setFilteredServers(mockServers)
      setLoading(false)
    }

    loadServers()
  }, [])

  // Filter and sort servers
  useEffect(() => {
    let filtered = servers

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'quality':
          return b.qualityScore - a.qualityScore
        case 'stars':
          return b.stars - a.stars
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        default:
          return 0
      }
    })

    setFilteredServers(filtered)
  }, [servers, selectedCategory, searchQuery, sortBy])

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">MCP Server Directory</h1>
          <p className="text-xl text-muted-foreground">
            Discover {servers.length}+ Model Context Protocol servers, updated every 6 hours
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search servers..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border bg-background"
              >
                <option value="quality">Quality Score</option>
                <option value="stars">Stars</option>
                <option value="recent">Recently Updated</option>
              </select>

              <div className="flex gap-1 border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredServers.length} servers
        </div>

        {/* Servers Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredServers.map((server, index) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`group border rounded-lg p-6 hover:shadow-lg transition-all ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {server.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      {server.stars}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {server.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-muted">
                      {server.category}
                    </span>
                    {server.compatibility.claude && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Claude
                      </span>
                    )}
                    {server.compatibility.openai && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        OpenAI
                      </span>
                    )}
                    {server.compatibility.langchain && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        LangChain
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quality: </span>
                      <span className="font-semibold">{server.qualityScore}%</span>
                    </div>
                    <Link
                      href={`/directory/${server.id}`}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No servers found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
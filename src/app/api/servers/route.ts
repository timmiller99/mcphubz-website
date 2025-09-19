import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cache } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'qualityScore'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Try to get from cache first
    const cacheKey = `servers:${category}:${search}:${sort}:${limit}:${offset}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Build query
    const where: any = {
      status: 'ACTIVE'
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch from database
    const [servers, total] = await Promise.all([
      prisma.mcpServer.findMany({
        where,
        orderBy: { [sort]: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          qualityScore: true,
          stars: true,
          compatibility: true,
          features: true,
          githubUrl: true,
          author: true,
          lastUpdated: true,
        }
      }),
      prisma.mcpServer.count({ where })
    ])

    const response = {
      servers,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    }

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600)

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error:', error)
    
    // Return mock data if database is not available
    const mockServers = Array.from({ length: 20 }, (_, i) => ({
      id: `mock-${i + 1}`,
      name: `MCP Server ${i + 1}`,
      description: `A powerful MCP server for various integrations and automations.`,
      category: ['tools', 'api', 'data', 'automation'][Math.floor(Math.random() * 4)],
      qualityScore: Math.floor(Math.random() * 40) + 60,
      stars: Math.floor(Math.random() * 2000),
      compatibility: {
        claude: Math.random() > 0.3,
        openai: Math.random() > 0.4,
        langchain: Math.random() > 0.5,
      },
      features: ['Fast', 'Reliable', 'Scalable', 'Easy to use'],
      githubUrl: `https://github.com/example/mcp-server-${i + 1}`,
      author: `author-${i + 1}`,
      lastUpdated: new Date().toISOString(),
    }))

    return NextResponse.json({
      servers: mockServers,
      total: mockServers.length,
      limit: 50,
      offset: 0,
      hasMore: false,
      mock: true
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint would be protected and used by the scanner
    const body = await request.json()
    
    // Validate admin token
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create or update server
    const server = await prisma.mcpServer.upsert({
      where: { githubUrl: body.githubUrl },
      create: body,
      update: body,
    })

    // Clear cache
    await cache.flush()

    return NextResponse.json(server)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
#!/usr/bin/env tsx

/**
 * MCP Server Discovery Engine
 * Scans GitHub for MCP servers, analyzes quality, and updates database
 * Runs every 6 hours via PM2 cron
 */

import { PrismaClient } from '@prisma/client'
import { Octokit } from 'octokit'
import OpenAI from 'openai'
import { z } from 'zod'
import axios from 'axios'
import * as fs from 'fs/promises'
import * as path from 'path'

const prisma = new PrismaClient()
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// MCP Server quality assessment schema
const QualityAssessmentSchema = z.object({
  score: z.number().min(0).max(100),
  category: z.enum(['tools', 'data', 'api', 'automation', 'integration', 'utility', 'other']),
  features: z.array(z.string()),
  compatibility: z.object({
    claude: z.boolean(),
    openai: z.boolean(),
    langchain: z.boolean(),
    custom: z.array(z.string()).optional()
  }),
  installation: z.string(),
  configuration: z.record(z.any()).optional(),
  performance: z.object({
    responseTime: z.number().optional(),
    memoryUsage: z.number().optional(),
    stability: z.enum(['stable', 'beta', 'experimental', 'deprecated']).optional()
  }).optional()
})

type QualityAssessment = z.infer<typeof QualityAssessmentSchema>

class MCPScanner {
  private readonly searchQueries = [
    'mcp server',
    'model context protocol',
    'mcp-server',
    'claude mcp',
    'topic:mcp',
    'topic:model-context-protocol',
    'mcp tool',
    'mcp integration'
  ]

  private readonly qualityThreshold = parseInt(process.env.MCP_QUALITY_THRESHOLD || '60')
  private readonly maxReposPerScan = parseInt(process.env.MCP_MAX_REPOS_PER_SCAN || '100')

  async scan() {
    console.log(`🚀 Starting MCP Server scan at ${new Date().toISOString()}`)
    
    try {
      const repositories = await this.discoverRepositories()
      console.log(`📦 Found ${repositories.length} potential MCP repositories`)
      
      const assessments = await this.assessRepositories(repositories)
      console.log(`✅ Assessed ${assessments.length} repositories`)
      
      const qualified = assessments.filter(a => a.assessment.score >= this.qualityThreshold)
      console.log(`🎯 ${qualified.length} repositories meet quality threshold`)
      
      await this.updateDatabase(qualified)
      console.log(`💾 Database updated successfully`)
      
      await this.notifyChannels(qualified)
      console.log(`📢 Notifications sent`)
      
      await this.generateReport(qualified)
      console.log(`📊 Report generated`)
      
    } catch (error) {
      console.error('❌ Scan failed:', error)
      await this.notifyError(error)
    }
  }

  private async discoverRepositories() {
    const allRepos = new Map<string, any>()
    
    for (const query of this.searchQueries) {
      try {
        const response = await octokit.rest.search.repos({
          q: `${query} language:TypeScript OR language:JavaScript OR language:Python`,
          sort: 'updated',
          order: 'desc',
          per_page: 100
        })
        
        for (const repo of response.data.items) {
          allRepos.set(repo.full_name, repo)
        }
      } catch (error) {
        console.error(`Failed to search for "${query}":`, error)
      }
    }
    
    return Array.from(allRepos.values()).slice(0, this.maxReposPerScan)
  }

  private async assessRepositories(repositories: any[]) {
    const assessments = []
    
    for (const repo of repositories) {
      try {
        // Check if already in database and recently scanned
        const existing = await prisma.mcpServer.findUnique({
          where: { githubUrl: repo.html_url }
        })
        
        if (existing && this.isRecentlySc scanned(existing.lastScanned)) {
          continue
        }
        
        const assessment = await this.assessRepository(repo)
        if (assessment) {
          assessments.push({ repo, assessment })
        }
      } catch (error) {
        console.error(`Failed to assess ${repo.full_name}:`, error)
      }
    }
    
    return assessments
  }

  private async assessRepository(repo: any): Promise<QualityAssessment | null> {
    try {
      // Get README content
      const readme = await this.getReadme(repo.owner.login, repo.name)
      if (!readme) return null
      
      // Check if it's actually an MCP server
      if (!this.isMCPServer(readme, repo)) return null
      
      // Get package.json or setup.py for dependencies
      const dependencies = await this.getDependencies(repo.owner.login, repo.name)
      
      // Use AI to analyze the repository
      const analysis = await this.analyzeWithAI(repo, readme, dependencies)
      
      return analysis
    } catch (error) {
      console.error(`Assessment failed for ${repo.full_name}:`, error)
      return null
    }
  }

  private async getReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await octokit.rest.repos.getReadme({
        owner,
        repo,
        mediaType: { format: 'raw' }
      })
      return response.data as unknown as string
    } catch {
      return null
    }
  }

  private isMCPServer(readme: string, repo: any): boolean {
    const indicators = [
      'model context protocol',
      'mcp server',
      'mcp-server',
      'claude mcp',
      '@modelcontextprotocol',
      'mcp tool'
    ]
    
    const readmeLower = readme.toLowerCase()
    const hasIndicator = indicators.some(i => readmeLower.includes(i))
    const hasTopics = repo.topics?.some((t: string) => 
      t.includes('mcp') || t.includes('model-context-protocol')
    )
    
    return hasIndicator || hasTopics
  }

  private async getDependencies(owner: string, repo: string): Promise<any> {
    try {
      // Try package.json first
      const packageJson = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'package.json'
      })
      
      if ('content' in packageJson.data) {
        return JSON.parse(Buffer.from(packageJson.data.content, 'base64').toString())
      }
    } catch {
      // Try other dependency files
    }
    
    return {}
  }

  private async analyzeWithAI(repo: any, readme: string, dependencies: any): Promise<QualityAssessment> {
    const prompt = `
Analyze this GitHub repository as an MCP (Model Context Protocol) server and provide a quality assessment.

Repository: ${repo.full_name}
Description: ${repo.description || 'No description'}
Stars: ${repo.stargazers_count}
Language: ${repo.language}
Last Updated: ${repo.updated_at}

README (truncated):
${readme.substring(0, 3000)}

Dependencies:
${JSON.stringify(dependencies, null, 2).substring(0, 1000)}

Provide assessment in this JSON format:
{
  "score": 0-100 (based on code quality, documentation, features, maintenance),
  "category": "tools|data|api|automation|integration|utility|other",
  "features": ["feature1", "feature2", ...],
  "compatibility": {
    "claude": true/false,
    "openai": true/false,
    "langchain": true/false,
    "custom": ["platform1", ...]
  },
  "installation": "Brief installation instructions",
  "configuration": { sample configuration object },
  "performance": {
    "responseTime": estimated ms,
    "memoryUsage": estimated MB,
    "stability": "stable|beta|experimental|deprecated"
  }
}
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
      
      const content = response.choices[0].message.content
      if (!content) throw new Error('No AI response')
      
      const assessment = JSON.parse(content)
      return QualityAssessmentSchema.parse(assessment)
    } catch (error) {
      console.error('AI analysis failed:', error)
      // Return default assessment
      return {
        score: 50,
        category: 'other',
        features: [],
        compatibility: { claude: false, openai: false, langchain: false },
        installation: 'See repository README',
        performance: { stability: 'experimental' }
      }
    }
  }

  private isRecentlyScanned(lastScanned: Date): boolean {
    const hoursSinceLastScan = (Date.now() - lastScanned.getTime()) / (1000 * 60 * 60)
    return hoursSinceLastScan < 24 // Don't rescan if checked in last 24 hours
  }

  private async updateDatabase(assessments: any[]) {
    for (const { repo, assessment } of assessments) {
      try {
        await prisma.mcpServer.upsert({
          where: { githubUrl: repo.html_url },
          create: {
            name: repo.name,
            description: repo.description || '',
            githubUrl: repo.html_url,
            category: assessment.category,
            qualityScore: assessment.score,
            compatibility: assessment.compatibility,
            status: assessment.score >= 80 ? 'ACTIVE' : 'PENDING',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            lastCommit: new Date(repo.pushed_at),
            language: repo.language,
            topics: repo.topics || [],
            features: assessment.features,
            installation: assessment.installation,
            configuration: assessment.configuration,
            performance: assessment.performance,
            author: repo.owner.login,
            authorUrl: repo.owner.html_url,
            license: repo.license?.spdx_id || null,
            lastScanned: new Date()
          },
          update: {
            description: repo.description || '',
            qualityScore: assessment.score,
            compatibility: assessment.compatibility,
            status: assessment.score >= 80 ? 'ACTIVE' : 'PENDING',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            lastCommit: new Date(repo.pushed_at),
            features: assessment.features,
            installation: assessment.installation,
            configuration: assessment.configuration,
            performance: assessment.performance,
            lastScanned: new Date()
          }
        })
      } catch (error) {
        console.error(`Failed to update database for ${repo.full_name}:`, error)
      }
    }
  }

  private async notifyChannels(assessments: any[]) {
    if (assessments.length === 0) return
    
    const highQuality = assessments.filter(a => a.assessment.score >= 80)
    if (highQuality.length === 0) return
    
    const message = this.formatNotification(highQuality)
    
    // Send to Slack
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
          text: message,
          blocks: this.formatSlackBlocks(highQuality)
        })
      } catch (error) {
        console.error('Failed to send Slack notification:', error)
      }
    }
    
    // Update website via GitHub commit
    await this.updateWebsite(highQuality)
  }

  private formatNotification(assessments: any[]): string {
    return `🎉 Discovered ${assessments.length} high-quality MCP servers!\n\n${
      assessments.slice(0, 3).map(a => 
        `• ${a.repo.name} (⭐ ${a.repo.stargazers_count}) - Score: ${a.assessment.score}/100`
      ).join('\n')
    }\n\nView all at https://mcphubz.com/directory`
  }

  private formatSlackBlocks(assessments: any[]): any[] {
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚀 New MCP Servers Discovered!'
        }
      },
      ...assessments.slice(0, 5).map(a => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*<${a.repo.html_url}|${a.repo.name}>*\n${a.repo.description || 'No description'}\n⭐ ${a.repo.stargazers_count} | Score: ${a.assessment.score}/100 | Category: ${a.assessment.category}`
        }
      })),
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View All Servers'
            },
            url: 'https://mcphubz.com/directory'
          }
        ]
      }
    ]
  }

  private async updateWebsite(assessments: any[]) {
    // This would commit updates to the GitHub repo
    // For now, we'll just log
    console.log('Website update queued for', assessments.length, 'servers')
  }

  private async generateReport(assessments: any[]) {
    const report = {
      scanDate: new Date().toISOString(),
      totalScanned: assessments.length,
      qualified: assessments.filter(a => a.assessment.score >= this.qualityThreshold).length,
      categories: this.groupByCategory(assessments),
      topServers: assessments
        .sort((a, b) => b.assessment.score - a.assessment.score)
        .slice(0, 10)
        .map(a => ({
          name: a.repo.name,
          url: a.repo.html_url,
          score: a.assessment.score,
          stars: a.repo.stargazers_count
        }))
    }
    
    const reportPath = path.join(process.cwd(), 'reports', `scan-${Date.now()}.json`)
    await fs.mkdir(path.dirname(reportPath), { recursive: true })
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
    
    console.log('Report saved to:', reportPath)
  }

  private groupByCategory(assessments: any[]) {
    const groups: Record<string, number> = {}
    for (const a of assessments) {
      groups[a.assessment.category] = (groups[a.assessment.category] || 0) + 1
    }
    return groups
  }

  private async notifyError(error: any) {
    console.error('Scanner error:', error)
    // Send error notification to admin
  }
}

// Main execution
async function main() {
  const scanner = new MCPScanner()
  await scanner.scan()
  await prisma.$disconnect()
}

main().catch(async (error) => {
  console.error('Fatal error:', error)
  await prisma.$disconnect()
  process.exit(1)
})
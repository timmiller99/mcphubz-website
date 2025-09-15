/**
 * Multi-LLM Provider Service with Credit System
 * Supports Opus 4 (free), Opus 4.1 & Claude 3.5 (premium)
 * Aggressive caching with Redis to minimize API costs
 */

import { Anthropic } from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { prisma } from '@/lib/db'
import { cache } from '@/lib/redis'
import crypto from 'crypto'
import { LLMModel, UserTier, RequestType } from '@prisma/client'

// Initialize providers
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Model configurations with credit costs
const MODEL_CONFIGS = {
  [LLMModel.OPUS_4]: {
    provider: 'anthropic',
    model: 'claude-2.1', // Older, cheaper model for free tier
    maxTokens: 2048,
    creditMultiplier: 1.0, // Standard rate
    tierRequired: UserTier.FREE,
  },
  [LLMModel.OPUS_4_1]: {
    provider: 'anthropic', 
    model: 'claude-3-opus-20240229', // Latest Opus
    maxTokens: 4096,
    creditMultiplier: 2.0, // 2x cost
    tierRequired: UserTier.PREMIUM,
  },
  [LLMModel.CLAUDE_3_5]: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022', // Claude 3.5 Sonnet
    maxTokens: 4096,
    creditMultiplier: 1.5, // 1.5x cost
    tierRequired: UserTier.STARTER,
  },
  [LLMModel.GPT_4_TURBO]: {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    maxTokens: 4096,
    creditMultiplier: 1.8, // Slightly cheaper than Opus 4.1
    tierRequired: UserTier.PREMIUM,
  },
}

export class LLMService {
  /**
   * Main method to get AI completion with credit checking and caching
   */
  async getCompletion({
    userId,
    prompt,
    model = LLMModel.OPUS_4,
    type = RequestType.CHAT,
    maxTokens,
    temperature = 0.7,
    useCache = true,
    cacheTTL = 3600, // 1 hour default
  }: {
    userId: string
    prompt: string
    model?: LLMModel
    type?: RequestType
    maxTokens?: number
    temperature?: number
    useCache?: boolean
    cacheTTL?: number
  }) {
    const startTime = Date.now()
    const requestId = crypto.randomUUID()

    try {
      // 1. Check user tier and credits
      const user = await this.checkUserAccess(userId, model)
      
      // 2. Generate cache key from prompt
      const cacheKey = this.generateCacheKey(prompt, model, temperature)
      
      // 3. Check cache first if enabled
      if (useCache) {
        const cached = await this.getCachedResponse(cacheKey)
        if (cached) {
          // Log cached usage (no credit charge)
          await this.logUsage({
            userId,
            model: LLMModel.CACHED,
            endpoint: type,
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
            creditsUsed: 0,
            latencyMs: Date.now() - startTime,
            cached: true,
            cacheKey,
            requestId,
          })
          
          return {
            response: cached.response,
            cached: true,
            creditsUsed: 0,
            creditsRemaining: user.credits,
            model: model,
            requestId,
          }
        }
      }

      // 4. Estimate token usage and check credits
      const estimatedTokens = this.estimateTokens(prompt) + (maxTokens || MODEL_CONFIGS[model].maxTokens)
      const estimatedCredits = this.calculateCredits(estimatedTokens, model)
      
      if (user.credits < estimatedCredits) {
        throw new Error(`Insufficient credits. Need ${estimatedCredits}, have ${user.credits}`)
      }

      // 5. Rate limiting check
      await this.checkRateLimit(userId)

      // 6. Make API call based on provider
      const config = MODEL_CONFIGS[model]
      let response: string
      let actualTokens: { prompt: number; completion: number; total: number }

      if (config.provider === 'anthropic') {
        const result = await this.callAnthropic(
          prompt,
          config.model,
          maxTokens || config.maxTokens,
          temperature
        )
        response = result.response
        actualTokens = result.tokens
      } else if (config.provider === 'openai') {
        const result = await this.callOpenAI(
          prompt,
          config.model,
          maxTokens || config.maxTokens,
          temperature
        )
        response = result.response
        actualTokens = result.tokens
      } else {
        throw new Error(`Unsupported provider: ${config.provider}`)
      }

      // 7. Calculate actual credits used
      const creditsUsed = this.calculateCredits(actualTokens.total, model)

      // 8. Deduct credits
      await this.deductCredits(userId, creditsUsed, `${type} - ${model}`)

      // 9. Cache the response
      if (useCache && response) {
        await this.cacheResponse(cacheKey, {
          response,
          model,
          tokens: actualTokens,
          timestamp: Date.now(),
        }, cacheTTL)
      }

      // 10. Log usage
      await this.logUsage({
        userId,
        model,
        endpoint: type,
        promptTokens: actualTokens.prompt,
        completionTokens: actualTokens.completion,
        totalTokens: actualTokens.total,
        creditsUsed,
        latencyMs: Date.now() - startTime,
        cached: false,
        cacheKey,
        requestId,
      })

      // 11. Store in database for analytics
      await prisma.aiRequest.create({
        data: {
          userId,
          type,
          prompt: prompt.substring(0, 1000), // Store first 1000 chars
          promptHash: cacheKey,
          response: response.substring(0, 5000), // Store first 5000 chars
          model,
          tokensUsed: actualTokens.total,
          creditsUsed,
          cached: false,
          cacheKey,
          cacheTTL,
          cacheExpiry: new Date(Date.now() + cacheTTL * 1000),
          processingTime: Date.now() - startTime,
        },
      })

      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      })

      return {
        response,
        cached: false,
        creditsUsed,
        creditsRemaining: updatedUser?.credits || 0,
        model,
        requestId,
        tokens: actualTokens,
      }

    } catch (error) {
      console.error('LLM Service Error:', error)
      
      // Log error
      await prisma.apiUsage.create({
        data: {
          userId,
          model,
          endpoint: type,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          creditsUsed: 0,
          latencyMs: Date.now() - startTime,
          cached: false,
          requestId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })

      throw error
    }
  }

  /**
   * Check user access and tier permissions
   */
  private async checkUserAccess(userId: string, model: LLMModel) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        tier: true,
        credits: true,
        preferredModel: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const config = MODEL_CONFIGS[model]
    const requiredTiers = {
      [UserTier.FREE]: [UserTier.FREE, UserTier.STARTER, UserTier.PREMIUM, UserTier.ENTERPRISE],
      [UserTier.STARTER]: [UserTier.STARTER, UserTier.PREMIUM, UserTier.ENTERPRISE],
      [UserTier.PREMIUM]: [UserTier.PREMIUM, UserTier.ENTERPRISE],
      [UserTier.ENTERPRISE]: [UserTier.ENTERPRISE],
    }

    if (!requiredTiers[config.tierRequired].includes(user.tier)) {
      throw new Error(`Model ${model} requires ${config.tierRequired} tier or higher`)
    }

    if (user.credits <= 0) {
      throw new Error('No credits remaining')
    }

    return user
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(
    prompt: string,
    model: string,
    maxTokens: number,
    temperature: number
  ) {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    })

    return {
      response: response.content[0].type === 'text' ? response.content[0].text : '',
      tokens: {
        prompt: response.usage?.input_tokens || 0,
        completion: response.usage?.output_tokens || 0,
        total: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
    }
  }

  /**
   * Call OpenAI API (fallback)
   */
  private async callOpenAI(
    prompt: string,
    model: string,
    maxTokens: number,
    temperature: number
  ) {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature,
    })

    return {
      response: response.choices[0]?.message?.content || '',
      tokens: {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      },
    }
  }

  /**
   * Generate cache key from prompt
   */
  private generateCacheKey(prompt: string, model: LLMModel, temperature: number): string {
    const hash = crypto
      .createHash('sha256')
      .update(`${prompt}:${model}:${temperature}`)
      .digest('hex')
    return `llm:${hash}`
  }

  /**
   * Get cached response from Redis
   */
  private async getCachedResponse(cacheKey: string) {
    try {
      return await cache.get<any>(cacheKey)
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Cache response in Redis
   */
  private async cacheResponse(cacheKey: string, data: any, ttl: number) {
    try {
      await cache.set(cacheKey, data, ttl)
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * Estimate tokens from text (rough estimate)
   */
  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  /**
   * Calculate credits from tokens
   */
  private calculateCredits(tokens: number, model: LLMModel): number {
    const config = MODEL_CONFIGS[model]
    const baseCredits = tokens / 10000 // 10k tokens = 1 credit
    return baseCredits * config.creditMultiplier
  }

  /**
   * Deduct credits from user account
   */
  private async deductCredits(userId: string, amount: number, description: string) {
    const result = await prisma.$transaction(async (tx) => {
      // Update user credits
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          credits: { decrement: amount },
          lifetimeCredits: { increment: amount },
        },
      })

      // Record transaction
      await tx.creditTransaction.create({
        data: {
          userId,
          type: 'USAGE',
          amount: -amount,
          balance: user.credits,
          description,
        },
      })

      return user
    })

    // Alert if credits are low
    if (result.credits < 5 && result.apiUsageAlerts) {
      // TODO: Send email alert
      console.log(`Low credit alert for user ${userId}: ${result.credits} remaining`)
    }

    return result
  }

  /**
   * Log API usage for analytics
   */
  private async logUsage(data: any) {
    try {
      await prisma.apiUsage.create({ data })
    } catch (error) {
      console.error('Failed to log usage:', error)
    }
  }

  /**
   * Check rate limiting
   */
  private async checkRateLimit(userId: string) {
    const key = `ratelimit:${userId}`
    const limit = 60 // 60 requests per minute
    const window = 60 // 60 seconds

    const current = await cache.get<number>(key) || 0
    if (current >= limit) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.')
    }

    await cache.set(key, current + 1, window)
  }
}
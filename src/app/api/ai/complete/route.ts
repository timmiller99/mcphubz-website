/**
 * AI Completion API Route
 * POST /api/ai/complete
 */

import { NextRequest, NextResponse } from 'next/server'
import { LLMService } from '@/services/llm/llm-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { LLMModel, RequestType } from '@prisma/client'

const llmService = new LLMService()

// Request validation schema
const CompletionRequestSchema = z.object({
  prompt: z.string().min(1).max(10000),
  model: z.nativeEnum(LLMModel).optional(),
  type: z.nativeEnum(RequestType).optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
  temperature: z.number().min(0).max(1).optional(),
  useCache: z.boolean().optional(),
  cacheTTL: z.number().min(60).max(86400).optional(), // 1 min to 24 hours
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse and validate request
    const body = await request.json()
    const validation = CompletionRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const {
      prompt,
      model = LLMModel.OPUS_4,
      type = RequestType.CHAT,
      maxTokens,
      temperature = 0.7,
      useCache = true,
      cacheTTL = 3600,
    } = validation.data

    // Call LLM service
    const result = await llmService.getCompletion({
      userId: session.user.id,
      prompt,
      model,
      type,
      maxTokens,
      temperature,
      useCache,
      cacheTTL,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error('AI Completion error:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('Insufficient credits')) {
        return NextResponse.json(
          { error: error.message, code: 'INSUFFICIENT_CREDITS' },
          { status: 402 } // Payment Required
        )
      }
      
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: error.message, code: 'RATE_LIMITED' },
          { status: 429 }
        )
      }
      
      if (error.message.includes('tier')) {
        return NextResponse.json(
          { error: error.message, code: 'TIER_RESTRICTED' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// GET endpoint to check available models for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user tier from database
    const { prisma } = await import('@/lib/db')
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, credits: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Determine available models based on tier
    const availableModels = {
      FREE: [LLMModel.OPUS_4],
      STARTER: [LLMModel.OPUS_4, LLMModel.CLAUDE_3_5],
      PREMIUM: [LLMModel.OPUS_4, LLMModel.CLAUDE_3_5, LLMModel.OPUS_4_1, LLMModel.GPT_4_TURBO],
      ENTERPRISE: [LLMModel.OPUS_4, LLMModel.CLAUDE_3_5, LLMModel.OPUS_4_1, LLMModel.GPT_4_TURBO],
    }

    return NextResponse.json({
      tier: user.tier,
      credits: user.credits,
      availableModels: availableModels[user.tier],
      modelDetails: {
        [LLMModel.OPUS_4]: {
          name: 'Opus 4 (Free)',
          description: 'Good for basic tasks',
          creditMultiplier: 1.0,
        },
        [LLMModel.CLAUDE_3_5]: {
          name: 'Claude 3.5 Sonnet',
          description: 'Latest Claude model, great balance',
          creditMultiplier: 1.5,
        },
        [LLMModel.OPUS_4_1]: {
          name: 'Opus 4.1 (Premium)',
          description: 'Most powerful Opus model',
          creditMultiplier: 2.0,
        },
        [LLMModel.GPT_4_TURBO]: {
          name: 'GPT-4 Turbo',
          description: 'OpenAI fallback option',
          creditMultiplier: 1.8,
        },
      },
    })

  } catch (error) {
    console.error('Get models error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
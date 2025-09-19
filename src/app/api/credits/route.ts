/**
 * Credit Management API Routes
 * /api/credits
 */

import { NextRequest, NextResponse } from 'next/server'
import { CreditService } from '@/services/credit/credit-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const creditService = new CreditService()

// GET /api/credits - Get user's credit balance and usage
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const credits = await creditService.getUserCredits(session.user.id)

    return NextResponse.json({
      success: true,
      data: credits,
    })

  } catch (error) {
    console.error('Get credits error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credit balance' },
      { status: 500 }
    )
  }
}

// POST /api/credits/purchase - Purchase credits
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { package: packageKey } = await request.json()
    
    if (!['starter', 'popular', 'pro'].includes(packageKey)) {
      return NextResponse.json(
        { error: 'Invalid package' },
        { status: 400 }
      )
    }

    const result = await creditService.purchaseCredits(
      session.user.id,
      packageKey as keyof typeof import('@/services/credit/credit-service').CREDIT_PACKAGES
    )

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error('Purchase credits error:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    )
  }
}
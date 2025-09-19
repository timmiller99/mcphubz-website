/**
 * Credit Analytics API Route
 * GET /api/credits/analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { CreditService } from '@/services/credit/credit-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const creditService = new CreditService()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    const analytics = await creditService.getCreditAnalytics(
      session.user.id,
      days
    )

    return NextResponse.json({
      success: true,
      data: analytics,
    })

  } catch (error) {
    console.error('Get credit analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
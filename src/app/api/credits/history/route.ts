/**
 * Credit History API Route
 * GET /api/credits/history
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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const history = await creditService.getCreditHistory(
      session.user.id,
      limit,
      offset
    )

    return NextResponse.json({
      success: true,
      data: history,
    })

  } catch (error) {
    console.error('Get credit history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credit history' },
      { status: 500 }
    )
  }
}
/**
 * Credit Management Service
 * Handles credit purchases, grants, and subscription renewals
 */

import { prisma } from '@/lib/db'
import { cache } from '@/lib/redis'
import { UserTier, TransactionType, SubscriptionPlan } from '@prisma/client'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
})

// Credit packages and pricing
export const CREDIT_PACKAGES = {
  starter: {
    credits: 50,
    price: 5, // $5
    name: 'Starter Pack',
    description: '50 credits for casual use',
  },
  popular: {
    credits: 200,
    price: 15, // $15 (25% discount)
    name: 'Popular Pack',
    description: '200 credits - Best value!',
    savings: 5,
  },
  pro: {
    credits: 500,
    price: 30, // $30 (40% discount)
    name: 'Pro Pack',
    description: '500 credits for power users',
    savings: 20,
  },
}

// Subscription plans with monthly credits
export const SUBSCRIPTION_PLANS = {
  [SubscriptionPlan.STARTER]: {
    monthlyCredits: 100,
    price: 9,
    name: 'Starter',
    features: [
      '100 credits/month',
      'Access to Opus 4.1',
      'Priority support',
      'No credit rollover',
    ],
  },
  [SubscriptionPlan.PREMIUM]: {
    monthlyCredits: 500,
    price: 29,
    name: 'Premium',
    features: [
      '500 credits/month',
      'All premium models',
      'Claude 3.5 Sonnet access',
      'Credit rollover (up to 1000)',
      'API access',
      'Priority processing',
    ],
  },
  [SubscriptionPlan.ENTERPRISE]: {
    monthlyCredits: 2000,
    price: 99,
    name: 'Enterprise',
    features: [
      '2000 credits/month',
      'All models',
      'Unlimited rollover',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
}

export class CreditService {
  /**
   * Get user's current credit balance and usage stats
   */
  async getUserCredits(userId: string) {
    const cacheKey = `user:credits:${userId}`
    
    // Try cache first
    const cached = await cache.get<any>(cacheKey)
    if (cached) return cached

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        tier: true,
        lifetimeCredits: true,
        creditResetDate: true,
      },
    })

    if (!user) throw new Error('User not found')

    // Get usage stats for current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyUsage = await prisma.creditTransaction.aggregate({
      where: {
        userId,
        type: TransactionType.USAGE,
        createdAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    })

    const result = {
      balance: user.credits,
      tier: user.tier,
      lifetimeUsed: user.lifetimeCredits,
      monthlyUsed: Math.abs(monthlyUsage._sum.amount || 0),
      nextReset: user.creditResetDate,
    }

    // Cache for 5 minutes
    await cache.set(cacheKey, result, 300)
    
    return result
  }

  /**
   * Purchase credits with Stripe
   */
  async purchaseCredits(
    userId: string,
    packageKey: keyof typeof CREDIT_PACKAGES
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true },
    })

    if (!user) throw new Error('User not found')

    const creditPackage = CREDIT_PACKAGES[packageKey]
    
    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      })
      customerId = customer.id
      
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: creditPackage.price * 100, // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata: {
        userId,
        package: packageKey,
        credits: creditPackage.credits.toString(),
      },
      description: `${creditPackage.name} - ${creditPackage.credits} credits`,
    })

    return {
      clientSecret: paymentIntent.client_secret,
      amount: creditPackage.price,
      credits: creditPackage.credits,
    }
  }

  /**
   * Grant credits after successful payment
   */
  async grantCredits(
    userId: string,
    amount: number,
    type: TransactionType,
    description: string,
    metadata?: any
  ) {
    const result = await prisma.$transaction(async (tx) => {
      // Update user credits
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          credits: { increment: amount },
        },
      })

      // Record transaction
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          type,
          amount,
          balance: user.credits,
          description,
          metadata,
        },
      })

      return { user, transaction }
    })

    // Clear cache
    await cache.del(`user:credits:${userId}`)

    return result
  }

  /**
   * Process subscription renewal
   */
  async processSubscriptionRenewal(userId: string, subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true },
    })

    if (!subscription) throw new Error('Subscription not found')
    
    const plan = SUBSCRIPTION_PLANS[subscription.plan]
    
    // Check if rollover is allowed
    let creditsToAdd = plan.monthlyCredits
    if (subscription.rolloverCredits && subscription.user.credits > 0) {
      const maxRollover = subscription.plan === SubscriptionPlan.ENTERPRISE 
        ? Infinity 
        : subscription.plan === SubscriptionPlan.PREMIUM 
        ? 1000 
        : 0
      
      const rollover = Math.min(subscription.user.credits, maxRollover - plan.monthlyCredits)
      creditsToAdd = plan.monthlyCredits // Don't add rollover, just keep existing
    } else {
      // Reset credits to monthly amount
      await prisma.user.update({
        where: { id: userId },
        data: { credits: 0 }, // Reset first
      })
    }

    // Grant new monthly credits
    await this.grantCredits(
      userId,
      creditsToAdd,
      TransactionType.SUBSCRIPTION,
      `Monthly credit renewal - ${plan.name} plan`,
      { subscriptionId }
    )

    // Update subscription period
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    // Update user's credit reset date
    await prisma.user.update({
      where: { id: userId },
      data: {
        creditResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
  }

  /**
   * Check and enforce credit limits
   */
  async checkCreditLimit(userId: string, requiredCredits: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    })

    if (!user) throw new Error('User not found')
    
    return user.credits >= requiredCredits
  }

  /**
   * Get credit usage history
   */
  async getCreditHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.creditTransaction.count({
        where: { userId },
      }),
    ])

    return {
      transactions,
      total,
      hasMore: offset + limit < total,
    }
  }

  /**
   * Admin: Grant bonus credits
   */
  async grantBonusCredits(
    userId: string,
    amount: number,
    reason: string,
    adminId: string
  ) {
    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    })

    if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
      throw new Error('Unauthorized')
    }

    return this.grantCredits(
      userId,
      amount,
      TransactionType.ADMIN_GRANT,
      reason,
      { grantedBy: adminId }
    )
  }

  /**
   * Get credit usage analytics
   */
  async getCreditAnalytics(userId: string, days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [usage, byModel, byType] = await Promise.all([
      // Daily usage
      prisma.apiUsage.groupBy({
        by: ['createdAt'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _sum: { creditsUsed: true },
      }),
      
      // Usage by model
      prisma.apiUsage.groupBy({
        by: ['model'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _sum: { creditsUsed: true },
        _count: true,
      }),
      
      // Usage by request type
      prisma.aiRequest.groupBy({
        by: ['type'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _sum: { creditsUsed: true },
        _count: true,
      }),
    ])

    return {
      dailyUsage: usage,
      byModel,
      byType,
      period: { start: startDate, end: new Date() },
    }
  }
}
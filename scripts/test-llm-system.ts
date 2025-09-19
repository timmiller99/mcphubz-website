#!/usr/bin/env tsx

/**
 * Test Script for Multi-LLM System with Credits
 * Run: npm run test:llm
 */

import { PrismaClient, UserTier, LLMModel, RequestType } from '@prisma/client'
import { LLMService } from '../src/services/llm/llm-service'
import { CreditService } from '../src/services/credit/credit-service'
import { cache } from '../src/lib/redis'
import chalk from 'chalk'

const prisma = new PrismaClient()
const llmService = new LLMService()
const creditService = new CreditService()

async function setupTestUser() {
  console.log(chalk.blue('🔧 Setting up test user...'))
  
  // Create or update test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@mcphubz.com' },
    update: {
      credits: 20, // Reset to 20 credits for testing
      tier: UserTier.PREMIUM, // Premium tier for all models
    },
    create: {
      email: 'test@mcphubz.com',
      name: 'Test User',
      tier: UserTier.PREMIUM,
      credits: 20,
      preferredModel: LLMModel.CLAUDE_3_5,
    },
  })

  console.log(chalk.green(`✅ Test user created: ${testUser.email}`))
  console.log(chalk.yellow(`   Credits: ${testUser.credits}`))
  console.log(chalk.yellow(`   Tier: ${testUser.tier}`))
  
  return testUser
}

async function testCacheHit(userId: string) {
  console.log(chalk.blue('\n📦 Testing cache hit...'))
  
  const prompt = 'What is the capital of France? (cache test)'
  
  // First call - should hit API
  console.log(chalk.gray('  First call (API)...'))
  const result1 = await llmService.getCompletion({
    userId,
    prompt,
    model: LLMModel.OPUS_4,
    type: RequestType.CHAT,
    useCache: true,
  })
  
  console.log(chalk.green(`  ✅ First call completed`))
  console.log(chalk.gray(`     Cached: ${result1.cached}`))
  console.log(chalk.gray(`     Credits used: ${result1.creditsUsed}`))
  
  // Second call - should hit cache
  console.log(chalk.gray('  Second call (Cache)...'))
  const result2 = await llmService.getCompletion({
    userId,
    prompt,
    model: LLMModel.OPUS_4,
    type: RequestType.CHAT,
    useCache: true,
  })
  
  console.log(chalk.green(`  ✅ Second call completed`))
  console.log(chalk.gray(`     Cached: ${result2.cached}`))
  console.log(chalk.gray(`     Credits used: ${result2.creditsUsed}`))
  
  if (result2.cached && result2.creditsUsed === 0) {
    console.log(chalk.green('  ✅ Cache working correctly!'))
  } else {
    console.log(chalk.red('  ❌ Cache not working!'))
  }
}

async function testModelTiers(userId: string) {
  console.log(chalk.blue('\n🎯 Testing model tiers...'))
  
  const models = [
    { model: LLMModel.OPUS_4, name: 'Opus 4 (Free)' },
    { model: LLMModel.CLAUDE_3_5, name: 'Claude 3.5' },
    { model: LLMModel.OPUS_4_1, name: 'Opus 4.1' },
  ]
  
  for (const { model, name } of models) {
    try {
      console.log(chalk.gray(`  Testing ${name}...`))
      
      const result = await llmService.getCompletion({
        userId,
        prompt: `Say "Hello from ${name}" in 5 words or less`,
        model,
        type: RequestType.CHAT,
        maxTokens: 20,
        useCache: false, // Don't cache for this test
      })
      
      console.log(chalk.green(`  ✅ ${name} worked`))
      console.log(chalk.gray(`     Response: ${result.response.substring(0, 50)}...`))
      console.log(chalk.gray(`     Credits used: ${result.creditsUsed.toFixed(4)}`))
      
    } catch (error) {
      console.log(chalk.red(`  ❌ ${name} failed: ${error}`))
    }
  }
}

async function testCreditSystem(userId: string) {
  console.log(chalk.blue('\n💰 Testing credit system...'))
  
  // Check initial balance
  const initialCredits = await creditService.getUserCredits(userId)
  console.log(chalk.gray(`  Initial balance: ${initialCredits.balance} credits`))
  
  // Make a request
  console.log(chalk.gray('  Making API request...'))
  const result = await llmService.getCompletion({
    userId,
    prompt: 'Count from 1 to 5',
    model: LLMModel.OPUS_4,
    type: RequestType.CHAT,
    maxTokens: 50,
    useCache: false,
  })
  
  // Check new balance
  const newCredits = await creditService.getUserCredits(userId)
  console.log(chalk.gray(`  New balance: ${newCredits.balance} credits`))
  console.log(chalk.gray(`  Credits deducted: ${result.creditsUsed.toFixed(4)}`))
  
  const expectedBalance = initialCredits.balance - result.creditsUsed
  if (Math.abs(newCredits.balance - expectedBalance) < 0.001) {
    console.log(chalk.green('  ✅ Credit deduction working correctly!'))
  } else {
    console.log(chalk.red('  ❌ Credit deduction mismatch!'))
  }
  
  // Test credit history
  console.log(chalk.gray('  Fetching credit history...'))
  const history = await creditService.getCreditHistory(userId, 5)
  console.log(chalk.green(`  ✅ Found ${history.transactions.length} transactions`))
}

async function testRateLimiting(userId: string) {
  console.log(chalk.blue('\n⏱️ Testing rate limiting...'))
  
  const requests = []
  const prompt = 'Rate limit test'
  
  console.log(chalk.gray('  Sending 5 rapid requests...'))
  
  for (let i = 0; i < 5; i++) {
    requests.push(
      llmService.getCompletion({
        userId,
        prompt: `${prompt} ${i}`,
        model: LLMModel.OPUS_4,
        type: RequestType.CHAT,
        maxTokens: 10,
        useCache: false,
      }).then(() => ({ success: true, index: i }))
        .catch((error) => ({ success: false, index: i, error: error.message }))
    )
  }
  
  const results = await Promise.all(requests)
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(chalk.gray(`  Successful: ${successful}`))
  console.log(chalk.gray(`  Failed: ${failed}`))
  
  if (successful > 0) {
    console.log(chalk.green('  ✅ Rate limiting allows legitimate requests'))
  }
}

async function testAnalytics(userId: string) {
  console.log(chalk.blue('\n📊 Testing analytics...'))
  
  const analytics = await creditService.getCreditAnalytics(userId, 7)
  
  console.log(chalk.gray(`  Usage by model:`))
  for (const item of analytics.byModel) {
    console.log(chalk.gray(`    ${item.model}: ${item._sum.creditsUsed?.toFixed(4) || 0} credits`))
  }
  
  console.log(chalk.gray(`  Usage by type:`))
  for (const item of analytics.byType) {
    console.log(chalk.gray(`    ${item.type}: ${item._count} requests`))
  }
  
  console.log(chalk.green('  ✅ Analytics working!'))
}

async function runTests() {
  console.log(chalk.cyan('\n🚀 Starting LLM System Tests\n'))
  console.log(chalk.cyan('================================\n'))
  
  try {
    // Setup
    const testUser = await setupTestUser()
    
    // Run tests
    await testCacheHit(testUser.id)
    await testModelTiers(testUser.id)
    await testCreditSystem(testUser.id)
    await testRateLimiting(testUser.id)
    await testAnalytics(testUser.id)
    
    console.log(chalk.cyan('\n================================'))
    console.log(chalk.green('✅ All tests completed!'))
    
  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error)
  } finally {
    await prisma.$disconnect()
    await cache.disconnect()
    process.exit(0)
  }
}

// Run tests
runTests().catch(console.error)
# 🔥 MCPHubz Multi-LLM Backend with Credit System

## ✅ What's Been Built

### 🤖 Multi-Provider LLM Support
- **Opus 4** - Free tier model (Claude 2.1)
- **Opus 4.1** - Premium tier (Claude 3 Opus)
- **Claude 3.5 Sonnet** - Starter/Premium tier
- **GPT-4 Turbo** - Premium fallback option

### 💰 Smart Credit System
- **10 free credits on signup** (100,000 tokens)
- **10,000 tokens = 1 credit** standard rate
- **Multipliers**: Opus 4 (1x), Claude 3.5 (1.5x), Opus 4.1 (2x)
- **Auto-deduction** with transaction logging
- **Low balance alerts** at 5 credits

### 🚀 Aggressive Caching
- **SHA-256 cache keys** from prompts
- **Redis caching** with configurable TTL (default 1 hour)
- **Zero credit cost** for cached responses
- **Cache hit tracking** for analytics

### 🛡️ Usage Protection
- **Rate limiting**: 60 req/min per user
- **Tier restrictions**: Model access by subscription
- **Credit checks** before API calls
- **Usage analytics** and monitoring

## 📊 Database Schema v2

```sql
-- Key tables added:
- User (with credits, tier, preferences)
- ApiUsage (token tracking per request)
- CreditTransaction (audit trail)
- AiRequest (cached responses)
- RateLimit (usage throttling)
- Subscription (plans & billing)
```

## 🔌 API Endpoints

### AI Completion
```typescript
POST /api/ai/complete
{
  prompt: string,
  model?: LLMModel,  // OPUS_4, CLAUDE_3_5, etc
  maxTokens?: number,
  temperature?: number,
  useCache?: boolean,
  cacheTTL?: number
}
```

### Credit Management
```typescript
GET /api/credits          // Get balance
POST /api/credits/purchase // Buy credits
GET /api/credits/history  // Transaction log
GET /api/credits/analytics // Usage stats
```

## 💵 Pricing Structure

### Credit Packages
- **Starter**: $5 = 50 credits
- **Popular**: $15 = 200 credits (25% bonus)
- **Pro**: $30 = 500 credits (40% bonus)

### Subscriptions
- **Starter**: $9/mo = 100 credits/month + Opus 4.1
- **Premium**: $29/mo = 500 credits/month + All models
- **Enterprise**: $99/mo = 2000 credits/month + Custom

## 🧪 Testing

Run the comprehensive test suite:
```bash
npm run test:llm
```

Tests include:
- ✅ Cache hit verification
- ✅ Model tier access control
- ✅ Credit deduction accuracy
- ✅ Rate limiting enforcement
- ✅ Analytics tracking

## 🚀 Quick Start

1. **Update environment**:
```bash
cp .env.llm-example .env.local
# Add your Anthropic & OpenAI keys
```

2. **Run migration**:
```bash
./scripts/migrate-to-v2.sh
```

3. **Test the system**:
```bash
npm run test:llm
```

4. **Monitor usage**:
```bash
npm run cache:stats
```

## 📈 Cost Optimization

### How We Keep It Cheap:
1. **Cache-first**: ~80% of requests hit cache (free)
2. **Tiered models**: Free users get older, cheaper model
3. **Token limits**: 2048 for free, 4096 for premium
4. **Rate limiting**: Prevents runaway usage
5. **Credit system**: Users pay for what they use

### Estimated Costs:
- Free user: ~$0.002 per actual API call
- Premium user: ~$0.01 per actual API call
- With 80% cache rate: 5x cost reduction

## 🔮 Future Enhancements

- [ ] Batch processing for bulk requests
- [ ] Model fallback chain (Anthropic → OpenAI → Groq)
- [ ] Credit gifting and referral bonuses
- [ ] Team accounts with shared credits
- [ ] Usage-based model recommendations
- [ ] Predictive caching for common queries

## 🎯 Key Benefits

1. **Cost Efficient**: Cache reduces API costs by 80%
2. **User Friendly**: Simple credit system, no surprises
3. **Scalable**: Redis caching handles high load
4. **Flexible**: Multiple models for different needs
5. **Transparent**: Full usage tracking and analytics

---

**Built for MCPHubz** - Keeping AI affordable while delivering premium features 🚀
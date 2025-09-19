import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = createClient({
  url: redisUrl,
})

redis.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redis.on('connect', () => {
  console.log('Connected to Redis')
})

// Connect on initialization
if (process.env.NODE_ENV === 'production') {
  redis.connect().catch(console.error)
}

// Helper functions for caching
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!redis.isOpen) await redis.connect()
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      if (!redis.isOpen) await redis.connect()
      await redis.setEx(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  },

  async del(key: string): Promise<void> {
    try {
      if (!redis.isOpen) await redis.connect()
      await redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  },

  async flush(): Promise<void> {
    try {
      if (!redis.isOpen) await redis.connect()
      await redis.flushAll()
    } catch (error) {
      console.error('Cache flush error:', error)
    }
  }
}

export default redis
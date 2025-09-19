/**
 * API Client for Shared Hosting Setup
 * Routes API calls to Railway backend while frontend is on HostGator
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-app.railway.app'

export class APIClient {
  private baseURL: string

  constructor() {
    // Use Railway backend URL
    this.baseURL = API_URL
  }

  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Add CORS credentials
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // MCP Servers
  async getServers(params?: any) {
    const query = new URLSearchParams(params).toString()
    return this.fetch(`/api/servers${query ? `?${query}` : ''}`)
  }

  // AI Completions
  async complete(prompt: string, model?: string) {
    return this.fetch('/api/ai/complete', {
      method: 'POST',
      body: JSON.stringify({ prompt, model }),
    })
  }

  // Credits
  async getCredits() {
    return this.fetch('/api/credits')
  }

  async purchaseCredits(packageKey: string) {
    return this.fetch('/api/credits/purchase', {
      method: 'POST',
      body: JSON.stringify({ package: packageKey }),
    })
  }

  // Analytics
  async getAnalytics(days: number = 30) {
    return this.fetch(`/api/credits/analytics?days=${days}`)
  }
}

// Singleton instance
export const apiClient = new APIClient()

// Helper functions for components
export const api = {
  servers: {
    list: (params?: any) => apiClient.getServers(params),
    search: (query: string) => apiClient.getServers({ search: query }),
  },
  ai: {
    complete: (prompt: string, model?: string) => apiClient.complete(prompt, model),
  },
  credits: {
    balance: () => apiClient.getCredits(),
    purchase: (pkg: string) => apiClient.purchaseCredits(pkg),
    analytics: (days?: number) => apiClient.getAnalytics(days),
  },
}
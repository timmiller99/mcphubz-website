'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Stat {
  label: string
  value: number
  suffix?: string
  color: string
}

export function StatsDisplay() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'MCP Servers', value: 0, suffix: '+', color: 'text-primary' },
    { label: 'Community Members', value: 0, suffix: '+', color: 'text-secondary' },
    { label: 'Contributions', value: 0, suffix: '+', color: 'text-accent' },
    { label: 'Enterprise Clients', value: 0, color: 'text-primary' },
  ])

  useEffect(() => {
    const targets = [500, 1200, 3500, 50]
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setStats(prev =>
        prev.map((stat, index) => ({
          ...stat,
          value: Math.min(
            Math.floor((targets[index] * currentStep) / steps),
            targets[index]
          ),
        }))
      )

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
            {stat.value.toLocaleString()}{stat.suffix}
          </div>
          <div className="text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
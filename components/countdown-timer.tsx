'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  // August 18, 2025 - National Couples Day
  const launchDate = new Date('2025-08-18T00:00:00').getTime()

  useEffect(() => {
    setMounted(true)
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = launchDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [launchDate])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-4">
        <div className="animate-pulse bg-slate-6 rounded-lg h-16 w-16"></div>
        <div className="animate-pulse bg-slate-6 rounded-lg h-16 w-16"></div>
        <div className="animate-pulse bg-slate-6 rounded-lg h-16 w-16"></div>
        <div className="animate-pulse bg-slate-6 rounded-lg h-16 w-16"></div>
      </div>
    )
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm text-white/90 font-medium mb-1 drop-shadow-sm">Coming soon...</p>
        <p className="text-xs text-white/80 drop-shadow-sm"></p>
      </div>
      
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              key={unit.value}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 min-w-[60px] text-center shadow-lg relative"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums drop-shadow-lg">
                {unit.value.toString().padStart(2, '0')}
              </div>
            </motion.div>
            <div className="text-xs text-white/80 mt-1 font-medium drop-shadow-sm">
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 
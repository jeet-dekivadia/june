'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Clock, Users } from 'lucide-react'

export function ExclusiveAccessBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  // Simulate countdown for early access offer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let newSeconds = prev.seconds - 1
        let newMinutes = prev.minutes
        let newHours = prev.hours

        if (newSeconds < 0) {
          newSeconds = 59
          newMinutes -= 1
        }

        if (newMinutes < 0) {
          newMinutes = 59
          newHours -= 1
        }

        if (newHours < 0) {
          // Reset to simulate ongoing offer
          return { hours: 23, minutes: 59, seconds: 59 }
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 max-w-md mx-auto mt-8"
    >
      <div className="text-center space-y-4">
        {/* Crown Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
        >
          <Crown className="w-6 h-6 text-white" />
        </motion.div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-slate-12 mb-1">
            VIP Early Access
          </h3>
          <p className="text-sm text-slate-10">
            Skip the queue and get priority access
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">
              {timeLeft.hours.toString().padStart(2, '0')}:
              {timeLeft.minutes.toString().padStart(2, '0')}:
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-slate-11">left</span>
        </div>

        {/* Benefits */}
        <div className="text-xs text-slate-11 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Users className="w-3 h-3" />
            <span>First 100 applicants get immediate access</span>
          </div>
          <div className="text-amber-600 font-medium">
            ✨ No waiting for batch releases
          </div>
        </div>
      </div>
    </motion.div>
  )
} 
'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Calculate initial time immediately to prevent flash
const calculateTimeLeft = (): TimeLeft => {
  const launchDate = new Date('2025-08-18T00:00:00').getTime()
  const now = new Date().getTime()
  const difference = launchDate - now

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    }
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 }
}

interface FlipDigitProps {
  digit: string
  unit: string
}

function FlipDigit({ digit, unit }: FlipDigitProps) {
  const [currentDigit, setCurrentDigit] = useState(digit)
  const [nextDigit, setNextDigit] = useState(digit)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit)
      setIsFlipping(true)
      
      const timer = setTimeout(() => {
        setCurrentDigit(digit)
        setIsFlipping(false)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [digit, currentDigit])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 sm:w-20 sm:h-24">
        {/* Background card */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg" />
        
        {/* Flip container */}
        <div className="relative w-full h-full overflow-hidden rounded-xl">
          {/* Current digit */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotateX: isFlipping ? -90 : 0,
              scale: isFlipping ? 0.8 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums drop-shadow-lg">
              {currentDigit}
            </span>
          </motion.div>
          
          {/* Next digit */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ rotateX: 90, scale: 0.8 }}
            animate={{ 
              rotateX: isFlipping ? 0 : 90,
              scale: isFlipping ? 1 : 0.8
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums drop-shadow-lg">
              {nextDigit}
            </span>
          </motion.div>
        </div>
        
        {/* Center line for flip effect */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 transform -translate-y-[0.5px]" />
      </div>
      
      <div className="text-xs text-white/80 mt-2 font-medium drop-shadow-sm">
        {unit}
      </div>
    </div>
  )
}

interface FlipUnitProps {
  value: number
  unit: string
}

function FlipUnit({ value, unit }: FlipUnitProps) {
  const formattedValue = value.toString().padStart(2, '0')
  const digits = formattedValue.split('')
  
  return (
    <div className="flex items-end gap-1">
      {digits.map((digit, index) => (
        <FlipDigit
          key={`${unit}-${index}`}
          digit={digit}
          unit={index === digits.length - 1 ? unit : ''}
        />
      ))}
    </div>
  )
}

export function CountdownTimer() {
  // Initialize with calculated time to prevent flash
  const initialTime = useMemo(() => calculateTimeLeft(), [])
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTime)
  const [mounted, setMounted] = useState(false)

  // August 18, 2025 - National Couples Day
  const launchDate = new Date('2025-08-18T00:00:00').getTime()

  useEffect(() => {
    setMounted(true)
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    // Show the initial calculated time instead of loading skeleton
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-sm text-white/90 font-medium mb-1 drop-shadow-sm">Coming soon...</p>
        </div>
        
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <FlipUnit value={initialTime.days} unit="Days" />
          <FlipUnit value={initialTime.hours} unit="Hours" />
          <FlipUnit value={initialTime.minutes} unit="Minutes" />
          <FlipUnit value={initialTime.seconds} unit="Seconds" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm text-white/90 font-medium mb-1 drop-shadow-sm">Coming soon...</p>
        <p className="text-xs text-white/80 drop-shadow-sm"></p>
      </div>
      
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <FlipUnit value={timeLeft.days} unit="Days" />
        <FlipUnit value={timeLeft.hours} unit="Hours" />
        <FlipUnit value={timeLeft.minutes} unit="Minutes" />
        <FlipUnit value={timeLeft.seconds} unit="Seconds" />
      </div>
    </div>
  )
} 
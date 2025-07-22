'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users } from 'lucide-react'

interface ApplicationNotification {
  id: string
  name: string
  location: string
  time: string
}

export function SocialProofTicker() {
  const [currentNotification, setCurrentNotification] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Sample notifications - in real app, this would come from your backend
  const notifications: ApplicationNotification[] = [
    { id: '1', name: 'Sarah M.', location: 'New York', time: '2 min ago' },
    { id: '2', name: 'Michael R.', location: 'Los Angeles', time: '5 min ago' },
    { id: '3', name: 'Emily K.', location: 'Chicago', time: '7 min ago' },
    { id: '4', name: 'David L.', location: 'Miami', time: '12 min ago' },
    { id: '5', name: 'Jessica T.', location: 'Seattle', time: '15 min ago' },
    { id: '6', name: 'Alex P.', location: 'Austin', time: '18 min ago' }
  ]

  const locations = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Boston', 'Denver']
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length)
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [notifications.length])

  return (
    <div className="space-y-6">
      {/* Real-time Application Notification */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-slate-2/80 backdrop-blur-sm border border-slate-6 rounded-xl px-4 py-3 max-w-sm mx-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1 text-sm">
                <span className="font-medium text-slate-12">
                  {notifications[currentNotification].name}
                </span>
                <span className="text-slate-10"> from </span>
                <span className="font-medium text-slate-11">
                  {notifications[currentNotification].location}
                </span>
                <span className="text-slate-10"> just applied</span>
              </div>
              <div className="text-xs text-slate-9">
                {notifications[currentNotification].time}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-10"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>Applications from:</span>
        </div>
        {locations.slice(0, 4).map((location, index) => (
          <motion.span
            key={location}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="bg-slate-3/50 px-2 py-1 rounded-full"
          >
            {location}
          </motion.span>
        ))}
        <span className="text-slate-9">+15 more</span>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex justify-center items-center gap-8 text-sm"
      >
        <div className="flex items-center gap-2 text-slate-11">
          <Users className="w-4 h-4" />
          <span className="font-medium">2,847+</span>
          <span className="text-slate-10">Applications</span>
        </div>
        <div className="w-1 h-1 bg-slate-6 rounded-full"></div>
                 <div className="text-slate-11">
           <span className="font-medium">Limited</span>
           <span className="text-slate-10"> early access</span>
         </div>
      </motion.div>
    </div>
  )
} 
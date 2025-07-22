'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export function VideoCornerPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {
        // Auto-play failed, which is normal on some browsers
        console.log('Auto-play blocked, video will play when user interacts')
      })
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed inset-0 z-10 flex items-center justify-center"
      style={{
        padding: '5vh 5vw', // Exactly 5% padding on all sides = 90% coverage
      }}
    >
      {/* Video Container - Exactly 90% of screen */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Import and render FOMO banner at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
            {/* Profile Photos */}
            <div className="flex items-center -space-x-2">
              {[
                { id: 1, name: 'Adriana', src: '/adriana.jpg' },
                { id: 2, name: 'Aija', src: '/aija.jpg' },
                { id: 3, name: 'Henry', src: '/henry.webp' },
                { id: 4, name: 'Megan', src: '/megan.webp' },
                { id: 5, name: 'Nas', src: '/nas.jpg' }
              ].map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative"
                >
                  <img
                    src={photo.src}
                    alt={photo.name}
                    className="w-7 h-7 rounded-full border-2 border-white/30 object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Text */}
            <span className="text-white text-sm font-medium drop-shadow-sm">
              Join 5000+ people on June
            </span>
          </div>
        </div>
        {/* Video Element */}
        <video
          ref={videoRef}
          loop
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none' }} // Completely disable interaction
        >
          <source src="/junebgvideoad.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Transparent Black-White Glass Overlay for Apple-like Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-gray-900/25 to-black/35" />
        
        {/* Subtle Glass Tint for Better Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />



        {/* Subtle Pulse Animation Ring */}
        <motion.div
          animate={{
            scale: [1, 1.005, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-3xl border border-purple-400/20 pointer-events-none"
        />
      </div>
    </motion.div>
  )
} 
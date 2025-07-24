'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useWaitlistCount } from '@/hooks/use-waitlist-count'

export function VideoCornerPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { count, isLoading } = useWaitlistCount()
  const [isMobile, setIsMobile] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                            window.innerWidth <= 768 ||
                            ('ontouchstart' in window)
      setIsMobile(isMobileDevice)
    }

    // Check on mount
    checkMobile()

    // Check on resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Delay video loading to improve initial page load
    const timer = setTimeout(() => {
      setShouldLoadVideo(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only play video if not mobile and video should load
    if (videoRef.current && !isMobile && shouldLoadVideo) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {
        // Auto-play failed, which is normal on some browsers
        console.log('Auto-play blocked, video will play when user interacts')
      })
    }
  }, [isMobile, shouldLoadVideo])

  return (
    <>
      {/* Video Container */}
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
          {/* Conditional Video Element - Only render if not mobile and should load */}
          {!isMobile && shouldLoadVideo && (
            <video
              ref={videoRef}
              loop
              muted
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              style={{ pointerEvents: 'none' }} // Completely disable interaction
            >
              <source src="/junebgvideoad.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Fallback background for mobile devices or before video loads */}
          {(isMobile || !shouldLoadVideo) && (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
          )}

          {/* Transparent Black-White Glass Overlay for Apple-like Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-gray-900/25 to-black/35" />
          
          {/* Subtle Glass Tint for Better Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />

          {/* FOMO Banner - Perfectly centered horizontally in video frame */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/30 shadow-2xl"
            >
              {/* Profile Photos */}
              <div className="flex items-center -space-x-2">
                {[
                  { id: 1, name: 'Adriana', src: '/adriana.jpg' },
                  { id: 2, name: 'Aija', src: '/aija.jpg' },
                  { id: 3, name: 'Henry', src: '/henry.webp' },
                  { id: 4, name: 'Megan', src: '/megan.webp' },
                  { id: 5, name: 'Nas', src: '/nas.jpg' }
                ].map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-white/40 object-cover shadow-lg"
                      sizes="32px"
                      quality={75}
                      priority={index < 2}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Text with exact real-time count */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-white text-sm font-semibold drop-shadow-lg">
                  {isLoading ? (
                    'Join others on the June waitlist'
                  ) : count === 0 ? (
                    'Be the first on the June waitlist'
                  ) : count === 1 ? (
                    'Join 1 other on the June waitlist'
                  ) : (
                    `Join ${count+5000} others on the June waitlist`
                  )}
                </span>
                <span className="text-white/90 text-xs drop-shadow-sm">
                  <strong className="text-white">Launching August 18, 2025</strong> • National Couples Day
                </span>
              </div>
            </motion.div>
          </div>

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
    </>
  )
}
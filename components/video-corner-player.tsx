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
          <div className={`absolute left-0 right-0 flex justify-center z-20 ${isMobile ? 'bottom-3' : 'bottom-6'}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center bg-black/40 backdrop-blur-xl rounded-full border border-white/30 shadow-2xl ${
                isMobile 
                  ? 'gap-2 px-3 py-2' // 50% smaller spacing on mobile
                  : 'gap-3 px-6 py-3' // Original spacing on desktop
              }`}
            >
              {/* Profile Photos */}
              <div className={`flex items-center ${isMobile ? '-space-x-1' : '-space-x-2'}`}>
                {[
                  { id: 1, name: 'Model 1', src: '/model1.jpg' },
                  { id: 2, name: 'Model 2', src: '/model2.jpg' },
                  { id: 3, name: 'Model 3', src: '/model3.jpg' },
                  { id: 4, name: 'Model 4', src: '/model4.jpg' },
                  { id: 5, name: 'Model 5', src: '/model5.jpg' }
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
                      width={isMobile ? 16 : 32} // 50% smaller on mobile
                      height={isMobile ? 16 : 32} // 50% smaller on mobile
                      className={`rounded-full border-2 border-white/40 object-cover shadow-lg ${
                        isMobile 
                          ? 'w-4 h-4' // 50% smaller on mobile (16px)
                          : 'w-8 h-8' // Original size on desktop (32px)
                      }`}
                      sizes={isMobile ? "16px" : "32px"}
                      quality={75}
                      priority={index < 2}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Text with exact real-time count */}
              <div className={`flex flex-col items-center ${isMobile ? 'gap-0.5' : 'gap-1'}`}>
                <span className={`text-white font-semibold drop-shadow-lg ${
                  isMobile 
                    ? 'text-xs' // 50% smaller text on mobile
                    : 'text-sm' // Original size on desktop
                }`}>
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
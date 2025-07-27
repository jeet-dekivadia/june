'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function FomoBanner() {

  // Real profile photos from public folder
  const profilePhotos = [
    { id: 1, name: 'girl', src: '/1.jpeg' },
    { id: 2, name: 'girll', src: '/2.jpeg' },
    { id: 3, name: 'man', src: '/3.jpeg' },
    { id: 4, name: 'Mann', src: '/4.jpeg' },
    { id: 5, name: 'gurls', src: '/5.jpeg' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="flex items-center gap-3 bg-black/70 backdrop-blur-lg rounded-full px-4 py-2 border border-white/80">
        {/* Profile Photos */}
        <div className="flex items-center -space-x-2">
          {profilePhotos.map((photo, index) => (
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
                width={28}
                height={28}
                className="w-7 h-7 rounded-full border-2 border-white/30 object-cover"
                sizes="28px"
                quality={75}
                priority={index < 2}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 
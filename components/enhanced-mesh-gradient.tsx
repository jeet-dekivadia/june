'use client'

import { MeshGradient, MeshGradientProps } from '@paper-design/shaders-react'
import { useEffect, useState } from 'react'

export function EnhancedMeshGradient({ speed, ...props }: MeshGradientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay to improve initial paint
    const timer = setTimeout(() => {
      setMounted(true)
      document.body.classList.add('opacity-100')
    }, 200)
    
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800"
        style={{ zIndex: 0 }}
      />
    )
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <MeshGradient 
        {...props} 
        speed={speed ? speed / 10 : 0.25}
        className="w-full h-full"
      />
      {/* Overlay for premium effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10" />
    </div>
  )
} 
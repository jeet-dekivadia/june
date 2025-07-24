'use client'

import { MeshGradient, MeshGradientProps } from '@paper-design/shaders-react'
import { useEffect, useState } from 'react'

export function MeshGradientComponent({ speed, ...props }: MeshGradientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay to improve initial paint
    const timer = setTimeout(() => {
      setMounted(true)
      document.body.classList.add('opacity-100')
    }, 100)

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

  return <MeshGradient {...props} speed={speed ? speed / 10 : 0.25} />
}

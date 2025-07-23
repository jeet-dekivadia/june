'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from "clsx"
import { motion } from 'framer-motion'
import { useIsMobile } from "@/hooks/use-mobile"
import { useState, useEffect } from 'react'

interface CardWithNavProps {
  children: React.ReactNode
}

export function CardWithNav({ children }: CardWithNavProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  const navItems = [
    { href: "/", title: "Apply" },
    { href: "/manifesto", title: "Manifesto" },
  ]

  const activeIndex = navItems.findIndex(item => item.href === pathname)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative">
      {mounted && !isMobile && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-30">
          <nav className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl">
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-3xl p-2 flex relative items-center shadow-lg backdrop-blur-sm">
              {/* Ultra-smooth animated background indicator */}
              <motion.div
                className="absolute h-8 rounded-2xl bg-gradient-to-r from-white/40 to-white/30 backdrop-blur-lg border border-white/50 shadow-lg"
                style={{
                  width: `85px`,
                  left: `8px`,
                }}
                initial={false}
                animate={{
                  x: activeIndex * 85,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8,
                }}
              />

              {/* Navigation items with smooth hover transitions */}
              {navItems.map(({ href, title }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm font-semibold py-2 px-4 text-white w-[85px] flex items-center justify-center drop-shadow-lg z-10 rounded-2xl transition-opacity duration-200 ease-out
                    ${pathname === href ? 'opacity-100 font-bold text-white' : 'opacity-80 hover:opacity-95'}`}
                  {...(href === '/manifesto' ? { 'data-manifesto-btn': true } : {})}
                >
                  {title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Card Content */}
      {children}
    </div>
  )
} 
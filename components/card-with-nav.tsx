'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from "clsx"
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

interface CardWithNavProps {
  children: React.ReactNode
}

export function CardWithNav({ children }: CardWithNavProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  
  const navItems = [
    { href: "/", title: "Apply" },
    { href: "/manifesto", title: "Manifesto" },
  ]

  const activeIndex = navItems.findIndex(item => item.href === pathname)

  return (
    <div className="relative">
      {/* Navigation Toggle - Ultra Smooth Animation */}
      <div className={clsx(
        "absolute left-1/2 transform -translate-x-1/2 z-30",
        // Mobile responsive positioning
        isMobile 
          ? "-top-14" // Closer to card on mobile
          : "-top-16" // Original position on desktop
      )}>
        <nav className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl">
          <div className={clsx(
            "bg-gradient-to-r from-white/10 to-white/5 rounded-3xl flex relative items-center shadow-lg backdrop-blur-sm",
            // Mobile responsive padding
            isMobile 
              ? "p-1.5" // Slightly smaller padding on mobile
              : "p-2" // Original padding on desktop
          )}>
            {/* Ultra-smooth animated background indicator */}
            <motion.div
              className="absolute h-8 rounded-2xl bg-gradient-to-r from-white/40 to-white/30 backdrop-blur-lg border border-white/50 shadow-lg"
              style={{
                width: isMobile ? `75px` : `85px`, // Slightly smaller on mobile
                left: isMobile ? `6px` : `8px`,
              }}
              initial={false}
              animate={{
                x: activeIndex * (isMobile ? 75 : 85), // Adjust animation distance for mobile
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
                className={clsx(
                  "relative font-semibold py-2 px-4 text-white flex items-center justify-center drop-shadow-lg z-10 rounded-2xl transition-opacity duration-200 ease-out",
                  // Mobile responsive sizing
                  isMobile 
                    ? "text-xs w-[75px]" // Smaller text and width on mobile
                    : "text-sm w-[85px]", // Original size on desktop
                  pathname === href ? 'opacity-100 font-bold text-white' : 'opacity-80 hover:opacity-95'
                )}
                {...(href === '/manifesto' ? { 'data-manifesto-btn': true } : {})}
              >
                {title}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Card Content */}
      {children}
    </div>
  )
} 
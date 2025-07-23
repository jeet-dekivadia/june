'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from "clsx"
import { motion } from 'framer-motion'

interface CardWithNavProps {
  children: React.ReactNode
}

export function CardWithNav({ children }: CardWithNavProps) {
  const pathname = usePathname()
  
  const navItems = [
    { href: "/", title: "Apply" },
    { href: "/manifesto", title: "Manifesto" },
  ]

  const activeIndex = navItems.findIndex(item => item.href === pathname)

  return (
    <div className="relative">
      {/* Navigation Toggle - Enhanced Styling */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-30">
        <nav className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl">
          <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-2 flex relative items-center shadow-lg backdrop-blur-sm">
            {/* Enhanced animated background indicator */}
            <motion.div
              className="absolute transition-all duration-300 ease-out h-8 rounded-xl bg-gradient-to-r from-white/40 to-white/30 backdrop-blur-lg border border-white/50 shadow-lg"
              style={{
                width: `85px`,
                left: `calc((${activeIndex} * 85px) + 8px)`,
              }}
              initial={false}
              animate={{
                left: `calc((${activeIndex} * 85px) + 8px)`,
              }}
            />

            {/* Navigation items with improved styling */}
            {navItems.map(({ href, title }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-sm font-semibold py-2 px-4 transition-all duration-300 text-white w-[85px] flex items-center justify-center drop-shadow-lg z-10 rounded-xl
                  ${pathname === href ? 'opacity-100 font-bold text-white' : 'opacity-80 hover:opacity-95'}`}
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
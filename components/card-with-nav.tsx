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
      {/* Navigation Toggle - Inside Card */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
        <nav className="bg-black/20 rounded-full border border-white/20">
          <div className="bg-black/10 rounded-full p-1 flex relative items-center shadow-lg backdrop-blur-sm">
            {/* Animated background indicator */}
            <motion.div
              className="absolute transition-all duration-200 ease-in-out h-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/40"
              style={{
                width: `75px`,
                left: `calc((${activeIndex} * 75px) + 4px)`,
              }}
              initial={false}
              animate={{
                left: `calc((${activeIndex} * 75px) + 4px)`,
              }}
            />

            {/* Navigation items */}
            {navItems.map(({ href, title }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-xs font-medium py-2 px-4 transition-all duration-300 text-white w-[75px] flex items-center justify-center drop-shadow-sm z-10
                  ${pathname === href ? 'opacity-100 font-bold text-white' : 'opacity-70 hover:opacity-90'}`}
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
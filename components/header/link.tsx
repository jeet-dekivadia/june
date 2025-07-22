'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

// Constants for sizing
const LINK_WIDTH = 90
const PADDING = 24
const BACKGROUND_PADDING = 20

// NavbarLink component
export const NavbarLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      className={`relative text-xs font-medium py-2 px-4 transition-all duration-300 text-white w-[75px] flex items-center justify-center drop-shadow-sm z-10
        ${pathname === href ? 'opacity-100 font-bold text-white' : 'opacity-70 hover:opacity-90'}`}
      {...(href === '/manifesto' ? { 'data-manifesto-btn': true } : {})}
    >
      {children}
    </Link>
  )
}

// NavbarLinkBackground component
export const NavbarLinkBackground = ({ links }: { links: string[] }) => {
  const pathname = usePathname()
  const activeIndex = links.indexOf(pathname)

  return (
    <div
      className={clsx(
        'absolute transition-all duration-200 ease-in-out h-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/40'
      )}
      style={{
        width: `75px`,
        left: `calc((${activeIndex} * 75px) + 4px)`,
      }}
    />
  )
}

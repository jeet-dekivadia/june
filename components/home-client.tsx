'use client'

import { useState } from 'react'
import { WaitlistWrapper } from "@/components/box"
import { CountdownTimer } from "@/components/countdown-timer"
import { PremiumWaitlistModal } from "@/components/premium-waitlist-modal"
import { CardWithNav } from "@/components/card-with-nav"

export function HomeClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <CardWithNav>
        <WaitlistWrapper>
                  {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-medium text-white whitespace-pre-wrap text-pretty drop-shadow-lg">
              Welcome to the Future of Dating.
            </h1>
            <div className="text-white/90 text-sm [&>p]:tracking-tight text-pretty">
              <p className="drop-shadow-sm">
                Meet your perfect match through AI-powered conversations. No endless swiping. No ghosting. No fake profiles.
              </p>
            </div>
          </div>

        {/* Countdown Timer */}
        <div className="w-full">
          <CountdownTimer />
        </div>

        {/* Form */}
        <div className="px-1 flex flex-col w-full self-stretch">
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative overflow-hidden bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-lg text-white px-8 py-4 rounded-2xl text-lg font-bold border border-white/20 hover:from-purple-500/90 hover:to-pink-500/90 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-500 group"
          >
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            
            {/* Text with enhanced contrast */}
            <span className="relative z-10 font-bold text-white drop-shadow-lg">
              Apply to Join
            </span>
          </button>
        </div>

        {/* Secondary Info */}
        <div className="space-y-1">
          <p className="text-sm text-white/90 drop-shadow-sm">
            <strong className="text-white">Launching August 18, 2025</strong> • National Couples Day
          </p>
          <p className="text-xs text-white/80 drop-shadow-sm">
            Early applications get priority access. Rolling out in batches.
          </p>
        </div>
        </WaitlistWrapper>
      </CardWithNav>

      {/* Premium Waitlist Modal */}
      <PremiumWaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 
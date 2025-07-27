'use client'

import { useState } from 'react'
import { WaitlistWrapper } from "@/components/box"
import { PremiumWaitlistModal } from "@/components/premium-waitlist-modal"
import { CardWithNav } from "@/components/card-with-nav"
import { LiquidButton } from "@/components/ui/button"

export function HomeClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <CardWithNav>
        <WaitlistWrapper>
                  {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-medium text-white whitespace-pre-wrap text-pretty drop-shadow-lg">
              The Future of Dating
            </h1>
            <div className="text-white/70 text-sm [&>p]:tracking-tight text-pretty">
              <p className="drop-shadow-sm">
                <s>No Swiping</s> <br /> We know you better than you know yourself
              </p>
            </div>
          </div>

        {/* Form */}
        <div className="px-1 flex flex-col w-full self-stretch">
          <LiquidButton
            onClick={() => setIsModalOpen(true)}
            size="xxl"
            className="text-lg font-bold text-white drop-shadow-lg w-full"
          >
            Apply to Join
          </LiquidButton>
        </div>

        {/* Secondary Info */}
        <div className="space-y-1">
          <p className="text-xs text-white/80 drop-shadow-sm">
            
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
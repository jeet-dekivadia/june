'use client'

import clsx from "clsx"
import Image from "next/image"
import { CardWithNav } from "./card-with-nav"

export function ManifestoCard() {
  return (
    <CardWithNav>
      <div
      className={clsx(
        "w-full mx-auto max-w-[450px] flex flex-col justify-center items-center pb-0 overflow-hidden rounded-3xl",
        // Much more transparent dark glass effect with black tint
        "bg-black/5 backdrop-blur-lg border border-black/20",
        // Enhanced shadows for depth
        "shadow-[0px_170px_48px_0px_rgba(0,_0,_0,_0.15),_0px_109px_44px_0px_rgba(0,_0,_0,_0.12),_0px_61px_37px_0px_rgba(0,_0,_0,_0.08),_0px_27px_27px_0px_rgba(0,_0,_0,_0.06),_0px_7px_15px_0px_rgba(0,_0,_0,_0.04)]",
        // Subtle inner dark glow
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-black/5 before:to-transparent before:pointer-events-none",
        "relative"
      )}
    >
      <div className="flex flex-col items-center gap-4 flex-1 text-center w-full p-8 pb-6">
        <div className="flex justify-center items-center mx-auto">
          <div className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-black/10 to-gray-800/10 backdrop-blur-sm">
            <Image
              src="/images/june-logo.png"
              alt="June - Welcome to the Future of Dating"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-white whitespace-pre-wrap text-pretty drop-shadow-lg">
              Our Manifesto
            </h1>
            <div className="text-white/90 text-sm leading-relaxed space-y-3">
              <p className="drop-shadow-sm">
                Dating shouldn't be a numbers game. It should be about finding the one person who truly gets you.
              </p>
              <p className="drop-shadow-sm">
                We're building June to replace endless swiping with meaningful connections powered by advanced AI.
              </p>
              <p className="drop-shadow-sm">
                <strong className="text-white">One match. One conversation. One chance to find love.</strong>
              </p>
            </div>
          </div>

          {/* Vision Statement */}
          <div className="bg-black/10 backdrop-blur-sm border border-black/20 rounded-2xl p-4">
            <p className="text-sm text-white/90 drop-shadow-sm italic">
              "The future of dating isn't about more options—it's about the right option."
            </p>
            <p className="text-xs text-white/70 mt-2 drop-shadow-sm">
              — The June Team
            </p>
          </div>

          {/* Launch Info */}
          <div className="space-y-2">
            <p className="text-sm text-white/90 drop-shadow-sm">
              <strong className="text-white">Launching August 18, 2025</strong> • National Couples Day
            </p>
            <p className="text-xs text-white/80 drop-shadow-sm">
              Join the waitlist. Be part of the revolution.
            </p>
          </div>
        </div>
      </div>
      </div>
    </CardWithNav>
  )
} 
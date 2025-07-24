'use client'

import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"
import { CardWithNav } from "./card-with-nav"
import { ExternalLink, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function ManifestoCard() {
  const [showTeamModal, setShowTeamModal] = useState(false)
  const isMobile = useIsMobile()

  const teamMembers = [
    {
      name: "Aija Mayrock",
      role: "Chief Executive Officer",
      linkedin: "https://www.linkedin.com/in/aija-mayrock-a364a2b5/",
      image: "/aija.jpg"
    },
    {
      name: "Nuseir Yassin", 
      role: "Chief Marketing Officer",
      linkedin: "https://www.linkedin.com/in/nyassin/",
      image: "/nas.jpg"
    },
    {
      name: "Jeet Dekivadia",
      role: "Chief Technology Officer", 
      linkedin: "https://www.linkedin.com/in/jeetdekivadia/",
      image: "/headshot.jpeg"
    },
    {
      name: "Kartik Bihani",
      role: "Chief Product Officer",
      linkedin: "https://www.linkedin.com/in/kbihani/",
      image: "/headshot.jpeg"
    }
  ]

  return (
    <CardWithNav>
      <div
      className={clsx(
        "w-full mx-auto flex flex-col justify-center items-center pb-0 overflow-hidden rounded-3xl",
        // Mobile responsive max-width and padding
        isMobile 
          ? "max-w-[350px] mx-4" // Smaller width with horizontal margin on mobile
          : "max-w-[400px]", // Original width on desktop
        // Ultra-transparent light beige glass effect
        "bg-amber-50/3 backdrop-blur-md border border-amber-100/15",
        // Enhanced shadows for depth
        "shadow-[0px_170px_48px_0px_rgba(0,_0,_0,_0.15),_0px_109px_44px_0px_rgba(0,_0,_0,_0.12),_0px_61px_37px_0px_rgba(0,_0,_0,_0.08),_0px_27px_27px_0px_rgba(0,_0,_0,_0.06),_0px_7px_15px_0px_rgba(0,_0,_0,_0.04)]",
        // Subtle inner beige glow
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-amber-50/2 before:to-transparent before:pointer-events-none",
        "relative"
      )}
    >
      <div 
        className={clsx(
          "flex flex-col items-center gap-4 flex-1 text-center w-full pb-6",
          // Mobile responsive padding
          isMobile 
            ? "p-6" // Reduced padding on mobile
            : "p-8" // Original padding on desktop
        )}
      >
        <div className="flex justify-center items-center mx-auto">
          <div 
            className={clsx(
              "flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-amber-100/8 to-amber-200/8 backdrop-blur-sm",
              // Mobile responsive logo size
              isMobile 
                ? "w-20 h-20" // Smaller logo on mobile
                : "w-24 h-24" // Original size on desktop
            )}
          >
            <Image
              src="/junelogo.png"
              alt="June - Welcome to the Future of Dating"
              width={isMobile ? 64 : 80}
              height={isMobile ? 64 : 80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Heading */}
          <div className="space-y-3">
            <h1 className={clsx(
              "font-semibold text-white whitespace-pre-wrap text-pretty drop-shadow-lg",
              // Mobile responsive text size
              isMobile 
                ? "text-lg" // Smaller text on mobile
                : "text-xl sm:text-2xl" // Original size on desktop
            )}>
              Our Manifesto
            </h1>
            <div className="text-white/90 text-sm leading-relaxed space-y-3">
              <p className="drop-shadow-sm">
                10% people get 90% dates. The age of swiping is over.
              </p>
            </div>
          </div>

          {/* Vision Statement - Clickable */}
          <div 
            onClick={() => setShowTeamModal(true)}
            className="bg-amber-50/5 backdrop-blur-sm border border-amber-100/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-amber-50/8 hover:border-amber-100/30 hover:shadow-lg"
          >
            <p className="text-sm text-white/90 drop-shadow-sm italic">
              "It's not about more options—it's about the right option." 
              <span className="text-xs text-white/70 mt-2 drop-shadow-sm">
              &emsp;— The June Team
              </span>
            </p>
          </div>

          {/* Launch Info */}
          {/* <div className="space-y-2">
            <p className="text-xs text-white/80 drop-shadow-sm">
              Join the waitlist. Be part of the Future.
            </p>
          </div> */}
        </div>
      </div>
      </div>

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-lg">
          <div 
            className={clsx(
              "relative bg-white/[0.03] backdrop-blur-3xl border border-white/[0.8] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/[0.07] before:via-white/[0.02] before:to-transparent before:pointer-events-none",
              // Mobile responsive modal sizing and padding
              isMobile 
                ? "p-6 max-w-sm w-full mx-4" // Smaller modal on mobile with horizontal margins
                : "p-8 max-w-md w-full" // Original size on desktop
            )}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTeamModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <h3 className={clsx(
                "font-semibold text-white drop-shadow-lg",
                // Mobile responsive modal title
                isMobile 
                  ? "text-lg" // Smaller title on mobile
                  : "text-xl" // Original size on desktop
              )}>
                Meet the Team
              </h3>
            </div>

            {/* Team Grid */}
            <div className={clsx(
              "grid gap-4",
              // Mobile responsive grid
              isMobile 
                ? "grid-cols-1" // Single column on mobile
                : "grid-cols-2" // Two columns on desktop
            )}>
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <div className={clsx(
                    "mb-3 rounded-full overflow-hidden border-2 border-white/30 shadow-lg",
                    // Mobile responsive image size
                    isMobile 
                      ? "w-14 h-14" // Smaller images on mobile
                      : "w-16 h-16" // Original size on desktop
                  )}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={isMobile ? 56 : 64}
                      height={isMobile ? 56 : 64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Name and Role */}
                  <div className="space-y-1">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-medium text-white hover:text-white/80 transition-colors duration-200"
                    >
                      {member.name}
                    </a>
                    <p className="text-xs text-white/70">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CardWithNav>
  )
} 
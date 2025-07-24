'use client'

import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"
import { CardWithNav } from "./card-with-nav"
import { ExternalLink, X } from "lucide-react"

export function ManifestoCard() {
  const [showTeamModal, setShowTeamModal] = useState(false)

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
        "w-full mx-auto max-w-[450px] flex flex-col justify-center items-center pb-0 overflow-hidden rounded-3xl",
        // Ultra-transparent light beige glass effect
        "bg-amber-50/3 backdrop-blur-md border border-amber-100/15",
        // Enhanced shadows for depth
        "shadow-[0px_170px_48px_0px_rgba(0,_0,_0,_0.15),_0px_109px_44px_0px_rgba(0,_0,_0,_0.12),_0px_61px_37px_0px_rgba(0,_0,_0,_0.08),_0px_27px_27px_0px_rgba(0,_0,_0,_0.06),_0px_7px_15px_0px_rgba(0,_0,_0,_0.04)]",
        // Subtle inner beige glow
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-amber-50/2 before:to-transparent before:pointer-events-none",
        "relative"
      )}
    >
      <div className="flex flex-col items-center gap-4 flex-1 text-center w-full p-8 pb-6">
        <div className="flex justify-center items-center mx-auto">
          <div className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-amber-100/8 to-amber-200/8 backdrop-blur-sm">
            <Image
              src="/junelogo.png"
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
                10% people get 90% dates.Dating shouldn't be a numbers game. It should be about finding the one person who truly gets you.
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
            </p>
            <p className="text-xs text-white/70 mt-2 drop-shadow-sm">
              — The June Team
            </p>
          </div>

          {/* Launch Info */}
          <div className="space-y-2">
            <p className="text-xs text-white/80 drop-shadow-sm">
              Join the waitlist. Be part of the Future.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-lg">
          <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/[0.8] rounded-3xl p-8 max-w-md w-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/[0.07] before:via-white/[0.02] before:to-transparent before:pointer-events-none">
            {/* Close Button */}
            <button
              onClick={() => setShowTeamModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                Meet the Team
              </h3>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-2 gap-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <div className="w-16 h-16 mb-3 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={64}
                      height={64}
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
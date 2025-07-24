'use client'

import clsx from "clsx"
import type { PropsWithChildren } from "react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"

export function WaitlistWrapper({ children }: PropsWithChildren) {
  const isMobile = useIsMobile()

  return (
    <div
      className={clsx(
        "w-full mx-auto flex flex-col justify-center items-center pb-0 overflow-hidden rounded-3xl",
        // Mobile responsive max-width and padding
        isMobile 
          ? "max-w-[350px] mx-4" // Smaller width with horizontal margin on mobile
          : "max-w-[450px]", // Original width on desktop
        "bg-amber-50/3 backdrop-blur-md border border-amber-100/15",
        "shadow-[0px_170px_48px_0px_rgba(0,_0,_0,_0.15),_0px_109px_44px_0px_rgba(0,_0,_0,_0.12),_0px_61px_37px_0px_rgba(0,_0,_0,_0.08),_0px_27px_27px_0px_rgba(0,_0,_0,_0.06),_0px_7px_15px_0px_rgba(0,_0,_0,_0.04)]",
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
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  )
}

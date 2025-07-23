import clsx from "clsx"
import type { PropsWithChildren } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

export function WaitlistWrapper({ children }: PropsWithChildren) {
  return (
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
        <div className="flex flex-col gap-6">{children}</div>
      </div>
      <footer className="flex justify-between items-center w-full self-stretch px-8 py-3 text-sm bg-gray-12/[.07] overflow-hidden">
        <p className="text-xs text-slate-10">© 2025 June. The future of dating.</p>
        <div className="flex items-center gap-4 text-xs text-slate-10">
          <span>Connect with us:</span>
          <div className="flex items-center gap-2">
            <a
              href="https://x.com/jeetdekivadia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-12 transition-colors duration-200"
            >
              X <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.linkedin.com/in/jeetdekivadia/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-12 transition-colors duration-200"
            >
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

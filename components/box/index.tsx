import clsx from "clsx"
import type { PropsWithChildren } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

export function WaitlistWrapper({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        "w-full mx-auto max-w-[500px] flex flex-col justify-center items-center bg-gray-1/85 pb-0 overflow-hidden rounded-2xl",
        "shadow-[0px_170px_48px_0px_rgba(18,_18,_19,_0.00),_0px_109px_44px_0px_rgba(18,_18,_19,_0.01),_0px_61px_37px_0px_rgba(18,_18,_19,_0.05),_0px_27px_27px_0px_rgba(18,_18,_19,_0.09),_0px_7px_15px_0px_rgba(18,_18,_19,_0.10)]",
      )}
    >
      <div className="flex flex-col items-center gap-4 flex-1 text-center w-full p-8 pb-4">
        <div className="flex justify-center items-center mx-auto">
          <div className="w-32 h-32 flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
            <Image
              src="/images/june-logo.png"
              alt="June - No Swiping. No Efforts. Just the one date that matters"
              width={120}
              height={120}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">{children}</div>
      </div>
      <footer className="flex justify-between items-center w-full self-stretch px-8 py-3 text-sm bg-gray-12/[.07] overflow-hidden">
        <p className="text-xs text-slate-10">© 2025 June. Just one match that matters.</p>
        <div className="flex items-center gap-4 text-xs text-slate-10">
          <span>Reach out on:</span>
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

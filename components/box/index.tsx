import clsx from "clsx"
import type { PropsWithChildren } from "react"
import Image from "next/image"

export function WaitlistWrapper({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        "w-full h-full flex flex-col justify-center items-center overflow-hidden rounded-3xl",
        "bg-amber-50/3 backdrop-blur-md border border-amber-100/15",
        "shadow-[0px_170px_48px_0px_rgba(0,_0,_0,_0.15),_0px_109px_44px_0px_rgba(0,_0,_0,_0.12),_0px_61px_37px_0px_rgba(0,_0,_0,_0.08),_0px_27px_27px_0px_rgba(0,_0,_0,_0.06),_0px_7px_15px_0px_rgba(0,_0,_0,_0.04)]",
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-amber-50/2 before:to-transparent before:pointer-events-none",
        "relative"
      )}
    >
      <div className="flex flex-col items-center gap-4 flex-1 text-center w-full p-4">
        <div className="flex justify-center items-center mx-auto">
          <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-amber-100/8 to-amber-200/8 backdrop-blur-sm">
            <Image
              src="/junelogo.png"
              alt="June - Welcome to the Future of Dating"
              width={60}
              height={60}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  )
}

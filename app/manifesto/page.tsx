import { WaitlistWrapper } from "@/components/box"
import { Alex_Brush } from "next/font/google"
import clsx from "clsx"
import type { Metadata } from "next"

const font = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "Manifesto | June - Just one match that matters",
  description:
    "Our mission to transform dating from endless swiping to meaningful connections through AI-powered conversations.",
}

export default function Manifesto() {
  return (
    <WaitlistWrapper maxWidthClass="max-w-[600px]">
      <div className="flex flex-col gap-10">
        <div className="text-slate-11 [&>p]:tracking-tight [&>p]:leading-[1.6] [&>p:not(:last-child)]:mb-3 text-pretty text-start">
          <p>
            Dating apps have lost their way. What started as a revolution in connection has devolved into an endless
            scroll of faces, reducing human beings to split-second judgments based on curated photos.
          </p>
          <p>
            We believe in a different approach. One where personality matters more than the perfect selfie. Where
            conversations happen before superficial swipes. Where technology serves genuine connection, not addiction.
          </p>
          <p>
            <strong>The Problem is Real:</strong> 80% of Gen Z users report feeling mentally drained by endless swiping.
            Nearly 1 in 2 online daters feel more discouraged than excited. Ghosting and fake profiles have made dating
            feel transactional.
          </p>
          <p>
            <strong>Our Solution is Simple:</strong> June replaces swipe culture with meaningful, AI-mediated
            conversations. Before you ever match with someone, you'll have already talked to their AI avatar—testing
            humor, empathy, and conversational flow in a natural 5-10 minute chat.
          </p>
          <p>No more endless scrolling. No more ghosting after "hey." Just one match that matters.</p>
          <p>Because when dating becomes intentional again, connection becomes real.</p>

          <div className="mt-16 pt-18 border-t border-slate-12">
            <p className="text-sm text-slate-18 mb-8">
              <strong>Backed by:</strong> Nas Company, Nusseir Yasin, and Aija Mayrock
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-0.5 items-start">
            <p className={clsx("text-slate-12 text-4xl font-medium italic transform -rotate-12", font.className)}>
              The June Team
            </p>
            <div className="flex flex-col gap-5 mt-2">
              <p className="text-slate-11 text-sm font-medium">
                <strong>Jeet Dekivadia</strong> & <strong>Kartikey Bihani</strong>
              </p>
              <p className="text-slate-10 text-xs">Co-Founders • Building the future of dating</p>
            </div>
          </div>
        </div>
      </div>
    </WaitlistWrapper>
  )
}

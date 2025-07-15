import { InputForm } from "@/components/waitlist-form"
import { WaitlistWrapper } from "@/components/box"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "June - Just one match that matters",
  description:
    "Dating apps are burning people out. June replaces endless swiping with one high-quality, AI-vetted connection.",
  openGraph: {
    type: "website",
    title: "June - Just one match that matters",
    description:
      "Dating apps are burning people out. June replaces endless swiping with one high-quality, AI-vetted connection.",
  },
  twitter: {
    card: "summary_large_image",
    title: "June - Just one match that matters",
    description:
      "Dating apps are burning people out. June replaces endless swiping with one high-quality, AI-vetted connection.",
  },
}

export default function Home() {
  return (
    <WaitlistWrapper>
      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 whitespace-pre-wrap text-pretty">
          Just one match that matters.
        </h1>
        <div className="text-slate-10 [&>p]:tracking-tight text-pretty">
          <p>
            Dating apps are burning people out. June replaces endless swiping with one high-quality, AI-vetted
            connection.
          </p>
        </div>
      </div>
      {/* Form */}
      <div className="px-1 flex flex-col w-full self-stretch">
        <InputForm
          buttonCopy={{
            idle: "Join Waitlist",
            success: "Welcome to June! 🎉",
            loading: "Joining...",
          }}
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
    </WaitlistWrapper>
  )
}

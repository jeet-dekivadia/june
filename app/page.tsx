import { WaitlistWrapper } from "@/components/box"
import { CountdownTimer } from "@/components/countdown-timer"
import { PremiumWaitlistModal } from "@/components/premium-waitlist-modal"
import { HomeClient } from "@/components/home-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "June - AI Dating App | Find Your Perfect Match Without Endless Swiping",
  description:
    "Join June, the revolutionary AI dating app changing how people find love. No endless swiping, no fake profiles. Our AI technology connects you with your perfect match based on deep compatibility. Sign up for early access to the future of online dating.",
  keywords: [
    "june dating app",
    "AI dating app", 
    "dating app",
    "june date",
    "junedate.com",
    "online dating",
    "dating site",
    "find girlfriend",
    "find boyfriend",
    "perfect match",
    "AI matchmaking",
    "relationship app",
    "dating platform",
    "no swiping dating",
    "meaningful connections",
    "future of dating",
    "love app",
    "romance app",
    "serious dating",
    "dating service"
  ],
  openGraph: {
    type: "website",
    url: "https://junedate.com",
    title: "June - AI Dating App | Find Your Perfect Match Without Endless Swiping",
    description:
      "Join June, the revolutionary AI dating app changing how people find love. No endless swiping, no fake profiles. Our AI technology connects you with your perfect match based on deep compatibility.",
    images: [
      {
        url: "https://junedate.com/junelogo.png",
        width: 1200,
        height: 630,
        alt: "June - The Future of AI Dating App",
        type: "image/png",
      }
    ],
    siteName: "June Dating",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@junedate",
    creator: "@junedate",
    title: "June - AI Dating App | Find Your Perfect Match",
    description:
      "Join June, the revolutionary AI dating app. No endless swiping, no fake profiles. Sign up for early access to the future of dating.",
    images: ["https://junedate.com/junelogo.png"],
  },
  alternates: {
    canonical: "https://junedate.com",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  return <HomeClient />
}

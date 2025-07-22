import { WaitlistWrapper } from "@/components/box"
import { CountdownTimer } from "@/components/countdown-timer"
import { PremiumWaitlistModal } from "@/components/premium-waitlist-modal"
import { HomeClient } from "@/components/home-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "June - Welcome to the Future of Dating",
  description:
    "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. No fake profiles. Just one meaningful connection that could change everything.",
  openGraph: {
    type: "website",
    title: "June - Welcome to the Future of Dating",
    description:
      "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. No fake profiles. Just one meaningful connection that could change everything.",
  },
  twitter: {
    card: "summary_large_image",
    title: "June - Welcome to the Future of Dating",
    description:
      "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. No fake profiles. Just one meaningful connection that could change everything.",
  },
}

export default function Home() {
  return <HomeClient />
}

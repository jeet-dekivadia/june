import { WaitlistWrapper } from "@/components/box"
import { CountdownTimer } from "@/components/countdown-timer"
import { PremiumWaitlistModal } from "@/components/premium-waitlist-modal"
import { HomeClient } from "@/components/home-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "June - AI Dating App",
  description:
    "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. No fake profiles. Experience the future of online dating with meaningful connections powered by AI.",
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
    "dating service",
    "june ai",
    "smart dating"
  ],
  authors: [{ name: "June Team" }],
  creator: "June",
  publisher: "June",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    url: "https://junedate.com",
    title: "June - AI Dating App",
    description:
      "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. No fake profiles. Experience the future of online dating.",
    images: [
      {
        url: "https://junedate.com/images/june-social.png",
        width: 1200,
        height: 630,
        alt: "June - AI Dating App Logo",
        type: "image/png",
      }
    ],
    siteName: "June",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@junedate",
    creator: "@junedate",
    title: "June - AI Dating App",
    description:
      "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. Experience the future of online dating.",
    images: ["https://junedate.com/images/june-social.png"],
  },
  alternates: {
    canonical: "https://junedate.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
}

export default function Home() {
  return <HomeClient />
}

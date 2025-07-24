import { ManifestoCard } from "@/components/manifesto-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Manifesto | June Dating App - Transforming Love Through AI",
  description:
    "Read why we're building the future of dating at June. Our mission to transform how people find love through AI-powered connections, meaningful conversations, and authentic relationships. Join the dating revolution.",
  keywords: [
    "june manifesto",
    "AI dating philosophy", 
    "future of dating",
    "dating app mission",
    "love through AI",
    "meaningful connections",
    "dating revolution",
    "authentic relationships",
    "june dating vision",
    "dating transformation",
    "AI matchmaking philosophy"
  ],
  openGraph: {
    type: "article",
    url: "https://junedate.com/manifesto",
    title: "Our Manifesto | June Dating App - Transforming Love Through AI",
    description:
      "Read why we're building the future of dating at June. Our mission to transform how people find love through AI-powered connections and meaningful conversations.",
    images: [
      {
        url: "https://junedate.com/junelogo.png",
        width: 1200,
        height: 630,
        alt: "June Dating App Manifesto",
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
    title: "Our Manifesto | June Dating App - Transforming Love Through AI",
    description:
      "Read why we're building the future of dating. Our mission to transform how people find love through AI-powered connections.",
    images: ["https://junedate.com/junelogo.png"],
  },
  alternates: {
    canonical: "https://junedate.com/manifesto",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Manifesto() {
  return <ManifestoCard />
}

import { ManifestoCard } from "@/components/manifesto-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "June Manifesto",
  description:
    "Read our manifesto on transforming how people find love. 10% of people get 90% of dates. The age of swiping is over. Discover why we're building the future of dating through AI-powered meaningful connections.",
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
    "AI matchmaking philosophy",
    "no swiping",
    "dating inequality",
    "june team"
  ],
  authors: [{ name: "June Team" }],
  creator: "June",
  publisher: "June",
  openGraph: {
    type: "article",
    url: "https://junedate.com/manifesto",
    title: "June Manifesto",
    description:
      "Read our manifesto on transforming how people find love. 10% of people get 90% of dates. The age of swiping is over. Discover the future of dating.",
    images: [
      {
        url: "https://junedate.com/images/june-social.png",
        width: 1200,
        height: 630,
        alt: "June Manifesto - The Future of Dating",
        type: "image/png",
      }
    ],
    siteName: "June",
    locale: "en_US",
    publishedTime: "2024-01-01T00:00:00.000Z",
    modifiedTime: new Date().toISOString(),
    authors: ["June Team"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@junedate",
    creator: "@junedate",
    title: "June Manifesto",
    description:
      "Read our manifesto on transforming how people find love. 10% of people get 90% of dates. The age of swiping is over.",
    images: ["https://junedate.com/images/june-social.png"],
  },
  alternates: {
    canonical: "https://junedate.com/manifesto",
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
}

export default function Manifesto() {
  return <ManifestoCard />
}

import type React from "react"
import type { Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Geist } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Header } from "@/components/header"
import { MeshGradientComponent } from "@/components/mesh-gradient"
import { FomoBanner } from "@/components/fomo-banner"
import { VideoCornerPlayer } from "@/components/video-corner-player"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: true,
})

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
}

export const metadata = {
  title: {
    template: "%s | June - The Future of AI Dating",
    default: "June - AI Dating App | Find Your Perfect Match | No Endless Swiping",
  },
  description:
    "June is the revolutionary AI dating app that connects you with your perfect match. No endless swiping, no fake profiles. Experience the future of online dating with meaningful connections. Join thousands finding love through AI-powered matchmaking.",
  keywords: [
    "dating app",
    "AI dating", 
    "june dating",
    "june date",
    "junedate",
    "online dating",
    "dating site",
    "relationship app",
    "find girlfriend",
    "find boyfriend", 
    "perfect match",
    "matchmaking",
    "AI matchmaking",
    "dating platform",
    "love app",
    "romance app",
    "dating service",
    "meaningful connections",
    "serious dating",
    "relationship finder"
  ],
  authors: [{ name: "June Dating" }],
  creator: "June Dating",
  publisher: "June Dating",
  metadataBase: new URL('https://junedate.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://junedate.com",
    siteName: "June - AI Dating App",
    title: "June - AI Dating App | Find Your Perfect Match | No Endless Swiping",
    description: "The revolutionary AI dating app that connects you with your perfect match. No endless swiping, no fake profiles. Join thousands finding love through AI-powered matchmaking.",
    images: [
      {
        url: "/junelogo.png",
        width: 1200,
        height: 630,
        alt: "June - The Future of AI Dating",
        type: "image/png",
      },
      {
        url: "/images/june-logo.png", 
        width: 800,
        height: 600,
        alt: "June Dating App Logo",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@junedate",
    creator: "@junedate", 
    title: "June - AI Dating App | Find Your Perfect Match",
    description: "The revolutionary AI dating app that connects you with your perfect match. No endless swiping, no fake profiles. Experience the future of dating.",
    images: ["/junelogo.png"],
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
    google: "your-google-verification-code", // You'll need to add this when you set up Google Search Console
  },
  category: "Dating & Relationships",
  generator: 'Next.js',
  applicationName: 'June Dating App',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "June Dating App",
    "url": "https://junedate.com",
    "description": "Revolutionary AI dating app that connects you with your perfect match. No endless swiping, no fake profiles.",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "iOS, Android, Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "June Dating",
      "url": "https://junedate.com"
    },
    "keywords": "AI dating app, online dating, matchmaking, relationships, dating platform",
    "sameAs": [
      "https://twitter.com/junedate",
      "https://instagram.com/junedate"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.className} antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12 opacity-0 duration-75 transition-opacity`}
      >
        <ThemeProvider
          enableSystem={false}
          disableTransitionOnChange
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
        >
          {/* Original Mesh Gradient Background */}
          <MeshGradientComponent
            colors={["#F5E6D3", "#E8D5C2", "#D4B8A6", "#C19A7B"]} // Beige, cream, and skin tone colors
            speed={2.5}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 0,
              width: "100%",
              height: "100%",
            }}
          />



          {/* Video Corner Player */}
          <VideoCornerPlayer />

          <div className="w-full relative z-20 flex flex-col min-h-screen">
            <main className="flex justify-center items-center min-h-screen">{children}</main>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

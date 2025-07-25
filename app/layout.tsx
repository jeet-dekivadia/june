import type React from "react"
import type { Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/react"
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
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export const metadata = {
  metadataBase: new URL('https://june.date'),
  title: {
    template: "%s | June",
    default: "June - AI Dating App",
  },
  description:
    "The dating app of the future that connects you with your perfect match. No endless swiping.",
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
    "no swiping",
    "future of dating",
    "meaningful connections"
  ],
  authors: [{ name: "June Team" }],
  creator: "Jeet Dekivadia",
  publisher: "Jeet Dekivadia",
  applicationName: "June",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/junelogo.png",
    shortcut: "/junelogo.png",
    apple: "/junelogo.png",
    other: [
      {
        rel: "apple-touch-icon",
        url: "/junelogo.png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://june.date",
    siteName: "June",
    title: "June - AI Dating App",
    description: "The dating app of the future that connects you with your perfect match. No endless swiping.",
    images: [
      {
        url: "https://june.date/images/june-social.png",
        width: 1200,
        height: 630,
        alt: "June - AI Dating App",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@junedate",
    creator: "@junedate",
    title: "June - AI Dating App",
    description: "The dating app of the future that connects you with your perfect match. No endless swiping.",
    images: {
      url: "https://june.date/images/june-social.png",
      alt: "June - AI Dating App",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://june.date",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "June",
  "applicationCategory": "SocialNetworkingApplication",
  "description": "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. Experience the future of online dating.",
  "url": "https://june.date",
  "downloadUrl": "https://june.date",
  "operatingSystem": "iOS, Android, Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "publisher": {
    "@type": "Organization",
    "name": "June",
    "url": "https://june.date",
    "logo": {
      "@type": "ImageObject",
      "url": "https://june.date/images/june-social.png"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "24847"
  },
  "author": {
    "@type": "Organization",
    "name": "June Team"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
            <main className="flex justify-center min-h-screen md:items-center items-start pt-40 md:pt-0">{children}</main>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  )
}

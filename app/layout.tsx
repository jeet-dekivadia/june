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
    template: "%s | June",
    default: "June - Welcome to the Future of Dating",
  },
  description:
    "The revolutionary AI dating app that connects you with your perfect match. No endless swiping. No fake profiles. Just one meaningful connection that could change everything.",
  openGraph: {
    type: "website",
    siteName: "June",
  },
  twitter: {
    card: "summary_large_image",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
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
            colors={["#8b5cf6", "#a855f7", "#c084fc", "#ddd6fe"]} // Purple gradient colors
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

import type React from "react"
import type { Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Geist } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Header } from "@/components/header"
import { MeshGradientComponent } from "@/components/mesh-gradient" // Using the original MeshGradientComponent
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
    default: "June - Just one match that matters",
  },
  description:
    "Dating apps are burning people out. June replaces endless swiping with one high-quality, AI-vetted connection.",
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
          <div className="max-w-screen-sm mx-auto w-full relative z-[1] flex flex-col min-h-screen">
            <div className="px-5 gap-8 flex flex-col flex-1 py-[6vh]">
              <Header />
              <main className="flex justify-center">{children}</main>
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

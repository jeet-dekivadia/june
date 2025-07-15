import type React from "react"
import { ThemeProvider } from "next-themes"

export function Providers({
  children,
  defaultTheme,
  forcedTheme,
}: {
  children: React.ReactNode
  defaultTheme: string | null
  forcedTheme: string | null
}) {
  return (
    <ThemeProvider
      enableSystem={false}
      disableTransitionOnChange
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
    >
      {children}
    </ThemeProvider>
  )
}

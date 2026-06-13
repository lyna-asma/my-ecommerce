"use client"

// this component wraps l entire app bech yjina light/dark mode 
//  "use client" psk client side (browser side)

import * as React from "react"
import { ThemeProvider as ShadcnThemeProvider } from "next-themes"

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ShadcnThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ShadcnThemeProvider>
  )
}

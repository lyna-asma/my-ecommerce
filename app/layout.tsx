import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppThemeProvider } from "@/components/ui/theme-provider"
import { Navigation } from "@/components/ui/navigation"

// load the Inter font from google fonts
const inter = Inter({ subsets: ["latin"] })

// metadata for the website (shows in browser tab)
export const metadata: Metadata = {
  title: "Wearlyn - Modest Luxury Fashion",
  description: "Crafting the in-between — where modesty reigns and luxury is seen",
}

// this is the root layout that wraps every page in our app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* theme provider enables dark mode throughout the app */}
        <AppThemeProvider>
          {/* navigation bar appears on every page */}
          <Navigation />
          
          {/* main content area - each page renders here */}
          <main className="min-h-screen bg-white dark:bg-gray-900">
            {children}
          </main>
          
          {/* footer of my page*/}
          <footer className="border-t bg-gray-50 dark:bg-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2025 Wearlyn. All rights reserved.</p>
            </div>
          </footer>
        </AppThemeProvider>
      </body>
    </html>
  )
}

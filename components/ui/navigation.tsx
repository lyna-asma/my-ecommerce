"use client"

import Link from "next/link"
// useRouter is good to usse allows to programmatically 
// change the page without a full page reload
import { useRouter } from "next/navigation"
import { Moon, Sun, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

export function Navigation() {
  const { theme, setTheme } = useTheme() // for the light/dark
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // when user searches go to products page with search query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
        //when the user submits a search it goes
        //  to /products?search=… without refreshing the page
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* logo and main links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Wearlyn
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Products
              </Link>
              <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Admin
              </Link>
            </div>
          </div>

          {/* search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* dark mode toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-gray-900 dark:text-white" />
            ) : (
              <Moon className="h-5 w-5 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
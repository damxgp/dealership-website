"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useAppStore } from "@/lib/store"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, isDarkMode, toggleDarkMode } = useTheme()
  const { state } = useAppStore()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Sales", href: "/sales" },
    ...(state.settings.rentalEnabled ? [{ name: "Rentals", href: "/rentals" }] : []),
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        theme === "modern"
          ? "border-border"
          : theme === "classic"
            ? "border-amber-200 bg-amber-50/95 dark:bg-amber-950/95"
            : theme === "bold"
              ? "border-purple-200 bg-gradient-to-r from-purple-50/95 to-pink-50/95 dark:from-purple-950/95 dark:to-pink-950/95"
              : "border-red-200 bg-gradient-to-r from-gray-50/95 to-red-50/95 dark:from-gray-900/95 dark:to-red-900/95"
      }`}
    >
      <div className="container mx-auto px-4">
  <div className="flex h-20 items-center justify-between py-4"> {/* Increased height and added padding */}          <Link href="/" className="flex items-center">
            <img
              src="/combe-logo.svg"
              alt="Combe Dealership Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  theme === "classic"
                    ? "text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
                    : theme === "bold"
                      ? "text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100"
                      : theme === "red-black"
                        ? "text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100"
                        : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
        
            <Button
              asChild
              className={`${
                theme === "modern"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : theme === "classic"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : theme === "bold"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
              }`}
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-9 w-9">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  theme === "modern"
                    ? "bg-primary text-primary-foreground"
                    : theme === "classic"
                      ? "bg-amber-600 text-white"
                      : theme === "bold"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gradient-to-r from-red-600 to-red-800 text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
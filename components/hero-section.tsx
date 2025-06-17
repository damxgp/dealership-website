"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

export function HeroSection() {
  const { theme } = useTheme()
  const { state } = useAppStore()

  return (
    <section
      className={`relative py-32 md:py-40 lg:py-48 px-4 ${
        theme === "modern"
          ? "bg-gradient-to-r from-blue-50 to-indigo-100"
          : theme === "classic"
            ? "bg-gradient-to-r from-amber-50 to-orange-100"
            : "bg-gradient-to-r from-purple-100 via-pink-50 to-red-100"
      }`}
    >
      <div className="container mx-auto text-center">
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 ${
            theme === "modern" ? "text-gray-900" : theme === "classic" ? "text-amber-900" : "text-purple-900"
          }`}
        >
          Find Your Perfect Car
        </h1>
        <p
          className={`text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto ${
            theme === "modern" ? "text-gray-600" : theme === "classic" ? "text-amber-700" : "text-purple-700"
          }`}
        >
          Discover quality vehicles for sale and rent. Your journey starts here with {state.settings.dealershipName}.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            asChild
            size="lg"
            className={`text-lg px-8 py-4 h-auto ${
              theme === "bold"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                : theme === "classic"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : ""
            }`}
          >
            <Link href="/sales">Browse Cars for Sale</Link>
          </Button>
          {state.settings.rentalEnabled && (
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
              <Link href="/rentals">Explore Rentals</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

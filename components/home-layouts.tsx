"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useAppStore } from "@/lib/store"
import { FeaturedCars } from "@/components/featured-cars"
import { CarSearch } from "@/components/car-search"
import { QuickLinks } from "@/components/quick-links"
import Link from "next/link"
import { Zap, Trophy, Star, ArrowRight, Play } from "lucide-react"

interface HomeLayoutProps {
  layout: "layout1" | "layout2" | "layout3"
}

export function HomeLayout({ layout }: HomeLayoutProps) {
  const { theme } = useTheme()
  const { state } = useAppStore()

  if (layout === "layout1") {
    return <Layout1 />
  } else if (layout === "layout2") {
    return <Layout2 />
  } else {
    return <Layout3 />
  }
}

function Layout1() {
  const { theme } = useTheme()
  const { state } = useAppStore()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className={`relative py-32 md:py-40 lg:py-48 px-4 overflow-hidden ${
          theme === "modern"
            ? "bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 dark:from-slate-950 dark:via-red-950 dark:to-slate-950"
            : theme === "classic"
              ? "bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 dark:from-amber-950 dark:via-orange-900 dark:to-amber-950"
              : theme === "bold"
                ? "bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 dark:from-purple-950 dark:via-pink-900 dark:to-purple-950"
                : "bg-gradient-to-br from-gray-900 via-red-900 to-black dark:from-black dark:via-red-900 dark:to-gray-900"
        }`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-6 animate-pulse-slow">
            <Zap className={`w-8 h-8 ${
              theme === "red-black" 
                ? "text-red-500 dark:text-red-400" 
                : "text-yellow-400 dark:text-yellow-500"
            }`} />
            <span className={`font-semibold text-lg ${
              theme === "red-black" 
                ? "text-white dark:text-white" 
                : "text-yellow-400 dark:text-yellow-500"
            }`}>
              PREMIUM PERFORMANCE
            </span>
          </div>
   <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white animate-slide-in-left">
  Drive Your
  <span className={`block ${
    theme === "red-black"
      ? "text-black dark:text-white"  // Changed to white in dark mode
      : "bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 bg-clip-text text-transparent"
  } animate-slide-in-right`}>
    Dreams
  </span>
</h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto text-gray-200 dark:text-gray-300">
            Discover the world's most exclusive sports cars and luxury vehicles at {state.settings.dealershipName}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className={`text-lg px-8 py-4 h-auto ${
                theme === "red-black"
                  ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                  : "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              } text-white font-bold`}
            >
              <Link href="/sales">
                <Trophy className="w-5 h-5 mr-2" />
                Explore Collection
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={`text-lg px-8 py-4 h-auto ${
                theme === "red-black"
                  ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-black dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-black"
              }`}
            >
              <Link href="/contact">Schedule Test Drive</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <div className="container mx-auto px-4 py-8">
        <CarSearch />
        <FeaturedCars />
        <QuickLinks />
      </div>
    </div>
  )
}

function Layout2() {
  const { theme } = useTheme()
  const { state } = useAppStore()

  return (
    <div className="min-h-screen">
      {/* Split Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
                <Star className={`w-6 h-6 ${
                  theme === "red-black" 
                    ? "text-red-500 dark:text-red-400" 
                    : "text-yellow-500 dark:text-yellow-600"
                }`} />
                <span className={`font-semibold ${
                  theme === "red-black" 
                    ? "text-red-500 dark:text-red-400" 
                    : "text-yellow-500 dark:text-yellow-600"
                }`}>
                  LUXURY REDEFINED
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Experience
                <span className={`block ${
                  theme === "modern" 
                    ? "text-red-600 dark:text-red-500" 
                    : theme === "classic" 
                      ? "text-amber-600 dark:text-amber-500" 
                      : theme === "red-black"
                        ? "text-red-600 dark:text-red-500"
                        : "text-primary"
                }`}>
                  Excellence
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                From high-performance sports cars to luxury sedans, find your perfect match in our curated collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className={`text-lg px-8 py-4 h-auto ${
                    theme === "modern"
                      ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                      : theme === "red-black"
                        ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                        : ""
                  }`}
                >
                  <Link href="/sales">
                    View Inventory
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className={`text-lg px-8 py-4 h-auto ${
                    theme === "red-black"
                      ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                      : ""
                  }`}
                >
                  <Link href="/about">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Story
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className={`aspect-[4/3] rounded-2xl overflow-hidden ${
                theme === "modern"
                  ? "bg-gradient-to-br from-red-600/20 to-red-500/5 dark:from-red-700/20 dark:to-red-600/5"
                  : theme === "red-black"
                    ? "bg-gradient-to-br from-red-600/20 to-black/10 dark:from-red-700/20 dark:to-black/10"
                    : "bg-gradient-to-br from-primary/20 to-primary/5"
              }`}>
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Hero Car Image</span>
                </div>
              </div>
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl ${
                theme === "modern"
                  ? "bg-red-600/10 dark:bg-red-700/10"
                  : theme === "red-black"
                    ? "bg-red-600/10 dark:bg-red-700/10"
                    : "bg-primary/10"
              }`} />
              <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full blur-2xl ${
                theme === "red-black"
                  ? "bg-red-500/20 dark:bg-red-400/20"
                  : "bg-yellow-500/20"
              }`} />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <CarSearch />
        <FeaturedCars />
        <QuickLinks />
      </div>
    </div>
  )
}

function Layout3() {
  const { theme } = useTheme()
  const { state } = useAppStore()

  return (
    <div className="min-h-screen">
      {/* Minimal Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
          <h1 className={`text-6xl md:text-8xl font-light mb-8 tracking-tight animate-scale-in ${
            theme === "modern" 
              ? "text-red-600 dark:text-red-500" 
              : theme === "red-black"
                ? "text-red-600 dark:text-red-500"
                : ""
          }`}>
            {state.settings.dealershipName}
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground mb-12 font-light max-w-3xl mx-auto">
            Where performance meets perfection
          </p>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className={`text-lg px-12 py-4 h-auto rounded-full ${
              theme === "modern" 
                ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white" 
                : theme === "red-black"
                  ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                  : ""
            }`}
          >
            <Link href="/sales">Discover More</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${
        theme === "red-black"
          ? "bg-black/30 dark:bg-gray-900/30"
          : "bg-muted/30"
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className={`text-4xl font-bold mb-2 ${
                theme === "modern" 
                  ? "text-red-600 dark:text-red-500" 
                  : theme === "red-black"
                    ? "text-red-600 dark:text-red-500"
                    : "text-primary"
              }`}>500+</div>
              <div className="text-muted-foreground">Premium Vehicles</div>
            </div>
            <div>
              <div className={`text-4xl font-bold mb-2 ${
                theme === "modern" 
                  ? "text-red-600 dark:text-red-500" 
                  : theme === "red-black"
                    ? "text-red-600 dark:text-red-500"
                    : "text-primary"
              }`}>25+</div>
              <div className="text-muted-foreground">Luxury Brands</div>
            </div>
            <div>
              <div className={`text-4xl font-bold mb-2 ${
                theme === "modern" 
                  ? "text-red-600 dark:text-red-500" 
                  : theme === "red-black"
                    ? "text-red-600 dark:text-red-500"
                    : "text-primary"
              }`}>10K+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div>
              <div className={`text-4xl font-bold mb-2 ${
                theme === "modern" 
                  ? "text-red-600 dark:text-red-500" 
                  : theme === "red-black"
                    ? "text-red-600 dark:text-red-500"
                    : "text-primary"
              }`}>15</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <CarSearch />
        <FeaturedCars />
        <QuickLinks />
      </div>
    </div>
  )
}
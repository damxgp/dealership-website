"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAppStore } from "@/lib/store"

type Theme = "modern" | "classic" | "bold" | "red-black"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useAppStore()
  const theme = state.settings.theme
  const prevThemeRef = useRef(theme)
  const prevCustomColorsRef = useRef(state.settings.customColors)
  const [isDarkMode, setIsDarkMode] = useState(false) // Default to false (light mode)

  const setTheme = (newTheme: Theme) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: { theme: newTheme } })
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("dark-mode", newMode.toString())
  }

  useEffect(() => {
    // Load dark mode preference (defaults to light mode if not set)
    const savedDarkMode = localStorage.getItem("dark-mode")
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true")
    }
    // Removed system preference detection entirely
  }, [])

  useEffect(() => {
    // Apply dark mode class
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    // Apply theme-specific styles
    const applyThemeStyles = () => {
      const root = document.documentElement
      
      // Reset all theme variables first
      root.style.removeProperty('--primary')
      root.style.removeProperty('--secondary')
      root.style.removeProperty('--accent')
      root.style.removeProperty('--background')
      root.style.removeProperty('--foreground')

      if (theme === "red-black") {
        if (isDarkMode) {
          // Dark mode red-black theme
          root.style.setProperty('--primary', '0 84% 60%')
          root.style.setProperty('--secondary', '0 0% 20%')
          root.style.setProperty('--accent', '0 84% 50%')
          root.style.setProperty('--background', '0 0% 0%')
          root.style.setProperty('--foreground', '0 0% 90%')
        } else {
          // Light mode red-black theme
          root.style.setProperty('--primary', '0 84% 60%')
          root.style.setProperty('--secondary', '0 0% 90%')
          root.style.setProperty('--accent', '0 84% 50%')
          root.style.setProperty('--background', '0 0% 100%')
          root.style.setProperty('--foreground', '0 0% 20%')
        }
      } else if (theme === "custom" && state.settings.customColors) {
        // Custom colors implementation remains the same
        const colors = state.settings.customColors
        const hexToHsl = (hex: string) => {
          // ... (existing hexToHsl implementation)
        }
        // ... (existing custom colors implementation)
      }

      document.documentElement.setAttribute("data-theme", theme)
      prevThemeRef.current = theme
      prevCustomColorsRef.current = state.settings.customColors
    }

    // Only update if theme or custom colors actually changed
    const themeChanged = prevThemeRef.current !== theme
    const customColorsChanged =
      JSON.stringify(prevCustomColorsRef.current) !== JSON.stringify(state.settings.customColors)

    if (themeChanged || customColorsChanged) {
      applyThemeStyles()
    }
  }, [theme, state.settings.customColors, isDarkMode])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
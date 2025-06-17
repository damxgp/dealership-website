import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AppProvider } from "@/lib/store"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Combe's Car Center- Drive your dream with us!",
  description: "Your trusted partner for premium sports cars and luxury vehicles",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
           <head>
        <link rel="icon" href="/combe-logo.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

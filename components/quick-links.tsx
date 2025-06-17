"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Info, Phone } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function QuickLinks() {
  const { theme } = useTheme()

  const links = [
    {
      title: "Car Sales",
      description: "Browse our extensive inventory of quality vehicles",
      icon: Car,
      href: "/sales",
      color: theme === "classic" ? "text-amber-600" : 
             theme === "bold" ? "text-purple-600" : 
             "text-red-600 dark:text-red-500",
    },
    {
      title: "About Us",
      description: "Learn more about our dealership and team",
      icon: Info,
      href: "/about",
      color: theme === "classic" ? "text-amber-600" : 
             theme === "bold" ? "text-purple-600" : 
             "text-red-600 dark:text-red-500",
    },
    {
      title: "Contact",
      description: "Get in touch or schedule a meeting",
      icon: Phone,
      href: "/contact",
      color: theme === "classic" ? "text-amber-600" : 
             theme === "bold" ? "text-pink-600" : 
             "text-red-600 dark:text-red-500",
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2
        className={`text-3xl font-bold text-center mb-8 ${
          theme === "classic" ? "text-amber-900" : 
          theme === "bold" ? "text-purple-900" : 
          "text-foreground"
        }`}
      >
        Quick Access
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {links.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card
              className={`h-full hover:shadow-lg transition-shadow cursor-pointer ${
                theme === "classic"
                  ? "border-amber-200 hover:border-amber-300"
                  : theme === "bold"
                    ? "border-purple-200 hover:border-purple-300"
                    : "border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
              }`}
            >
              <CardHeader className="text-center">
                <link.icon className={`w-12 h-12 mx-auto mb-2 ${link.color}`} />
                <CardTitle
                  className={
                    theme === "classic" ? "text-amber-900" : 
                    theme === "bold" ? "text-purple-900" : 
                    "text-foreground"
                  }
                >
                  {link.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

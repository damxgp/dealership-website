"use client"

import Link from "next/link"
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function Footer() {
  const { theme } = useTheme()

  return (
    <footer
      className={`border-t ${
        theme === "modern"
          ? "bg-muted/50"
          : theme === "classic"
            ? "bg-amber-50 border-amber-200"
            : theme === "bold"
              ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
              : "bg-gradient-to-r from-gray-50 to-red-50 border-red-200 dark:from-gray-900 dark:to-red-900 dark:border-red-800"
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car
                className={`h-6 w-6 ${
                  theme === "modern" 
                    ? "text-primary" 
                    : theme === "classic" 
                      ? "text-amber-600" 
                      : theme === "red-black"
                        ? "text-red-600"
                        : "text-purple-600"
                }`}
              />
              <span
                className={`text-lg font-bold ${
                  theme === "modern" 
                    ? "text-foreground" 
                    : theme === "classic" 
                      ? "text-amber-900" 
                      : theme === "red-black"
                        ? "text-red-900 dark:text-red-700"
                        : "text-purple-900"
                }`}
              >
                Combe's Car Center
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
Drive your dream with us.            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3
              className={`font-semibold ${
                theme === "classic" 
                  ? "text-amber-900" 
                  : theme === "bold" 
                    ? "text-purple-900" 
                    : theme === "red-black"
                      ? "text-red-900 dark:text-red-700"
                      : "text-foreground"
              }`}
            >
              Quick Links
            </h3>
            <div className="space-y-2">
              {["Sales", "Rentals", "About", "FAQ", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`block text-sm text-muted-foreground hover:text-primary ${
                    theme === "red-black" ? "hover:text-red-600" : ""
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3
              className={`font-semibold ${
                theme === "classic" 
                  ? "text-amber-900" 
                  : theme === "bold" 
                    ? "text-purple-900" 
                    : theme === "red-black"
                      ? "text-red-900 dark:text-red-700"
                      : "text-foreground"
              }`}
            >
              Contact Info
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(597) 520-385</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>combecarcenternv@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Grote Combeweg, Paramaribo, Suriname</span>
              </div>
            </div>
          </div>

          {/* Business Hours & Social */}
          <div className="space-y-4">
            <h3
              className={`font-semibold ${
                theme === "classic" 
                  ? "text-amber-900" 
                  : theme === "bold" 
                    ? "text-purple-900" 
                    : theme === "red-black"
                      ? "text-red-900 dark:text-red-700"
                      : "text-foreground"
              }`}
            >
              Business Hours
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>Mon-Fri: 8:00 AM - 4:30 PM</div>
              <div>Saturday: 8:00 AM - 4:30 PM</div>
              <div>Sunday: Closed</div>
            </div>
            <div className="flex space-x-4">
              <Facebook className={`h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer ${
                theme === "red-black" ? "hover:text-red-600" : ""
              }`} />
              <Twitter className={`h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer ${
                theme === "red-black" ? "hover:text-red-600" : ""
              }`} />
              <Instagram className={`h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer ${
                theme === "red-black" ? "hover:text-red-600" : ""
              }`} />
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t text-center text-sm text-muted-foreground ${
          theme === "red-black" ? "border-red-200 dark:border-red-800" : ""
        }`}>
          <p>&copy; 2024 Combe's Car Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
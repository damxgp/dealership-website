"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Fuel, Users, Zap } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAppStore } from "@/lib/store"
import Image from "next/image"
import Link from "next/link"

export function FeaturedCars() {
  const { theme } = useTheme()
  const { state } = useAppStore()

  const featuredCars = state.cars.filter((car) => car.featured)

  if (featuredCars.length === 0) {
    return (
      <section className="mb-12">
        <h2
          className={`text-3xl font-bold text-center mb-8 ${
            theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-red-900"
          }`}
        >
          Featured Vehicles
        </h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No featured vehicles available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <h2
          className={`text-4xl font-bold text-center ${
            theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-black-900"
          }`}
        >
          Featured  Vehicles
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
        {featuredCars.map((car, index) => (
          <Card
            key={car.id}
            className={`overflow-hidden hover-lift transition-all duration-300 border-2 ${
              theme === "classic"
                ? "border-amber-200 hover:border-amber-300"
                : theme === "bold"
                  ? "border-purple-200 hover:border-purple-300"
                  : "border-red-200 hover:border-red-300"
            }`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <CardHeader className="p-0">
              <div className="relative group">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge
                  className={`absolute top-3 right-3 ${car.type === "sale" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white font-semibold`}
                >
                  {car.type === "sale" ? "FOR SALE" : "FOR RENT"}
                </Badge>
                {!car.inStock && (
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white font-semibold">OUT OF STOCK</Badge>
                )}
                {car.selling && (
                  <Badge className="absolute bottom-3 left-3 bg-yellow-500 text-black font-semibold">HOT DEAL</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="mb-3 text-xl">
                {car.year} {car.make} {car.model}
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{car.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-3xl font-bold ${
                    theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-red-600"
                  }`}
                >
                  ${car.price.toLocaleString()}
                  {car.type === "rental" && <span className="text-sm font-normal">/day</span>}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{car.mileage} mi</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  <span>{car.fuel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{car.seats} seats</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                asChild
                className={`w-full font-semibold ${
                  theme === "bold"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : theme === "classic"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={!car.inStock && car.type === "sale"}
              >
                <Link href={`/car/${car.id}`}>{car.type === "sale" ? "View Details" : "Check Availability"}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
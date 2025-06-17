"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarSearch, type SearchFilters } from "@/components/car-search"
import { Calendar, Fuel, Users } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAppStore } from "@/lib/store"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function SalesPage() {
  const { theme } = useTheme()
  const { state } = useAppStore()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("all")

  // Initialize search filters from URL params only once
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(() => ({
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    year: searchParams.get("year") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  }))

  // Filter cars based on search criteria and active tab
  const filteredCars = useMemo(() => {
    let cars = state.cars.filter((car) => car.type === "sale")

    // Apply tab filter
    if (activeTab === "selling") {
      cars = cars.filter((car) => car.selling)
    } else if (activeTab === "instock") {
      cars = cars.filter((car) => car.inStock)
    }

    // Apply search filters
    if (searchFilters.make && searchFilters.make !== "all" && searchFilters.make !== "") {
      cars = cars.filter((car) => car.make.toLowerCase().includes(searchFilters.make.toLowerCase()))
    }
    if (searchFilters.model && searchFilters.model !== "all" && searchFilters.model !== "") {
      cars = cars.filter((car) => car.model.toLowerCase().includes(searchFilters.model.toLowerCase()))
    }
    if (searchFilters.year && searchFilters.year !== "all" && searchFilters.year !== "") {
      cars = cars.filter((car) => car.year.toString() === searchFilters.year)
    }
    if (searchFilters.minPrice && searchFilters.minPrice !== "") {
      cars = cars.filter((car) => car.price >= Number.parseInt(searchFilters.minPrice))
    }
    if (searchFilters.maxPrice && searchFilters.maxPrice !== "") {
      cars = cars.filter((car) => car.price <= Number.parseInt(searchFilters.maxPrice))
    }

    return cars
  }, [state.cars, activeTab, searchFilters])

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1
        className={`text-4xl font-bold text-center mb-8 animate-fade-in-up ${
          theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
        }`}
      >
        Premium Cars for Sale
      </h1>

      <CarSearch onSearch={handleSearch} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Cars ({state.cars.filter((car) => car.type === "sale").length})</TabsTrigger>
          <TabsTrigger value="selling">
            Hot Deals ({state.cars.filter((car) => car.type === "sale" && car.selling).length})
          </TabsTrigger>
          <TabsTrigger value="instock">
            In Stock ({state.cars.filter((car) => car.type === "sale" && car.inStock).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12 animate-fade-in-up">
              <p className="text-muted-foreground text-lg">No cars found matching your criteria.</p>
              <Button
                onClick={() => handleSearch({ make: "", model: "", year: "", minPrice: "", maxPrice: "" })}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car, index) => (
                <Card
                  key={car.id}
                  className={`overflow-hidden hover-lift transition-all duration-300 animate-fade-in-up ${
                    theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
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
                      <div className="absolute top-2 right-2 space-y-1">
                        {car.selling && <Badge className="bg-green-500">Hot Deal</Badge>}
                        {car.inStock ? (
                          <Badge className="bg-blue-500">In Stock</Badge>
                        ) : (
                          <Badge className="bg-red-500">Out of Stock</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2">
                      {car.year} {car.make} {car.model}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{car.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-2xl font-bold ${
                          theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
                        }`}
                      >
                        ${car.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {car.mileage} mi
                      </div>
                      <div className="flex items-center">
                        <Fuel className="w-4 h-4 mr-1" />
                        {car.fuel}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {car.seats} seats
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      asChild
                      className={`w-full ${
                        theme === "bold"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          : ""
                      }`}
                      disabled={!car.inStock}
                    >
                      <Link href={`/car/${car.id}`}>{car.inStock ? "View Details" : "Out of Stock"}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

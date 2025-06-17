"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

interface CarSearchProps {
  onSearch?: (filters: SearchFilters) => void
}

export interface SearchFilters {
  make: string
  model: string
  year: string
  minPrice: string
  maxPrice: string
}

export function CarSearch({ onSearch }: CarSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    make: "all",
    model: "all",
    year: "all",
    minPrice: "",
    maxPrice: "",
  })
  const { theme } = useTheme()
  const router = useRouter()
  const { state } = useAppStore()

  // Get available options based on current filters
  const availableOptions = useMemo(() => {
    let filteredCars = state.cars.filter((car) => car.type === "sale")

    // Filter by selected make first
    if (filters.make && filters.make !== "all") {
      filteredCars = filteredCars.filter((car) => car.make.toLowerCase() === filters.make.toLowerCase())
    }

    // Get unique makes
    const makes = Array.from(
      new Set(state.cars.filter((car) => car.type === "sale").map((car) => car.make.toLowerCase())),
    ).sort()

    // Get unique models based on selected make
    const models = Array.from(new Set(filteredCars.map((car) => car.model.toLowerCase()))).sort()

    // Get unique years based on selected make/model
    let yearFilteredCars = filteredCars
    if (filters.model && filters.model !== "all") {
      yearFilteredCars = filteredCars.filter((car) => car.model.toLowerCase() === filters.model.toLowerCase())
    }
    const years = Array.from(new Set(yearFilteredCars.map((car) => car.year.toString()))).sort(
      (a, b) => Number(b) - Number(a),
    )

    return { makes, models, years }
  }, [state.cars, filters.make, filters.model])

  const handleMakeChange = (value: string) => {
    setFilters({
      ...filters,
      make: value,
      model: "all", // Reset model when make changes
      year: "all", // Reset year when make changes
    })
  }

  const handleModelChange = (value: string) => {
    setFilters({
      ...filters,
      model: value,
      year: "all", // Reset year when model changes
    })
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters)
    } else {
      // Navigate to sales page with search params
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value)
      })
      router.push(`/sales?${params.toString()}`)
    }
  }

  const handleClear = () => {
    const clearedFilters = {
      make: "all",
      model: "all",
      year: "all",
      minPrice: "",
      maxPrice: "",
    }
    setFilters(clearedFilters)
    if (onSearch) {
      onSearch(clearedFilters)
    }
  }

  return (
    <Card
      className={`mb-12 ${
        theme === "classic"
          ? "border-amber-200 bg-amber-50/50"
          : theme === "bold"
            ? "border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
            : ""
      }`}
    >
      <CardHeader>
        <CardTitle
          className={`text-center ${
            theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : ""
          }`}
        >
          Search & Filter Cars
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Select value={filters.make} onValueChange={handleMakeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {availableOptions.makes.map((make) => (
                <SelectItem key={make} value={make}>
                  {make.charAt(0).toUpperCase() + make.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.model} onValueChange={handleModelChange} disabled={filters.make === "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {availableOptions.models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model.charAt(0).toUpperCase() + model.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.year}
            onValueChange={(value) => setFilters({ ...filters, year: value })}
            disabled={filters.make === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {availableOptions.years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Min Price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />

          <Input
            placeholder="Max Price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              className={`flex-1 ${
                theme === "bold"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  : ""
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

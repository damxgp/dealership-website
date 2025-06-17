"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Fuel, Users } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAppStore, type Booking } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import Image from "next/image"

export default function RentalsPage() {
  const { theme } = useTheme()
  const { state, dispatch } = useAppStore()
  const { toast } = useToast()
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedCar, setSelectedCar] = useState<string | null>(null)
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)

  const rentalCars = useMemo(() => {
    return state.cars.filter((car) => car.type === "rental")
  }, [state.cars])

  // Check if rentals are enabled
  const isRentalEnabled = state.settings.rentalEnabled

  const handleBookNow = (carId: string) => {
    if (!selectedDates.from || !selectedDates.to) {
      toast({
        title: "Please select dates",
        description: "You need to select pickup and return dates before booking.",
        variant: "destructive",
      })
      return
    }
    setSelectedCar(carId)
    setIsBookingDialogOpen(true)
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCar || !selectedDates.from || !selectedDates.to) return

    const car = state.cars.find((c) => c.id === selectedCar)
    if (!car) return

    const newBooking: Booking = {
      id: Date.now().toString(),
      type: "rental",
      customerName: bookingForm.name,
      customerEmail: bookingForm.email,
      customerPhone: bookingForm.phone,
      bookingDate: format(selectedDates.from, "yyyy-MM-dd"),
      carId: selectedCar,
      status: "pending",
      notes: `Rental from ${format(selectedDates.from, "PPP")} to ${format(selectedDates.to, "PPP")}`,
      createdAt: new Date().toISOString(),
    }

    dispatch({ type: "ADD_BOOKING", payload: newBooking })

    toast({
      title: "Booking Submitted!",
      description: `Your rental request for the ${car.year} ${car.make} ${car.model} has been submitted. We'll contact you soon to confirm.`,
    })

    setIsBookingDialogOpen(false)
    setBookingForm({ name: "", email: "", phone: "" })
    setSelectedCar(null)
  }

  if (!isRentalEnabled) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Car Rentals</h1>
          <p className="text-muted-foreground text-lg">Car rental service is currently unavailable.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
        }`}
      >
        Car Rentals
      </h1>

      {/* Date Selection */}
      <Card
        className={`mb-8 ${
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
            Select Rental Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDates.from ? format(selectedDates.from, "PPP") : "Pick up date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDates.from}
                  onSelect={(date) => setSelectedDates({ ...selectedDates, from: date })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDates.to ? format(selectedDates.to, "PPP") : "Return date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDates.to}
                  onSelect={(date) => setSelectedDates({ ...selectedDates, to: date })}
                  disabled={(date) => date < new Date() || (selectedDates.from && date <= selectedDates.from)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Rental Cars */}
      {rentalCars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No rental cars available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalCars.map((car) => (
            <Card
              key={car.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
              }`}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${car.available !== false ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {car.available !== false ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2">
                  {car.year} {car.make} {car.model}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{car.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily:</span>
                    <span
                      className={`font-semibold ${
                        theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
                      }`}
                    >
                      ${car.dailyRate || car.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Weekly:</span>
                    <span
                      className={`font-semibold ${
                        theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
                      }`}
                    >
                      ${car.weeklyRate || car.price * 6.5}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly:</span>
                    <span
                      className={`font-semibold ${
                        theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
                      }`}
                    >
                      ${car.monthlyRate || car.price * 25}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                  onClick={() => handleBookNow(car.id)}
                  className={`w-full ${
                    theme === "bold"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : ""
                  }`}
                  disabled={car.available === false}
                >
                  {car.available !== false ? "Book Now" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Rental Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={bookingForm.email}
                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                required
              />
            </div>
            {selectedDates.from && selectedDates.to && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Rental Period:</strong> {format(selectedDates.from, "PPP")} to{" "}
                  {format(selectedDates.to, "PPP")}
                </p>
              </div>
            )}
            <Button type="submit" className="w-full">
              Submit Booking Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Share,
  Heart,
  BarChart3,
  Calendar,
  Gauge,
  Fuel,
  Car,
  Cog,
  Palette,
  DoorOpen,
  FuelIcon as Engine,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { state } = useAppStore()
  const { theme } = useTheme()
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [carImages, setCarImages] = useState<string[]>([])

  const car = state.cars.find((c) => c.id === params.id)

  useEffect(() => {
    if (!car) return

    // Combine main image with additional images
    const images = [
      car.image,
      ...(Array.isArray(car.images) ? car.images : typeof car.images === 'string' ? JSON.parse(car.images) : [])
    ].filter(Boolean)
    
    setCarImages(images)

    // Check if car is saved
    const savedCars = JSON.parse(localStorage.getItem("saved-cars") || "[]")
    setIsSaved(savedCars.includes(car.id))
  }, [car?.id])

  const handleShare = async () => {
    if (!car) return

    const shareData = {
      title: `${car.year} ${car.make} ${car.model}`,
      text: `Check out this ${car.year} ${car.make} ${car.model} for $${car.price.toLocaleString()}`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast({
          title: "Shared Successfully!",
          description: "Car listing has been shared.",
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied!",
          description: "Car listing link copied to clipboard.",
        })
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied!",
          description: "Car listing link copied to clipboard.",
        })
      } catch (clipboardError) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy link. Please copy the URL manually.",
          variant: "destructive",
        })
      }
    }
  }
// Add these state variables at the top of your component
const [carForm, setCarForm] = useState({
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  type: "",
  mileage: 0,
  fuel: "",
  seats: 5,
  inStock: true,
  featured: false,
  selling: false,
  image: "",
  images: [] as string[],
  description: "",
  dailyRate: 0,
  weeklyRate: 0,
  monthlyRate: 0,
  available: true,
  bodyType: "",
  condition: "",
  engineSize: "",
  doors: 4,
  cylinders: 4,
  color: "",
  vin: "",
  transmission: "",
  driveType: "",
  features: {} as Record<string, string[]>,
  paymentOptions: [] as string[],
  warranty: [] as string[],
});

const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (!car) return

    const savedCars = JSON.parse(localStorage.getItem("saved-cars") || "[]")

    if (isSaved) {
      const updatedSaved = savedCars.filter((id: string) => id !== car.id)
      localStorage.setItem("saved-cars", JSON.stringify(updatedSaved))
      setIsSaved(false)
      toast({
        title: "Removed from Saved",
        description: "Car removed from your saved list.",
      })
    } else {
      const updatedSaved = [...savedCars, car.id]
      localStorage.setItem("saved-cars", JSON.stringify(updatedSaved))
      setIsSaved(true)
      toast({
        title: "Saved!",
        description: "Car added to your saved list.",
      })
    }
  }
const handleCarSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // 1. Validate required fields
    if (!carForm.make || !carForm.model || !carForm.year || !carForm.price) {
      throw new Error("Make, model, year and price are required");
    }

    // 2. Prepare the API endpoint and method
    const endpoint = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars';
    const method = editingCar ? 'PUT' : 'POST';

    // 3. Create the payload with proper type conversions
    const payload = {
      ...carForm,
      year: Number(carForm.year),
      price: Number(carForm.price),
      seats: Number(carForm.seats || 5),
      doors: Number(carForm.doors || 4),
      cylinders: Number(carForm.cylinders || 4),
      // Ensure images array exists even if empty
      images: carForm.images || []
    };

    // 4. Make the API call
    const response = await fetch(endpoint, {
      method,
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // 5. Handle response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save car');
    }

    // 6. Handle success
    const data = await response.json();
    const savedCar = editingCar 
      ? { ...editingCar, ...carForm, id: editingCar.id }
      : { ...carForm, id: data.id } as Car;

    dispatch({
      type: editingCar ? "UPDATE_CAR" : "ADD_CAR",
      payload: savedCar,
    });

    toast({
      title: editingCar ? "Car Updated" : "Car Added",
      description: `Car ${carForm.make} ${carForm.model} has been ${editingCar ? 'updated' : 'added'} successfully`,
    });

    // 7. Reset form and close dialog
    setIsCarDialogOpen(false);
    setEditingCar(null);
    setCarForm({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      // ... rest of your initial car form state
    });

  } catch (error) {
    console.error('Save error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to save car",
      variant: "destructive"
    });
  }
};
  const handleCompare = () => {
    if (!car) return

    const compareCars = JSON.parse(localStorage.getItem("compare-cars") || "[]")

    if (compareCars.length >= 3) {
      toast({
        title: "Compare List Full",
        description: "You can only compare up to 3 cars at once.",
        variant: "destructive",
      })
      return
    }

    if (compareCars.includes(car.id)) {
      toast({
        title: "Already in Compare",
        description: "This car is already in your compare list.",
        variant: "destructive",
      })
      return
    }

    const updatedCompare = [...compareCars, car.id]
    localStorage.setItem("compare-cars", JSON.stringify(updatedCompare))

    toast({
      title: "Added to Compare",
      description: `Car added to compare list (${updatedCompare.length}/3).`,
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length)
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const relatedCars = state.cars
    .filter((c) => c.id !== car.id && c.make === car.make && c.type === car.type)
    .slice(0, 4)

   return (
    <div className="min-h-screen bg-gray-50">
      {/* ... (keep your existing breadcrumb and header) ... */}

      <div className="container mx-auto px-4 py-6">
        {/* Header (keep your existing header) */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images Section - Updated */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                {carImages.length > 0 ? (
                  <>
                    <Image
                      src={carImages[currentImageIndex]}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                      priority
                    />
                    {carImages.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-4 right-4">
                          <Badge className="bg-black/70 text-white">
                            {currentImageIndex + 1}/{carImages.length}
                          </Badge>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-muted-foreground">No images available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {carImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {carImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        fill 
                        className="object-cover"
                      />
                      <div className={`absolute inset-0 ${
                        currentImageIndex === index ? 'bg-primary/20' : 'hover:bg-black/10'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Car Overview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Car Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Body</div>
                      <div className="font-medium">{car.bodyType || "Sedan"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <div className="text-muted-foreground">Condition</div>
                      <div className="font-medium ml-2">{car.condition || "Used"}</div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Kilometers</div>
                      <div className="font-medium">{car.mileage}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Engine className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Engine Size</div>
                      <div className="font-medium">{car.engineSize || "2000cc"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Fuel Type</div>
                      <div className="font-medium">{car.fuel}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Door</div>
                      <div className="font-medium">{car.doors || 4} Doors</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Year</div>
                      <div className="font-medium">{car.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Engine className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Cylinder</div>
                      <div className="font-medium">{car.cylinders || 4}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cog className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Transmission</div>
                      <div className="font-medium">{car.transmission || "Manual"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Color</div>
                      <div className="font-medium">{car.color || "Black"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Drive Type</div>
                      <div className="font-medium">{car.driveType || "FWD"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <div className="text-muted-foreground">VIN</div>
                      <div className="font-medium ml-2">{car.vin || "***-*******"}</div>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{car.description}</p>

            {car.paymentOptions && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Payment options:</h3>
                <ul className="space-y-1">
                  {car.paymentOptions.map((option, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {car.warranty && (
              <div>
                <ul className="space-y-1">
                  {car.warranty.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        {car.features && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(car.features).map(([category, features]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3 capitalize">{category}</h3>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Listings */}
        {relatedCars.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Listings</h2>
              <Button variant="outline" onClick={() => router.push("/sales")}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((relatedCar) => (
                <Card
                  key={relatedCar.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/car/${relatedCar.id}`)}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={relatedCar.image || "/placeholder.svg"}
                      alt={`${relatedCar.year} ${relatedCar.make} ${relatedCar.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">
                      {relatedCar.make} {relatedCar.model}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {relatedCar.year}
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        {relatedCar.mileage}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">${relatedCar.price.toLocaleString()}</div>
                    <Button className="w-full mt-3" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
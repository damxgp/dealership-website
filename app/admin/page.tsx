"use client"

import { CarImageUpload } from "@/components/CarImageUpload"
import type React from "react"
import { useState, useEffect } from "react"
import { AdminSetup } from "@/components/admin-setup"
import { useAppStore } from "@/lib/store"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTheme } from "@/components/theme-provider"
import type { ThemeColors, Car, FAQ } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { AdminGuard } from "@/components/admin-guard"
import { CarIcon, Users, Calendar, Settings, Edit, Trash2, LogOut, Plus } from "lucide-react"

function AdminDashboard() {
  const { theme, setTheme } = useTheme()
  const { state, dispatch } = useAppStore()
  const { logout, user } = useAuth()
  const { toast } = useToast()
  const [needsSetup, setNeedsSetup] = useState(false)
  const [checkingSetup, setCheckingSetup] = useState(true)

  // Check if setup is needed
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch("/api/admin/setup")
        const { hasAdmin } = await response.json()

        if (!hasAdmin) {
          setNeedsSetup(true)
        } else {
          setNeedsSetup(false)
        }
      } catch (error) {
        console.error("Failed to check setup:", error)
        // If there's an error, assume setup is needed
        setNeedsSetup(true)
      } finally {
        setCheckingSetup(false)
      }
    }

    checkSetup()
  }, [])

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(state.settings)
  const [customColors, setCustomColors] = useState<ThemeColors>(
    state.settings.customColors || {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#0f172a",
    },
  )

  // Car form state
  const [carForm, setCarForm] = useState<Partial<Car>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    type: "sale",
    mileage: "",
    fuel: "Gasoline",
    seats: 5,
    inStock: true,
    featured: false,
    selling: false,
    image: "/placeholder.svg?height=400&width=600",
      images: [], // Add this line for multiple images
    description: "",
    bodyType: "Sedan",
    condition: "Used",
    engineSize: "",
    doors: 4,
    cylinders: 4,
    color: "",
    vin: "",
    transmission: "Manual",
    driveType: "FWD",
  })
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)

  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    displayOrder: 0,
    active: true,
  })
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking setup...</p>
        </div>
      </div>
    )
  }

  if (needsSetup) {
    return <AdminSetup onComplete={() => setNeedsSetup(false)} />
  }

  const handleSaveSettings = async () => {
    try {
      const updatedSettings = {
        ...settingsForm,
        customColors: settingsForm.theme === "custom" ? customColors : undefined,
      }

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      dispatch({
        type: "UPDATE_SETTINGS",
        payload: updatedSettings,
      })

      // Apply theme immediately
      if (settingsForm.theme !== "custom") {
        setTheme(settingsForm.theme as "modern" | "classic" | "bold" | "red-black")
      }

      toast({
        title: "Settings Saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleThemeChange = (newTheme: "modern" | "classic" | "bold" | "red-black" | "custom") => {
    setSettingsForm({ ...settingsForm, theme: newTheme })

    // Apply theme immediately for non-custom themes
    if (newTheme !== "custom") {
      setTheme(newTheme as "modern" | "classic" | "bold" | "red-black")
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSettingsForm({ ...settingsForm, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCar) {
        // Update existing car
        const response = await fetch(`/api/cars/${editingCar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(carForm),
        })

        if (!response.ok) throw new Error("Failed to update car")

        dispatch({
          type: "UPDATE_CAR",
          payload: { ...editingCar, ...carForm } as Car,
        })
        toast({
          title: "Car Updated",
          description: "Car has been updated successfully.",
        })
      } else {
        // Add new car
        const response = await fetch("/api/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(carForm),
        })

        if (!response.ok) throw new Error("Failed to create car")

        const { id } = await response.json()
        const newCar: Car = {
          id: id.toString(),
          ...carForm,
        } as Car

        dispatch({ type: "ADD_CAR", payload: newCar })
        toast({
          title: "Car Added",
          description: "New car has been added to inventory.",
        })
      }

      setIsCarDialogOpen(false)
      setEditingCar(null)
      setCarForm({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        type: "sale",
        mileage: "",
        fuel: "Gasoline",
        seats: 5,
        inStock: true,
        featured: false,
        selling: false,
        image: "/placeholder.svg?height=400&width=600",
        description: "",
        bodyType: "Sedan",
        condition: "Used",
        engineSize: "",
        doors: 4,
        cylinders: 4,
        color: "",
        vin: "",
        transmission: "Manual",
        driveType: "FWD",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save car. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditCar = (car: Car) => {
    setEditingCar(car)
    setCarForm(car)
    setIsCarDialogOpen(true)
  }

  const handleDeleteCar = async (carId: string) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete car")

      dispatch({ type: "DELETE_CAR", payload: carId })
      toast({
        title: "Car Deleted",
        description: "Car has been removed from inventory.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleCarStock = async (car: Car) => {
    try {
      const updatedCar = { ...car, inStock: !car.inStock }
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCar),
      })

      if (!response.ok) throw new Error("Failed to update car")

      dispatch({
        type: "UPDATE_CAR",
        payload: updatedCar,
      })
      toast({
        title: car.inStock ? "Car Marked Out of Stock" : "Car Marked In Stock",
        description: `${car.make} ${car.model} stock status updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update car status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleCarSelling = async (car: Car) => {
    try {
      const updatedCar = { ...car, selling: !car.selling }
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCar),
      })

      if (!response.ok) throw new Error("Failed to update car")

      dispatch({
        type: "UPDATE_CAR",
        payload: updatedCar,
      })
      toast({
        title: car.selling ? "Removed from Hot Deals" : "Added to Hot Deals",
        description: `${car.make} ${car.model} selling status updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update car status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingFaq) {
        // Update existing FAQ
        const response = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqForm),
        })

        if (!response.ok) throw new Error("Failed to update FAQ")

        dispatch({
          type: "UPDATE_FAQ",
          payload: { ...editingFaq, ...faqForm },
        })
        toast({
          title: "FAQ Updated",
          description: "FAQ has been updated successfully.",
        })
      } else {
        // Add new FAQ
        const response = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqForm),
        })

        if (!response.ok) throw new Error("Failed to create FAQ")

        const { id } = await response.json()
        const newFaq: FAQ = {
          id: id.toString(),
          ...faqForm,
        }

        dispatch({ type: "ADD_FAQ", payload: newFaq })
        toast({
          title: "FAQ Added",
          description: "New FAQ has been added.",
        })
      }

      setIsFaqDialogOpen(false)
      setEditingFaq(null)
      setFaqForm({
        question: "",
        answer: "",
        displayOrder: 0,
        active: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save FAQ. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq)
    setFaqForm(faq)
    setIsFaqDialogOpen(true)
  }

  const handleDeleteFaq = async (faqId: string) => {
    try {
      const response = await fetch(`/api/faqs/${faqId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete FAQ")

      dispatch({ type: "DELETE_FAQ", payload: faqId })
      toast({
        title: "FAQ Deleted",
        description: "FAQ has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const totalCars = state.cars.length
  const activeBookings = state.bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length
  const todaysMeetings = state.bookings.filter(
    (b) => b.type === "meeting" && b.bookingDate === new Date().toISOString().split("T")[0],
  ).length

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}!</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <CarIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Cars</p>
                <p className="text-lg md:text-2xl font-bold">{totalCars}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Active Bookings</p>
                <p className="text-lg md:text-2xl font-bold">{activeBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Meetings Today</p>
                <p className="text-lg md:text-2xl font-bold">{todaysMeetings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Settings className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">System Status</p>
                <p className="text-lg md:text-2xl font-bold text-green-600">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="settings" className="text-xs md:text-sm">
            Settings
          </TabsTrigger>
          <TabsTrigger value="cars" className="text-xs md:text-sm">
            Cars
          </TabsTrigger>
          <TabsTrigger value="bookings" className="text-xs md:text-sm">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-xs md:text-sm">
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Settings */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dealership-name">Dealership Name</Label>
                  <Input
                    id="dealership-name"
                    value={settingsForm.dealershipName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, dealershipName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="business-hours">Business Hours</Label>
                  <Input
                    id="business-hours"
                    value={settingsForm.businessHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo-upload">Logo</Label>
                  <div className="space-y-2">
                    {settingsForm.logo && (
                      <div className="flex items-center gap-4 p-2 border rounded">
                        <img
                          src={settingsForm.logo || "/placeholder.svg"}
                          alt="Logo"
                          className="h-12 w-12 object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettingsForm({ ...settingsForm, logo: undefined })}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
                    <p className="text-xs text-muted-foreground">Upload your dealership logo (PNG, JPG, SVG)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rental-toggle"
                    checked={settingsForm.rentalEnabled}
                    onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, rentalEnabled: checked })}
                  />
                  <Label htmlFor="rental-toggle">Enable Car Rental Page</Label>
                </div>
              </CardContent>
            </Card>

            {/* Theme & Layout Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Theme & Layout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme-select">Choose Theme</Label>
                  <Select value={settingsForm.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern & Minimalistic</SelectItem>
                      <SelectItem value="classic">Classic & Detailed</SelectItem>
                      <SelectItem value="bold">Bold & Colorful</SelectItem>
                      <SelectItem value="red-black">Red & Black</SelectItem>
                      <SelectItem value="custom">Custom Colors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settingsForm.theme === "custom" && (
                  <div className="space-y-3">
                    <Label>Custom Colors</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="primary-color" className="text-sm">
                          Primary
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="primary-color"
                            type="color"
                            value={customColors.primary}
                            onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={customColors.primary}
                            onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondary-color" className="text-sm">
                          Secondary
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="secondary-color"
                            type="color"
                            value={customColors.secondary}
                            onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={customColors.secondary}
                            onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accent-color" className="text-sm">
                          Accent
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="accent-color"
                            type="color"
                            value={customColors.accent}
                            onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={customColors.accent}
                            onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="text-color" className="text-sm">
                          Text
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="text-color"
                            type="color"
                            value={customColors.text}
                            onChange={(e) => setCustomColors({ ...customColors, text: e.target.value })}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={customColors.text}
                            onChange={(e) => setCustomColors({ ...customColors, text: e.target.value })}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="layout-select">Home Page Layout</Label>
                  <Select
                    value={settingsForm.homeLayout}
                    onValueChange={(value: "layout1" | "layout2" | "layout3") =>
                      setSettingsForm({ ...settingsForm, homeLayout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="layout1">Sporty & Dynamic</SelectItem>
                      <SelectItem value="layout2">Split Hero Layout</SelectItem>
                      <SelectItem value="layout3">Minimal & Clean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Theme Preview:</p>
                  <div
                    className={`p-4 rounded-lg border ${
                      settingsForm.theme === "modern"
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                        : settingsForm.theme === "classic"
                          ? "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800"
                          : settingsForm.theme === "bold"
                            ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:to-pink-950 dark:border-purple-800"
                            : settingsForm.theme === "red-black"
                              ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                              : "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
                    }`}
                    style={
                      settingsForm.theme === "custom"
                        ? {
                            backgroundColor: customColors.background,
                            borderColor: customColors.primary,
                            color: customColors.text,
                          }
                        : {}
                    }
                  >
                    <h3
                      className={`font-semibold ${
                        settingsForm.theme === "modern"
                          ? "text-blue-900 dark:text-blue-100"
                          : settingsForm.theme === "classic"
                            ? "text-amber-900 dark:text-amber-100"
                            : settingsForm.theme === "bold"
                              ? "text-purple-900 dark:text-purple-100"
                              : settingsForm.theme === "red-black"
                                ? "text-red-900 dark:text-red-100"
                                : ""
                      }`}
                      style={settingsForm.theme === "custom" ? { color: customColors.primary } : {}}
                    >
                      {settingsForm.theme === "modern"
                        ? "Modern Theme"
                        : settingsForm.theme === "classic"
                          ? "Classic Theme"
                          : settingsForm.theme === "bold"
                            ? "Bold Theme"
                            : settingsForm.theme === "red-black"
                              ? "Red & Black Theme"
                              : "Custom Theme"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This is how your site will look with the selected theme.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Button onClick={handleSaveSettings} size="lg" className="w-full md:w-auto">
              Save All Settings
            </Button>
          </div>
        </TabsContent>

        {/* Car Management */}
        <TabsContent value="cars">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Vehicle Inventory ({totalCars})</CardTitle>
                <Dialog open={isCarDialogOpen} onOpenChange={setIsCarDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Car
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCarSubmit} className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="car-make">Make</Label>
                            <Input
                              id="car-make"
                              value={carForm.make}
                              onChange={(e) => setCarForm({ ...carForm, make: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="car-model">Model</Label>
                            <Input
                              id="car-model"
                              value={carForm.model}
                              onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="car-year">Year</Label>
                            <Input
                              id="car-year"
                              type="number"
                              value={carForm.year}
                              onChange={(e) => setCarForm({ ...carForm, year: Number(e.target.value) })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="car-price">Price</Label>
                            <Input
                              id="car-price"
                              type="number"
                              value={carForm.price}
                              onChange={(e) => setCarForm({ ...carForm, price: Number(e.target.value) })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="car-type">Type</Label>
                            <Select
                              value={carForm.type}
                              onValueChange={(value: "sale" | "rental") => setCarForm({ ...carForm, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sale">For Sale</SelectItem>
                                <SelectItem value="rental">For Rental</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Vehicle Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="car-mileage">Mileage</Label>
                            <Input
                              id="car-mileage"
                              value={carForm.mileage}
                              onChange={(e) => setCarForm({ ...carForm, mileage: e.target.value })}
                              placeholder="e.g., 25,000"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="car-fuel">Fuel Type</Label>
                            <Select
                              value={carForm.fuel}
                              onValueChange={(value) => setCarForm({ ...carForm, fuel: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Gasoline">Gasoline</SelectItem>
                                <SelectItem value="Diesel">Diesel</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                <SelectItem value="Electric">Electric</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="car-seats">Seats</Label>
                            <Input
                              id="car-seats"
                              type="number"
                              value={carForm.seats}
                              onChange={(e) => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="car-condition">Condition</Label>
                            <Select
                              value={carForm.condition}
                              onValueChange={(value) => setCarForm({ ...carForm, condition: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Used">Used</SelectItem>
                                <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="car-body-type">Body Type</Label>
                            <Select
                              value={carForm.bodyType}
                              onValueChange={(value) => setCarForm({ ...carForm, bodyType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sedan">Sedan</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="Hatchback">Hatchback</SelectItem>
                                <SelectItem value="Coupe">Coupe</SelectItem>
                                <SelectItem value="Convertible">Convertible</SelectItem>
                                <SelectItem value="Truck">Truck</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="car-doors">Doors</Label>
                            <Select
                              value={carForm.doors?.toString()}
                              onValueChange={(value) => setCarForm({ ...carForm, doors: Number(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2 Doors</SelectItem>
                                <SelectItem value="4">4 Doors</SelectItem>
                                <SelectItem value="5">5 Doors</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Engine & Drivetrain */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Engine & Drivetrain</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="car-engine-size">Engine Size</Label>
                            <Input
                              id="car-engine-size"
                              value={carForm.engineSize}
                              onChange={(e) => setCarForm({ ...carForm, engineSize: e.target.value })}
                              placeholder="e.g., 2000cc"
                            />
                          </div>
                          <div>
                            <Label htmlFor="car-cylinders">Cylinders</Label>
                            <Select
                              value={carForm.cylinders?.toString()}
                              onValueChange={(value) => setCarForm({ ...carForm, cylinders: Number(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3">3 Cylinders</SelectItem>
                                <SelectItem value="4">4 Cylinders</SelectItem>
                                <SelectItem value="6">6 Cylinders</SelectItem>
                                <SelectItem value="8">8 Cylinders</SelectItem>
                                <SelectItem value="10">10 Cylinders</SelectItem>
                                <SelectItem value="12">12 Cylinders</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="car-transmission">Transmission</Label>
                            <Select
                              value={carForm.transmission}
                              onValueChange={(value) => setCarForm({ ...carForm, transmission: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="CVT">CVT</SelectItem>
                                <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="car-drive-type">Drive Type</Label>
                            <Select
                              value={carForm.driveType}
                              onValueChange={(value) => setCarForm({ ...carForm, driveType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FWD">Front-Wheel Drive</SelectItem>
                                <SelectItem value="RWD">Rear-Wheel Drive</SelectItem>
                                <SelectItem value="AWD">All-Wheel Drive</SelectItem>
                                <SelectItem value="4WD">4-Wheel Drive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="car-color">Color</Label>
                            <Input
                              id="car-color"
                              value={carForm.color}
                              onChange={(e) => setCarForm({ ...carForm, color: e.target.value })}
                              placeholder="e.g., Black, White, Red"
                            />
                          </div>
                          <div>
                            <Label htmlFor="car-vin">VIN</Label>
                            <Input
                              id="car-vin"
                              value={carForm.vin}
                              onChange={(e) => setCarForm({ ...carForm, vin: e.target.value })}
                              placeholder="Vehicle Identification Number"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Description</h3>
                        <div>
                          <Label htmlFor="car-description">Description</Label>
                          <Textarea
                            id="car-description"
                            value={carForm.description}
                            onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                            rows={3}
                            required
                          />
                        </div>
                      </div>
<div className="space-y-4">
  <h3 className="text-lg font-semibold">Images</h3>
  <CarImageUpload
    images={[
      carForm.image || "",
      ...(carForm.images || [])
    ].filter(Boolean)}
    onImagesChange={(images) => {
      setCarForm({
        ...carForm,
        image: images[0] || "/placeholder.svg?height=400&width=600",
        images: images.slice(1)
      })
    }}
  />
</div>
                      {/* Status Options */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Status Options</h3>
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="car-instock"
                              checked={carForm.inStock}
                              onCheckedChange={(checked) => setCarForm({ ...carForm, inStock: checked })}
                            />
                            <Label htmlFor="car-instock">In Stock</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="car-featured"
                              checked={carForm.featured}
                              onCheckedChange={(checked) => setCarForm({ ...carForm, featured: checked })}
                            />
                            <Label htmlFor="car-featured">Featured</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="car-selling"
                              checked={carForm.selling}
                              onCheckedChange={(checked) => setCarForm({ ...carForm, selling: checked })}
                            />
                            <Label htmlFor="car-selling">Hot Deal</Label>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCarDialogOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">
                          {editingCar ? "Update Car" : "Add Car"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.cars.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No cars in inventory yet.</p>
                ) : (
                  state.cars.map((car) => (
                    <div
                      key={car.id}
                      className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ${car.price.toLocaleString()} • {car.type === "sale" ? "For Sale" : "For Rent"} •{" "}
                          {car.mileage} mi
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant={car.inStock ? "default" : "destructive"}>
                            {car.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                          {car.featured && <Badge variant="secondary">Featured</Badge>}
                          {car.selling && <Badge className="bg-green-500">Hot Deal</Badge>}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleCarStock(car)}
                          className={`${car.inStock ? "text-red-600" : "text-green-600"} text-xs`}
                        >
                          {car.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleCarSelling(car)}
                          className={`${car.selling ? "text-red-600" : "text-green-600"} text-xs`}
                        >
                          {car.selling ? "Remove Hot Deal" : "Mark Hot Deal"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditCar(car)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCar(car.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Management */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings ({state.bookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.bookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No bookings yet.</p>
                ) : (
                  state.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{booking.customerName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.type} • {booking.bookingDate} {booking.bookingTime && `at ${booking.bookingTime}`}
                        </p>
                        {booking.purpose && <p className="text-sm text-muted-foreground">Purpose: {booking.purpose}</p>}
                      </div>
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Management */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>FAQ Management ({state.faqs.length})</CardTitle>
                <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add FAQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFaqSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="faq-question">Question</Label>
                        <Input
                          id="faq-question"
                          value={faqForm.question}
                          onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq-answer">Answer</Label>
                        <Textarea
                          id="faq-answer"
                          value={faqForm.answer}
                          onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="faq-order">Display Order</Label>
                          <Input
                            id="faq-order"
                            type="number"
                            value={faqForm.displayOrder}
                            onChange={(e) => setFaqForm({ ...faqForm, displayOrder: Number(e.target.value) })}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="faq-active"
                            checked={faqForm.active}
                            onCheckedChange={(checked) => setFaqForm({ ...faqForm, active: checked })}
                          />
                          <Label htmlFor="faq-active">Active</Label>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsFaqDialogOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">
                          {editingFaq ? "Update FAQ" : "Add FAQ"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.faqs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No FAQs yet.</p>
                ) : (
                  state.faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={faq.active ? "default" : "secondary"}>
                            {faq.active ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Order: {faq.displayOrder}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 w-full lg:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFaq(faq)}
                          className="flex-1 lg:flex-none"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="flex-1 lg:flex-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Shield, User, Settings, Upload, X } from "lucide-react"

interface AdminSetupProps {
  onComplete: () => void
}

export function AdminSetup({ onComplete }: AdminSetupProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [settingsForm, setSettingsForm] = useState({
    dealershipName: "Premier Auto",
    contactEmail: "info@premierauto.com",
    contactPhone: "(555) 123-4567",
    address: "123 Auto Street, Car City, CC 12345",
    theme: "modern" as "modern" | "classic" | "bold" | "red-black",
    homeLayout: "layout1" as "layout1" | "layout2" | "layout3",
    rentalEnabled: true,
    logo: undefined as string | undefined,
  })

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

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (adminForm.password !== adminForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (adminForm.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Initialize database
      await fetch("/api/init", { method: "POST" })

      // Create admin user and settings
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: adminForm.username,
          password: adminForm.password,
          settings: settingsForm,
        }),
      })

      if (!response.ok) {
        throw new Error("Setup failed")
      }

      toast({
        title: "Setup Complete!",
        description: "Your dealership website has been configured successfully.",
      })

      onComplete()
      router.push("/admin/login")
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalSteps = 2

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            Initial Setup ({step}/{totalSteps})
          </CardTitle>
          <p className="text-muted-foreground">Set up your dealership website</p>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step 1: Admin Account */}
          {step === 1 && (
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Create Admin Account</h3>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={adminForm.username}
                    onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                    placeholder="Enter admin username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="Enter password (min 6 characters)"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={adminForm.confirmPassword}
                    onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Continue to Settings
              </Button>
            </form>
          )}

          {/* Step 2: Basic Settings */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Basic Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div>
                <Label htmlFor="logo-upload">Logo (Optional)</Label>
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
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600">Click to upload logo</div>
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme-select">Theme</Label>
                  <Select
                    value={settingsForm.theme}
                    onValueChange={(value: "modern" | "classic" | "bold" | "red-black") =>
                      setSettingsForm({ ...settingsForm, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern & Minimalistic</SelectItem>
                      <SelectItem value="classic">Classic & Detailed</SelectItem>
                      <SelectItem value="bold">Bold & Colorful</SelectItem>
                      <SelectItem value="red-black">Red & Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="layout-select">Home Layout</Label>
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
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="rental-toggle"
                  checked={settingsForm.rentalEnabled}
                  onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, rentalEnabled: checked })}
                />
                <Label htmlFor="rental-toggle">Enable Car Rental Service</Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} disabled={isLoading} className="flex-1">
                  {isLoading ? "Setting up..." : "Complete Setup"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

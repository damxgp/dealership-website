"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { Zap, Palette, Upload, X } from "lucide-react"

interface QuickStartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickStartModal({ open, onOpenChange }: QuickStartModalProps) {
  const { state, dispatch } = useAppStore()
  const { setTheme } = useTheme()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    dealershipName: state.settings.dealershipName,
    contactEmail: state.settings.contactEmail,
    contactPhone: state.settings.contactPhone,
    address: state.settings.address,
    theme: state.settings.theme,
    homeLayout: state.settings.homeLayout,
    rentalEnabled: state.settings.rentalEnabled,
    logo: state.settings.logo,
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData({ ...formData, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleComplete = () => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: formData,
    })

    if (formData.theme !== "custom") {
      setTheme(formData.theme as "modern" | "classic" | "bold" | )
    }

    toast({
      title: "Setup Complete!",
      description: "Your dealership website has been configured successfully.",
    })

    onOpenChange(false)
  }

  const totalSteps = 4

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Quick Start Setup ({step}/{totalSteps})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="dealership-name">Dealership Name</Label>
                  <Input
                    id="dealership-name"
                    value={formData.dealershipName}
                    onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
                    placeholder="Enter your dealership name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="contact@yourdealership.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main Street, City, State 12345"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Logo Upload */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-lg font-semibold">Upload Your Logo</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {formData.logo ? (
                    <div className="space-y-4">
                      <img
                        src={formData.logo || "/placeholder.svg"}
                        alt="Logo preview"
                        className="max-h-24 mx-auto object-contain"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setFormData({ ...formData, logo: undefined })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <div className="text-sm text-gray-600">Click to upload your logo or drag and drop</div>
                          <div className="text-xs text-gray-400 mt-1">PNG, JPG, SVG up to 2MB</div>
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
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  You can skip this step and add a logo later from the admin panel.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Theme Selection */}
          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Choose Your Theme
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "modern", name: "Modern", desc: "Clean and minimalistic", color: "bg-blue-500" },
                  { value: "classic", name: "Classic", desc: "Traditional and elegant", color: "bg-amber-500" },
                  { value: "bold", name: "Bold", desc: "Vibrant and energetic", color: "bg-purple-500" },
                ].map((theme) => (
                  <Card
                    key={theme.value}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      formData.theme === theme.value ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setFormData({ ...formData, theme: theme.value as any })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${theme.color} rounded-full mx-auto mb-2`} />
                      <h4 className="font-semibold">{theme.name}</h4>
                      <p className="text-sm text-gray-600">{theme.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                <Label htmlFor="layout-select">Home Page Layout</Label>
                <Select
                  value={formData.homeLayout}
                  onValueChange={(value: "layout1" | "layout2" | "layout3") =>
                    setFormData({ ...formData, homeLayout: value })
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
          )}

          {/* Step 4: Features */}
          {step === 4 && (
            <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-lg font-semibold">Enable Features</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Car Rental Service</h4>
                    <p className="text-sm text-gray-600">Allow customers to rent vehicles</p>
                  </div>
                  <Switch
                    checked={formData.rentalEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, rentalEnabled: checked })}
                  />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Setup Complete!</h4>
                <p className="text-sm text-green-700">
                  Your dealership website is ready to go. You can always modify these settings later from the admin
                  panel.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Skip Setup
              </Button>
              {step < totalSteps ? (
                <Button onClick={() => setStep(Math.min(totalSteps, step + 1))}>Next</Button>
              ) : (
                <Button onClick={handleComplete}>Complete Setup</Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

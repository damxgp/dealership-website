"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus, Trash2 } from "lucide-react"
import Image from "next/image"

export function CarImageUpload({
  images,
  onImagesChange,
}: {
  images: string[]
  onImagesChange: (images: string[]) => void
}) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setIsUploading(true)

      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error("Upload failed")
          return await response.json()
        })

        const results = await Promise.all(uploadPromises)
        const newImages = results.map((result) => result.url)
        onImagesChange([...images, ...newImages])
      } catch (error) {
        console.error("Upload error:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [images, onImagesChange]
  )

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onImagesChange(newImages)
  }

  const handleSetMainImage = (index: number) => {
    if (index === 0) return // Already main image
    const newImages = [...images]
    const [selectedImage] = newImages.splice(index, 1)
    newImages.unshift(selectedImage)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Car Images</Label>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="car-images"
            className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors w-full"
          >
            <ImagePlus className="w-6 h-6 mb-2" />
            <span>Upload Images</span>
            <Input
              id="car-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
          </Label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Upload multiple images (JPG, PNG, WEBP). First image will be the main display image.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border">
                <Image
                  src={img}
                  alt={`Car image ${index + 1}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => handleSetMainImage(index)}
                  disabled={index === 0}
                >
                  {index === 0 ? "Main" : "Set as Main"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
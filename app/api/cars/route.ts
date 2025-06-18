import { NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { rename, unlink, readdir, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const cars = await sql`
      SELECT 
        id::text,
        make,
        model,
        year,
        price::float,
        type,
        mileage,
        fuel_type as fuel,
        seats,
        in_stock as "inStock",
        featured,
        selling,
        image_url as image,
        images,
        description,
        daily_rate::float as "dailyRate",
        weekly_rate::float as "weeklyRate",
        monthly_rate::float as "monthlyRate",
        available,
        body_type as "bodyType",
        condition,
        engine_size as "engineSize",
        doors,
        cylinders,
        color,
        vin,
        transmission,
        drive_type as "driveType",
        features,
        payment_options as "paymentOptions",
        warranty
      FROM cars 
      ORDER BY created_at DESC
    `

    // Parse JSON fields for all cars
    const parsedCars = cars.map(car => ({
      ...car,
      images: typeof car.images === 'string' ? JSON.parse(car.images) : car.images || [],
      features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features || {},
      paymentOptions: typeof car.paymentOptions === 'string' ? JSON.parse(car.paymentOptions) : car.paymentOptions || [],
      warranty: typeof car.warranty === 'string' ? JSON.parse(car.warranty) : car.warranty || []
    }))

    return NextResponse.json({ data: parsedCars })
  } catch (error) {
    console.error("Failed to fetch cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const car = await request.json()

    // Use "temp" folder first — we'll move images later after getting the real car ID
    const publicPath = process.env.NODE_ENV === "production" ? "/app/public" : "./public"
    const tempDir = join(publicPath, "cars", "temp")

    const processedImages = []
    if (car.images && Array.isArray(car.images)) {
      for (const imageUrl of car.images) {
        if (imageUrl.includes('/cars/temp/')) {
          const filename = imageUrl.split('/').pop()
          const oldPath = join(tempDir, filename)
          processedImages.push({ filename, path: oldPath })
        } else {
          processedImages.push({ url: imageUrl }) // already permanent
        }
      }
    }

    // Set placeholder for now — will be updated with moved path later
    const mainImage = processedImages.length > 0 && processedImages[0].url 
      ? processedImages[0].url 
      : car.image || "/placeholder.svg"

    // Insert car (without image movement yet)
    const result = await sql`
      INSERT INTO cars (
        make, model, year, price, type, mileage, fuel_type, seats,
        in_stock, featured, selling, image_url, images, description,
        daily_rate, weekly_rate, monthly_rate, available, body_type,
        condition, engine_size, doors, cylinders, color, vin,
        transmission, drive_type, features, payment_options, warranty
      ) VALUES (
        ${car.make}, ${car.model}, ${car.year}, ${car.price}, ${car.type},
        ${car.mileage}, ${car.fuel}, ${car.seats}, ${car.inStock},
        ${car.featured}, ${car.selling}, ${mainImage}, ${JSON.stringify([])},
        ${car.description}, ${car.dailyRate || null}, ${car.weeklyRate || null},
        ${car.monthlyRate || null}, ${car.available !== false}, ${car.bodyType},
        ${car.condition}, ${car.engineSize}, ${car.doors}, ${car.cylinders},
        ${car.color}, ${car.vin}, ${car.transmission}, ${car.driveType},
        ${JSON.stringify(car.features || {})}, ${JSON.stringify(car.paymentOptions || [])},
        ${JSON.stringify(car.warranty || [])}
      ) RETURNING id
    `

    const carId = result[0].id.toString()
    const carImageDir = join(publicPath, "cars", carId)
    await mkdir(carImageDir, { recursive: true })

    const finalImageUrls = []

    for (const img of processedImages) {
      if (img.filename && img.path) {
        const newPath = join(carImageDir, img.filename)
        try {
          await rename(img.path, newPath)
          finalImageUrls.push(`/cars/${carId}/${img.filename}`)
        } catch (error) {
          console.error(`Failed to move image ${img.filename}:`, error)
          finalImageUrls.push(`/cars/temp/${img.filename}`)
        }
      } else {
        finalImageUrls.push(img.url)
      }
    }

    // Update car record with final images and main image
    const finalMainImage = finalImageUrls.length > 0 ? finalImageUrls[0] : mainImage

    await sql`
      UPDATE cars 
      SET image_url = ${finalMainImage}, images = ${JSON.stringify(finalImageUrls)}
      WHERE id = ${carId}
    `

    return NextResponse.json({ 
      success: true, 
      id: carId,
      image: finalMainImage,
      images: finalImageUrls
    })
  } catch (error) {
    console.error("Failed to create car:", error)
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
  }
}


// Add this helper endpoint for image uploads
export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const carId = formData.get("carId") as string

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    // If carId is not provided, we'll use "temp" as fallback
    const targetFolder = carId || "temp"

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const extension = file.name.split('.').pop()
    const filename = `${uuidv4()}.${extension}`

    // Create directory if it doesn't exist
    const publicPath = process.env.NODE_ENV === "production" ? "/app/public" : "./public"
    const uploadDir = join(publicPath, "cars", targetFolder)
    await mkdir(uploadDir, { recursive: true })

    // Write file directly to the target folder (either car's folder or temp)
    const filePath = join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return relative path to the image
    const relativePath = `/cars/${targetFolder}/${filename}`

    return NextResponse.json({ 
      url: relativePath,
      // Include the filename in response if needed for future reference
      filename: filename
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const carId = params.id

    const result = await sql`
      SELECT 
        id,
        make,
        model,
        year,
        price,
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
        daily_rate as "dailyRate",
        weekly_rate as "weeklyRate",
        monthly_rate as "monthlyRate",
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
        warranty,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM cars 
      WHERE id = ${carId}
    `

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const car = result.rows[0]
    
    // Parse JSON fields if they're stored as strings
    if (typeof car.features === 'string') {
      car.features = JSON.parse(car.features)
    }
    if (typeof car.images === 'string') {
      car.images = JSON.parse(car.images)
    }
    if (typeof car.paymentOptions === 'string') {
      car.paymentOptions = JSON.parse(car.paymentOptions)
    }
    if (typeof car.warranty === 'string') {
      car.warranty = JSON.parse(car.warranty)
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error("Failed to fetch car:", error)
    return NextResponse.json(
      { error: "Failed to fetch car" }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const car = await request.json()
    const carId = params.id

    await sql`
      UPDATE cars SET
        make = ${car.make},
        model = ${car.model},
        year = ${car.year},
        price = ${car.price},
        type = ${car.type},
        mileage = ${car.mileage},
        fuel_type = ${car.fuel},
        seats = ${car.seats},
        in_stock = ${car.inStock},
        featured = ${car.featured},
        selling = ${car.selling},
        image_url = ${car.image},
        images = ${JSON.stringify(car.images || [])},
        description = ${car.description},
        daily_rate = ${car.dailyRate || null},
        weekly_rate = ${car.weeklyRate || null},
        monthly_rate = ${car.monthlyRate || null},
        available = ${car.available !== false},
        body_type = ${car.bodyType},
        condition = ${car.condition},
        engine_size = ${car.engineSize},
        doors = ${car.doors},
        cylinders = ${car.cylinders},
        color = ${car.color},
        vin = ${car.vin},
        transmission = ${car.transmission},
        drive_type = ${car.driveType},
        features = ${JSON.stringify(car.features || {})},
        payment_options = ${JSON.stringify(car.paymentOptions || [])},
        warranty = ${JSON.stringify(car.warranty || [])},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${carId}
      RETURNING *
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update car:", error)
    return NextResponse.json(
      { error: "Failed to update car" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const carId = params.id

    await sql`
      DELETE FROM cars 
      WHERE id = ${carId}
      RETURNING id
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete car:", error)
    return NextResponse.json(
      { error: "Failed to delete car" }, 
      { status: 500 }
    )
  }
}

// Separate endpoint just for images
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const carId = params.id
    const { imageUrl } = await request.json()

    // First get current images
    const result = await sql`
      SELECT images FROM cars WHERE id = ${carId}
    `
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const currentImages = result.rows[0].images || []
    const updatedImages = [...currentImages, imageUrl]

    await sql`
      UPDATE cars SET
        images = ${JSON.stringify(updatedImages)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${carId}
    `

    return NextResponse.json({ success: true, images: updatedImages })
  } catch (error) {
    console.error("Failed to add car image:", error)
    return NextResponse.json(
      { error: "Failed to add car image" }, 
      { status: 500 }
    )
  }
}
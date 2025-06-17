import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const bookings = await sql`
      SELECT 
        id::text,
        type,
        customer_name as "customerName",
        customer_email as "customerEmail",
        customer_phone as "customerPhone",
        booking_date::text as "bookingDate",
        booking_time::text as "bookingTime",
        purpose,
        car_id::text as "carId",
        status,
        notes,
        created_at::text as "createdAt"
      FROM bookings 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ data: bookings })
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const booking = await request.json()

    const result = await sql`
      INSERT INTO bookings (
        type, customer_name, customer_email, customer_phone,
        booking_date, booking_time, purpose, car_id, status, notes
      ) VALUES (
        ${booking.type}, ${booking.customerName}, ${booking.customerEmail},
        ${booking.customerPhone || null}, ${booking.bookingDate}, 
        ${booking.bookingTime || null}, ${booking.purpose || null},
        ${booking.carId || null}, ${booking.status || "pending"}, ${booking.notes || null}
      ) RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Failed to create booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

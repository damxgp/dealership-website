import { NextResponse } from "next/server"
import { isDatabaseInitialized, initializeDatabase } from "@/lib/database"

export async function GET() {
  try {
    const initialized = await isDatabaseInitialized()
    return NextResponse.json({ initialized })
  } catch (error) {
    console.error("Init check failed:", error)
    return NextResponse.json({ error: "Failed to check initialization" }, { status: 500 })
  }
}

export async function POST() {
  try {
    await initializeDatabase()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database initialization failed:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}

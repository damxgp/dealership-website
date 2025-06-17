import { NextResponse } from "next/server"
import { sql } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { username, password, settings } = await request.json()

    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE username = ${username}
    `

    if (existingAdmin.length > 0) {
      return NextResponse.json({ error: "Admin user already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create admin user
    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${username}, ${passwordHash})
    `

    // Update settings if provided
    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        let stringValue = value

        if (typeof value === "object") {
          stringValue = JSON.stringify(value)
        } else if (typeof value === "boolean") {
          stringValue = value.toString()
        }

        await sql`
          INSERT INTO settings (setting_key, setting_value, updated_at)
          VALUES (${snakeKey}, ${stringValue}, CURRENT_TIMESTAMP)
          ON CONFLICT (setting_key) 
          DO UPDATE SET setting_value = ${stringValue}, updated_at = CURRENT_TIMESTAMP
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Setup failed:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const admins = await sql`
      SELECT COUNT(*) as count FROM admin_users
    `

    const hasAdmin = admins[0].count > 0
    return NextResponse.json({ hasAdmin })
  } catch (error) {
    console.error("Failed to check admin:", error)
    return NextResponse.json({ error: "Failed to check admin" }, { status: 500 })
  }
}

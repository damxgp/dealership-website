import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const settings = await sql`
      SELECT setting_key, setting_value 
      FROM settings
    `

    const settingsObj = settings.reduce((acc: any, setting: any) => {
      let value = setting.setting_value

      // Parse boolean and JSON values
      if (value === "true") value = true
      else if (value === "false") value = false
      else if (setting.setting_key === "custom_colors" && value) {
        try {
          value = JSON.parse(value)
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }

      // Convert snake_case to camelCase
      const key = setting.setting_key.replace(/_([a-z])/g, (g: string) => g[1].toUpperCase())
      acc[key] = value
      return acc
    }, {})

    return NextResponse.json({ data: settingsObj })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()

    // Convert camelCase to snake_case and update settings
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

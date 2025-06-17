// app/api/cleanup/route.ts
import { NextResponse } from "next/server"
import { rm, readdir } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const publicPath = process.env.NODE_ENV === "production" ? "/app/public" : "./public"
    const tempDir = join(publicPath, "cars", "temp")
    
    // Delete all files in temp directory older than 24 hours
    const files = await readdir(tempDir)
    const now = Date.now()
    
    for (const file of files) {
      const filePath = join(tempDir, file)
      const stats = await stat(filePath)
      if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
        await rm(filePath)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 })
  }
}
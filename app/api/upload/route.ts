import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const carId = formData.get("carId") as string || "temp"

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const extension = file.name.split('.').pop()
    const filename = `${uuidv4()}.${extension}`

    // Create directory if it doesn't exist
    const publicPath = process.env.NODE_ENV === "production" ? "/app/public" : "./public"
    const uploadDir = join(publicPath, "cars", carId)
    await mkdir(uploadDir, { recursive: true })

    // Write file to public folder
    const filePath = join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return relative path to the image
    const relativePath = `/cars/${carId}/${filename}`

    return NextResponse.json({ url: relativePath })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
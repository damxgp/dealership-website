import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function GET(request: Request) {
  try {
    const token = request.headers.get("cookie")?.split("auth-token=")[1]?.split(";")[0]

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, secret)

    return NextResponse.json({
      user: {
        id: payload.userId,
        username: payload.username,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

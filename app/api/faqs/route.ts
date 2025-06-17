import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const faqs = await sql`
      SELECT 
        id::text,
        question,
        answer,
        display_order as "displayOrder",
        active
      FROM faqs 
      ORDER BY display_order ASC, created_at DESC
    `

    return NextResponse.json({ data: faqs })
  } catch (error) {
    console.error("Failed to fetch FAQs:", error)
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const faq = await request.json()

    const result = await sql`
      INSERT INTO faqs (question, answer, display_order, active)
      VALUES (${faq.question}, ${faq.answer}, ${faq.displayOrder || 0}, ${faq.active !== false})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Failed to create FAQ:", error)
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const faq = await request.json()
    const faqId = params.id

    await sql`
      UPDATE faqs SET
        question = ${faq.question},
        answer = ${faq.answer},
        display_order = ${faq.displayOrder || 0},
        active = ${faq.active !== false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${faqId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update FAQ:", error)
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const faqId = params.id

    await sql`
      DELETE FROM faqs WHERE id = ${faqId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete FAQ:", error)
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
  }
}

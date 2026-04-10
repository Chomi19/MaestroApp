import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.payment.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.payment.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
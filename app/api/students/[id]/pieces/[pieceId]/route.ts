import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; pieceId: string }> }) {
  const { pieceId } = await params
  const body = await req.json()
  const updated = await db.studentPiece.update({
    where: { id: pieceId },
    data: {
      status: body.status,
      notes: body.notes,
      endedAt: body.status === "completed" ? new Date() : null,
    },
    include: { piece: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; pieceId: string }> }) {
  const { pieceId } = await params
  await db.studentPiece.delete({ where: { id: pieceId } })
  return NextResponse.json({ success: true })
}
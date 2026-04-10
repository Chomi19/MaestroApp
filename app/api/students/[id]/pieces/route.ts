import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pieces = await db.studentPiece.findMany({
    where: { studentId: id },
    include: { piece: true },
    orderBy: { startedAt: "desc" },
  })
  return NextResponse.json(pieces)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const studentPiece = await db.studentPiece.create({
    data: {
      student: { connect: { id } },
      piece: { connect: { id: body.pieceId } },
      status: body.status ?? "in_progress",
      notes: body.notes ?? null,
    },
    include: { piece: true },
  })
  return NextResponse.json(studentPiece)
}
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const pieces = await db.piece.findMany({
    orderBy: [{ level: "asc" }, { title: "asc" }],
  })
  return NextResponse.json(pieces)
}

export async function POST(req: Request) {
  const body = await req.json()
  const piece = await db.piece.create({
    data: {
      title: body.title,
      composer: body.composer ?? null,
      level: body.level,
      genre: body.genre ?? null,
      notes: body.notes ?? null,
    },
  })
  return NextResponse.json(piece)
}
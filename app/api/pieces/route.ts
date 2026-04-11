import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const level = searchParams.get("level")
  const genre = searchParams.get("genre")
  const search = searchParams.get("search")

  const pieces = await db.piece.findMany({
    where: {
      ...(level && { level }),
      ...(genre && { genre }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { composer: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      _count: { select: { students: true } },
    },
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
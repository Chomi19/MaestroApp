import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const lesson = await db.lesson.update({ where: { id }, data: body })
  return NextResponse.json(lesson)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.lesson.update({ where: { id }, data: { status: "cancelled" } })
  return NextResponse.json({ success: true })
}
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const student = await db.student.findUnique({ where: { id } })
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(student)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const student = await db.student.update({ where: { id }, data: body })
  return NextResponse.json(student)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.student.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ success: true })
}
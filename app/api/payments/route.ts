import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get("studentId")

  const payments = await db.payment.findMany({
    where: studentId ? { studentId } : undefined,
    include: { student: true },
    orderBy: { paidAt: "desc" },
  })
  return NextResponse.json(payments)
}

export async function POST(req: Request) {
  const body = await req.json()
  const payment = await db.payment.create({
    data: {
      student: { connect: { id: body.studentId } },
      amount: body.amount,
      method: body.method ?? null,
      notes: body.notes ?? null,
    },
    include: { student: true },
  })
  return NextResponse.json(payment)
}
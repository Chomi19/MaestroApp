import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const students = await db.student.findMany({
    where: { active: true },
    include: {
      payments: true,
      lessons: {
        where: { status: "completed" },
      },
    },
    orderBy: { name: "asc" },
  })

  const summary = students.map((s) => {
    const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0)
    const lessonsCompleted = s.lessons.length
    return {
      id: s.id,
      name: s.name,
      totalPaid,
      lessonsCompleted,
    }
  })

  return NextResponse.json(summary)
}
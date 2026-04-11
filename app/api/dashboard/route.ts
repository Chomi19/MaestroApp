import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { startOfDay, endOfDay } from "date-fns"

export async function GET() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  const [studentCount, todaysLessons, recentPayments, students] = await Promise.all([
    db.student.count({ where: { active: true } }),

    db.lesson.findMany({
      where: {
        startTime: { gte: todayStart, lte: todayEnd },
        status: { not: "cancelled" },
      },
      include: { student: true },
      orderBy: { startTime: "asc" },
    }),

    db.payment.findMany({
      take: 5,
      orderBy: { paidAt: "desc" },
      include: { student: true },
    }),

    db.student.findMany({
      where: { active: true },
      include: {
        payments: true,
        lessons: { where: { status: "completed" } },
      },
    }),
  ])

  const totalEarned = recentPayments.reduce((sum, p) => sum + p.amount, 0)

  return NextResponse.json({
    studentCount,
    todaysLessons,
    recentPayments,
    totalEarned,
    hasStudents: studentCount > 0,
  })
}
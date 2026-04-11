"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Lesson = {
  id: string
  startTime: string
  duration: number
  student: { name: string; level: string }
}

type Payment = {
  id: string
  amount: number
  paidAt: string
  student: { name: string }
}

type DashboardData = {
  studentCount: number
  todaysLessons: Lesson[]
  recentPayments: Payment[]
  totalEarned: number
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function ReturningDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData)
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your studio...</p>
      </div>
    )
  }

  const today = format(new Date(), "EEEE, MMMM d")

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted-foreground text-sm mb-1">{today}</p>
        <h1 className="text-2xl font-semibold">{getGreeting()} 👋</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold">{data.studentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold">{data.todaysLessons.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold">${data.totalEarned.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's lessons */}
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Today's lessons</CardTitle>
          <Link href="/dashboard/schedule" className="text-xs text-muted-foreground hover:underline">
            View schedule →
          </Link>
        </CardHeader>
        <CardContent>
          {data.todaysLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No lessons scheduled today.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.todaysLessons.map(lesson => (
                <div key={lesson.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground w-16">
                      {format(new Date(lesson.startTime), "h:mm a")}
                    </p>
                    <div>
                      <p className="text-sm font-medium">{lesson.student.name}</p>
                      <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                    </div>
                  </div>
                  <Badge className={levelColors[lesson.student.level]}>
                    {lesson.student.level}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent payments */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent payments</CardTitle>
          <Link href="/dashboard/payments" className="text-xs text-muted-foreground hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {data.recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No payments logged yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.recentPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{payment.student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(payment.paidAt), "MMM d")}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">${payment.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick nav */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/dashboard/students", icon: "👥", label: "Students" },
          { href: "/dashboard/schedule", icon: "📅", label: "Schedule" },
          { href: "/dashboard/payments", icon: "💰", label: "Payments" },
          { href: "/dashboard/library", icon: "🎵", label: "Library" },
        ].map(item => (
          <Link key={item.label} href={item.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="py-4 flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
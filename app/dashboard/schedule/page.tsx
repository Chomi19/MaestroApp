"use client"

import { useEffect, useState } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay } from "date-fns"
import { AddLessonDialog } from "@/components/lessons/add-lesson-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Lesson = {
  id: string
  startTime: string
  duration: number
  status: string
  notes: string | null
  student: { id: string; name: string; level: string }
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
}

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [lessons, setLessons] = useState<Lesson[]>([])

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  async function fetchLessons() {
    const res = await fetch(`/api/lessons?start=${weekStart.toISOString()}&end=${weekEnd.toISOString()}`)
    const data = await res.json()
    console.log("Lessons fetched:", data)
    setLessons(data)
  }

  useEffect(() => { fetchLessons() }, [weekStart])

  async function cancelLesson(id: string) {
    await fetch(`/api/lessons/${id}`, { method: "DELETE" })
    fetchLessons()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Schedule</h1>
          <p className="text-muted-foreground text-sm">
            {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekStart(w => subWeeks(w, 1))}>←</Button>
          <Button variant="outline" size="sm" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>Today</Button>
          <Button variant="outline" size="sm" onClick={() => setWeekStart(w => addWeeks(w, 1))}>→</Button>
          <AddLessonDialog onAdded={fetchLessons} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {days.map(day => {
          const dayLessons = lessons.filter(l =>
            isSameDay(new Date(l.startTime), day) && l.status !== "cancelled"
          )

          return (
            <div key={day.toISOString()}>
              <p className={`text-sm font-medium mb-2 ${isSameDay(day, new Date()) ? "text-blue-600" : "text-muted-foreground"}`}>
                {format(day, "EEEE, MMM d")}
                {isSameDay(day, new Date()) && " · Today"}
              </p>

              {dayLessons.length === 0 ? (
                <p className="text-xs text-muted-foreground pl-2 pb-3">No lessons</p>
              ) : (
                <div className="flex flex-col gap-2 mb-2">
                  {dayLessons.map(lesson => (
                    <Card key={lesson.id}>
                      <CardContent className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium w-16 text-muted-foreground">
                            {format(new Date(lesson.startTime), "h:mm a")}
                          </p>
                          <div>
                            <p className="font-medium text-sm">{lesson.student.name}</p>
                            <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={levelColors[lesson.student.level]}>{lesson.student.level}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-red-500"
                            onClick={() => cancelLesson(lesson.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <div className="border-b border-border" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
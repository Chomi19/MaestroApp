"use client"

import { useEffect, useState } from "react"
import { AddStudentDialog } from "@/components/students/add-student-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type Student = {
  id: string
  name: string
  email: string | null
  phone: string | null
  level: string
  notes: string | null
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const router = useRouter()

  async function fetchStudents() {
    const res = await fetch("/api/students")
    const data = await res.json()
    setStudents(data)
  }

  useEffect(() => { fetchStudents() }, [])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-muted-foreground text-sm">{students.length} active students</p>
        </div>
        <AddStudentDialog onAdded={fetchStudents} />
      </div>

      {students.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">🎹</p>
          <p>No students yet. Add your first one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {students.map((s) => (
            <Card
              key={s.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/students/${s.id}`)}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.email ?? s.phone ?? "No contact info"}</p>
                </div>
                <Badge className={levelColors[s.level]}>{s.level}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
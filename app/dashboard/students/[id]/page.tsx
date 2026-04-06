"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Student = {
  id: string
  name: string
  email: string | null
  phone: string | null
  level: string
  notes: string | null
  createdAt: string
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
}

export default function StudentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((r) => r.json())
      .then(setStudent)
  }, [id])

  async function handleArchive() {
    await fetch(`/api/students/${id}`, { method: "DELETE" })
    router.push("/dashboard/students")
  }

  if (!student) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="text-sm text-muted-foreground mb-6 hover:underline">
        ← Back
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{student.name}</h1>
          <p className="text-sm text-muted-foreground">
            Student since {new Date(student.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={levelColors[student.level]}>{student.level}</Badge>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {student.email ?? "—"}</p>
            <p><span className="text-muted-foreground">Phone:</span> {student.phone ?? "—"}</p>
          </CardContent>
        </Card>

        {student.notes && (
          <Card>
            <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
            <CardContent className="text-sm">{student.notes}</CardContent>
          </Card>
        )}

        <div className="pt-4">
          <Button variant="destructive" onClick={handleArchive}>Archive Student</Button>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddPieceDialog } from "@/components/pieces/add-piece-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Student = {
  id: string
  name: string
  email: string | null
  phone: string | null
  level: string
  notes: string | null
  createdAt: string
}

type StudentPiece = {
  id: string
  status: string
  notes: string | null
  startedAt: string
  endedAt: string | null
  piece: { title: string; composer: string | null; level: string; genre: string | null }
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
}

const statusColors: Record<string, string> = {
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-gray-100 text-gray-800",
}

export default function StudentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [pieces, setPieces] = useState<StudentPiece[]>([])

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then(r => r.json())
      .then(setStudent)
    fetchPieces()
  }, [id])

  async function fetchPieces() {
    fetch(`/api/students/${id}/pieces`)
      .then(r => r.json())
      .then(setPieces)
  }

  async function updateStatus(pieceId: string, status: string) {
    await fetch(`/api/students/${id}/pieces/${pieceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    fetchPieces()
  }

  async function removePiece(pieceId: string) {
    await fetch(`/api/students/${id}/pieces/${pieceId}`, { method: "DELETE" })
    fetchPieces()
  }

  async function handleArchive() {
    await fetch(`/api/students/${id}`, { method: "DELETE" })
    router.push("/dashboard/students")
  }

  if (!student) return <div className="p-6 text-muted-foreground">Loading...</div>

  const inProgress = pieces.filter(p => p.status === "in_progress")
  const completed = pieces.filter(p => p.status === "completed")
  const onHold = pieces.filter(p => p.status === "on_hold")

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

        {/* Repertoire */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Repertoire</CardTitle>
            <AddPieceDialog studentId={student.id} onAdded={fetchPieces} />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {pieces.length === 0 && (
              <p className="text-sm text-muted-foreground">No pieces assigned yet.</p>
            )}

            {inProgress.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">IN PROGRESS</p>
                <div className="flex flex-col gap-2">
                  {inProgress.map(sp => (
                    <PieceRow key={sp.id} sp={sp} onStatus={updateStatus} onRemove={removePiece} />
                  ))}
                </div>
              </div>
            )}

            {onHold.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">ON HOLD</p>
                <div className="flex flex-col gap-2">
                  {onHold.map(sp => (
                    <PieceRow key={sp.id} sp={sp} onStatus={updateStatus} onRemove={removePiece} />
                  ))}
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">COMPLETED</p>
                <div className="flex flex-col gap-2">
                  {completed.map(sp => (
                    <PieceRow key={sp.id} sp={sp} onStatus={updateStatus} onRemove={removePiece} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="pt-2">
          <Button variant="destructive" onClick={handleArchive}>Archive Student</Button>
        </div>
      </div>
    </div>
  )
}

function PieceRow({
  sp,
  onStatus,
  onRemove,
}: {
  sp: StudentPiece
  onStatus: (id: string, status: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="flex items-center justify-between text-sm border rounded-md px-3 py-2">
      <div>
        <p className="font-medium">{sp.piece.title}</p>
        <p className="text-xs text-muted-foreground">
          {sp.piece.composer ?? "Unknown"} · {sp.piece.genre ?? sp.piece.level}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select
          defaultValue={sp.status}
          onValueChange={(val) => onStatus(sp.id, val)}
        >
          <SelectTrigger className="w-32 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On hold</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-red-500 h-7"
          onClick={() => onRemove(sp.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
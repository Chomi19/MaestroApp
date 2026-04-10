"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

const schema = z.object({
  pieceId: z.string().min(1, "Please select a piece"),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>
type Piece = { id: string; title: string; composer: string | null; level: string }

export function AddPieceDialog({
  studentId,
  onAdded,
}: {
  studentId: string
  onAdded: () => void
}) {
  const [open, setOpen] = useState(false)
  const [pieces, setPieces] = useState<Piece[]>([])
  const [search, setSearch] = useState("")
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    fetch("/api/pieces").then(r => r.json()).then(setPieces)
  }, [])

  const filtered = pieces.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.composer ?? "").toLowerCase().includes(search.toLowerCase())
  )

  async function onSubmit(data: FormData) {
    await fetch(`/api/students/${studentId}/pieces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    reset()
    setSearch("")
    setOpen(false)
    onAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">+ Add Piece</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign a Piece</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Search pieces</Label>
            <Input
              placeholder="Search by title or composer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Select piece *</Label>
            <Select onValueChange={(val) => setValue("pieceId", val)}>
              <SelectTrigger><SelectValue placeholder="Choose a piece" /></SelectTrigger>
              <SelectContent>
                {filtered.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}{p.composer ? ` — ${p.composer}` : ""} ({p.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pieceId && <p className="text-xs text-red-500">{errors.pieceId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Notes</Label>
            <Textarea {...register("notes" as any)} placeholder="Focus areas, teacher notes..." />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Assigning..." : "Assign Piece"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  studentId: z.string().min(1, "Student is required"),
  startTime: z.string().min(1, "Time is required"),
  duration: z.coerce.number().min(15).max(180),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>
type Student = { id: string; name: string }

export function AddLessonDialog({
  onAdded,
  defaultDate,
}: {
  onAdded: () => void
  defaultDate?: string
}) {
  const [open, setOpen] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 60, startTime: defaultDate ?? "" },
  })

  useEffect(() => {
    fetch("/api/students").then(r => r.json()).then(setStudents)
  }, [])

  async function onSubmit(data: FormData) {
    await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    reset()
    setOpen(false)
    onAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Lesson</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Student *</Label>
            <Select onValueChange={(val) => setValue("studentId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.studentId && <p className="text-xs text-red-500">{errors.studentId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Date & Time *</Label>
            <Input {...register("startTime")} type="datetime-local" />
            {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Duration (minutes)</Label>
            <Select onValueChange={(val) => setValue("duration", Number(val))} defaultValue="60">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Notes</Label>
            <Textarea {...register("notes")} placeholder="Anything to prepare..." />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Lesson"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
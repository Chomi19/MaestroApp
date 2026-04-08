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

const schema = z.object({
  studentId: z.string().min(1, "Student is required"),
  month: z.string().min(1),
  day: z.string().min(1),
  year: z.string().min(1),
  hour: z.string().min(1),
  minute: z.string().min(1),
  duration: z.coerce.number().min(15).max(180),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>
type Student = { id: string; name: string }

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const minutes = ["00", "15", "30", "45"]

export function AddLessonDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 60 },
  })

  const today = new Date()
  const currentYear = today.getFullYear()
  const years = [currentYear, currentYear + 1]
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))

  useEffect(() => {
    fetch("/api/students").then(r => r.json()).then(setStudents)
  }, [])

  useEffect(() => {
    setValue("year", String(currentYear))
    setValue("minute", "00")
    setValue("duration", 60)
  }, [])

  async function onSubmit(data: FormData) {
    const monthIndex = String(months.indexOf(data.month) + 1).padStart(2, "0")
    const startTime = new Date(`${data.year}-${monthIndex}-${data.day}T${data.hour}:${data.minute}:00`)

    await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: data.studentId,
        startTime: startTime.toISOString(),
        duration: data.duration,
        notes: data.notes,
      }),
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
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.studentId && <p className="text-xs text-red-500">{errors.studentId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Date *</Label>
            <div className="flex gap-2">
              <Select onValueChange={(val) => setValue("month", val)}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>
                  {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={(val) => setValue("day", val)}>
                <SelectTrigger className="w-20"><SelectValue placeholder="Day" /></SelectTrigger>
                <SelectContent>
                  {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={(val) => setValue("year", val)} defaultValue={String(currentYear)}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Time *</Label>
            <div className="flex gap-2">
              <Select onValueChange={(val) => setValue("hour", val)}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Hour" /></SelectTrigger>
                <SelectContent>
                  {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={(val) => setValue("minute", val)} defaultValue="00">
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {minutes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Duration</Label>
            <Select onValueChange={(val) => setValue("duration", Number(val))} defaultValue="60">
              <SelectTrigger><SelectValue /></SelectTrigger>
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
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
  amount: z.coerce.number().min(0.01, "Amount is required"),
  method: z.enum(["cash", "transfer", "card", "other"]).optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>
type Student = { id: string; name: string }

export function AddPaymentDialog({
  onAdded,
  defaultStudentId,
}: {
  onAdded: () => void
  defaultStudentId?: string
}) {
  const [open, setOpen] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { studentId: defaultStudentId },
  })

  useEffect(() => {
    fetch("/api/students").then(r => r.json()).then(setStudents)
    if (defaultStudentId) setValue("studentId", defaultStudentId)
  }, [defaultStudentId])

  async function onSubmit(data: FormData) {
    await fetch("/api/payments", {
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
        <Button>+ Log Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

          <div className="flex flex-col gap-1">
            <Label>Student *</Label>
            <Select
              onValueChange={(val) => setValue("studentId", val)}
              defaultValue={defaultStudentId}
            >
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
            <Label>Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                {...register("amount")}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-7"
              />
            </div>
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Method</Label>
            <Select onValueChange={(val) => setValue("method", val as FormData["method"])}>
              <SelectTrigger><SelectValue placeholder="How did they pay?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="transfer">Bank Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Notes</Label>
            <Textarea {...register("notes")} placeholder="e.g. payment for March lessons" />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
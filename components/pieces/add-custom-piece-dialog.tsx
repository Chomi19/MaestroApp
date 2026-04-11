"use client"

import { useState } from "react"
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
  title: z.string().min(1, "Title is required"),
  composer: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  genre: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function AddCustomPieceDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    await fetch("/api/pieces", {
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
        <Button variant="outline">+ Add custom piece</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a piece to the library</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Title *</Label>
            <Input {...register("title")} placeholder="e.g. River Flows In You" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Composer / Artist</Label>
            <Input {...register("composer")} placeholder="e.g. Yiruma" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Level *</Label>
            <Select onValueChange={(val) => setValue("level", val as FormData["level"])}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && <p className="text-xs text-red-500">Level is required</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Genre</Label>
            <Input {...register("genre")} placeholder="e.g. Contemporary, Jazz, Pop..." />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Notes</Label>
            <Textarea {...register("notes")} placeholder="Difficulty notes, technique focus..." />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add to library"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
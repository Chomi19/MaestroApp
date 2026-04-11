"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
})

type FormData = z.infer<typeof schema>

const steps = [
  {
    id: "welcome",
    title: "Welcome to Maestro",
    subtitle: "Your personal music teaching studio — students, lessons, payments and repertoire all in one place.",
  },
  {
    id: "first-student",
    title: "Add your first student",
    subtitle: "Let's get your roster started. You can add more anytime.",
  },
  {
    id: "done",
    title: "You're all set",
    subtitle: "Your studio is ready. Let's go to your dashboard.",
  },
]

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const currentStep = steps[step]

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setStep(2)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      {/* Step indicators */}
      <div className="flex gap-2 mb-12">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? "w-8 bg-foreground" : i < step ? "w-4 bg-foreground/40" : "w-4 bg-foreground/15"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-sm">
        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-[#1B4D3E] flex items-center justify-center text-5xl shadow-lg">
              🎼
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-2">{currentStep.title}</h1>
              <p className="text-muted-foreground leading-relaxed">{currentStep.subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 w-full pt-4">
              <div className="text-sm text-muted-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-base">👥</span>
                Manage your student roster
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-base">📅</span>
                Schedule and track lessons
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-base">💰</span>
                Track payments and balances
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-base">🎵</span>
                Track repertoire and progress
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => setStep(1)}>
              Get started
            </Button>
          </div>
        )}

        {/* Step 1 — Add first student */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-2">{currentStep.title}</h1>
              <p className="text-muted-foreground">{currentStep.subtitle}</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label>Student name *</Label>
                <Input {...register("name")} placeholder="e.g. Sarah Johnson" autoFocus />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
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
                <Label>Email</Label>
                <Input {...register("email")} type="email" placeholder="student@email.com" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="+1 234 567 8900" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add student"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2 — Done */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-[#1B4D3E] flex items-center justify-center text-5xl shadow-lg">
              ✓
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-2">{currentStep.title}</h1>
              <p className="text-muted-foreground">{currentStep.subtitle}</p>
            </div>
            <Button className="w-full mt-4" onClick={onComplete}>
              Go to dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
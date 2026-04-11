"use client"

import { useEffect, useState } from "react"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { ReturningDashboard } from "@/components/dashboard/returning-dashboard"

export default function DashboardPage() {
  const [hasStudents, setHasStudents] = useState<boolean | null>(null)

  async function checkStudents() {
    const res = await fetch("/api/dashboard")
    const data = await res.json()
    setHasStudents(data.hasStudents)
  }

  useEffect(() => { checkStudents() }, [])

  if (hasStudents === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    )
  }

  if (!hasStudents) {
    return <OnboardingFlow onComplete={checkStudents} />
  }

  return <ReturningDashboard />
}
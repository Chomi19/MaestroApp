"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <p className="text-3xl mb-2">🎵</p>
          <CardTitle>Maestro</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to your studio</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="border rounded-md px-3 py-2 text-sm bg-background"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="border rounded-md px-3 py-2 text-sm bg-background"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
import { auth } from "@/auth"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">🎵 Maestro</h1>
          <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
        </div>
        <form action={async () => { "use server"; await signOut() }}>
          <Button variant="outline" type="submit">Sign out</Button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/students">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-8 text-center">
              <p className="text-3xl mb-2">👥</p>
              <p className="font-medium">Students</p>
              <p className="text-sm text-muted-foreground">Manage your roster</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Link href="/dashboard/schedule">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="py-8 text-center">
            <p className="text-3xl mb-2">📅</p>
            <p className="font-medium">Schedule</p>
            <p className="text-sm text-muted-foreground">Weekly lessons</p>
          </CardContent>
        </Card>
      </Link>
    </main>
  )
}
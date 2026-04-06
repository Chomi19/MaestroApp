import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="text-muted-foreground">{session?.user?.email}</p>
      <form action={async () => { "use server"; await signOut() }}>
        <Button variant="outline" type="submit">Sign out</Button>
      </form>
    </main>
  )
}
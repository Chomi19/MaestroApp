"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Payment = {
  id: string
  amount: number
  method: string | null
  notes: string | null
  paidAt: string
  student: { id: string; name: string }
}

type Summary = {
  id: string
  name: string
  totalPaid: number
  lessonsCompleted: number
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [summary, setSummary] = useState<Summary[]>([])

  async function fetchAll() {
    const [p, s] = await Promise.all([
      fetch("/api/payments").then(r => r.json()),
      fetch("/api/payments/summary").then(r => r.json()),
    ])
    setPayments(p)
    setSummary(s)
  }

  useEffect(() => { fetchAll() }, [])

  async function deletePayment(id: string) {
    await fetch(`/api/payments/${id}`, { method: "DELETE" })
    fetchAll()
  }

  const methodColors: Record<string, string> = {
    cash: "bg-green-100 text-green-800",
    transfer: "bg-blue-100 text-blue-800",
    card: "bg-purple-100 text-purple-800",
    other: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-muted-foreground text-sm">
            Total collected: ${payments.reduce((s, p) => s + p.amount, 0).toFixed(2)}
          </p>
        </div>
        <AddPaymentDialog onAdded={fetchAll} />
      </div>

      {/* Per-student summary */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {summary.map(s => (
          <Card key={s.id}>
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.lessonsCompleted} lessons completed</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">${s.totalPaid.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">paid</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment history */}
      <h2 className="text-base font-medium mb-3">Payment History</h2>
      {payments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">💰</p>
          <p>No payments logged yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {payments.map(p => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-sm">{p.student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(p.paidAt), "MMM d, yyyy")}
                      {p.notes && ` · ${p.notes}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.method && (
                    <Badge className={methodColors[p.method] ?? methodColors.other}>
                      {p.method}
                    </Badge>
                  )}
                  <p className="font-semibold text-sm">${p.amount.toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-red-500"
                    onClick={() => deletePayment(p.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
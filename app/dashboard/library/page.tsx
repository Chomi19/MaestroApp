"use client"

import { useEffect, useState, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AddCustomPieceDialog } from "@/components/pieces/add-custom-piece-dialog"

type Piece = {
  id: string
  title: string
  composer: string | null
  level: string
  genre: string | null
  notes: string | null
  _count: { students: number }
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
}

const levels = ["all", "beginner", "intermediate", "advanced"]

export default function LibraryPage() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("all")
  const [loading, setLoading] = useState(true)

  const fetchPieces = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (level !== "all") params.set("level", level)
    const res = await fetch(`/api/pieces?${params.toString()}`)
    const data = await res.json()
    setPieces(data)
    setLoading(false)
  }, [search, level])

  useEffect(() => {
    const timeout = setTimeout(fetchPieces, 200)
    return () => clearTimeout(timeout)
  }, [fetchPieces])

  const genres = ["all", ...Array.from(new Set(pieces.map(p => p.genre).filter(Boolean)))] as string[]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Piece Library</h1>
          <p className="text-muted-foreground text-sm">{pieces.length} pieces</p>
        </div>
        <AddCustomPieceDialog onAdded={fetchPieces} />
      </div>

      {/* Search */}
      <Input
        placeholder="Search by title or composer..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* Level filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {levels.map(l => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors capitalize ${
              level === l
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:border-foreground/40"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Pieces list */}
      {loading ? (
        <p className="text-muted-foreground text-sm text-center py-12">Loading...</p>
      ) : pieces.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">🎵</p>
          <p>No pieces found. Try a different search or add a custom piece.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pieces.map(piece => (
            <Card key={piece.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{piece.title}</p>
                    {piece.genre && (
                      <span className="text-xs text-muted-foreground border rounded-full px-2 py-0.5">
                        {piece.genre}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {piece.composer ?? "Unknown composer"}
                    {piece._count.students > 0 && (
                      <span className="ml-2">· {piece._count.students} student{piece._count.students !== 1 ? "s" : ""}</span>
                    )}
                  </p>
                </div>
                <Badge className={levelColors[piece.level]}>{piece.level}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
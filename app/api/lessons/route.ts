import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request){
    const { searchParams } = new URL(req.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    const lessons = await db.lesson.findMany({
        where: {
            startTime: {
                gte: start ? new Date(start) : undefined,
                lte: end ? new Date(end) : undefined,
            },
        },
        include: { student: true},
        orderBy: { startTime: "asc"},
    })
    return NextResponse.json(lessons)
}

export async function POST(req: Request){
    const body = await req.json()
    const lesson = await db.lesson.create({
        data: {
            studentId: body.studentId,
            startTime: new Date(body.startTime),
            duration: body.duration,
            notes: body.notes ?? null,
        },
        include: { student: true },
    })
    return NextResponse.json(lesson)
}
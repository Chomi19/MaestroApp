import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: { id: string }}){
    const body = await req.json()
    const lesson = await db.lesson.update({
        where: { id: params.id },
        data: body,
    })
    return NextResponse.json(lesson)
}

export async function DELETE(_: Request, { params }: { params: { id: string }}){
    await db.lesson.update({
        where: { id: params.id },
        data: { status: "cancelled" },
    })
    return NextResponse.json({ sucess: true })
}
import { NextResponse } from "next/server";
import { db } from "@/lib/db"

export async function GET(){
    const students = await db.student.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    })
    return NextResponse.json(students)
}

export async function POST(req: Request){
    const body = await req.json()
    const student = await db.student.create({
        data: {
            name: body.name,
            email: body.email ?? null,
            phone: body.phone ?? null,
            level: body.level,
            notes: body.notes ?? null,
        },
    })
    return NextResponse.json(student)
}


import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {

  try {

    const body = await req.json()

    const {
      studentId,
      levelId,
      trackType
    } = body

    if (!studentId || !levelId || !trackType) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    // REMOVE OLD LEVEL
    await prisma.studentLevel.deleteMany({
      where: {
        studentId,
        trackType
      }
    })

    // ASSIGN NEW LEVEL
    await prisma.studentLevel.create({
      data: {
        studentId,
        levelId,
        trackType
      }
    })

    return NextResponse.json({
      success: true
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )

  }
}
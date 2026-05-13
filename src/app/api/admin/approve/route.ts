import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const studentId = body.studentId || body.userId

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 })
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        requestedLevels: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    if (student.status !== "PENDING") {
      return NextResponse.json(
        { error: "Student is not pending" },
        { status: 400 }
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: studentId },
        data: {
          status: "ACTIVE",
          approvedAt: new Date(),
        },
      })

      if (student.requestedLevels.length > 0) {
        await tx.studentLevel.createMany({
          data: student.requestedLevels.map((rl) => ({
            studentId,
            levelId: rl.levelId,
            trackType: rl.trackType,
            scheduleId: rl.scheduleId,
          })),
          skipDuplicates: true,
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Approval failed" }, { status: 500 })
  }
}
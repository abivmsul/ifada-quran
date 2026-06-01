import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = {
  params: Promise<{
    id: string
  }>
}

type SessionInput = {
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY"
  startTime: string
  endTime: string
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()

    const { label, mode, location, sessions } = body ?? {}

    if (
      !label ||
      !mode ||
      !Array.isArray(sessions) ||
      sessions.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Label, mode, and at least one session are required",
        },
        { status: 400 }
      )
    }

    const schedule = await prisma.levelSchedule.update({
      where: { id },
      data: {
        label,
        mode,
        location: location || null,
        sessions: {
          deleteMany: {},
          create: sessions.map((session: SessionInput) => ({
            dayOfWeek: session.dayOfWeek,
            startTime: session.startTime,
            endTime: session.endTime,
          })),
        },
      },
      include: {
        sessions: {
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update schedule group" },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    await prisma.levelSchedule.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete schedule group" },
      { status: 500 }
    )
  }
}
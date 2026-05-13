import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const mode = req.nextUrl.searchParams.get("mode") as
      | "ONLINE"
      | "IN_PERSON"
      | "BOTH"
      | null

    const schedules = await prisma.levelSchedule.findMany({
      where: {
        levelId: id,
        ...(mode && mode !== "BOTH"
          ? {
              OR: [{ mode }, { mode: "BOTH" }],
            }
          : {}),
      },
      orderBy: [
        {
          dayOfWeek: "asc",
        },
        {
          startTime: "asc",
        },
      ],
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to load schedules" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()

    const { dayOfWeek, startTime, endTime, mode, location } = body ?? {}

    if (!dayOfWeek || !startTime || !endTime || !mode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const schedule = await prisma.levelSchedule.create({
      data: {
        levelId: id,
        dayOfWeek,
        startTime,
        endTime,
        mode,
        location: location || null,
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    )
  }
}
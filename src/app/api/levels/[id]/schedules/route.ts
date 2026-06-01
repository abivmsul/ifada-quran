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
      include: {
        sessions: {
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
      },
      orderBy: {
        createdAt: "asc",
      },
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
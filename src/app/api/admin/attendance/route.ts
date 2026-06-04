import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type AttendanceStatus = "PRESENT" | "ABSENT" | "PERMISSION"

function getDayRange(dateString: string) {
  const start = new Date(`${dateString}T00:00:00.000Z`)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 1)

  return { start, end }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const search = searchParams.get("search") || ""
    const trackType = searchParams.get("trackType") || ""
    const learningMode = searchParams.get("learningMode") || ""
    const quranLevel = searchParams.get("quranLevel") || ""
    const kitabLevel = searchParams.get("kitabLevel") || ""
    const scheduleId = searchParams.get("scheduleId") || ""
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0]

    const { start, end } = getDayRange(date)

    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        ...(search
          ? {
              OR: [
                {
                  fullName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  phone: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
        ...(learningMode
          ? {
              learningMode: learningMode as any,
            }
          : {}),
        ...(trackType
          ? {
              studentLevels: {
                some: {
                  trackType: trackType as any,
                },
              },
            }
          : {}),
        ...(quranLevel
          ? {
              studentLevels: {
                some: {
                  trackType: "QURAN",
                  levelId: quranLevel,
                },
              },
            }
          : {}),
        ...(kitabLevel
          ? {
              studentLevels: {
                some: {
                  trackType: "KITAB",
                  levelId: kitabLevel,
                },
              },
            }
          : {}),
        ...(scheduleId
          ? {
              studentLevels: {
                some: {
                  scheduleId,
                },
              },
            }
          : {}),
      },
      orderBy: {
        fullName: "asc",
      },
      include: {
        sponsor: true,
        studentLevels: {
          include: {
            level: true,
            schedule: {
              include: {
                sessions: true,
              },
            },
          },
        },
        attendance: {
          where: {
            date: {
              gte: start,
              lt: end,
            },
          },
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
    })

    const payload = students.map((student) => ({
      ...student,
      attendanceStatus: student.attendance[0]?.status || null,
    }))

    return NextResponse.json(payload)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to load attendance list" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { studentId, status, date } = body ?? {}

    if (!studentId || !status || !date) {
      return NextResponse.json(
        { error: "studentId, status, and date are required" },
        { status: 400 }
      )
    }

    if (!["PRESENT", "ABSENT", "PERMISSION"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid attendance status" },
        { status: 400 }
      )
    }

    const { start, end } = getDayRange(date)

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: {
          gte: start,
          lt: end,
        },
      },
      select: {
        id: true,
      },
    })

    const attendance = existing
      ? await prisma.attendance.update({
          where: {
            id: existing.id,
          },
          data: {
            status: status as AttendanceStatus,
            date: start,
          },
        })
      : await prisma.attendance.create({
          data: {
            studentId,
            status: status as AttendanceStatus,
            date: start,
          },
        })

    return NextResponse.json({
      success: true,
      attendance,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 }
    )
  }
}
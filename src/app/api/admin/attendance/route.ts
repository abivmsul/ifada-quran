import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const search = searchParams.get("search")
  const quranLevel = searchParams.get("quranLevel")
  const kitabLevel = searchParams.get("kitabLevel")

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      status: "ACTIVE",

      ...(search && {
        OR: [
          {
            fullName: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            phone: {
              contains: search
            }
          },
          {
            email: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      }),

      ...(quranLevel && {
        studentLevels: {
          some: {
            trackType: "QURAN",
            levelId: quranLevel
          }
        }
      }),

      ...(kitabLevel && {
        studentLevels: {
          some: {
            trackType: "KITAB",
            levelId: kitabLevel
          }
        }
      })
    },

    include: {
      studentLevels: {
        include: {
          level: true
        }
      }
    },

    orderBy: {
      fullName: "asc"
    }
  })

  return NextResponse.json(students)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      studentId,
      status,
      date
    } = body

    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date: new Date(date)
        }
      },

      update: {
        status
      },

      create: {
        studentId,
        status,
        date: new Date(date)
      }
    })

    return NextResponse.json(attendance)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 }
    )
  }
}
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
            email: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            phone: {
              contains: search
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
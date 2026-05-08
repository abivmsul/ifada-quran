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
      status: "PENDING",

      ...(search && {
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
            },
          },
        ],
      }),

      ...(quranLevel && {
        requestedLevels: {
          some: {
            trackType: "QURAN",
            levelId: quranLevel,
          },
        },
      }),

      ...(kitabLevel && {
        requestedLevels: {
          some: {
            trackType: "KITAB",
            levelId: kitabLevel,
          },
        },
      }),
    },
    include: {
      requestedLevels: {
        include: {
          level: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(students)
}
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const student = await prisma.user.findUnique({
    where: { id },

    include: {
      studentLevels: {
        include: {
          level: true
        }
      },

      attendance: {
        orderBy: {
          date: "desc"
        },
        take: 20
      },

      lessons: {
        orderBy: {
          date: "desc"
        },
        take: 20
      },

      notes: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  return NextResponse.json(student)
}
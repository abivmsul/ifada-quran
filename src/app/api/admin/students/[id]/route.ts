import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const student = await prisma.user.findUnique({
    where: {
      id
    },

    include: {

     studentLevels: {
        include: {
            level: true
        },
        orderBy: {
            id: "desc"
        }
        },

      attendance: {
        orderBy: {
          date: "desc"
        },
        take: 50
      },

      lessons: {
        orderBy: {
          date: "desc"
        },
        take: 100
      },

      notes: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  if (!student) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    )
  }

  const levels = await prisma.level.findMany({
    orderBy: {
        levelOrder: "asc"
    }
    })

    return NextResponse.json({
    student,
    levels
    })
}
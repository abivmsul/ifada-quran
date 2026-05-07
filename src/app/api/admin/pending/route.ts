import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const students = await prisma.user.findMany({
    where: {
      status: "PENDING",
      role: "STUDENT"
    },
    include: {
      requestedLevels: {
        include: {
          level: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json(students)
}
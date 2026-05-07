import { NextResponse } from "next/server"

export async function GET() {
  const { prisma } = await import("@/lib/prisma")

  const levels = await prisma.level.findMany({
    orderBy: { levelOrder: "asc" }
  })

  return NextResponse.json(levels)
}
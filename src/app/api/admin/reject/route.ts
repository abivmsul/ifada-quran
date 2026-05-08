import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body ?? {}

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.status !== "PENDING") {
      return NextResponse.json(
        { error: "User is not pending" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "REJECTED",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to reject student" },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const trackType = searchParams.get("trackType") || ""

    const levels = await prisma.level.findMany({
      where: {
        ...(trackType ? { trackType: trackType as "QURAN" | "KITAB" } : {}),
      },
      orderBy: [
        {
          trackType: "asc",
        },
        {
          levelOrder: "asc",
        },
      ],
    })

    return NextResponse.json(levels)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to load levels" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      trackType,
      levelOrder,
      description,
    } = body ?? {}

    if (!name || !trackType || levelOrder === undefined || levelOrder === null) {
      return NextResponse.json(
        { error: "Name, track type, and level order are required" },
        { status: 400 }
      )
    }

    const level = await prisma.level.create({
      data: {
        name,
        trackType,
        levelOrder: Number(levelOrder),
        description: description || null,
      },
    })

    return NextResponse.json(level)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create level" },
      { status: 500 }
    )
  }
}
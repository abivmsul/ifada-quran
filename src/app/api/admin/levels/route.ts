import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  const levels = await prisma.level.findMany({
    orderBy: [
      {
        trackType: "asc"
      },
      {
        levelOrder: "asc"
      }
    ]
  })

  return NextResponse.json(levels)
}

export async function POST(req: NextRequest) {

  try {

    const body = await req.json()

    const {
      name,
      trackType,
      levelOrder,
      description
    } = body

    if (!name || !trackType || !levelOrder) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const level = await prisma.level.create({
      data: {
        name,
        trackType,
        levelOrder: Number(levelOrder),
        description
      }
    })

    return NextResponse.json(level)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )

  }
}
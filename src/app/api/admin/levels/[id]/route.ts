import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    const body = await req.json()

    const {
      name,
      trackType,
      levelOrder,
      description
    } = body

    const level = await prisma.level.update({
      where: {
        id
      },

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
      { error: "Update failed" },
      { status: 500 }
    )

  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    await prisma.level.delete({
      where: {
        id
      }
    })

    return NextResponse.json({
      success: true
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    )

  }
}
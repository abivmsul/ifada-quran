import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()

    const {
      name,
      type,
      phone,
      email,
      notes,
      status,
    } = body ?? {}

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        name,
        type,
        phone: phone || null,
        email: email || null,
        notes: notes || null,
        status: status || "ACTIVE",
      },
    })

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update sponsor" },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    await prisma.sponsor.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete sponsor" },
      { status: 500 }
    )
  }
}
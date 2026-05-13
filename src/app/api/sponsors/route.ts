import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(sponsors)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to load sponsors" },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const type = searchParams.get("type") || ""
  const status = searchParams.get("status") || ""

  const sponsors = await prisma.sponsor.findMany({
    where: {
      ...(type ? { type: type as any } : {}),
      ...(status ? { status: status as any } : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(sponsors)
}

export async function POST(req: NextRequest) {
  try {
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

    const sponsor = await prisma.sponsor.create({
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
      { error: "Failed to create sponsor" },
      { status: 500 }
    )
  }
}
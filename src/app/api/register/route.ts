import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      email,
      fullName,
      phone,
      quranLevelId,
      kitabLevelId
    } = body ?? {}

    if (!email || !fullName || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 🚨 FORCE STUDENT ROLE
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        phone,
        role: "STUDENT",   // ← forced
        status: "PENDING"
      }
    })

    // Save requested levels
    if (quranLevelId) {
      await prisma.requestedLevel.create({
        data: {
          studentId: user.id,
          levelId: quranLevelId,
          trackType: "QURAN"
        }
      })
    }

    if (kitabLevelId) {
      await prisma.requestedLevel.create({
        data: {
          studentId: user.id,
          levelId: kitabLevelId,
          trackType: "KITAB"
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Registered successfully. Waiting for admin approval."
    })

  } catch (err: any) {
    console.error(err)

    // Handle duplicate email/phone
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Email or phone already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
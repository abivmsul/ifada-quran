import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      fullName,
      phone,
      email,
      address,
      emergencyContactName,
      emergencyContactPhone,
      isSponsored,
      quranLevelId,
      kitabLevelId,
    } = body ?? {}

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { error: "Full name, phone, and email are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        email,
        address: address || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        isSponsored: Boolean(isSponsored),
        role: "STUDENT",
        status: "ACTIVE",
        approvedAt: new Date(),
      },
    })

    const studentLevelsData = [
      quranLevelId
        ? {
            studentId: user.id,
            levelId: quranLevelId,
            trackType: "QURAN" as const,
          }
        : null,
      kitabLevelId
        ? {
            studentId: user.id,
            levelId: kitabLevelId,
            trackType: "KITAB" as const,
          }
        : null,
    ].filter(Boolean) as {
      studentId: string
      levelId: string
      trackType: "QURAN" | "KITAB"
    }[]

    if (studentLevelsData.length) {
      await prisma.studentLevel.createMany({
        data: studentLevelsData,
        skipDuplicates: true,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Student created and approved successfully.",
    })
  } catch (error: any) {
    console.error(error)

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Email or phone already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Admin student creation failed" },
      { status: 500 }
    )
  }
}
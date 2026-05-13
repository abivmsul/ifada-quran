import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const validGenders = [
  "MALE",
  "FEMALE",
  "OTHER",
  "PREFER_NOT_TO_SAY",
] as const

const validLearningModes = ["ONLINE", "IN_PERSON", "BOTH"] as const

async function validateSchedule(
  scheduleId: string | null | undefined,
  levelId: string
) {
  if (!scheduleId) return null

  const schedule = await prisma.levelSchedule.findUnique({
    where: { id: scheduleId },
    select: {
      id: true,
      levelId: true,
    },
  })

  if (!schedule || schedule.levelId !== levelId) {
    throw new Error("Invalid schedule selection")
  }

  return schedule.id
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      fullName,
      email,
      phone,
      age,
      gender,
      telegramUsername,
      address,
      learningMode,
      isSponsored,
      sponsorId,
      emergencyContactName,
      emergencyContactPhone,
      quranLevelId,
      kitabLevelId,
      quranScheduleId,
      kitabScheduleId,
    } = body ?? {}

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Full name, email, and phone are required" },
        { status: 400 }
      )
    }

    if (!age || Number.isNaN(Number(age)) || Number(age) <= 0) {
      return NextResponse.json(
        { error: "Valid age is required" },
        { status: 400 }
      )
    }

    if (!gender || !validGenders.includes(gender)) {
      return NextResponse.json(
        { error: "Gender is required" },
        { status: 400 }
      )
    }

    if (!learningMode || !validLearningModes.includes(learningMode)) {
      return NextResponse.json(
        { error: "Learning mode is required" },
        { status: 400 }
      )
    }

    const hasQuran = Boolean(quranLevelId)
    const hasKitab = Boolean(kitabLevelId)

    if (!hasQuran && !hasKitab) {
      return NextResponse.json(
        { error: "Select at least one level" },
        { status: 400 }
      )
    }

    let sponsorLink: string | null = null

    if (isSponsored) {
      if (!sponsorId) {
        return NextResponse.json(
          { error: "Please select a sponsor" },
          { status: 400 }
        )
      }

      const sponsor = await prisma.sponsor.findUnique({
        where: { id: sponsorId },
        select: {
          id: true,
          status: true,
        },
      })

      if (!sponsor || sponsor.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Selected sponsor is invalid" },
          { status: 400 }
        )
      }

      sponsorLink = sponsor.id
    }

    const user = await prisma.user.create({
      data: {
        fullName: String(fullName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        age: Number(age),
        gender,
        telegramUsername: telegramUsername
          ? String(telegramUsername).trim()
          : null,
        learningMode,
        address: address ? String(address).trim() : null,
        isSponsored: Boolean(isSponsored),
        sponsorId: sponsorLink,
        emergencyContactName: emergencyContactName
          ? String(emergencyContactName).trim()
          : null,
        emergencyContactPhone: emergencyContactPhone
          ? String(emergencyContactPhone).trim()
          : null,
        role: "STUDENT",
        status: "ACTIVE",
        approvedAt: new Date(),
      },
    })

    const studentLevelsData: Array<{
      studentId: string
      levelId: string
      trackType: "QURAN" | "KITAB"
      scheduleId: string | null
    }> = []

    if (quranLevelId) {
      const scheduleId = await validateSchedule(
        quranScheduleId,
        quranLevelId
      )

      studentLevelsData.push({
        studentId: user.id,
        levelId: quranLevelId,
        trackType: "QURAN",
        scheduleId,
      })
    }

    if (kitabLevelId) {
      const scheduleId = await validateSchedule(
        kitabScheduleId,
        kitabLevelId
      )

      studentLevelsData.push({
        studentId: user.id,
        levelId: kitabLevelId,
        trackType: "KITAB",
        scheduleId,
      })
    }

    if (studentLevelsData.length > 0) {
      await prisma.studentLevel.createMany({
        data: studentLevelsData,
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

    if (error?.message === "Invalid schedule selection") {
      return NextResponse.json(
        { error: "Invalid schedule selected for the chosen level" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Admin student creation failed" },
      { status: 500 }
    )
  }
}
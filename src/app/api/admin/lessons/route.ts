import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { TrackType } from "@prisma/client"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const search = searchParams.get("search") || ""
  const trackType = searchParams.get("trackType") || ""
  const studentId = searchParams.get("studentId") || ""
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const lessons = await prisma.lesson.findMany({
    where: {
      ...(trackType && { trackType: trackType as TrackType }),
      ...(studentId && { studentId }),
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(search && {
        OR: [
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            notes: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            surah: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            kitabBook: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            topic: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          studentLevels: {
            include: {
              level: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 100,
  })

  return NextResponse.json(lessons)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      studentId,
      trackType,
      title,
      content,
      notes,
      surah,
      fromAyah,
      toAyah,
      isRevision,
      kitabBook,
      kitabChapter,
      topic,
      homework,
      date,
    } = body ?? {}

    if (!studentId || !trackType || !content) {
      return NextResponse.json(
        { error: "studentId, trackType, and content are required" },
        { status: 400 }
      )
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, role: true, status: true },
    })

    if (!student || student.role !== "STUDENT" || student.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Student not found or not active" },
        { status: 400 }
      )
    }

    const lesson = await prisma.lesson.create({
      data: {
        studentId,
        trackType,
        title: title || null,
        content,
        notes: notes || null,
        surah: surah || null,
        fromAyah: fromAyah ? Number(fromAyah) : null,
        toAyah: toAyah ? Number(toAyah) : null,
        isRevision: Boolean(isRevision),
        kitabBook: kitabBook || null,
        kitabChapter: kitabChapter || null,
        topic: topic || null,
        homework: homework || null,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to save lesson" },
      { status: 500 }
    )
  }
}
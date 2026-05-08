// src/app/admin/students/[id]/page.tsx

import { prisma } from "@/lib/prisma"
import Link from "next/link"

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  ScrollText,
  ClipboardCheck,
  NotebookPen,
  TrendingUp,
  Plus,
} from "lucide-react"

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const student = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      studentLevels: {
        include: {
          level: true,
        },
      },

      requestedLevels: {
        include: {
          level: true,
        },
      },

      lessons: {
        orderBy: {
          date: "desc",
        },
        take: 10,
      },

      attendance: {
        orderBy: {
          date: "desc",
        },
        take: 10,
      },

      notes: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  })

  if (!student) {
    return (
      <main className="min-h-screen bg-[#f7f7f2] p-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Student not found
        </div>
      </main>
    )
  }

  const presentCount = student.attendance.filter(
    (a) => a.status === "PRESENT"
  ).length

  const absentCount = student.attendance.filter(
    (a) => a.status === "ABSENT"
  ).length

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left */}
            <div className="flex gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-900">
                <UserRound className="h-10 w-10" />
              </div>

              <div>
                <div className="mb-3">
                  <Link
                    href="/admin/students"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Students
                  </Link>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  {student.fullName}
                </h1>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-700" />
                    {student.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-700" />
                    {student.phone}
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-emerald-700" />
                    {student.role}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-700" />
                    Joined{" "}
                    {new Date(student.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/students/${student.id}/attendance`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ClipboardCheck className="h-4 w-4" />
                Attendance
              </Link>

              <Link
                href={`/admin/students/${student.id}/lessons`}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                <NotebookPen className="h-4 w-4" />
                Lessons
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  Quran Levels
                </div>

                <div className="mt-2 text-3xl font-black text-emerald-900">
                  {
                    student.studentLevels.filter(
                      (l) => l.trackType === "QURAN"
                    ).length
                  }
                </div>
              </div>

              <BookOpen className="h-8 w-8 text-emerald-800" />
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  Kitab Levels
                </div>

                <div className="mt-2 text-3xl font-black text-amber-600">
                  {
                    student.studentLevels.filter(
                      (l) => l.trackType === "KITAB"
                    ).length
                  }
                </div>
              </div>

              <ScrollText className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  Present
                </div>

                <div className="mt-2 text-3xl font-black text-emerald-900">
                  {presentCount}
                </div>
              </div>

              <ClipboardCheck className="h-8 w-8 text-emerald-800" />
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  Lessons
                </div>

                <div className="mt-2 text-3xl font-black text-emerald-900">
                  {student.lessons.length}
                </div>
              </div>

              <TrendingUp className="h-8 w-8 text-emerald-800" />
            </div>
          </div>
        </section>

        {/* Levels */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Current Levels */}
          <div className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-900" />

              <h2 className="text-2xl font-bold">
                Current Levels
              </h2>
            </div>

            <div className="space-y-4">
              {student.studentLevels.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-slate-500">
                  No assigned levels
                </div>
              )}

              {student.studentLevels.map((sl) => (
                <div
                  key={sl.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {sl.trackType === "QURAN" ? (
                      <BookOpen className="h-4 w-4 text-emerald-900" />
                    ) : (
                      <ScrollText className="h-4 w-4 text-amber-600" />
                    )}

                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      {sl.trackType}
                    </span>
                  </div>

                  <div className="text-xl font-bold text-slate-900">
                    {sl.level.name}
                  </div>

                  {sl.level.description && (
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {sl.level.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requested Levels */}
          <div className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-900" />

              <h2 className="text-2xl font-bold">
                Requested Levels
              </h2>
            </div>

            <div className="space-y-4">
              {student.requestedLevels.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-slate-500">
                  No requested levels
                </div>
              )}

              {student.requestedLevels.map((rl) => (
                <div
                  key={rl.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {rl.trackType === "QURAN" ? (
                      <BookOpen className="h-4 w-4 text-emerald-900" />
                    ) : (
                      <ScrollText className="h-4 w-4 text-amber-600" />
                    )}

                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      {rl.trackType}
                    </span>
                  </div>

                  <div className="text-xl font-bold text-slate-900">
                    {rl.level.name}
                  </div>

                  {rl.level.description && (
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {rl.level.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Attendance + Lessons */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Attendance */}
          <div className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-900" />

              <h2 className="text-2xl font-bold">
                Recent Attendance
              </h2>
            </div>

            <div className="space-y-3">
              {student.attendance.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-slate-500">
                  No attendance records
                </div>
              )}

              {student.attendance.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {new Date(attendance.date).toLocaleDateString()}
                    </div>

                    <div className="text-sm text-slate-500">
                      Attendance Record
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      attendance.status === "PRESENT"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {attendance.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lessons */}
          <div className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <NotebookPen className="h-5 w-5 text-emerald-900" />

              <h2 className="text-2xl font-bold">
                Recent Lessons
              </h2>
            </div>

            <div className="space-y-3">
              {student.lessons.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-slate-500">
                  No lesson records
                </div>
              )}

              {student.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {lesson.trackType === "QURAN" ? (
                      <BookOpen className="h-4 w-4 text-emerald-900" />
                    ) : (
                      <ScrollText className="h-4 w-4 text-amber-600" />
                    )}

                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      {lesson.trackType}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900">
                    {lesson.content}
                  </div>

                  {lesson.notes && (
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {lesson.notes}
                    </div>
                  )}

                  <div className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                    {new Date(lesson.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-emerald-900" />

            <h2 className="text-2xl font-bold">
              Student Notes
            </h2>
          </div>

          <div className="space-y-4">
            {student.notes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-slate-500">
                No notes added
              </div>
            )}

            {student.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="leading-7 text-slate-700">
                  {note.text}
                </div>

                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
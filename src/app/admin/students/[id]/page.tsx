// src/app/admin/students/[id]/page.tsx

import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  ClipboardCheck,
  NotebookPen,
  Clock3,
} from "lucide-react"

type Props = {
  params: Promise<{
    id: string
  }>
}

type StudentWithRelations = Prisma.UserGetPayload<{
  include: {
    studentLevels: {
      include: {
        level: true
      }
    }

    requestedLevels: {
      include: {
        level: true
      }
    }

    attendance: true
    lessons: true
    notes: true
  }
}>

export default async function StudentDetailPage({
  params,
}: Props) {
  const { id } = await params

  
  const student: StudentWithRelations | null =
  await prisma.user.findUnique({
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

      attendance: {
        orderBy: {
          date: "desc",
        },
        take: 10,
      },

      lessons: {
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
    notFound()
  }

  const quranLevel = student.studentLevels.find(
    (sl) => sl.trackType === "QURAN"
  )

  const kitabLevel = student.studentLevels.find(
    (sl) => sl.trackType === "KITAB"
  )

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* TOP NAV */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Students
        </Link>
      </div>

      {/* HERO */}
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-8 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15">
                <Users className="h-10 w-10" />
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    Active Student
                  </div>

                  {student.isSponsored ? (
                    <div className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950">
                      Sponsored
                    </div>
                  ) : (
                    <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      Self Sponsored
                    </div>
                  )}
                </div>

                <h1 className="text-3xl font-black sm:text-4xl">
                  {student.fullName}
                </h1>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-emerald-50">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-50">
                    <Phone className="h-4 w-4" />
                    <span>{student.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-50">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {student.address || "Address not provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-50">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(
                        student.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-emerald-50">
                  Attendance
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {student.attendance.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-emerald-50">
                  Lessons
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {student.lessons.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur col-span-2 sm:col-span-1">
                <p className="text-sm text-emerald-50">
                  Notes
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {student.notes.length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* LEVELS */}
        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <BookOpen className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Quran Track
                </p>

                <h3 className="text-lg font-black text-slate-900">
                  {quranLevel?.level?.name ||
                    "Not Assigned"}
                </h3>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-700">
              Current Quran memorization and learning
              track.
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <ScrollText className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Kitab Track
                </p>

                <h3 className="text-lg font-black text-slate-900">
                  {kitabLevel?.level?.name ||
                    "Not Assigned"}
                </h3>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-700">
              Current Islamic studies and kitab learning
              track.
            </div>
          </div>
        </div>
      </section>

      {/* INFO GRID */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          {/* ATTENDANCE */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <ClipboardCheck className="h-6 w-6 text-emerald-700" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Attendance History
                  </h2>

                  <p className="text-sm text-slate-500">
                    Recent attendance records
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {student.attendance.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  No attendance records yet.
                </div>
              )}

              {student.attendance.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        attendance.status === "PRESENT"
                          ? "bg-emerald-100"
                          : "bg-rose-100"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-5 w-5 ${
                          attendance.status === "PRESENT"
                            ? "text-emerald-700"
                            : "text-rose-700"
                        }`}
                      />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        {attendance.status}
                      </p>

                      <p className="text-sm text-slate-500">
                        {new Date(
                          attendance.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      attendance.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {attendance.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LESSONS */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <NotebookPen className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Recent Lessons
                </h2>

                <p className="text-sm text-slate-500">
                  Latest lesson records
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {student.lessons.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  No lessons recorded yet.
                </div>
              )}

              {student.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-emerald-700" />

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {lesson.trackType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="h-4 w-4" />

                      {new Date(
                        lesson.date
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {lesson.content}
                  </p>

                  {lesson.notes && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      {lesson.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* EMERGENCY */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Emergency Contact
                </h2>

                <p className="text-sm text-slate-500">
                  Parent or guardian information
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="mb-2 text-sm text-slate-500">
                  Contact Person
                </p>

                <p className="font-bold text-slate-900">
                  {student.emergencyContactName ||
                    "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="mb-2 text-sm text-slate-500">
                  Contact Phone
                </p>

                <p className="font-bold text-slate-900">
                  {student.emergencyContactPhone ||
                    "Not provided"}
                </p>
              </div>
            </div>
          </section>

          {/* REQUESTED LEVELS */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Sparkles className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Requested Levels
                </h2>

                <p className="text-sm text-slate-500">
                  Registration preferences
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {student.requestedLevels.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                  No requested levels found.
                </div>
              )}

              {student.requestedLevels.map((rl) => (
                <div
                  key={rl.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                      <User className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        {rl.level?.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {rl.trackType}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Requested
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
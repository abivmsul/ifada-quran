// src/app/admin/students/[id]/attendance/page.tsx

import { prisma } from "@/lib/prisma"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  UserRound,
  XCircle,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default async function StudentAttendancePage({
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
      attendance: {
        orderBy: {
          date: "desc",
        },
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

  const attendanceRate =
    student.attendance.length > 0
      ? Math.round((presentCount / student.attendance.length) * 100)
      : 0

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
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
                    href={`/admin/students/${student.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Student
                  </Link>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Attendance Records
                </h1>

                <p className="mt-3 text-base leading-7 text-slate-600">
                  Monitor attendance history and track consistency for{" "}
                  <span className="font-bold text-emerald-900">
                    {student.fullName}
                  </span>
                </p>
              </div>
            </div>

            {/* Action */}
            <form
              action="/api/admin/attendance"
              method="POST"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="hidden"
                name="studentId"
                value={student.id}
              />

              <select
                name="status"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
              </select>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                <Plus className="h-4 w-4" />
                Record Attendance
              </button>
            </form>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  Total Records
                </div>

                <div className="mt-2 text-3xl font-black text-emerald-900">
                  {student.attendance.length}
                </div>
              </div>

              <ClipboardCheck className="h-8 w-8 text-emerald-800" />
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

              <CheckCircle2 className="h-8 w-8 text-emerald-800" />
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  Absent
                </div>

                <div className="mt-2 text-3xl font-black text-rose-600">
                  {absentCount}
                </div>
              </div>

              <XCircle className="h-8 w-8 text-rose-500" />
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">
                  Attendance Rate
                </div>

                <div className="mt-2 text-3xl font-black text-emerald-900">
                  {attendanceRate}%
                </div>
              </div>

              <Calendar className="h-8 w-8 text-emerald-800" />
            </div>
          </div>
        </section>

        {/* Attendance Timeline */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-900" />

            <h2 className="text-2xl font-bold">
              Attendance Timeline
            </h2>
          </div>

          <div className="space-y-4">
            {student.attendance.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
                No attendance records found.
              </div>
            )}

            {student.attendance.map((attendance) => (
              <div
                key={attendance.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      attendance.status === "PRESENT"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {attendance.status === "PRESENT" ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <XCircle className="h-7 w-7" />
                    )}
                  </div>

                  <div>
                    <div className="text-lg font-bold text-slate-900">
                      {attendance.status === "PRESENT"
                        ? "Present"
                        : "Absent"}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      Attendance Record
                    </div>
                  </div>
                </div>

                <div className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
                  {new Date(attendance.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
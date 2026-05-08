import Link from "next/link"
import Image from "next/image"
import {
  Users,
  ClipboardCheck,
  BookOpen,
  Layers3,
  ScrollText,
  BookMarked,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
  GraduationCap,
} from "lucide-react"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)

  const [
    activeStudents,
    pendingStudents,
    totalLevels,
    totalLessons,
    quranStudents,
    kitabStudents,
    recentPendingStudents,
    recentActiveStudents,
    recentLessons,
    todayAttendanceCount,
    todayPresentCount,
  ] = await Promise.all([
    prisma.user.count({
      where: { role: "STUDENT", status: "ACTIVE" },
    }),
    prisma.user.count({
      where: { role: "STUDENT", status: "PENDING" },
    }),
    prisma.level.count(),
    prisma.lesson.count(),
    prisma.user.count({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        studentLevels: { some: { trackType: "QURAN" } },
      },
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        studentLevels: { some: { trackType: "KITAB" } },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT", status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        requestedLevels: {
          include: { level: true },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT", status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        studentLevels: {
          include: { level: true },
        },
      },
    }),
    prisma.lesson.findMany({
      orderBy: { date: "desc" },
      take: 6,
      include: {
        student: {
          select: { fullName: true },
        },
      },
    }),
    prisma.attendance.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
    prisma.attendance.count({
      where: {
        status: "PRESENT",
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
  ])

  const stats = [
    {
      label: "Active Students",
      value: activeStudents,
      icon: Users,
      color: "text-emerald-900",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Approvals",
      value: pendingStudents,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Levels",
      value: totalLevels,
      icon: Layers3,
      color: "text-emerald-900",
      bg: "bg-emerald-50",
    },
    {
      label: "Lessons Recorded",
      value: totalLessons,
      icon: BookOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Quran Students",
      value: quranStudents,
      icon: BookMarked,
      color: "text-emerald-900",
      bg: "bg-emerald-50",
    },
    {
      label: "Kitab Students",
      value: kitabStudents,
      icon: ScrollText,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  const quickActions = [
    {
      href: "/admin/pending",
      title: "Pending Approvals",
      text: "Review and approve new student registrations.",
      icon: ClipboardCheck,
      accent: "bg-emerald-900",
    },
    {
      href: "/admin/students",
      title: "Active Students",
      text: "View current students, levels, and progress.",
      icon: Users,
      accent: "bg-amber-500",
    },
    {
      href: "/admin/attendance",
      title: "Attendance",
      text: "Mark attendance and manage daily records.",
      icon: CheckCircle2,
      accent: "bg-emerald-900",
    },
    {
      href: "/admin/lessons",
      title: "Lesson Recording",
      text: "Record Quran and Kitab lessons in detail.",
      icon: BookOpen,
      accent: "bg-amber-500",
    },
    {
      href: "/admin/levels",
      title: "Levels",
      text: "Create, edit, and organize all learning levels.",
      icon: GraduationCap,
      accent: "bg-emerald-900",
    },
  ]

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,101,52,0.10),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(217,164,74,0.12),_transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                IFADA QIRAT CENTER ADMIN
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                ኢፋዳ የቁርዓን ማዕከል
                <span className="block text-emerald-900">
                  Manage ተማሪዎችን with Ease
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                ምዝገባዎችን መከለስ፣ ተማሪዎችን ማፅደቅ፣ የትምህርት ክትትልን መቆጣጠር፣ ትምህርቶችን መመዝገብ፣ ደረጃዎችን ማስተዳደር እና የቂርዓት ማዕከሉን በተደራጀ ሁኔታ መምራት።
              </p>
            </div>

            <div className="rounded-[32px] border border-emerald-900/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-amber-500/20">
                  <Image
                    src="/ifada-logo.png"
                    alt="Ifada Qirat Center"
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div>
                  <div className="text-lg font-black text-emerald-900">
                    IFADA QIRAT CENTER
                  </div>
                  <div className="text-sm text-slate-500">
                    Knowledge is Light
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}
                    >
                      <Icon className={`h-7 w-7 ${stat.color}`} />
                    </div>

                    <div className={`text-4xl font-black ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>

                  <div className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Quick Access
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Main Admin Tools
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {quickActions.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.accent} text-white shadow-lg`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900">
                  Open
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Content grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Pending students */}
          <div className="rounded-[32px] border border-emerald-900/10 bg-white p-4 sm:p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">Pending Students</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Students waiting for approval
                </p>
              </div>

              <Link
                href="/admin/pending"
                className="w-fit rounded-xl border border-emerald-900/15 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentPendingStudents.map((student: any) => (
                <div
                  key={student.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        {student.fullName}
                      </div>
                      <div className="text-sm text-slate-500">{student.email}</div>
                      <div className="text-sm text-slate-500">{student.phone}</div>
                    </div>

                    <div className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                      PENDING
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    {student.requestedLevels.map((rl: any) => (
                      <div key={rl.id}>
                        <span className="font-semibold text-slate-900">
                          {rl.trackType}
                        </span>{" "}
                        → {rl.level.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {recentPendingStudents.length === 0 && (
                <p className="text-sm text-slate-500">No pending students.</p>
              )}
            </div>
          </div>

          {/* Active students + lessons */}
          <div className="space-y-8">
            <div className="rounded-[32px] border border-emerald-900/10 bg-white p-4 sm:p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Active Students</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Students currently enrolled
                  </p>
                </div>

                <Link
                  href="/admin/students"
                  className="w-fit rounded-xl border border-emerald-900/15 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentActiveStudents.map((student: any) => {
                  const quranLevel = student.studentLevels.find(
                    (sl: any) => sl.trackType === "QURAN"
                  )
                  const kitabLevel = student.studentLevels.find(
                    (sl: any) => sl.trackType === "KITAB"
                  )

                  return (
                    <div
                      key={student.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="font-bold text-slate-900">
                            {student.fullName}
                          </div>
                          <div className="text-sm text-slate-500">{student.email}</div>
                        </div>

                        <div className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                          ACTIVE
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white p-3">
                          <div className="text-xs font-semibold uppercase text-slate-500">
                            Quran
                          </div>
                          <div className="mt-1 font-bold text-emerald-900">
                            {quranLevel?.level?.name || "Not assigned"}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-white p-3">
                          <div className="text-xs font-semibold uppercase text-slate-500">
                            Kitab
                          </div>
                          <div className="mt-1 font-bold text-amber-600">
                            {kitabLevel?.level?.name || "Not assigned"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {recentActiveStudents.length === 0 && (
                  <p className="text-sm text-slate-500">No active students yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-900/10 bg-white p-4 sm:p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Recent Lessons</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest Quran and Kitab lesson entries
                  </p>
                </div>

                <Link
                  href="/admin/lessons"
                  className="w-fit rounded-xl border border-emerald-900/15 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentLessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {lesson.student.fullName}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {lesson.content}
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {new Date(lesson.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                        lesson.trackType === "QURAN"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {lesson.trackType}
                    </div>
                  </div>
                ))}

                {recentLessons.length === 0 && (
                  <p className="text-sm text-slate-500">No lessons recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Daily snapshot */}
        <div className="mt-8 rounded-[32px] bg-emerald-900 px-4 py-8 text-white shadow-2xl sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Daily Snapshot
              </div>
              <h3 className="mt-2 text-3xl font-black">Attendance Overview</h3>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-100">Present Today</span>
                <span className="text-2xl font-black">{todayPresentCount}</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-100">Attendance Entries</span>
                <span className="text-2xl font-black">{todayAttendanceCount}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
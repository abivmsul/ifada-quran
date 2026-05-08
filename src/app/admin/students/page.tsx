// src/app/admin/students/page.tsx

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  Users,
  Sparkles,
  BookOpen,
  ScrollText,
  UserRound,
  GraduationCap,
  Phone,
  Mail,
  Eye,
} from "lucide-react"
import Link from "next/link"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

type StudentLevel = {
  id: string
  trackType: "QURAN" | "KITAB"
  level: Level
}

type Student = {
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: string
  studentLevels: StudentLevel[]
}

export default function ActiveStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [quranLevel, setQuranLevel] = useState("")
  const [kitabLevel, setKitabLevel] = useState("")

  async function loadLevels() {
    const res = await fetch("/api/levels")
    const data = await res.json()
    setLevels(data)
  }

  async function loadStudents() {
    setLoading(true)

    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (quranLevel) params.set("quranLevel", quranLevel)
    if (kitabLevel) params.set("kitabLevel", kitabLevel)

    const res = await fetch(`/api/admin/students?${params.toString()}`)
    const data = await res.json()

    setStudents(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLevels()
  }, [])

  useEffect(() => {
    loadStudents()
  }, [search, quranLevel, kitabLevel])

  const quranLevels = useMemo(
    () => levels.filter((l) => l.trackType === "QURAN"),
    [levels]
  )

  const kitabLevels = useMemo(
    () => levels.filter((l) => l.trackType === "KITAB"),
    [levels]
  )

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                <Sparkles className="h-4 w-4" />
                Active Students
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Student Management
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Manage active students, review levels, monitor progress,
                attendance, and lesson activities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Students</div>

                <div className="mt-1 text-3xl font-black text-emerald-900">
                  {students.length}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Quran Levels</div>

                <div className="mt-1 text-3xl font-black text-amber-600">
                  {quranLevels.length}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 col-span-2 sm:col-span-1">
                <div className="text-sm text-slate-500">Kitab Levels</div>

                <div className="mt-1 text-3xl font-black text-emerald-900">
                  {kitabLevels.length}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-900" />
            <h2 className="text-xl font-bold">Student Filters</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              value={quranLevel}
              onChange={(e) => setQuranLevel(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            >
              <option value="">All Quran Levels</option>

              {quranLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>

            <select
              value={kitabLevel}
              onChange={(e) => setKitabLevel(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            >
              <option value="">All Kitab Levels</option>

              {kitabLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Students */}
        <section className="space-y-4">
          {loading && (
            <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              Loading students...
            </div>
          )}

          {!loading && students.length === 0 && (
            <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 text-slate-500 shadow-sm">
              No students found.
            </div>
          )}

          {!loading &&
            students.map((student) => (
              <div
                key={student.id}
                className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Student Info */}
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
                      <UserRound className="h-7 w-7" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {student.fullName}
                      </h3>

                      <div className="mt-3 space-y-2 text-sm text-slate-600">
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
                          Active Student
                        </div>
                      </div>

                      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Registered{" "}
                        {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                    >
                      <Eye className="h-4 w-4" />
                      View Student
                    </Link>
                  </div>
                </div>

                {/* Levels */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {student.studentLevels.map((sl) => (
                    <div
                      key={sl.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {sl.trackType === "QURAN" ? (
                          <BookOpen className="h-4 w-4 text-emerald-900" />
                        ) : (
                          <ScrollText className="h-4 w-4 text-amber-600" />
                        )}

                        <span className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                          {sl.trackType}
                        </span>
                      </div>

                      <div className="text-lg font-bold text-slate-900">
                        {sl.level?.name}
                      </div>

                      {sl.level?.description && (
                        <div className="mt-2 text-sm leading-6 text-slate-600">
                          {sl.level.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
      </div>
    </main>
  )
}
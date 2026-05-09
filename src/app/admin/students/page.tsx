// src/app/admin/students/page.tsx

"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
  User,
  Users,
  ShieldCheck,
  Eye,
  ScrollText,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
  description?: string | null
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
  address?: string | null
  isSponsored?: boolean
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  createdAt: string
  studentLevels: StudentLevel[]
}

export default function ActiveStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)

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

  const sponsoredCount = students.filter((s) => s.isSponsored).length

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Active Students
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Manage currently approved students, their tracks, sponsorship,
              and contact information.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <Users className="h-6 w-6 text-emerald-700" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Active</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {students.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <Sparkles className="h-6 w-6 text-emerald-700" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Sponsored</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {sponsoredCount}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-span-2 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                  <Clock3 className="h-6 w-6 text-amber-700" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Tracks</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {quranLevels.length + kitabLevels.length}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={quranLevel}
            onChange={(e) => setQuranLevel(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
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
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
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

      {/* LOADING */}
      {loading && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">Loading active students...</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && students.length === 0 && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Users className="h-10 w-10 text-emerald-700" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            No Active Students
          </h2>

          <p className="mt-2 text-slate-600">
            Approved students will appear here once registered or approved.
          </p>
        </div>
      )}

      {/* CARDS */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {students.map((student) => {
            const quranCurrent = student.studentLevels.find(
              (sl) => sl.trackType === "QURAN"
            )
            const kitabCurrent = student.studentLevels.find(
              (sl) => sl.trackType === "KITAB"
            )

            return (
              <div
                key={student.id}
                className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* TOP */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-5 text-white sm:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                        <Users className="h-7 w-7" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-black sm:text-2xl">
                          {student.fullName}
                        </h2>

                        <div className="mt-1 flex items-center gap-2 text-emerald-50">
                          <Mail className="h-4 w-4 shrink-0" />
                          <p className="truncate text-sm">{student.email}</p>
                        </div>

                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
                          <GraduationCap className="h-4 w-4" />
                          Active Student
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
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
                  </div>
                </div>

                {/* CONTENT */}
                <div className="space-y-5 p-5 sm:p-6">
                  {/* INFO */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-2 flex items-center gap-2 text-slate-500">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-medium">Phone</span>
                      </div>
                      <p className="font-bold text-slate-900">
                        {student.phone || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-2 flex items-center gap-2 text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">Address</span>
                      </div>
                      <p className="font-bold text-slate-900">
                        {student.address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* EMERGENCY */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-700" />
                      <h3 className="font-black text-slate-900">
                        Emergency Contact
                      </h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-slate-500">
                          Contact Person
                        </p>
                        <p className="font-bold text-slate-900">
                          {student.emergencyContactName || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-sm text-slate-500">
                          Contact Phone
                        </p>
                        <p className="font-bold text-slate-900">
                          {student.emergencyContactPhone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CURRENT LEVELS */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-emerald-700" />
                      <h3 className="font-black text-slate-900">
                        Current Levels
                      </h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-emerald-700" />
                          <span className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                            Quran
                          </span>
                        </div>

                        <p className="font-bold text-slate-900">
                          {quranCurrent?.level?.name || "Not assigned"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <ScrollText className="h-4 w-4 text-emerald-700" />
                          <span className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                            Kitab
                          </span>
                        </div>

                        <p className="font-bold text-slate-900">
                          {kitabCurrent?.level?.name || "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
                    >
                      <Eye className="h-5 w-5" />
                      View Student
                    </Link>

                    <Link
                      href={`/admin/students/${student.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
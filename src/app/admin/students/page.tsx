"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  Eye,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  ScrollText,
  Sparkles,
  Users,
  X,
} from "lucide-react"

type Session = {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

type ScheduleGroup = {
  id: string
  label: string
  mode?: "ONLINE" | "IN_PERSON" | "BOTH"
  location?: string | null
  sessions?: Session[]
}

type LevelRef = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

type StudentLevel = {
  id: string
  trackType: "QURAN" | "KITAB"
  level: LevelRef
  schedule?: ScheduleGroup | null
}

type Sponsor = {
  id: string
  name: string
}

type RequestedLevel = {
  id: string
  trackType: "QURAN" | "KITAB"
  level: LevelRef
  schedule?: ScheduleGroup | null
}

type Student = {
  id: string
  fullName: string
  email: string
  phone: string
  age: number | null
  gender: string | null
  learningMode: string | null
  address: string | null
  isSponsored: boolean
  sponsor?: Sponsor | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  createdAt?: string
  studentLevels?: StudentLevel[]
  requestedLevels?: RequestedLevel[]
}

function formatSessions(schedule?: ScheduleGroup | null) {
  if (!schedule?.sessions?.length) return "No sessions"
  return schedule.sessions
    .map((s) => `${s.dayOfWeek} • ${s.startTime} → ${s.endTime}`)
    .join(" | ")
}

function OverviewModal({
  student,
  onClose,
}: {
  student: Student
  onClose: () => void
}) {
  const quranLevel = student.studentLevels?.find((sl) => sl.trackType === "QURAN")
  const kitabLevel = student.studentLevels?.find((sl) => sl.trackType === "KITAB")

  const quranRequested = student.requestedLevels?.find(
    (rl) => rl.trackType === "QURAN"
  )
  const kitabRequested = student.requestedLevels?.find(
    (rl) => rl.trackType === "KITAB"
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-emerald-700">Student Overview</p>
            <h2 className="text-2xl font-black text-slate-900">
              {student.fullName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Basic Information
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Email:</span> {student.email}</p>
              <p><span className="font-semibold">Phone:</span> {student.phone}</p>
              <p><span className="font-semibold">Age:</span> {student.age ?? "Not provided"}</p>
              <p><span className="font-semibold">Gender:</span> {student.gender || "Not provided"}</p>
              <p><span className="font-semibold">Telegram:</span> {"Not provided"}</p>
              <p><span className="font-semibold">Address:</span> {student.address || "Not provided"}</p>
              <p><span className="font-semibold">Learning Mode:</span> {student.learningMode || "Not provided"}</p>
              <p><span className="font-semibold">Joined:</span> {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "Not provided"}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Sponsorship & Emergency
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Sponsored:</span>{" "}
                {student.isSponsored ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold">Sponsor:</span>{" "}
                {student.sponsor?.name || "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Emergency Contact:</span>{" "}
                {student.emergencyContactName || "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Emergency Phone:</span>{" "}
                {student.emergencyContactPhone || "Not provided"}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Current Levels
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Quran
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {quranLevel?.level?.name || "Not assigned"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {quranLevel?.schedule?.label || "No schedule selected"}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatSessions(quranLevel?.schedule)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Kitab
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {kitabLevel?.level?.name || "Not assigned"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {kitabLevel?.schedule?.label || "No schedule selected"}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatSessions(kitabLevel?.schedule)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Requested Levels
            </h3>

            <div className="space-y-4">
              {(student.requestedLevels?.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                  No requested levels found.
                </div>
              ) : (
                student.requestedLevels!.map((rl) => (
                  <div
                    key={rl.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {rl.level?.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {rl.trackType}
                        </p>
                      </div>

                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Requested
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">
                        {rl.schedule?.label || "No schedule selected"}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {formatSessions(rl.schedule)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ActiveStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sponsored, setSponsored] = useState("")
  const [trackType, setTrackType] = useState("")
  const [gender, setGender] = useState("")
  const [learningMode, setLearningMode] = useState("")
  const [quranLevel, setQuranLevel] = useState("")
  const [kitabLevel, setKitabLevel] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  async function loadStudents() {
    setLoading(true)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (sponsored) params.set("sponsored", sponsored)
    if (trackType) params.set("trackType", trackType)
    if (gender) params.set("gender", gender)
    if (learningMode) params.set("learningMode", learningMode)
    if (quranLevel) params.set("quranLevel", quranLevel)
    if (kitabLevel) params.set("kitabLevel", kitabLevel)

    const res = await fetch(`/api/admin/students?${params.toString()}`)
    const data = await res.json().catch(() => [])

    setStudents(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    loadStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sponsored, trackType, gender, learningMode, quranLevel, kitabLevel])

  const summary = useMemo(() => {
    return {
      active: students.length,
      sponsored: students.filter((s) => s.isSponsored).length,
      quran: students.filter((s) =>
        s.studentLevels?.some((sl) => sl.trackType === "QURAN")
      ).length,
      kitab: students.filter((s) =>
        s.studentLevels?.some((sl) => sl.trackType === "KITAB")
      ).length,
    }
  }, [students])

  const quranLevelOptions = useMemo(() => {
    const items = new Map<string, string>()
    students.forEach((student) => {
      student.studentLevels
        ?.filter((sl) => sl.trackType === "QURAN")
        .forEach((sl) => items.set(sl.level.id, sl.level.name))
    })
    return Array.from(items.entries()).map(([id, name]) => ({ id, name }))
  }, [students])

  const kitabLevelOptions = useMemo(() => {
    const items = new Map<string, string>()
    students.forEach((student) => {
      student.studentLevels
        ?.filter((sl) => sl.trackType === "KITAB")
        .forEach((sl) => items.set(sl.level.id, sl.level.name))
    })
    return Array.from(items.entries()).map(([id, name]) => ({ id, name }))
  }, [students])

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Administration</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Active Students
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Manage active students from a compact table and open their full overview in a modal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <Users className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {summary.active}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <Sparkles className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Sponsored</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {summary.sponsored}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <BookOpen className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Quran</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {summary.quran}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <ScrollText className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Kitab</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {summary.kitab}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4 xl:grid-cols-7">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 xl:col-span-2">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email, phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            value={sponsored}
            onChange={(e) => setSponsored(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Sponsorships</option>
            <option value="true">Sponsored</option>
            <option value="false">Self Sponsored</option>
          </select>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>

          <select
            value={learningMode}
            onChange={(e) => setLearningMode(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Modes</option>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">In Person</option>
            <option value="BOTH">Both</option>
          </select>

          <select
            value={trackType}
            onChange={(e) => setTrackType(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Tracks</option>
            <option value="QURAN">Quran</option>
            <option value="KITAB">Kitab</option>
          </select>

          <select
            value={quranLevel}
            onChange={(e) => setQuranLevel(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">Quran Level</option>
            {quranLevelOptions.map((level) => (
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
            <option value="">Kitab Level</option>
            {kitabLevelOptions.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading active students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Users className="h-10 w-10 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              No Active Students
            </h2>
            <p className="mt-2 text-slate-600">
              No students match the current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">#</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Student</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Contact</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Status</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-bold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-left font-bold text-slate-900 transition hover:text-emerald-700"
                        >
                          {student.fullName}
                        </button>
                        <p className="text-sm text-slate-500">
                          {student.gender || "Not provided"} • Age{" "}
                          {student.age ?? "-"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {student.learningMode || "Not provided"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1 text-sm text-slate-700">
                          <p>{student.phone}</p>
                          <p className="text-slate-500">{student.email}</p>
                          <p className="text-xs text-slate-400">
                            {student.address || "No address"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            Active
                          </span>
                          {student.isSponsored ? (
                            <span className="ml-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                              Sponsored
                            </span>
                          ) : (
                            <span className="ml-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                              Self Sponsored
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            View
                          </button>

                          <Link
                            href={`/admin/students/${student.id}`}
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800"
                          >
                            <Eye className="h-4 w-4" />
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {selectedStudent && (
        <OverviewModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </main>
  )
}
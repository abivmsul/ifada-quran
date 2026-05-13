"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock3,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"

type LevelRef = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

type RequestedLevel = {
  id: string
  trackType: "QURAN" | "KITAB"
  level: LevelRef
}

type Student = {
  id: string
  fullName: string
  email: string
  phone: string
  age: number | null
  gender: string | null
  address: string | null
  isSponsored: boolean
  sponsor?: {
    name: string
  } | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  createdAt: string
  requestedLevels: RequestedLevel[]
}

export default function PendingStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [sponsored, setSponsored] = useState("")
  const [trackType, setTrackType] = useState("")
  const [gender, setGender] = useState("")

  async function loadStudents() {
    setLoading(true)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (sponsored) params.set("sponsored", sponsored)
    if (trackType) params.set("trackType", trackType)
    if (gender) params.set("gender", gender)

    const res = await fetch(`/api/admin/pending?${params.toString()}`)
    const data = await res.json()

    setStudents(data)
    setLoading(false)
  }

  useEffect(() => {
    loadStudents()
  }, [search, sponsored, trackType, gender])

  async function approveStudent(studentId: string) {
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      alert(data?.error || "Failed to approve student")
      return
    }

    loadStudents()
  }

  async function rejectStudent(studentId: string) {
    const confirmed = confirm("Reject this student registration?")
    if (!confirmed) return

    const res = await fetch("/api/admin/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      alert(data?.error || "Failed to reject student")
      return
    }

    loadStudents()
  }

  const summary = useMemo(() => {
    return {
      pending: students.length,
      sponsored: students.filter((s) => s.isSponsored).length,
      quran: students.filter((s) =>
        s.requestedLevels.some((rl) => rl.trackType === "QURAN")
      ).length,
      kitab: students.filter((s) =>
        s.requestedLevels.some((rl) => rl.trackType === "KITAB")
      ).length,
    }
  }, [students])

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Administration</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Pending Students
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Review new registrations and approve or reject them from a compact list.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100">
                  <Clock3 className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pending</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {summary.pending}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <UserCheck className="h-5 w-5 text-emerald-700" />
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
                  <GraduationCap className="h-5 w-5 text-emerald-700" />
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
                  <GraduationCap className="h-5 w-5 text-emerald-700" />
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
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
            value={trackType}
            onChange={(e) => setTrackType(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Tracks</option>
            <option value="QURAN">Quran</option>
            <option value="KITAB">Kitab</option>
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
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              No Pending Students
            </h2>
            <p className="mt-2 text-slate-600">
              No registrations match the current filters.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1400px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Student</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Contact</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Details</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Levels</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Sponsor</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Emergency</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <div>
                          <h3 className="font-bold text-slate-900">{student.fullName}</h3>
                          <p className="text-sm text-slate-500">
                            {student.createdAt
                              ? new Date(student.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-900">{student.phone}</p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                          <p className="text-xs text-slate-400">{student.address || "No address"}</p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold">Age:</span>{" "}
                            {student.age ?? "-"}
                          </p>
                          <p>
                            <span className="font-semibold">Gender:</span>{" "}
                            {student.gender || "-"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {student.requestedLevels?.map((rl) => (
                            <div
                              key={rl.id}
                              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                            >
                              {rl.level.name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {student.isSponsored ? (
                          <div>
                            <p className="font-semibold text-slate-900">
                              {student.sponsor?.name || "Sponsored"}
                            </p>
                            <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                              Sponsored
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                            Self Sponsored
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {student.emergencyContactName || "-"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {student.emergencyContactPhone || "-"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveStudent(student.id)}
                            className="h-10 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectStudent(student.id)}
                            className="h-10 rounded-xl border border-rose-200 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {student.fullName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {student.gender || "-"} • Age {student.age ?? "-"}
                      </p>
                    </div>

                    {student.isSponsored ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                        Sponsored
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        Self Sponsored
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Contact
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {student.phone}
                      </p>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Emergency
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {student.emergencyContactName || "-"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {student.emergencyContactPhone || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Requested Levels
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {student.requestedLevels?.map((rl) => (
                        <span
                          key={rl.id}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                        >
                          {rl.level.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => approveStudent(student.id)}
                      className="flex-1 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectStudent(student.id)}
                      className="flex-1 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
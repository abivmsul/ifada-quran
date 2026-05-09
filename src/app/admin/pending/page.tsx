"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  User,
  Users,
  XCircle,
  Mail,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
  description?: string | null
}

type RequestedLevel = {
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
  requestedLevels: RequestedLevel[]
}

export default function PendingStudentsPage() {
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

    const res = await fetch(`/api/admin/pending?${params.toString()}`)
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

    alert("Student approved successfully")
    loadStudents()
  }

  async function rejectStudent(studentId: string) {
    const confirmed = confirm("Are you sure you want to reject this student?")
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

    alert("Student rejected")
    loadStudents()
  }

  const quranLevels = useMemo(
    () => levels.filter((l) => l.trackType === "QURAN"),
    [levels]
  )

  const kitabLevels = useMemo(
    () => levels.filter((l) => l.trackType === "KITAB"),
    [levels]
  )

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Administration</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Pending Students
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Review newly registered students, check their details, and approve or reject them.
            </p>
          </div>

          <div className="w-full max-w-xs rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Clock3 className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">Waiting Approval</p>
                <h2 className="text-2xl font-black text-slate-900">{students.length}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
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
              placeholder="Search by name, email, phone"
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

      {/* Loading */}
      {loading && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">Loading pending students...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && students.length === 0 && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-700" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            No Pending Students
          </h2>

          <p className="mt-2 text-slate-600">
            All student registrations are already reviewed.
          </p>
        </div>
      )}

      {/* Cards */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {students.map((student) => {
            const quranRequested = student.requestedLevels.find(
              (rl) => rl.trackType === "QURAN"
            )
            const kitabRequested = student.requestedLevels.find(
              (rl) => rl.trackType === "KITAB"
            )

            return (
              <div
                key={student.id}
                className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* Top bar */}
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
                          <Clock3 className="h-4 w-4" />
                          Pending Approval
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

                {/* Content */}
                <div className="space-y-5 p-5 sm:p-6">
                  {/* Basic info */}
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

                  {/* Emergency contact */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-700" />
                      <h3 className="font-black text-slate-900">
                        Emergency Contact
                      </h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-slate-500">Contact Person</p>
                        <p className="font-bold text-slate-900">
                          {student.emergencyContactName || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-sm text-slate-500">Contact Phone</p>
                        <p className="font-bold text-slate-900">
                          {student.emergencyContactPhone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requested levels */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-emerald-700" />
                      <h3 className="font-black text-slate-900">
                        Requested Levels
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {student.requestedLevels?.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                          No requested levels selected.
                        </div>
                      )}

                      {student.requestedLevels?.map((rl: any) => (
                        <div
                          key={rl.id}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                              <User className="h-5 w-5 text-emerald-700" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-900">
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
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      onClick={() => approveStudent(student.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Approve Student
                    </button>

                    <button
                      onClick={() => rejectStudent(student.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-bold text-rose-700 transition hover:bg-rose-100"
                    >
                      <XCircle className="h-5 w-5" />
                      Reject
                    </button>
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
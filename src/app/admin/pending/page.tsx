"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  UserRound,
  Sparkles,
  BookOpen,
  ScrollText,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
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
  createdAt: string
  requestedLevels: RequestedLevel[]
}

export default function PendingStudentsPage() {
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

  async function approveStudent(userId: string) {
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to approve student")
      return
    }

    alert("Student approved successfully")
    loadStudents()
  }

  async function rejectStudent(userId: string) {
    const confirmed = confirm("Are you sure you want to reject this student?")
    if (!confirmed) return

    const res = await fetch("/api/admin/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to reject student")
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
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <Sparkles className="h-4 w-4" />
                Pending Approvals
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Pending Students
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Review new registrations, check their requested levels, and
                approve or reject students.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Pending</div>
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
            <ClipboardCheck className="h-5 w-5 text-emerald-900" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone"
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

        {/* Student list */}
        <section className="space-y-4">
          {loading && (
            <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              Loading students...
            </div>
          )}

          {!loading && students.length === 0 && (
            <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 text-slate-500 shadow-sm">
              No pending students found.
            </div>
          )}

          {!loading &&
            students.map((student) => (
              <div
                key={student.id}
                className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
                      <UserRound className="h-7 w-7" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {student.fullName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">{student.email}</p>
                      <p className="text-sm text-slate-500">{student.phone}</p>

                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Registered {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => approveStudent(student.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => rejectStudent(student.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      <XCircle className="h-4 w-4 text-rose-600" />
                      Reject
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {student.requestedLevels.map((rl: RequestedLevel) => (
                    <div
                      key={rl.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {rl.trackType === "QURAN" ? (
                          <BookOpen className="h-4 w-4 text-emerald-900" />
                        ) : (
                          <ScrollText className="h-4 w-4 text-amber-600" />
                        )}

                        <span className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                          {rl.trackType}
                        </span>
                      </div>

                      <div className="text-lg font-bold text-slate-900">
                        {rl.level?.name}
                      </div>

                      {rl.level?.description && (
                        <div className="mt-2 text-sm leading-6 text-slate-600">
                          {rl.level.description}
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
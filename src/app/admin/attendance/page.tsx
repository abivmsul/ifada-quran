"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock3,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react"

type ScheduleSession = {
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
  sessions?: ScheduleSession[]
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

type AttendanceRecord = {
  id: string
  status: "PRESENT" | "ABSENT" | "PERMISSION"
  date: string
}

type Sponsor = {
  id: string
  name: string
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
  studentLevels?: StudentLevel[]
  attendance?: AttendanceRecord[]
  attendanceStatus?: "PRESENT" | "ABSENT" | "PERMISSION" | null
}

type ScheduleOption = {
  id: string
  label: string
  trackType: "QURAN" | "KITAB"
  mode?: "ONLINE" | "IN_PERSON" | "BOTH"
  sessions: ScheduleSession[]
}

function formatSessions(schedule?: ScheduleGroup | null) {
  if (!schedule?.sessions?.length) return "No sessions"
  return schedule.sessions
    .map((s) => `${s.dayOfWeek} • ${s.startTime} → ${s.endTime}`)
    .join(" | ")
}

function OverviewModal({
  student,
  date,
  currentStatus,
  onClose,
  onMark,
}: {
  student: Student
  date: string
  currentStatus: "PRESENT" | "ABSENT" | "PERMISSION" | null
  onClose: () => void
  onMark: (studentId: string, status: "PRESENT" | "ABSENT" | "PERMISSION") => void
}) {
  const quranLevel = student.studentLevels?.find(
    (sl) => sl.trackType === "QURAN"
  )
  const kitabLevel = student.studentLevels?.find(
    (sl) => sl.trackType === "KITAB"
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Attendance Overview
            </p>
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
              <p>
                <span className="font-semibold">Email:</span> {student.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {student.phone}
              </p>
              <p>
                <span className="font-semibold">Age:</span>{" "}
                {student.age ?? "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {student.gender || "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Learning Mode:</span>{" "}
                {student.learningMode || "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {student.address || "Not provided"}
              </p>
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
              Attendance for {date}
            </h3>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {currentStatus ? (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    currentStatus === "PRESENT"
                      ? "bg-emerald-50 text-emerald-700"
                      : currentStatus === "ABSENT"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  Current status: {currentStatus}
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Not marked yet
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => onMark(student.id, "PRESENT")}
                className={`rounded-2xl px-5 py-3 font-bold transition ${
                  currentStatus === "PRESENT"
                    ? "bg-emerald-800 text-white"
                    : "bg-emerald-700 text-white hover:bg-emerald-800"
                }`}
              >
                Mark Present
              </button>

              <button
                onClick={() => onMark(student.id, "ABSENT")}
                className={`rounded-2xl px-5 py-3 font-bold transition ${
                  currentStatus === "ABSENT"
                    ? "bg-rose-700 text-white"
                    : "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                Mark Absent
              </button>

              <button
                onClick={() => onMark(student.id, "PERMISSION")}
                className={`rounded-2xl px-5 py-3 font-bold transition ${
                  currentStatus === "PERMISSION"
                    ? "bg-amber-700 text-white"
                    : "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                Mark Permission
              </button>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [levels, setLevels] = useState<LevelRef[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [trackType, setTrackType] = useState("")
  const [learningMode, setLearningMode] = useState("")
  const [quranLevel, setQuranLevel] = useState("")
  const [kitabLevel, setKitabLevel] = useState("")
  const [scheduleId, setScheduleId] = useState("")

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, "PRESENT" | "ABSENT" | "PERMISSION">
  >({})

  async function loadLevels() {
    const res = await fetch("/api/levels")
    const data = await res.json().catch(() => [])
    setLevels(Array.isArray(data) ? data : [])
  }

  async function loadStudents() {
    setLoading(true)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (trackType) params.set("trackType", trackType)
    if (learningMode) params.set("learningMode", learningMode)
    if (quranLevel) params.set("quranLevel", quranLevel)
    if (kitabLevel) params.set("kitabLevel", kitabLevel)
    if (scheduleId) params.set("scheduleId", scheduleId)
    if (date) params.set("date", date)

    const res = await fetch(`/api/admin/attendance?${params.toString()}`)
    const data = await res.json().catch(() => [])

    const list: Student[] = Array.isArray(data) ? data : []
    setStudents(list)

    const map: Record<string, "PRESENT" | "ABSENT" | "PERMISSION"> = {}
    list.forEach((student) => {
      if (student.attendanceStatus) {
        map[student.id] = student.attendanceStatus
      }
    })
    setAttendanceMap(map)

    setLoading(false)
  }

  useEffect(() => {
    loadLevels()
  }, [])

  useEffect(() => {
    loadStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, trackType, learningMode, quranLevel, kitabLevel, scheduleId, date])

  async function markAttendance(
    studentId: string,
    status: "PRESENT" | "ABSENT" | "PERMISSION"
  ) {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }))

    const res = await fetch("/api/admin/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        status,
        date,
      }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      alert(data?.error || "Failed to save attendance")
      await loadStudents()
      return
    }

    await loadStudents()
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null)
    }
  }

  const summary = useMemo(() => {
    return {
      total: students.length,
      quran: students.filter((s) =>
        s.studentLevels?.some((sl) => sl.trackType === "QURAN")
      ).length,
      kitab: students.filter((s) =>
        s.studentLevels?.some((sl) => sl.trackType === "KITAB")
      ).length,
      marked: Object.keys(attendanceMap).length,
    }
  }, [students, attendanceMap])

  const quranLevelOptions = useMemo(() => {
    const map = new Map<string, string>()
    levels
      .filter((l) => l.trackType === "QURAN")
      .forEach((l) => map.set(l.id, l.name))
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [levels])

  const kitabLevelOptions = useMemo(() => {
    const map = new Map<string, string>()
    levels
      .filter((l) => l.trackType === "KITAB")
      .forEach((l) => map.set(l.id, l.name))
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [levels])

  const scheduleOptions = useMemo(() => {
    const map = new Map<string, ScheduleOption>()

    students.forEach((student) => {
      student.studentLevels?.forEach((sl) => {
        if (!sl.schedule) return
        if (!map.has(sl.schedule.id)) {
          map.set(sl.schedule.id, {
            id: sl.schedule.id,
            label: sl.schedule.label,
            trackType: sl.trackType,
            mode: sl.schedule.mode,
            sessions: sl.schedule.sessions || [],
          })
        }
      })
    })

    return Array.from(map.values())
  }, [students])

  function getRowStatus(student: Student) {
    return attendanceMap[student.id] || student.attendanceStatus || null
  }

  function statusLabel(status: "PRESENT" | "ABSENT" | "PERMISSION" | null) {
    if (status === "PRESENT") return "Present"
    if (status === "ABSENT") return "Absent"
    if (status === "PERMISSION") return "Permission"
    return "Not marked"
  }

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Administration</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Attendance
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Mark attendance and filter students by level, learning mode, and schedule.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <Users className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {summary.total}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Marked</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {summary.marked}
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Track
            </label>
            <select
              value={trackType}
              onChange={(e) => setTrackType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            >
              <option value="">All Tracks</option>
              <option value="QURAN">Quran</option>
              <option value="KITAB">Kitab</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Learning Mode
            </label>
            <select
              value={learningMode}
              onChange={(e) => setLearningMode(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            >
              <option value="">All Modes</option>
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In Person</option>
              <option value="BOTH">Both</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Quran Level
            </label>
            <select
              value={quranLevel}
              onChange={(e) => setQuranLevel(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            >
              <option value="">All Quran Levels</option>
              {quranLevelOptions.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Kitab Level
            </label>
            <select
              value={kitabLevel}
              onChange={(e) => setKitabLevel(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            >
              <option value="">All Kitab Levels</option>
              {kitabLevelOptions.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Schedule
            </label>
            <select
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            >
              <option value="">All Schedules</option>
              {scheduleOptions.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.label} — {schedule.trackType}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading attendance list...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Clock3 className="h-10 w-10 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              No Students Found
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
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">
                      Student
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">
                      Levels
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">
                      Attendance
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => {
                    const currentStatus = getRowStatus(student)

                    return (
                      <tr
                        key={student.id}
                        className={`border-b border-slate-100 transition hover:bg-slate-50 ${
                          currentStatus === "PRESENT"
                            ? "bg-emerald-50/40"
                            : currentStatus === "ABSENT"
                              ? "bg-rose-50/40"
                              : currentStatus === "PERMISSION"
                                ? "bg-amber-50/40"
                                : ""
                        }`}
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
                            {student.studentLevels?.length ? (
                              student.studentLevels.map((sl) => (
                                <div
                                  key={sl.id}
                                  className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                                >
                                  {sl.trackType}: {sl.level?.name}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-slate-400">
                                No levels
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              currentStatus === "PRESENT"
                                ? "bg-emerald-100 text-emerald-700"
                                : currentStatus === "ABSENT"
                                  ? "bg-rose-100 text-rose-700"
                                  : currentStatus === "PERMISSION"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {statusLabel(currentStatus)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                              View
                            </button>

                            <button
                              onClick={() => markAttendance(student.id, "PRESENT")}
                              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                                currentStatus === "PRESENT"
                                  ? "bg-emerald-800 text-white"
                                  : "bg-emerald-700 text-white hover:bg-emerald-800"
                              }`}
                            >
                              Present
                            </button>

                            <button
                              onClick={() => markAttendance(student.id, "ABSENT")}
                              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                                currentStatus === "ABSENT"
                                  ? "bg-rose-700 text-white"
                                  : "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                            >
                              Absent
                            </button>

                            <button
                              onClick={() =>
                                markAttendance(student.id, "PERMISSION")
                              }
                              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                                currentStatus === "PERMISSION"
                                  ? "bg-amber-700 text-white"
                                  : "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                            >
                              Permission
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {selectedStudent && (
        <OverviewModal
          student={selectedStudent}
          date={date}
          currentStatus={getRowStatus(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          onMark={markAttendance}
        />
      )}
    </main>
  )
}
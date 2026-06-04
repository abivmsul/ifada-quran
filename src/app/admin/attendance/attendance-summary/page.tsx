"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
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

type LevelOption = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

type SummaryItem = {
  id: string
  name: string
  count: number
  present: number
  absent: number
  permission: number
  unmarked: number
}

type ScheduleSummaryItem = {
  id: string
  label: string
  trackType: "QURAN" | "KITAB"
  levelName: string
  mode?: "ONLINE" | "IN_PERSON" | "BOTH"
  sessions: ScheduleSession[]
  count: number
  present: number
  absent: number
  permission: number
  unmarked: number
}

const statusStyles: Record<
  "PRESENT" | "ABSENT" | "PERMISSION" | "UNMARKED",
  string
> = {
  PRESENT: "bg-emerald-100 text-emerald-700",
  ABSENT: "bg-rose-100 text-rose-700",
  PERMISSION: "bg-amber-100 text-amber-700",
  UNMARKED: "bg-slate-100 text-slate-600",
}

function formatSessions(schedule?: ScheduleGroup | null) {
  if (!schedule?.sessions?.length) return "No sessions"
  return schedule.sessions
    .map((s) => `${s.dayOfWeek} • ${s.startTime} → ${s.endTime}`)
    .join(" | ")
}

function getStatusLabel(status: "PRESENT" | "ABSENT" | "PERMISSION" | null) {
  if (status === "PRESENT") return "Present"
  if (status === "ABSENT") return "Absent"
  if (status === "PERMISSION") return "Permission"
  return "Not marked"
}

function getStatusTone(status: "PRESENT" | "ABSENT" | "PERMISSION" | null) {
  if (status === "PRESENT") return "PRESENT"
  if (status === "ABSENT") return "ABSENT"
  if (status === "PERMISSION") return "PERMISSION"
  return "UNMARKED"
}

function OverviewModal({
  student,
  date,
  currentStatus,
  onClose,
}: {
  student: Student
  date: string
  currentStatus: "PRESENT" | "ABSENT" | "PERMISSION" | null
  onClose: () => void
}) {
  const quranLevel = student.studentLevels?.find((sl) => sl.trackType === "QURAN")
  const kitabLevel = student.studentLevels?.find((sl) => sl.trackType === "KITAB")

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
              <p><span className="font-semibold">Email:</span> {student.email}</p>
              <p><span className="font-semibold">Phone:</span> {student.phone}</p>
              <p><span className="font-semibold">Age:</span> {student.age ?? "Not provided"}</p>
              <p><span className="font-semibold">Gender:</span> {student.gender || "Not provided"}</p>
              <p><span className="font-semibold">Learning Mode:</span> {student.learningMode || "Not provided"}</p>
              <p><span className="font-semibold">Address:</span> {student.address || "Not provided"}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Sponsorship & Emergency
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Sponsored:</span> {student.isSponsored ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Sponsor:</span> {student.sponsor?.name || "Not provided"}</p>
              <p><span className="font-semibold">Emergency Contact:</span> {student.emergencyContactName || "Not provided"}</p>
              <p><span className="font-semibold">Emergency Phone:</span> {student.emergencyContactPhone || "Not provided"}</p>
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

            <div className="mb-4">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  currentStatus === "PRESENT"
                    ? statusStyles.PRESENT
                    : currentStatus === "ABSENT"
                      ? statusStyles.ABSENT
                      : currentStatus === "PERMISSION"
                        ? statusStyles.PERMISSION
                        : statusStyles.UNMARKED
                }`}
              >
                {getStatusLabel(currentStatus)}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">
                This page is for reviewing attendance summaries only. Marking is done on the attendance page.
              </p>
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

export default function AttendanceSummaryPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [levels, setLevels] = useState<LevelOption[]>([])
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

  const quranLevelOptions = useMemo(
    () => levels.filter((level) => level.trackType === "QURAN"),
    [levels]
  )

  const kitabLevelOptions = useMemo(
    () => levels.filter((level) => level.trackType === "KITAB"),
    [levels]
  )

  const scheduleOptions = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string
        label: string
        trackType: "QURAN" | "KITAB"
        mode?: "ONLINE" | "IN_PERSON" | "BOTH"
        sessions: ScheduleSession[]
      }
    >()

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

  const summary = useMemo(() => {
    const present = students.filter((s) => getRowStatus(s) === "PRESENT").length
    const absent = students.filter((s) => getRowStatus(s) === "ABSENT").length
    const permission = students.filter((s) => getRowStatus(s) === "PERMISSION").length
    const unmarked = students.length - present - absent - permission

    return {
      total: students.length,
      present,
      absent,
      permission,
      unmarked,
      quran: students.filter((s) =>
        s.studentLevels?.some((sl) => sl.trackType === "QURAN")
      ).length,
      kitab: students.filter((s) =>
        s.studentLevels?.some((sl) => sl.trackType === "KITAB")
      ).length,
    }
  }, [students, attendanceMap])

  const quranLevelSummaries = useMemo<SummaryItem[]>(() => {
    return quranLevelOptions.map((level) => {
      const matched = students.filter((student) =>
        student.studentLevels?.some((sl) => sl.trackType === "QURAN" && sl.level.id === level.id)
      )

      const present = matched.filter((s) => getRowStatus(s) === "PRESENT").length
      const absent = matched.filter((s) => getRowStatus(s) === "ABSENT").length
      const permission = matched.filter((s) => getRowStatus(s) === "PERMISSION").length
      const unmarked = matched.length - present - absent - permission

      return {
        id: level.id,
        name: level.name,
        count: matched.length,
        present,
        absent,
        permission,
        unmarked,
      }
    })
  }, [quranLevelOptions, students, attendanceMap])

  const kitabLevelSummaries = useMemo<SummaryItem[]>(() => {
    return kitabLevelOptions.map((level) => {
      const matched = students.filter((student) =>
        student.studentLevels?.some((sl) => sl.trackType === "KITAB" && sl.level.id === level.id)
      )

      const present = matched.filter((s) => getRowStatus(s) === "PRESENT").length
      const absent = matched.filter((s) => getRowStatus(s) === "ABSENT").length
      const permission = matched.filter((s) => getRowStatus(s) === "PERMISSION").length
      const unmarked = matched.length - present - absent - permission

      return {
        id: level.id,
        name: level.name,
        count: matched.length,
        present,
        absent,
        permission,
        unmarked,
      }
    })
  }, [kitabLevelOptions, students, attendanceMap])

  const scheduleSummaries = useMemo<ScheduleSummaryItem[]>(() => {
    return scheduleOptions.map((schedule) => {
      const matched = students.filter((student) =>
        student.studentLevels?.some((sl) => sl.schedule?.id === schedule.id)
      )

      const present = matched.filter((s) => getRowStatus(s) === "PRESENT").length
      const absent = matched.filter((s) => getRowStatus(s) === "ABSENT").length
      const permission = matched.filter((s) => getRowStatus(s) === "PERMISSION").length
      const unmarked = matched.length - present - absent - permission

      return {
        id: schedule.id,
        label: schedule.label,
        trackType: schedule.trackType,
        levelName:
          students
            .flatMap((student) => student.studentLevels || [])
            .find((sl) => sl.schedule?.id === schedule.id)?.level.name || "Unknown",
        mode: schedule.mode,
        sessions: schedule.sessions,
        count: matched.length,
        present,
        absent,
        permission,
        unmarked,
      }
    })
  }, [scheduleOptions, students, attendanceMap])

  function StatusChip({
    value,
    label,
  }: {
    value: number
    label: string
  }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-slate-500">{label}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900">{value}</h2>
      </div>
    )
  }

  function SummaryCard({
    title,
    count,
    present,
    absent,
    permission,
    unmarked,
  }: {
    title: string
    count: number
    present: number
    absent: number
    permission: number
    unmarked: number
  }) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">Total students: {count}</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {count}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className={`rounded-2xl px-4 py-3 ${statusStyles.PRESENT}`}>
            <p className="text-xs font-semibold">Present</p>
            <p className="mt-1 text-xl font-black">{present}</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 ${statusStyles.ABSENT}`}>
            <p className="text-xs font-semibold">Absent</p>
            <p className="mt-1 text-xl font-black">{absent}</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 ${statusStyles.PERMISSION}`}>
            <p className="text-xs font-semibold">Permission</p>
            <p className="mt-1 text-xl font-black">{permission}</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 ${statusStyles.UNMARKED}`}>
            <p className="text-xs font-semibold">Not marked</p>
            <p className="mt-1 text-xl font-black">{unmarked}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="space-y-6 p-4 text-slate-900 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Administration</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Attendance Summary
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Review attendance by selected date, level, and schedule in one separate page.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatusChip label="Total" value={summary.total} />
            <StatusChip label="Present" value={summary.present} />
            <StatusChip label="Absent" value={summary.absent} />
            <StatusChip label="Permission" value={summary.permission} />
            <StatusChip label="Not marked" value={summary.unmarked} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        </div>

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

          <div className="md:col-span-2">
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

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-black text-slate-900">Quran Levels</h2>
          </div>

          {quranLevelSummaries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
              No Quran level data found.
            </div>
          ) : (
            <div className="grid gap-4">
              {quranLevelSummaries.map((item) => (
                <SummaryCard
                  key={item.id}
                  title={item.name}
                  count={item.count}
                  present={item.present}
                  absent={item.absent}
                  permission={item.permission}
                  unmarked={item.unmarked}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-black text-slate-900">Kitab Levels</h2>
          </div>

          {kitabLevelSummaries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
              No Kitab level data found.
            </div>
          ) : (
            <div className="grid gap-4">
              {kitabLevelSummaries.map((item) => (
                <SummaryCard
                  key={item.id}
                  title={item.name}
                  count={item.count}
                  present={item.present}
                  absent={item.absent}
                  permission={item.permission}
                  unmarked={item.unmarked}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-emerald-700" />
          <h2 className="text-xl font-black text-slate-900">Schedule Summary</h2>
        </div>

        {scheduleSummaries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
            No schedule data found for the selected filters.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {scheduleSummaries.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {schedule.label}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {schedule.trackType} • {schedule.levelName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {schedule.mode || "No mode"}
                    </p>
                  </div>

                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {schedule.count} students
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">
                    {schedule.sessions.length ? "Sessions" : "No sessions"}
                  </p>
                  <div className="mt-2 space-y-1">
                    {schedule.sessions.map((session) => (
                      <div key={session.id} className="text-xs text-slate-500">
                        {session.dayOfWeek} • {session.startTime} → {session.endTime}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className={`rounded-2xl px-4 py-3 ${statusStyles.PRESENT}`}>
                    <p className="text-xs font-semibold">Present</p>
                    <p className="mt-1 text-xl font-black">{schedule.present}</p>
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${statusStyles.ABSENT}`}>
                    <p className="text-xs font-semibold">Absent</p>
                    <p className="mt-1 text-xl font-black">{schedule.absent}</p>
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${statusStyles.PERMISSION}`}>
                    <p className="text-xs font-semibold">Permission</p>
                    <p className="mt-1 text-xl font-black">{schedule.permission}</p>
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${statusStyles.UNMARKED}`}>
                    <p className="text-xs font-semibold">Not marked</p>
                    <p className="mt-1 text-xl font-black">{schedule.unmarked}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading attendance summary...
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
              No students match the current filters for this date.
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
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Levels</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Schedule</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Status</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">
                      Open
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => {
                    const status = getRowStatus(student)
                    const quran = student.studentLevels?.find((sl) => sl.trackType === "QURAN")
                    const kitab = student.studentLevels?.find((sl) => sl.trackType === "KITAB")
                    const schedule = quran?.schedule || kitab?.schedule || null

                    return (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-5 font-bold text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p className="font-bold text-slate-900">{student.fullName}</p>
                            <p className="text-sm text-slate-500">
                              {student.gender || "Not provided"} • Age {student.age ?? "-"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {student.learningMode || "Not provided"}
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
                          <div className="space-y-1 text-sm text-slate-700">
                            <p className="font-semibold text-slate-900">
                              {schedule?.label || "No schedule selected"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatSessions(schedule)}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              status === "PRESENT"
                                ? statusStyles.PRESENT
                                : status === "ABSENT"
                                  ? statusStyles.ABSENT
                                  : status === "PERMISSION"
                                    ? statusStyles.PERMISSION
                                    : statusStyles.UNMARKED
                            }`}
                          >
                            {getStatusLabel(status)}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            View
                          </button>
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
        />
      )}
    </main>
  )
}
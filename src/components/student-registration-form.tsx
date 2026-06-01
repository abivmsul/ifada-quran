"use client"

import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, ComponentType, FormEvent } from "react"
import {
  ArrowRight,
  BadgeInfo,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  ScrollText,
  User,
  Users,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
  levelOrder: number
  description?: string | null
}

type Sponsor = {
  id: string
  name: string
  type: "INDIVIDUAL" | "ORGANIZATION" | "FOUNDATION" | "FAMILY" | "OTHER"
  status: "ACTIVE" | "INACTIVE"
}

type ScheduleSession = {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

type ScheduleGroup = {
  id: string
  label: string
  mode: "ONLINE" | "IN_PERSON" | "BOTH"
  location: string | null
  sessions: ScheduleSession[]
}

type LearningMode = "ONLINE" | "IN_PERSON" | "BOTH"
type Gender = "MALE" | "FEMALE" 

type Props = {
  mode: "public" | "admin"
  submitUrl: string
}

const dayOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
]

const learningModeOptions: Array<{ value: LearningMode; label: string }> = [
  { value: "ONLINE", label: "Online" },
  { value: "IN_PERSON", label: "In Person" },
  { value: "BOTH", label: "Both" },
]

function sortSessions(items: ScheduleSession[]) {
  return [...items].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
    if (dayDiff !== 0) return dayDiff
    return a.startTime.localeCompare(b.startTime)
  })
}

function formatGroup(group: ScheduleGroup) {
  return `${group.label} • ${group.sessions.length} sessions`
}

function TrackBlock({
  title,
  subtitle,
  icon: Icon,
  trackType,
  levelValue,
  scheduleValue,
  levels,
  schedules,
  learningMode,
  onLevelChange,
  onScheduleChange,
}: {
  title: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
  trackType: "QURAN" | "KITAB"
  levelValue: string
  scheduleValue: string
  levels: Level[]
  schedules: ScheduleGroup[]
  learningMode: LearningMode
  onLevelChange: (value: string) => void
  onScheduleChange: (value: string) => void
}) {
  const sortedSchedules = useMemo(
    () =>
      schedules.map((group) => ({
        ...group,
        sessions: sortSessions(group.sessions),
      })),
    [schedules]
  )

  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-5 w-5 text-emerald-700" />
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>

      <p className="mb-4 text-sm text-slate-500">{subtitle}</p>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Select Level
          </label>
          <select
            value={levelValue}
            onChange={(e) => onLevelChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">No {trackType} Registration</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name} — Level {level.levelOrder}
              </option>
            ))}
          </select>
        </div>

        {levelValue && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Schedule Group
            </label>

            <select
              value={scheduleValue}
              onChange={(e) => onScheduleChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            >
              <option value="">No schedule selected</option>
              {sortedSchedules.map((group) => (
                <option key={group.id} value={group.id}>
                  {formatGroup(group)}
                </option>
              ))}
            </select>

            <p className="mt-3 text-sm text-slate-500">
              Showing schedule groups matched to the selected level and learning mode: {learningMode}.
            </p>

            {sortedSchedules.length === 0 && (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No schedule groups found for this level yet.
              </div>
            )}

            {sortedSchedules.length > 0 && (
              <div className="mt-3 space-y-3">
                {sortedSchedules.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{group.label}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                        {group.mode}
                      </span>
                      {group.location && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                          {group.location}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {group.sessions.map((session) => (
                        <div key={session.id} className="text-xs text-slate-500">
                          {session.dayOfWeek} • {session.startTime} → {session.endTime}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function StudentRegistrationForm({ mode, submitUrl }: Props) {
  const isAdmin = mode === "admin"

  const [levels, setLevels] = useState<Level[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [quranSchedules, setQuranSchedules] = useState<ScheduleGroup[]>([])
  const [kitabSchedules, setKitabSchedules] = useState<ScheduleGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "" as "" | Gender,
    telegramUsername: "",
    address: "",
    learningMode: "BOTH" as LearningMode,
    isSponsored: false,
    sponsorId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    quranLevelId: "",
    kitabLevelId: "",
    quranScheduleId: "",
    kitabScheduleId: "",
  })

  async function loadInitialData() {
    setLoading(true)
    try {
      const [levelsRes, sponsorsRes] = await Promise.all([
        fetch("/api/levels"),
        fetch("/api/sponsors"),
      ])

      const levelsData = levelsRes.ok ? await levelsRes.json() : []
      const sponsorsData = sponsorsRes.ok ? await sponsorsRes.json() : []

      setLevels(levelsData)
      setSponsors(sponsorsData)
    } catch (error) {
      console.error("Failed to load initial data:", error)
      setLevels([])
      setSponsors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const filteredLevels = useMemo(() => {
    if (!search) return levels
    const q = search.toLowerCase()

    return levels.filter(
      (level) =>
        level.name.toLowerCase().includes(q) ||
        String(level.levelOrder).includes(q) ||
        (level.description || "").toLowerCase().includes(q)
    )
  }, [levels, search])

  const quranLevels = useMemo(
    () => filteredLevels.filter((level) => level.trackType === "QURAN"),
    [filteredLevels]
  )

  const kitabLevels = useMemo(
    () => filteredLevels.filter((level) => level.trackType === "KITAB"),
    [filteredLevels]
  )

  const activeSponsors = useMemo(
    () => sponsors.filter((sponsor) => sponsor.status === "ACTIVE"),
    [sponsors]
  )

  async function loadSchedules(
    levelId: string,
    learningMode: LearningMode,
    setSchedules: (schedules: ScheduleGroup[]) => void
  ) {
    if (!levelId) {
      setSchedules([])
      return
    }

    const res = await fetch(`/api/levels/${levelId}/schedules?mode=${learningMode}`)
    const data = await res.json().catch(() => [])
    setSchedules(data)
  }

  useEffect(() => {
    loadSchedules(form.quranLevelId, form.learningMode, setQuranSchedules)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.quranLevelId, form.learningMode])

  useEffect(() => {
    loadSchedules(form.kitabLevelId, form.learningMode, setKitabSchedules)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.kitabLevelId, form.learningMode])

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, type } = e.target
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        telegramUsername: form.telegramUsername || null,
        address: form.address || null,
        learningMode: form.learningMode,
        isSponsored: form.isSponsored,
        sponsorId: form.isSponsored ? form.sponsorId || null : null,
        emergencyContactName: form.emergencyContactName || null,
        emergencyContactPhone: form.emergencyContactPhone || null,
        quranLevelId: form.quranLevelId || null,
        kitabLevelId: form.kitabLevelId || null,
        quranScheduleId: form.quranScheduleId || null,
        kitabScheduleId: form.kitabScheduleId || null,
      }

      const res = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        alert(data?.error || "Registration failed")
        return
      }

      alert(
        data?.message ||
          (isAdmin
            ? "Student created and approved successfully."
            : "Registered successfully. Waiting for admin approval.")
      )

      setForm({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        telegramUsername: "",
        address: "",
        learningMode: "BOTH",
        isSponsored: false,
        sponsorId: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        quranLevelId: "",
        kitabLevelId: "",
        quranScheduleId: "",
        kitabScheduleId: "",
      })

      setQuranSchedules([])
      setKitabSchedules([])
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 text-slate-900">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              {isAdmin ? "Administration" : "Student Registration"}
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {isAdmin ? "Register Student" : "Register as a Student"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {isAdmin
                ? "Add a new student directly into the system. This creates an active student immediately."
                : "Fill in your details, choose tracks and schedule groups if needed, and submit your application for approval."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <BookOpen className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Quran Levels</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {quranLevels.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <ScrollText className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Kitab Levels</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {kitabLevels.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-span-2 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                  <CheckCircle2 className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {isAdmin ? "Active" : "Pending"}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <User className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Basic Information
                </h2>
                <p className="text-sm text-slate-500">
                  Personal and contact details
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Student full name"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="student@example.com"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="09xxxxxxxx"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Age
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <BadgeInfo className="h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    name="age"
                    min="1"
                    value={form.age}
                    onChange={handleChange}
                    required
                    placeholder="Age"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Telegram Username
                </label>
                <input
                  type="text"
                  name="telegramUsername"
                  value={form.telegramUsername}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Student address"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <ClipboardCheck className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Learning Mode
                </h2>
                <p className="text-sm text-slate-500">
                  Choose how the student attends lessons
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Learning Mode
                </label>
                <select
                  name="learningMode"
                  value={form.learningMode}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                >
                  {learningModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <TrackBlock
                title="Quran Track"
                subtitle="Select the Quran level and one schedule group."
                icon={BookOpen}
                trackType="QURAN"
                levelValue={form.quranLevelId}
                scheduleValue={form.quranScheduleId}
                levels={quranLevels}
                schedules={quranSchedules}
                learningMode={form.learningMode}
                onLevelChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    quranLevelId: value,
                    quranScheduleId: "",
                  }))
                }
                onScheduleChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    quranScheduleId: value,
                  }))
                }
              />

              <TrackBlock
                title="Kitab Track"
                subtitle="Select the Kitab level and one schedule group."
                icon={ScrollText}
                trackType="KITAB"
                levelValue={form.kitabLevelId}
                scheduleValue={form.kitabScheduleId}
                levels={kitabLevels}
                schedules={kitabSchedules}
                learningMode={form.learningMode}
                onLevelChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    kitabLevelId: value,
                    kitabScheduleId: "",
                  }))
                }
                onScheduleChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    kitabScheduleId: value,
                  }))
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                  <CheckCircle2 className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Sponsorship
                  </h2>
                  <p className="text-sm text-slate-500">
                    Mark whether this student is sponsored
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3">
                <input
                  type="checkbox"
                  name="isSponsored"
                  checked={form.isSponsored}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      isSponsored: e.target.checked,
                      sponsorId: e.target.checked ? prev.sponsorId : "",
                    }))
                  }}
                  className="h-5 w-5 accent-emerald-700"
                />
                <span className="font-semibold text-slate-700">
                  Sponsored Student
                </span>
              </label>
            </div>

            {form.isSponsored && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Sponsor
                  </label>
                  <select
                    name="sponsorId"
                    value={form.sponsorId}
                    onChange={handleChange}
                    required={form.isSponsored}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    <option value="">Choose sponsor</option>
                    {activeSponsors.map((sponsor) => (
                      <option key={sponsor.id} value={sponsor.id}>
                        {sponsor.name} — {sponsor.type}
                      </option>
                    ))}
                  </select>

                  {activeSponsors.length === 0 && (
                    <p className="mt-2 text-sm text-rose-600">
                      No active sponsors found. Create one in the admin sponsors page first.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Emergency Contact
                </h2>
                <p className="text-sm text-slate-500">
                  Parent or guardian information
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Guardian name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="09xxxxxxxx"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 rounded-2xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              <ArrowRight className="h-5 w-5" />
              {submitting ? "Submitting..." : isAdmin ? "Create Student" : "Register Student"}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Users className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Registration Notes
                </h2>
                <p className="text-sm text-slate-500">
                  What happens after submission
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  {isAdmin ? "Direct Approval" : "Approval Required"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isAdmin
                    ? "Students created here become active immediately."
                    : "Public registrations stay pending until reviewed by the admin."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">Optional tracks</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A student may register for Quran only, Kitab only, or both.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">Sponsor selection</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If sponsored, choose a sponsor from the active sponsor list.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Schedule groups
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Students choose one schedule group per track. Each group can contain multiple weekly sessions.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Search className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Browse Levels
                </h2>
                <p className="text-sm text-slate-500">
                  Search available learning levels
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search level name or order"
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">
                Loading levels and sponsors...
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                    Quran Levels
                  </h3>

                  <div className="space-y-3">
                    {quranLevels.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No Quran levels found.
                      </p>
                    )}

                    {quranLevels.map((level) => (
                      <div
                        key={level.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="font-bold text-slate-900">{level.name}</p>
                        <p className="text-sm text-slate-500">
                          Order: {level.levelOrder}
                        </p>
                        {level.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {level.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                    Kitab Levels
                  </h3>

                  <div className="space-y-3">
                    {kitabLevels.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No Kitab levels found.
                      </p>
                    )}

                    {kitabLevels.map((level) => (
                      <div
                        key={level.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="font-bold text-slate-900">{level.name}</p>
                        <p className="text-sm text-slate-500">
                          Order: {level.levelOrder}
                        </p>
                        {level.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {level.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
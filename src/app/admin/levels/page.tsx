"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Edit3,
  Filter,
  GraduationCap,
  MapPin,
  Plus,
  Save,
  ScrollText,
  Trash2,
  X,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
  levelOrder: number
  description?: string | null
}

type ScheduleSession = {
  id: string
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY"
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

const DAYS: ScheduleSession["dayOfWeek"][] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

const emptyLevelForm = {
  name: "",
  trackType: "QURAN" as "QURAN" | "KITAB",
  levelOrder: "",
  description: "",
}

type SessionRow = {
  dayOfWeek: ScheduleSession["dayOfWeek"]
  startTime: string
  endTime: string
}

const emptyScheduleForm = {
  label: "",
  mode: "ONLINE" as "ONLINE" | "IN_PERSON" | "BOTH",
  location: "",
  sessions: [
    {
      dayOfWeek: "MONDAY" as const,
      startTime: "",
      endTime: "",
    },
  ] as SessionRow[],
}

function sortSessions(items: ScheduleSession[]) {
  return [...items].sort((a, b) => {
    const dayDiff = DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek)
    if (dayDiff !== 0) return dayDiff
    return a.startTime.localeCompare(b.startTime)
  })
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [trackFilter, setTrackFilter] = useState<"" | "QURAN" | "KITAB">("")

  const [showLevelModal, setShowLevelModal] = useState(false)
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null)
  const [levelForm, setLevelForm] = useState(emptyLevelForm)

  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [schedules, setSchedules] = useState<ScheduleGroup[]>([])
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm)
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)

  async function loadLevels() {
    setLoading(true)

    const params = new URLSearchParams()
    if (trackFilter) params.set("trackType", trackFilter)

    const res = await fetch(`/api/admin/levels?${params.toString()}`)
    const data = await res.json()

    setLevels(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLevels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackFilter])

  function openCreateLevel() {
    setEditingLevelId(null)
    setLevelForm(emptyLevelForm)
    setShowLevelModal(true)
  }

  function openEditLevel(level: Level) {
    setEditingLevelId(level.id)
    setLevelForm({
      name: level.name,
      trackType: level.trackType,
      levelOrder: String(level.levelOrder),
      description: level.description || "",
    })
    setShowLevelModal(true)
  }

  function closeLevelModal() {
    setShowLevelModal(false)
    setEditingLevelId(null)
    setLevelForm(emptyLevelForm)
  }

  async function handleLevelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingLevelId
        ? `/api/admin/levels/${editingLevelId}`
        : "/api/admin/levels"

      const method = editingLevelId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(levelForm),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        alert(data?.error || "Failed to save level")
        return
      }

      closeLevelModal()
      await loadLevels()
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function deleteLevel(id: string) {
    const confirmed = confirm(
      "Delete this level? This will also remove its schedules."
    )
    if (!confirmed) return

    const res = await fetch(`/api/admin/levels/${id}`, {
      method: "DELETE",
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      alert(data?.error || "Failed to delete level")
      return
    }

    await loadLevels()
  }

  async function openSchedules(level: Level) {
    setSelectedLevel(level)
    setShowScheduleModal(true)
    setEditingScheduleId(null)
    setScheduleForm(emptyScheduleForm)

    const res = await fetch(`/api/admin/levels/${level.id}/schedules`)
    const data = await res.json()
    setSchedules(data)
  }

  function closeScheduleModal() {
    setShowScheduleModal(false)
    setSelectedLevel(null)
    setSchedules([])
    setScheduleForm(emptyScheduleForm)
    setEditingScheduleId(null)
  }

  function updateSession(
    index: number,
    field: keyof SessionRow,
    value: string
  ) {
    setScheduleForm((prev) => {
      const sessions = [...prev.sessions]
      sessions[index] = {
        ...sessions[index],
        [field]: value,
      }
      return { ...prev, sessions }
    })
  }

  function addSessionRow() {
    setScheduleForm((prev) => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        { dayOfWeek: "TUESDAY", startTime: "", endTime: "" },
      ],
    }))
  }

  function removeSessionRow(index: number) {
    setScheduleForm((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }))
  }

  async function handleScheduleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedLevel) return

    setSaving(true)

    try {
      const url = editingScheduleId
        ? `/api/admin/schedules/${editingScheduleId}`
        : `/api/admin/levels/${selectedLevel.id}/schedules`

      const method = editingScheduleId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: scheduleForm.label,
          mode: scheduleForm.mode,
          location: scheduleForm.location,
          sessions: scheduleForm.sessions,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        alert(data?.error || "Failed to save schedule group")
        return
      }

      setScheduleForm(emptyScheduleForm)
      setEditingScheduleId(null)

      const refreshed = await fetch(
        `/api/admin/levels/${selectedLevel.id}/schedules`
      )
      setSchedules(await refreshed.json())
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function deleteSchedule(id: string) {
    const confirmed = confirm("Delete this schedule group?")
    if (!confirmed) return

    const res = await fetch(`/api/admin/schedules/${id}`, {
      method: "DELETE",
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      alert(data?.error || "Failed to delete schedule")
      return
    }

    if (selectedLevel) {
      const refreshed = await fetch(
        `/api/admin/levels/${selectedLevel.id}/schedules`
      )
      setSchedules(await refreshed.json())
    }
  }

  function editSchedule(group: ScheduleGroup) {
    setEditingScheduleId(group.id)
    setScheduleForm({
      label: group.label,
      mode: group.mode,
      location: group.location || "",
      sessions: group.sessions.length
        ? group.sessions.map((session) => ({
            dayOfWeek: session.dayOfWeek,
            startTime: session.startTime,
            endTime: session.endTime,
          }))
        : [{ dayOfWeek: "MONDAY", startTime: "", endTime: "" }],
    })
  }

  const quranCount = useMemo(
    () => levels.filter((l) => l.trackType === "QURAN").length,
    [levels]
  )

  const kitabCount = useMemo(
    () => levels.filter((l) => l.trackType === "KITAB").length,
    [levels]
  )

  return (
    <main className="space-y-6 p-4 text-slate-900 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
              Levels & Schedules
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Manage Quran and Kitab levels with grouped weekly schedules.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <GraduationCap className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {levels.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <BookOpen className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Quran</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {quranCount}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-span-2 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <ScrollText className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Kitab</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {kitabCount}
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
          <select
            value={trackFilter}
            onChange={(e) =>
              setTrackFilter(e.target.value as "" | "QURAN" | "KITAB")
            }
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Tracks</option>
            <option value="QURAN">Quran</option>
            <option value="KITAB">Kitab</option>
          </select>

          <button
            onClick={openCreateLevel}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            <Plus className="h-5 w-5" />
            Add Level
          </button>

          <button
            onClick={() => setTrackFilter("")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Clear Filter
          </button>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
          Loading levels...
        </div>
      ) : levels.length === 0 ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <GraduationCap className="h-10 w-10 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No Levels</h2>
          <p className="mt-2 text-slate-600">
            Create your first Quran or Kitab level.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {levels.map((level) => (
            <div
              key={level.id}
              className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                      {level.trackType === "QURAN" ? (
                        <BookOpen className="h-8 w-8" />
                      ) : (
                        <ScrollText className="h-8 w-8" />
                      )}
                    </div>

                    <div>
                      <h2 className="text-2xl font-black">{level.name}</h2>
                      <p className="text-emerald-50">{level.trackType}</p>
                    </div>
                  </div>

                  <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                    Level {level.levelOrder}
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Description</p>
                  <p className="mt-2 font-medium text-slate-800">
                    {level.description || "No description"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => openSchedules(level)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
                  >
                    <CalendarDays className="h-5 w-5" />
                    Manage Schedules
                  </button>

                  <button
                    onClick={() => openEditLevel(level)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Edit3 className="h-5 w-5" />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteLevel(level.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-bold text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showLevelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingLevelId ? "Edit Level" : "Add Level"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create or update a Quran or Kitab level
                </p>
              </div>

              <button
                onClick={closeLevelModal}
                className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleLevelSubmit} className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Name
                  </label>
                  <input
                    value={levelForm.name}
                    onChange={(e) =>
                      setLevelForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Track Type
                  </label>
                  <select
                    value={levelForm.trackType}
                    onChange={(e) =>
                      setLevelForm((prev) => ({
                        ...prev,
                        trackType: e.target.value as "QURAN" | "KITAB",
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    <option value="QURAN">Quran</option>
                    <option value="KITAB">Kitab</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Level Order
                  </label>
                  <input
                    type="number"
                    value={levelForm.levelOrder}
                    onChange={(e) =>
                      setLevelForm((prev) => ({
                        ...prev,
                        levelOrder: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <input
                    value={levelForm.description}
                    onChange={(e) =>
                      setLevelForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeLevelModal}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                >
                  <Save className="h-5 w-5" />
                  {saving
                    ? "Saving..."
                    : editingLevelId
                      ? "Update Level"
                      : "Create Level"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && selectedLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedLevel.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage grouped weekly schedules
                </p>
              </div>

              <button
                onClick={closeScheduleModal}
                className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                    <Plus className="h-6 w-6 text-emerald-700" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {editingScheduleId
                        ? "Edit Schedule Group"
                        : "Add Schedule Group"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Add one group with multiple weekly sessions
                    </p>
                  </div>
                </div>

                <form onSubmit={handleScheduleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Group Label
                    </label>
                    <input
                      value={scheduleForm.label}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      placeholder="Example: Morning Group A"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Learning Mode
                    </label>
                    <select
                      value={scheduleForm.mode}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          mode: e.target.value as
                            | "ONLINE"
                            | "IN_PERSON"
                            | "BOTH",
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    >
                      <option value="ONLINE">Online</option>
                      <option value="IN_PERSON">In Person</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location / Meeting Link
                    </label>
                    <input
                      value={scheduleForm.location}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">Sessions</h4>

                      <button
                        type="button"
                        onClick={addSessionRow}
                        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
                      >
                        + Add Session
                      </button>
                    </div>

                    <div className="space-y-3">
                      {scheduleForm.sessions.map((session, index) => (
                        <div key={index} className="grid gap-3 md:grid-cols-4">
                          <select
                            value={session.dayOfWeek}
                            onChange={(e) =>
                              updateSession(index, "dayOfWeek", e.target.value)
                            }
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                          >
                            {DAYS.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>

                          <input
                            type="time"
                            value={session.startTime}
                            onChange={(e) =>
                              updateSession(index, "startTime", e.target.value)
                            }
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            required
                          />

                          <input
                            type="time"
                            value={session.endTime}
                            onChange={(e) =>
                              updateSession(index, "endTime", e.target.value)
                            }
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            required
                          />

                          <button
                            type="button"
                            onClick={() => removeSessionRow(index)}
                            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
                  >
                    <Save className="h-5 w-5" />
                    {saving
                      ? "Saving..."
                      : editingScheduleId
                        ? "Update Group"
                        : "Create Group"}
                  </button>
                </form>
              </section>

              <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                    <Clock3 className="h-6 w-6 text-emerald-700" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Existing Schedule Groups
                    </h3>
                    <p className="text-sm text-slate-500">
                      Groups with multiple weekly sessions
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {schedules.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                      No schedule groups yet
                    </div>
                  )}

                  {schedules.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                              <CalendarDays className="h-5 w-5 text-emerald-700" />
                            </div>

                            <div>
                              <h4 className="font-black text-slate-900">
                                {group.label}
                              </h4>

                              <p className="text-sm text-slate-500">
                                {group.mode}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {group.location && (
                              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                <MapPin className="h-3 w-3" />
                                {group.location}
                              </div>
                            )}

                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              {group.sessions.length} sessions
                            </div>
                          </div>

                          <div className="space-y-1">
                            {sortSessions(group.sessions).map((session) => (
                              <div key={session.id} className="text-xs text-slate-500">
                                {session.dayOfWeek} • {session.startTime} → {session.endTime}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editSchedule(group)}
                            className="rounded-2xl border border-slate-300 bg-white p-3 text-slate-700 transition hover:bg-slate-50"
                          >
                            <Edit3 className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => deleteSchedule(group.id)}
                            className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700 transition hover:bg-rose-100"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
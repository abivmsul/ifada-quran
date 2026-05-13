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
  Search,
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

type Schedule = {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  mode: string
  location?: string | null
}

const DAYS = [
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

const emptyScheduleForm = {
  dayOfWeek: "MONDAY",
  startTime: "",
  endTime: "",
  mode: "ONLINE",
  location: "",
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
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm)

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
    const confirmed = confirm("Delete this level? This will also remove its schedules.")
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
  }

  async function addSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedLevel) return

    const res = await fetch(`/api/admin/levels/${selectedLevel.id}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleForm),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      alert(data?.error || "Failed to add schedule")
      return
    }

    setScheduleForm(emptyScheduleForm)

    const refreshed = await fetch(`/api/admin/levels/${selectedLevel.id}/schedules`)
    const refreshedData = await refreshed.json()
    setSchedules(refreshedData)
  }

  async function deleteSchedule(id: string) {
    const confirmed = confirm("Delete this schedule?")
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
      const refreshed = await fetch(`/api/admin/levels/${selectedLevel.id}/schedules`)
      const refreshedData = await refreshed.json()
      setSchedules(refreshedData)
    }
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
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Levels & Schedules
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Create, edit, delete, and schedule Quran and Kitab levels with multiple weekly sessions.
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
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search handled through filters below"
              disabled
              className="w-full bg-transparent text-slate-400 outline-none"
            />
          </div>

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
                  {saving ? "Saving..." : editingLevelId ? "Update Level" : "Create Level"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && selectedLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedLevel.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage weekly schedules
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
                      Add Schedule
                    </h3>
                    <p className="text-sm text-slate-500">
                      Create weekly learning sessions
                    </p>
                  </div>
                </div>

                <form onSubmit={addSchedule} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Day
                    </label>
                    <select
                      value={scheduleForm.dayOfWeek}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          dayOfWeek: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    >
                      {DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={scheduleForm.startTime}
                        onChange={(e) =>
                          setScheduleForm((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={scheduleForm.endTime}
                        onChange={(e) =>
                          setScheduleForm((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                        required
                      />
                    </div>
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
                          mode: e.target.value,
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
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
                  >
                    <Plus className="h-5 w-5" />
                    Add Schedule
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
                      Weekly Schedules
                    </h3>
                    <p className="text-sm text-slate-500">
                      Existing sessions
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {schedules.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                      No schedules yet
                    </div>
                  )}

                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                              <CalendarDays className="h-5 w-5 text-emerald-700" />
                            </div>

                            <div>
                              <h4 className="font-black text-slate-900">
                                {schedule.dayOfWeek}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {schedule.startTime} → {schedule.endTime}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              {schedule.mode}
                            </div>

                            {schedule.location && (
                              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                <MapPin className="h-3 w-3" />
                                {schedule.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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
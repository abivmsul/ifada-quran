// src/app/admin/levels/page.tsx

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  ClipboardList,
  Edit3,
  Layers3,
  Plus,
  ScrollText,
  Sparkles,
  Trash2,
  Save,
  X,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
  levelOrder: number
  description?: string | null
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState("")
  const [trackFilter, setTrackFilter] = useState<"" | "QURAN" | "KITAB">("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    trackType: "QURAN" as "QURAN" | "KITAB",
    levelOrder: "",
    description: "",
  })

  async function loadLevels() {
    setLoading(true)
    const res = await fetch("/api/admin/levels")
    const data = await res.json()
    setLevels(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLevels()
  }, [])

  const filteredLevels = useMemo(() => {
    return levels.filter((level) => {
      const matchesSearch =
        !search ||
        level.name.toLowerCase().includes(search.toLowerCase()) ||
        String(level.levelOrder).includes(search.toLowerCase()) ||
        (level.description || "")
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesTrack = !trackFilter || level.trackType === trackFilter

      return matchesSearch && matchesTrack
    })
  }, [levels, search, trackFilter])

  const quranLevels = filteredLevels.filter((l) => l.trackType === "QURAN")
  const kitabLevels = filteredLevels.filter((l) => l.trackType === "KITAB")

  function resetForm() {
    setEditingId(null)
    setForm({
      name: "",
      trackType: "QURAN",
      levelOrder: "",
      description: "",
    })
  }

  function editLevel(level: Level) {
    setEditingId(level.id)
    setForm({
      name: level.name,
      trackType: level.trackType,
      levelOrder: String(level.levelOrder),
      description: level.description || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingId
        ? `/api/admin/levels/${editingId}`
        : "/api/admin/levels"

      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to save level")
        return
      }

      await loadLevels()
      resetForm()
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function deleteLevel(id: string) {
    const confirmDelete = confirm("Delete this level?")
    if (!confirmDelete) return

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

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                <Sparkles className="h-4 w-4" />
                Level Management
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Levels
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Create, edit, and organize Quran and Kitab levels for the entire system.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Total</div>
                <div className="mt-1 text-3xl font-black text-emerald-900">
                  {levels.length}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Quran</div>
                <div className="mt-1 text-3xl font-black text-emerald-900">
                  {levels.filter((l) => l.trackType === "QURAN").length}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 col-span-2 sm:col-span-1">
                <div className="text-sm text-slate-500">Kitab</div>
                <div className="mt-1 text-3xl font-black text-amber-600">
                  {levels.filter((l) => l.trackType === "KITAB").length}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-900" />
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Level" : "Create New Level"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Level Name
                </span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Quran Level 1"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Track Type
                </span>
                <select
                  value={form.trackType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      trackType: e.target.value as "QURAN" | "KITAB",
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                >
                  <option value="QURAN">Quran</option>
                  <option value="KITAB">Kitab</option>
                </select>
              </label>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Level Order
                </span>
                <input
                  type="number"
                  value={form.levelOrder}
                  onChange={(e) =>
                    setForm({ ...form, levelOrder: e.target.value })
                  }
                  placeholder="1"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Short description for this level"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row lg:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Level"
                    : "Create Level"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Filters */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-emerald-900" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or order"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
            />

            <select
              value={trackFilter}
              onChange={(e) =>
                setTrackFilter(e.target.value as "" | "QURAN" | "KITAB")
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
            >
              <option value="">All Tracks</option>
              <option value="QURAN">Quran</option>
              <option value="KITAB">Kitab</option>
            </select>
          </div>
        </section>

        {/* Lists */}
        {loading ? (
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm">
            Loading levels...
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Quran */}
            <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-900" />
                <h2 className="text-2xl font-bold">Quran Levels</h2>
              </div>

              <div className="space-y-4">
                {quranLevels.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
                    No Quran levels found.
                  </div>
                ) : (
                  quranLevels.map((level) => (
                    <div
                      key={level.id}
                      className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">
                            Quran
                          </div>

                          <h3 className="mt-3 text-xl font-bold text-slate-900">
                            {level.name}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            Order: {level.levelOrder}
                          </p>

                          {level.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                              {level.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editLevel(level)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => deleteLevel(level.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Kitab */}
            <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-amber-600" />
                <h2 className="text-2xl font-bold">Kitab Levels</h2>
              </div>

              <div className="space-y-4">
                {kitabLevels.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
                    No Kitab levels found.
                  </div>
                ) : (
                  kitabLevels.map((level) => (
                    <div
                      key={level.id}
                      className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                            Kitab
                          </div>

                          <h3 className="mt-3 text-xl font-bold text-slate-900">
                            {level.name}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            Order: {level.levelOrder}
                          </p>

                          {level.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                              {level.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editLevel(level)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => deleteLevel(level.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
// src/app/admin/lessons/page.tsx

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ClipboardList,
  Edit3,
  Layers3,
  NotebookPen,
  Plus,
  Search,
  ScrollText,
  Sparkles,
  X,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

type Student = {
  id: string
  fullName: string
  phone: string
  email?: string
}

type Lesson = {
  id: string
  studentId: string
  trackType: "QURAN" | "KITAB"
  title: string | null
  content: string
  notes: string | null
  surah: string | null
  fromAyah: number | null
  toAyah: number | null
  isRevision: boolean
  kitabBook: string | null
  kitabChapter: string | null
  topic: string | null
  homework: string | null
  date: string
  student: Student
}

export default function LessonsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState("")
  const [trackFilter, setTrackFilter] = useState<"" | "QURAN" | "KITAB">("")
  const [studentFilter, setStudentFilter] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const [form, setForm] = useState({
    studentId: "",
    trackType: "QURAN" as "QURAN" | "KITAB",
    title: "",
    content: "",
    notes: "",
    surah: "",
    fromAyah: "",
    toAyah: "",
    isRevision: false,
    kitabBook: "",
    kitabChapter: "",
    topic: "",
    homework: "",
    date: new Date().toISOString().split("T")[0],
  })

  async function loadStudents() {
    const res = await fetch("/api/admin/students")
    const data = await res.json()
    setStudents(data)
  }

  async function loadLevels() {
    const res = await fetch("/api/levels")
    const data = await res.json()
    setLevels(data)
  }

  async function loadLessons() {
    setLoading(true)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (trackFilter) params.set("trackType", trackFilter)
    if (studentFilter) params.set("studentId", studentFilter)
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)

    const res = await fetch(`/api/admin/lessons?${params.toString()}`)
    const data = await res.json()
    setLessons(data)

    setLoading(false)
  }

  useEffect(() => {
    loadStudents()
    loadLevels()
  }, [])

  useEffect(() => {
    loadLessons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, trackFilter, studentFilter, fromDate, toDate])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to save lesson")
        return
      }

      alert("Lesson saved successfully")

      setForm({
        studentId: "",
        trackType: "QURAN",
        title: "",
        content: "",
        notes: "",
        surah: "",
        fromAyah: "",
        toAyah: "",
        isRevision: false,
        kitabBook: "",
        kitabChapter: "",
        topic: "",
        homework: "",
        date: new Date().toISOString().split("T")[0],
      })

      loadLessons()
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const quranStudents = useMemo(
    () =>
      students.filter((student) => {
        const selected = studentFilter ? student.id === studentFilter : true
        return selected
      }),
    [students, studentFilter]
  )

  const filteredStudentsForForm = useMemo(() => {
    return students
  }, [students])

  const quranCount = lessons.filter((l) => l.trackType === "QURAN").length
  const kitabCount = lessons.filter((l) => l.trackType === "KITAB").length

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                <Sparkles className="h-4 w-4" />
                Lesson Recording
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Lessons
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Record Quran and Kitab lessons with clean progress tracking,
                structured details, homework, and searchable history.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Total</div>
                <div className="mt-1 text-3xl font-black text-emerald-900">
                  {lessons.length}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Quran</div>
                <div className="mt-1 text-3xl font-black text-emerald-900">
                  {quranCount}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 col-span-2 sm:col-span-1">
                <div className="text-sm text-slate-500">Kitab</div>
                <div className="mt-1 text-3xl font-black text-amber-600">
                  {kitabCount}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Create Lesson Form */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-900" />
            <h2 className="text-xl font-bold">Create Lesson</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Student
              </span>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                required
              >
                <option value="">Select student</option>
                {filteredStudentsForForm.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} — {student.phone}
                  </option>
                ))}
              </select>
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
                    // clear track-specific fields when switching
                    surah: "",
                    fromAyah: "",
                    toAyah: "",
                    isRevision: false,
                    kitabBook: "",
                    kitabChapter: "",
                    topic: "",
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
              >
                <option value="QURAN">Quran</option>
                <option value="KITAB">Kitab</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Lesson Title
              </span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Optional title"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Date
              </span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
              />
            </label>

            <div className="lg:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Lesson Content
                </span>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Describe what was covered"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                  required
                />
              </label>
            </div>

            {form.trackType === "QURAN" ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Surah
                  </span>
                  <input
                    value={form.surah}
                    onChange={(e) => setForm({ ...form, surah: e.target.value })}
                    placeholder="e.g. Al-Mulk"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Revision?
                  </span>
                  <select
                    value={form.isRevision ? "true" : "false"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isRevision: e.target.value === "true",
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                  >
                    <option value="false">New Lesson</option>
                    <option value="true">Revision</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    From Ayah
                  </span>
                  <input
                    type="number"
                    value={form.fromAyah}
                    onChange={(e) =>
                      setForm({ ...form, fromAyah: e.target.value })
                    }
                    placeholder="1"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    To Ayah
                  </span>
                  <input
                    type="number"
                    value={form.toAyah}
                    onChange={(e) =>
                      setForm({ ...form, toAyah: e.target.value })
                    }
                    placeholder="5"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Book
                  </span>
                  <input
                    value={form.kitabBook}
                    onChange={(e) =>
                      setForm({ ...form, kitabBook: e.target.value })
                    }
                    placeholder="e.g. Nahw Book 1"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Chapter
                  </span>
                  <input
                    value={form.kitabChapter}
                    onChange={(e) =>
                      setForm({ ...form, kitabChapter: e.target.value })
                    }
                    placeholder="e.g. Chapter 2"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                  />
                </label>

                <div className="lg:col-span-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Topic
                    </span>
                    <input
                      value={form.topic}
                      onChange={(e) =>
                        setForm({ ...form, topic: e.target.value })
                      }
                      placeholder="e.g. Grammar basics"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                    />
                  </label>
                </div>
              </>
            )}

            <div className="lg:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </span>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional notes"
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-900 focus:bg-white"
                />
              </label>
            </div>

            <div className="lg:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Homework / Next Task
                </span>
                <textarea
                  value={form.homework}
                  onChange={(e) => setForm({ ...form, homework: e.target.value })}
                  placeholder="What should the student do next?"
                  rows={2}
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
                <Plus className="h-4 w-4" />
                {saving ? "Saving..." : "Save Lesson"}
              </button>
            </div>
          </form>
        </section>

        {/* Filters */}
        <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-emerald-900" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lessons"
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              value={trackFilter}
              onChange={(e) =>
                setTrackFilter(e.target.value as "" | "QURAN" | "KITAB")
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            >
              <option value="">All Tracks</option>
              <option value="QURAN">Quran</option>
              <option value="KITAB">Kitab</option>
            </select>

            <select
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            >
              <option value="">All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Calendar className="h-4 w-4 text-slate-500" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-transparent outline-none"
                />
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Calendar className="h-4 w-4 text-slate-500" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-transparent outline-none"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Lessons list */}
        <section className="space-y-4">
          {loading && (
            <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              Loading lessons...
            </div>
          )}

          {!loading && lessons.length === 0 && (
            <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 text-slate-500 shadow-sm">
              No lessons found.
            </div>
          )}

          {!loading &&
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                        lesson.trackType === "QURAN"
                          ? "bg-emerald-50 text-emerald-900"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {lesson.trackType === "QURAN" ? (
                        <BookOpen className="h-7 w-7" />
                      ) : (
                        <ScrollText className="h-7 w-7" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {lesson.title || lesson.student.fullName}
                      </h3>

                      <div className="mt-2 text-sm text-slate-600">
                        Student:{" "}
                        <span className="font-semibold text-slate-900">
                          {lesson.student.fullName}
                        </span>
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        {lesson.student.phone}
                      </div>

                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {new Date(lesson.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                      lesson.trackType === "QURAN"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {lesson.trackType}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Content
                    </div>
                    <div className="mt-2 leading-7 text-slate-700">
                      {lesson.content}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Lesson Details
                    </div>

                    {lesson.trackType === "QURAN" ? (
                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold">Surah:</span>{" "}
                          {lesson.surah || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Ayahs:</span>{" "}
                          {lesson.fromAyah ?? "-"} to {lesson.toAyah ?? "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Type:</span>{" "}
                          {lesson.isRevision ? "Revision" : "New lesson"}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold">Book:</span>{" "}
                          {lesson.kitabBook || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Chapter:</span>{" "}
                          {lesson.kitabChapter || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Topic:</span>{" "}
                          {lesson.topic || "-"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Notes
                    </div>
                    <div className="mt-2 leading-7 text-slate-700">
                      {lesson.notes || "No notes"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      Homework
                    </div>
                    <div className="mt-2 leading-7 text-slate-700">
                      {lesson.homework || "No homework"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </section>
      </div>
    </main>
  )
}
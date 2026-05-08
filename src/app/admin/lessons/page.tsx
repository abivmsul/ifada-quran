"use client"

import { useEffect, useMemo, useState } from "react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

type Student = {
  id: string
  fullName: string
  email: string
  phone: string
}

type Lesson = {
  id: string
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
  student: Student & {
    studentLevels: {
      id: string
      trackType: "QURAN" | "KITAB"
      level: {
        id: string
        name: string
      }
    }[]
  }
}

export default function LessonsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [trackTypeFilter, setTrackTypeFilter] = useState("")
  const [studentFilter, setStudentFilter] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const [form, setForm] = useState({
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

  useEffect(() => {
    fetch("/api/admin/students")
      .then((res) => res.json())
      .then(setStudents)

    fetch("/api/levels")
      .then((res) => res.json())
      .then(setLevels)
  }, [])

  useEffect(() => {
    loadLessons()
  }, [search, trackTypeFilter, studentFilter, fromDate, toDate])

  async function loadLessons() {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (trackTypeFilter) params.set("trackType", trackTypeFilter)
    if (studentFilter) params.set("studentId", studentFilter)
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)

    const res = await fetch(`/api/admin/lessons?${params.toString()}`)
    const data = await res.json()
    setLessons(data)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

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

      alert("Lesson saved")
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
      setLoading(false)
    }
  }

  const filteredLevels = useMemo(() => {
    return levels.filter((l) => l.trackType === form.trackType)
  }, [levels, form.trackType])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Lesson Recording</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="border p-2 rounded"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            required
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.phone})
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={form.trackType}
            onChange={(e) =>
              setForm({
                ...form,
                trackType: e.target.value as "QURAN" | "KITAB",
              })
            }
          >
            <option value="QURAN">Quran</option>
            <option value="KITAB">Kitab</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <textarea
          className="border p-2 rounded w-full"
          rows={4}
          placeholder="Lesson content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />

        <textarea
          className="border p-2 rounded w-full"
          rows={3}
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        {form.trackType === "QURAN" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Surah"
              value={form.surah}
              onChange={(e) => setForm({ ...form, surah: e.target.value })}
            />

            <input
              className="border p-2 rounded"
              placeholder="From Ayah"
              type="number"
              value={form.fromAyah}
              onChange={(e) => setForm({ ...form, fromAyah: e.target.value })}
            />

            <input
              className="border p-2 rounded"
              placeholder="To Ayah"
              type="number"
              value={form.toAyah}
              onChange={(e) => setForm({ ...form, toAyah: e.target.value })}
            />

            <label className="border p-2 rounded flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isRevision}
                onChange={(e) =>
                  setForm({ ...form, isRevision: e.target.checked })
                }
              />
              Revision
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Book"
              value={form.kitabBook}
              onChange={(e) => setForm({ ...form, kitabBook: e.target.value })}
            />

            <input
              className="border p-2 rounded"
              placeholder="Chapter"
              value={form.kitabChapter}
              onChange={(e) =>
                setForm({ ...form, kitabChapter: e.target.value })
              }
            />

            <input
              className="border p-2 rounded md:col-span-2"
              placeholder="Topic"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>
        )}

        <textarea
          className="border p-2 rounded w-full"
          rows={2}
          placeholder="Homework / next task"
          value={form.homework}
          onChange={(e) => setForm({ ...form, homework: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="border px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Lesson"}
        </button>
      </form>

      <div className="space-y-4 border rounded p-4">
        <h2 className="text-xl font-bold">Recent Lessons</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={trackTypeFilter}
            onChange={(e) => setTrackTypeFilter(e.target.value)}
          >
            <option value="">All tracks</option>
            <option value="QURAN">Quran</option>
            <option value="KITAB">Kitab</option>
          </select>

          <select
            className="border p-2 rounded"
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
          >
            <option value="">All students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="border p-2 rounded"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="border p-4 rounded">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {lesson.student.fullName} — {lesson.trackType}
                  </p>
                  <p className="text-sm">
                    {new Date(lesson.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {lesson.title && <p><strong>Title:</strong> {lesson.title}</p>}
                <p><strong>Content:</strong> {lesson.content}</p>

                {lesson.trackType === "QURAN" && (
                  <div className="text-sm">
                    {lesson.surah && <p><strong>Surah:</strong> {lesson.surah}</p>}
                    {(lesson.fromAyah !== null || lesson.toAyah !== null) && (
                      <p>
                        <strong>Ayah:</strong>{" "}
                        {lesson.fromAyah ?? "-"} to {lesson.toAyah ?? "-"}
                      </p>
                    )}
                    <p>
                      <strong>Type:</strong>{" "}
                      {lesson.isRevision ? "Revision" : "New lesson"}
                    </p>
                  </div>
                )}

                {lesson.trackType === "KITAB" && (
                  <div className="text-sm">
                    {lesson.kitabBook && (
                      <p><strong>Book:</strong> {lesson.kitabBook}</p>
                    )}
                    {lesson.kitabChapter && (
                      <p><strong>Chapter:</strong> {lesson.kitabChapter}</p>
                    )}
                    {lesson.topic && (
                      <p><strong>Topic:</strong> {lesson.topic}</p>
                    )}
                  </div>
                )}

                {lesson.homework && (
                  <p className="text-sm">
                    <strong>Homework:</strong> {lesson.homework}
                  </p>
                )}

                {lesson.notes && (
                  <p className="text-sm mt-2">
                    <strong>Notes:</strong> {lesson.notes}
                  </p>
                )}
              </div>
            </div>
          ))}

          {lessons.length === 0 && <p>No lessons found.</p>}
        </div>
      </div>
    </div>
  )
}
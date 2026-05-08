"use client"

import { useEffect, useMemo, useState } from "react"

export default function StudentPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const [student, setStudent] = useState<any>(null)
  const [levels, setLevels] = useState<any[]>([])

  const [lessonTrackFilter, setLessonTrackFilter] = useState("")
  const [lessonSearch, setLessonSearch] = useState("")

  useEffect(() => {

    async function load() {

      const { id } = await params

      const res = await fetch(
        `/api/admin/students/${id}`
      )

      const data = await res.json()

      setStudent(data.student)
      setLevels(data.levels)
    }

    load()

  }, [params])

  async function promoteStudent(
    trackType: "QURAN" | "KITAB",
    levelId: string
  ) {

    const res = await fetch(
      "/api/admin/promote",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          studentId: student.id,
          levelId,
          trackType
        })
      }
    )

    const data = await res.json()

    if (data.success) {
      alert("Student promoted")
      window.location.reload()
    }
  }

  const filteredLessons = useMemo(() => {

    if (!student) return []

    return student.lessons.filter((lesson: any) => {

      const matchesTrack =
        !lessonTrackFilter ||
        lesson.trackType === lessonTrackFilter

      const searchText = lessonSearch.toLowerCase()

      const matchesSearch =
        !lessonSearch ||
        lesson.content?.toLowerCase().includes(searchText) ||
        lesson.notes?.toLowerCase().includes(searchText) ||
        lesson.surah?.toLowerCase().includes(searchText) ||
        lesson.kitabBook?.toLowerCase().includes(searchText) ||
        lesson.topic?.toLowerCase().includes(searchText)

      return matchesTrack && matchesSearch

    })

  }, [student, lessonTrackFilter, lessonSearch])

  if (!student) {
    return (
      <div className="p-6">
        Loading...
      </div>
    )
  }

  // CURRENT LEVELS
  const quranLevel = student.studentLevels.find(
    (l: any) => l.trackType === "QURAN"
  )

  const kitabLevel = student.studentLevels.find(
    (l: any) => l.trackType === "KITAB"
  )

  return (
    <div className="p-6 space-y-8">

      {/* STUDENT INFO */}
      <div className="border rounded p-4">

        <h1 className="text-3xl font-bold">
          {student.fullName}
        </h1>

        <div className="mt-3 space-y-1">
          <p>{student.email}</p>
          <p>{student.phone}</p>
          <p>Status: {student.status}</p>
        </div>

      </div>

      {/* CURRENT LEVELS */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          Current Levels
        </h2>

        <div className="space-y-3">

          <div className="p-3 border rounded">
            <strong>Quran:</strong>{" "}
            {quranLevel?.level?.name || "Not assigned"}
          </div>

          <div className="p-3 border rounded">
            <strong>Kitab:</strong>{" "}
            {kitabLevel?.level?.name || "Not assigned"}
          </div>

        </div>

      </div>

      {/* PROMOTION */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-6">
          Promote Student
        </h2>

        {/* QURAN */}
        <div className="mb-8">

          <h3 className="font-bold mb-3">
            Quran Level
          </h3>

          <select
            className="border p-2 rounded w-full"
            onChange={(e) => {
              if (e.target.value) {
                promoteStudent(
                  "QURAN",
                  e.target.value
                )
              }
            }}
          >

            <option value="">
              Select Quran Level
            </option>

            {levels
              .filter(
                (l) => l.trackType === "QURAN"
              )
              .map((level) => (

                <option
                  key={level.id}
                  value={level.id}
                >
                  {level.name}
                </option>

              ))}

          </select>

        </div>

        {/* KITAB */}
        <div>

          <h3 className="font-bold mb-3">
            Kitab Level
          </h3>

          <select
            className="border p-2 rounded w-full"
            onChange={(e) => {
              if (e.target.value) {
                promoteStudent(
                  "KITAB",
                  e.target.value
                )
              }
            }}
          >

            <option value="">
              Select Kitab Level
            </option>

            {levels
              .filter(
                (l) => l.trackType === "KITAB"
              )
              .map((level) => (

                <option
                  key={level.id}
                  value={level.id}
                >
                  {level.name}
                </option>

              ))}

          </select>

        </div>

      </div>

      {/* LEVEL HISTORY */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          Level History
        </h2>

        <div className="space-y-2">

          {student.studentLevels.map((sl: any) => (

            <div
              key={sl.id}
              className="border rounded p-3"
            >

              <strong>{sl.trackType}</strong>
              {" → "}
              {sl.level?.name}

            </div>

          ))}

        </div>

      </div>

      {/* ATTENDANCE */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          Attendance History
        </h2>

        <div className="space-y-2">

          {student.attendance.map((a: any) => (

            <div
              key={a.id}
              className="border rounded p-3 flex justify-between"
            >

              <span>
                {new Date(a.date)
                  .toLocaleDateString()}
              </span>

              <span>
                {a.status}
              </span>

            </div>

          ))}

          {student.attendance.length === 0 && (
            <p>No attendance records.</p>
          )}

        </div>

      </div>

      {/* LESSONS */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          Lessons
        </h2>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">

          <input
            placeholder="Search lessons"
            value={lessonSearch}
            onChange={(e) =>
              setLessonSearch(e.target.value)
            }
            className="border p-2 rounded"
          />

          <select
            value={lessonTrackFilter}
            onChange={(e) =>
              setLessonTrackFilter(e.target.value)
            }
            className="border p-2 rounded"
          >

            <option value="">
              All Tracks
            </option>

            <option value="QURAN">
              Quran
            </option>

            <option value="KITAB">
              Kitab
            </option>

          </select>

        </div>

        {/* LESSON LIST */}
        <div className="space-y-4">

          {filteredLessons.map((lesson: any) => (

            <div
              key={lesson.id}
              className="border rounded p-4"
            >

              <div className="flex justify-between">

                <div>

                  <p className="font-bold">
                    {lesson.trackType}
                  </p>

                  <p className="text-sm">
                    {new Date(lesson.date)
                      .toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="mt-4 space-y-2">

                {lesson.title && (
                  <p>
                    <strong>Title:</strong>{" "}
                    {lesson.title}
                  </p>
                )}

                <p>
                  <strong>Content:</strong>{" "}
                  {lesson.content}
                </p>

                {/* QURAN */}
                {lesson.trackType === "QURAN" && (

                  <div className="space-y-1 text-sm">

                    {lesson.surah && (
                      <p>
                        <strong>Surah:</strong>{" "}
                        {lesson.surah}
                      </p>
                    )}

                    {(lesson.fromAyah ||
                      lesson.toAyah) && (
                      <p>
                        <strong>Ayahs:</strong>{" "}
                        {lesson.fromAyah}
                        {" - "}
                        {lesson.toAyah}
                      </p>
                    )}

                    <p>
                      <strong>Type:</strong>{" "}
                      {lesson.isRevision
                        ? "Revision"
                        : "New Lesson"}
                    </p>

                  </div>

                )}

                {/* KITAB */}
                {lesson.trackType === "KITAB" && (

                  <div className="space-y-1 text-sm">

                    {lesson.kitabBook && (
                      <p>
                        <strong>Book:</strong>{" "}
                        {lesson.kitabBook}
                      </p>
                    )}

                    {lesson.kitabChapter && (
                      <p>
                        <strong>Chapter:</strong>{" "}
                        {lesson.kitabChapter}
                      </p>
                    )}

                    {lesson.topic && (
                      <p>
                        <strong>Topic:</strong>{" "}
                        {lesson.topic}
                      </p>
                    )}

                  </div>

                )}

                {lesson.homework && (
                  <p>
                    <strong>Homework:</strong>{" "}
                    {lesson.homework}
                  </p>
                )}

                {lesson.notes && (
                  <p>
                    <strong>Notes:</strong>{" "}
                    {lesson.notes}
                  </p>
                )}

              </div>

            </div>

          ))}

          {filteredLessons.length === 0 && (
            <p>No lessons found.</p>
          )}

        </div>

      </div>

      {/* NOTES */}
      <div className="border rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          Notes
        </h2>

        <div className="space-y-2">

          {student.notes.map((note: any) => (

            <div
              key={note.id}
              className="border rounded p-3"
            >

              <p>{note.text}</p>

              <p className="text-sm mt-2">
                {new Date(note.createdAt)
                  .toLocaleDateString()}
              </p>

            </div>

          ))}

          {student.notes.length === 0 && (
            <p>No notes.</p>
          )}

        </div>

      </div>

    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [levels, setLevels] = useState<Level[]>([])

  const [search, setSearch] = useState("")
  const [quranLevel, setQuranLevel] = useState("")
  const [kitabLevel, setKitabLevel] = useState("")

  // Load levels
  useEffect(() => {
    fetch("/api/levels")
      .then(res => res.json())
      .then(setLevels)
  }, [])

  // Load students
  useEffect(() => {
    loadStudents()
  }, [search, quranLevel, kitabLevel])

  async function loadStudents() {
    const params = new URLSearchParams()

    if (search) {
      params.set("search", search)
    }

    if (quranLevel) {
      params.set("quranLevel", quranLevel)
    }

    if (kitabLevel) {
      params.set("kitabLevel", kitabLevel)
    }

    const res = await fetch(
      `/api/admin/students?${params.toString()}`
    )

    const data = await res.json()

    setStudents(data)
  }

  const quranLevels = levels.filter(
    (l) => l.trackType === "QURAN"
  )

  const kitabLevels = levels.filter(
    (l) => l.trackType === "KITAB"
  )

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Active Students
      </h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

        <input
          placeholder="Search by name, email, phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={quranLevel}
          onChange={(e) => setQuranLevel(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">
            All Quran Levels
          </option>

          {quranLevels.map((level) => (
            <option
              key={level.id}
              value={level.id}
            >
              {level.name}
            </option>
          ))}
        </select>

        <select
          value={kitabLevel}
          onChange={(e) => setKitabLevel(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">
            All Kitab Levels
          </option>

          {kitabLevels.map((level) => (
            <option
              key={level.id}
              value={level.id}
            >
              {level.name}
            </option>
          ))}
        </select>

      </div>

      {/* STUDENTS */}
      <div className="space-y-4">

        {students.length === 0 && (
          <p>No students found.</p>
        )}

        {students.map((student) => (

          <div
            key={student.id}
            className="border p-4 rounded"
          >
            <div className="flex justify-between items-start">

              <div>

                <h2 className="font-bold text-lg">
                  {student.fullName}
                </h2>

                <p>{student.email}</p>
                <p>{student.phone}</p>

                <div className="mt-3 space-y-1">

                  {student.studentLevels.map((sl: any) => (
                    <div key={sl.id}>
                      <strong>{sl.trackType}</strong>
                      {" → "}
                      {sl.level.name}
                    </div>
                  ))}

                </div>

              </div>

              <Link
                href={`/admin/students/${student.id}`}
                className="border px-3 py-1 rounded"
              >
                View
              </Link>

            </div>
          </div>

        ))}

      </div>

    </div>
  )
}
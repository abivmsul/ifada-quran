"use client"

import { useEffect, useState } from "react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([])
  const [levels, setLevels] = useState<Level[]>([])

  const [search, setSearch] = useState("")
  const [quranLevel, setQuranLevel] = useState("")
  const [kitabLevel, setKitabLevel] = useState("")

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  )

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
      `/api/admin/attendance?${params.toString()}`
    )

    const data = await res.json()

    setStudents(data)
  }

  async function markAttendance(
    studentId: string,
    status: "PRESENT" | "ABSENT"
  ) {
    const res = await fetch("/api/admin/attendance", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        studentId,
        status,
        date
      })
    })

    if (res.ok) {
      alert("Attendance saved")
    } else {
      alert("Failed to save attendance")
    }
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
        Attendance
      </h1>

      {/* DATE */}
      <div className="mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

        <input
          placeholder="Search student"
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
      <div className="space-y-3">

        {students.length === 0 && (
          <p>No students found.</p>
        )}

        {students.map((student) => (

          <div
            key={student.id}
            className="border p-4 rounded flex justify-between items-center"
          >

            <div>

              <h2 className="font-bold">
                {student.fullName}
              </h2>

              <p>{student.phone}</p>

              <div className="mt-2 space-y-1">

                {student.studentLevels.map((sl: any) => (
                  <div key={sl.id}>
                    <strong>{sl.trackType}</strong>
                    {" → "}
                    {sl.level.name}
                  </div>
                ))}

              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  markAttendance(student.id, "PRESENT")
                }
                className="border px-3 py-1 rounded"
              >
                Present
              </button>

              <button
                onClick={() =>
                  markAttendance(student.id, "ABSENT")
                }
                className="border px-3 py-1 rounded"
              >
                Absent
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}
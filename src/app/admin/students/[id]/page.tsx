"use client"

import { useEffect, useState } from "react"

export default function StudentPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const [student, setStudent] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { id } = await params

      const res = await fetch(`/api/admin/students/${id}`)
      const data = await res.json()

      setStudent(data)
    }

    load()
  }, [params])

  if (!student) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          {student.fullName}
        </h1>

        <p>{student.email}</p>
        <p>{student.phone}</p>
      </div>

      <div>
        <h2 className="font-bold mb-2">Levels</h2>

        {student.studentLevels.map((sl: any) => (
          <div key={sl.id}>
            {sl.trackType} → {sl.level.name}
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-bold mb-2">Attendance</h2>

        {student.attendance.map((a: any) => (
          <div key={a.id}>
            {a.status} — {new Date(a.date).toLocaleDateString()}
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-bold mb-2">Lessons</h2>

        {student.lessons.map((l: any) => (
          <div
            key={l.id}
            className="border p-2 mb-2"
          >
            <p>{l.content}</p>

            {l.notes && (
              <p className="text-sm mt-1">
                {l.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-bold mb-2">Notes</h2>

        {student.notes.map((n: any) => (
          <div
            key={n.id}
            className="border p-2 mb-2"
          >
            {n.text}
          </div>
        ))}
      </div>

    </div>
  )
}
"use client"

import { useEffect, useState } from "react"

export default function ClientPage() {
  const [students, setStudents] = useState<any[]>([])

  async function load() {
    const res = await fetch("/api/admin/pending")
    const data = await res.json()
    setStudents(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function approve(userId: string) {
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
    } else {
      alert(`Approved!\nPassword: ${data.tempPassword}`)
      load()
    }
  }

  return (
    <div className="p-6">
      <h1>Pending Students</h1>

      {students.map((s) => (
        <div key={s.id} className="border p-3 mb-3">
          <p>{s.fullName}</p>
          <p>{s.email}</p>

          <button onClick={() => approve(s.id)}>
            Approve
          </button>
        </div>
      ))}
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

export default function RegisterPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/levels")
      .then(res => res.json())
      .then(setLevels)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const payload = {
      email: form.get("email"),
      fullName: form.get("fullName"),
      phone: form.get("phone"),
      quranLevelId: form.get("quranLevelId"),
      kitabLevelId: form.get("kitabLevelId")
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
    } else {
      alert(data.message)
      e.currentTarget.reset()
    }

    setLoading(false)
  }

  const quranLevels = levels.filter(l => l.trackType === "QURAN")
  const kitabLevels = levels.filter(l => l.trackType === "KITAB")

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Student Registration</h2>

      <input name="fullName" placeholder="Full Name" className="border p-2 w-full" />
      <input name="phone" placeholder="Phone" className="border p-2 w-full" />
      <input name="email" placeholder="Email" className="border p-2 w-full" />

      <select name="quranLevelId" className="border p-2 w-full">
        <option value="">Select Quran Level</option>
        {quranLevels.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      <select name="kitabLevelId" className="border p-2 w-full">
        <option value="">Select Kitab Level</option>
        {kitabLevels.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      <button disabled={loading} className="border px-4 py-2">
        {loading ? "Submitting..." : "Register"}
      </button>
    </form>
  )
}
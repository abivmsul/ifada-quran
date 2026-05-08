// src/app/register/page.tsx

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Mail,
  Phone,
  Sparkles,
  UserRound,
  ScrollText,
  ArrowRight,
  ShieldCheck,
  Layers3,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
  levelOrder: number
  description?: string | null
}

export default function RegisterPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState("")
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    quranLevelId: "",
    kitabLevelId: "",
  })

  async function loadLevels() {
    setLoading(true)
    const res = await fetch("/api/levels")
    const data = await res.json()
    setLevels(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLevels()
  }, [])

  const filteredLevels = useMemo(() => {
    if (!search) return levels

    return levels.filter((level) => {
      const q = search.toLowerCase()
      return (
        level.name.toLowerCase().includes(q) ||
        String(level.levelOrder).includes(q) ||
        (level.description || "").toLowerCase().includes(q)
      )
    })
  }, [levels, search])

  const quranLevels = filteredLevels.filter((l) => l.trackType === "QURAN")
  const kitabLevels = filteredLevels.filter((l) => l.trackType === "KITAB")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Registration failed")
        return
      }

      alert(
        data.message ||
          "Registered successfully. Waiting for admin approval."
      )

      setForm({
        fullName: "",
        phone: "",
        email: "",
        quranLevelId: "",
        kitabLevelId: "",
      })
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setSubmitting(false)
    }
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
                Student Registration
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Register as a Student
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Choose your Quran and Kitab levels. Your registration will be
                submitted for admin approval.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Quran Levels</div>
                <div className="mt-1 text-3xl font-black text-emerald-900">
                  {quranLevels.length}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Kitab Levels</div>
                <div className="mt-1 text-3xl font-black text-amber-600">
                  {kitabLevels.length}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 col-span-2 sm:col-span-1">
                <div className="text-sm text-slate-500">Status</div>
                <div className="mt-1 text-3xl font-black text-emerald-900">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Form */}
          <section className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-emerald-900" />
              <h2 className="text-xl font-bold">Student Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-900 focus-within:bg-white">
                    <UserRound className="h-4 w-4 text-slate-500" />
                    <input
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      placeholder="e.g. Ahmed Ali"
                      className="w-full bg-transparent outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-900 focus-within:bg-white">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="e.g. 09xxxxxxxx"
                      className="w-full bg-transparent outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-900 focus-within:bg-white">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="e.g. student@example.com"
                      className="w-full bg-transparent outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="rounded-[28px] border border-emerald-900/10 bg-slate-50 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-emerald-900" />
                  <h3 className="text-lg font-bold">Choose Levels</h3>
                </div>

                <label className="mb-4 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Search Levels
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by level name or description"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-900"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Quran Level
                    </span>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <select
                        value={form.quranLevelId}
                        onChange={(e) =>
                          setForm({ ...form, quranLevelId: e.target.value })
                        }
                        className="w-full bg-transparent outline-none"
                        required
                      >
                        <option value="">Select Quran level</option>
                        {quranLevels.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Kitab Level
                    </span>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <select
                        value={form.kitabLevelId}
                        onChange={(e) =>
                          setForm({ ...form, kitabLevelId: e.target.value })
                        }
                        className="w-full bg-transparent outline-none"
                        required
                      >
                        <option value="">Select Kitab level</option>
                        {kitabLevels.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
              </div>

              <div className="rounded-[28px] border border-emerald-900/10 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-900" />
                  <div>
                    <h3 className="font-bold text-emerald-900">
                      Approval Required
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      After registration, your request will be reviewed by the admin
                      before your account becomes active.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-70"
                >
                  <ArrowRight className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Register Student"}
                </button>
              </div>
            </form>
          </section>

          {/* Right panel */}
          <section className="space-y-6">
            <div className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Layers3 className="h-5 w-5 text-emerald-900" />
                <h2 className="text-xl font-bold">How It Works</h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Fill in your details
                      </div>
                      <p className="text-sm text-slate-600">
                        Provide name, phone, and email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Select Quran and Kitab levels
                      </div>
                      <p className="text-sm text-slate-600">
                        Choose the starting levels for both tracks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Wait for admin approval
                      </div>
                      <p className="text-sm text-slate-600">
                        Your registration will be reviewed manually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-900" />
                <h2 className="text-xl font-bold">Available Quran Levels</h2>
              </div>

              <div className="space-y-3">
                {loading && <p className="text-sm text-slate-500">Loading levels...</p>}

                {!loading && quranLevels.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No Quran levels found.
                  </p>
                )}

                {quranLevels.map((level) => (
                  <div
                    key={level.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900">{level.name}</div>
                        <div className="text-sm text-slate-500">
                          Order: {level.levelOrder}
                        </div>
                      </div>
                      <BookOpen className="h-5 w-5 text-emerald-900" />
                    </div>
                    {level.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {level.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-bold">Available Kitab Levels</h2>
              </div>

              <div className="space-y-3">
                {loading && <p className="text-sm text-slate-500">Loading levels...</p>}

                {!loading && kitabLevels.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No Kitab levels found.
                  </p>
                )}

                {kitabLevels.map((level) => (
                  <div
                    key={level.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900">{level.name}</div>
                        <div className="text-sm text-slate-500">
                          Order: {level.levelOrder}
                        </div>
                      </div>
                      <ScrollText className="h-5 w-5 text-amber-600" />
                    </div>
                    {level.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {level.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
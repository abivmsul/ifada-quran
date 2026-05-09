// src/app/register/page.tsx

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  ScrollText,
  Users,
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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState("")
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    isSponsored: false,
    emergencyContactName: "",
    emergencyContactPhone: "",
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

    const q = search.toLowerCase()
    return levels.filter(
      (level) =>
        level.name.toLowerCase().includes(q) ||
        String(level.levelOrder).includes(q) ||
        (level.description || "").toLowerCase().includes(q)
    )
  }, [levels, search])

  const quranLevels = filteredLevels.filter((l) => l.trackType === "QURAN")
  const kitabLevels = filteredLevels.filter((l) => l.trackType === "KITAB")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, type } = e.target
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          quranLevelId: form.quranLevelId || null,
          kitabLevelId: form.kitabLevelId || null,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        alert(data?.error || "Registration failed")
        return
      }

      alert(
        data?.message ||
          "Registered successfully. Waiting for admin approval."
      )

      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        isSponsored: false,
        emergencyContactName: "",
        emergencyContactPhone: "",
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
    <main className="bg-[#f7f7f2] space-y-6 p-4 text-slate-900 sm:p-6 lg:p-8">
      {/* HEADER */}
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Student Registration
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Register as a Student
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Fill in your details, choose Quran and Kitab tracks if needed, and
              submit your application for approval.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <BookOpen className="h-6 w-6 text-emerald-700" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Quran Levels</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {quranLevels.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <ScrollText className="h-6 w-6 text-emerald-700" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Kitab Levels</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {kitabLevels.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-span-2 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                  <CheckCircle2 className="h-6 w-6 text-amber-700" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    Pending
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <User className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Basic Information
                </h2>
                <p className="text-sm text-slate-500">
                  Your personal details
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="09xxxxxxxx"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* EMERGENCY */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Emergency Contact
                </h2>
                <p className="text-sm text-slate-500">
                  Parent or guardian information
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Guardian name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="09xxxxxxxx"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* TRACKS */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <GraduationCap className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Learning Tracks
                </h2>
                <p className="text-sm text-slate-500">
                  You may register for Quran only, Kitab only, or both
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Quran */}
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900">Quran Track</h3>
                </div>

                <select
                  name="quranLevelId"
                  value={form.quranLevelId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                >
                  <option value="">No Quran Registration</option>
                  {quranLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>

                <p className="mt-3 text-sm text-slate-500">
                  Optional. Leave blank if the student is not joining Quran yet.
                </p>
              </div>

              {/* Kitab */}
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900">Kitab Track</h3>
                </div>

                <select
                  name="kitabLevelId"
                  value={form.kitabLevelId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                >
                  <option value="">No Kitab Registration</option>
                  {kitabLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>

                <p className="mt-3 text-sm text-slate-500">
                  Optional. Leave blank if the student is not joining Kitab yet.
                </p>
              </div>
            </div>
          </section>

          {/* SPONSORSHIP */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                  <CheckCircle2 className="h-6 w-6 text-amber-700" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Sponsorship
                  </h2>
                  <p className="text-sm text-slate-500">
                    Mark whether this student is sponsored
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3">
                <input
                  type="checkbox"
                  name="isSponsored"
                  checked={form.isSponsored}
                  onChange={handleChange}
                  className="h-5 w-5 accent-emerald-700"
                />
                <span className="font-semibold text-slate-700">
                  Sponsored Student
                </span>
              </label>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 rounded-2xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              <UserPlus className="h-5 w-5" />
              {submitting ? "Submitting..." : "Register Student"}
            </button>
          </div>
        </form>

        {/* RIGHT SIDE */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Users className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Registration Notes
                </h2>
                <p className="text-sm text-slate-500">
                  What happens after submission
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Public student registration
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Students can register themselves and the request will stay
                  pending until approved by the admin.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Optional tracks
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A student may select only Quran, only Kitab, or both.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Sponsorship and contact info
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You can include sponsorship status, address, and emergency
                  contact details.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Search className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Browse Levels
                </h2>
                <p className="text-sm text-slate-500">
                  Search available learning levels
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search level name or order"
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading levels...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                    Quran Levels
                  </h3>

                  <div className="space-y-3">
                    {quranLevels.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No Quran levels found.
                      </p>
                    )}

                    {quranLevels.map((level) => (
                      <div
                        key={level.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="font-bold text-slate-900">
                          {level.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Order: {level.levelOrder}
                        </p>
                        {level.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {level.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                    Kitab Levels
                  </h3>

                  <div className="space-y-3">
                    {kitabLevels.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No Kitab levels found.
                      </p>
                    )}

                    {kitabLevels.map((level) => (
                      <div
                        key={level.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="font-bold text-slate-900">
                          {level.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Order: {level.levelOrder}
                        </p>
                        {level.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {level.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  )
}
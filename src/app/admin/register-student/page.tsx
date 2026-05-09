"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  GraduationCap,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  UserPlus,
  Mail,
  CheckCircle2,
} from "lucide-react"

type Level = {
  id: string
  name: string
  trackType: "QURAN" | "KITAB"
}

export default function AdminRegisterStudentPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(false)

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
    const res = await fetch("/api/levels")
    const data = await res.json()
    setLevels(data)
  }

  useEffect(() => {
    loadLevels()
  }, [])

  const quranLevels = useMemo(
    () => levels.filter((l) => l.trackType === "QURAN"),
    [levels]
  )

  const kitabLevels = useMemo(
    () => levels.filter((l) => l.trackType === "KITAB"),
    [levels]
  )

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    try {
      const res = await fetch("/api/admin/register-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,

          // allow optional levels
          quranLevelId: form.quranLevelId || null,
          kitabLevelId: form.kitabLevelId || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to register student")
        return
      }

      alert("Student registered successfully")

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
      setLoading(false)
    }
  }

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Register Student
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Add a new student directly into the system with approved access.
            </p>
          </div>

          <div className="w-full max-w-xs rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <UserPlus className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Student Registration
                </p>

                <h2 className="text-2xl font-black text-slate-900">
                  Admin Access
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* BASIC INFO */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <User className="h-6 w-6 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Basic Information
              </h2>

              <p className="text-sm text-slate-500">
                Student personal details
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* FULL NAME */}
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
                  placeholder="Student full name"
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* EMAIL */}
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
                  placeholder="student@email.com"
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* PHONE */}
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

            {/* ADDRESS */}
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
                  placeholder="Addis Ababa"
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* EMERGENCY */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
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
                placeholder="Guardian full name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
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
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
              />
            </div>
          </div>
        </section>

        {/* LEVELS */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <GraduationCap className="h-6 w-6 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Learning Tracks
              </h2>

              <p className="text-sm text-slate-500">
                Students may register for Quran only, Kitab only, or both
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* QURAN */}
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-700" />

                <h3 className="font-bold text-slate-900">
                  Quran Track
                </h3>
              </div>

              <select
                name="quranLevelId"
                value={form.quranLevelId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
              >
                <option value="">
                  No Quran Registration
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
            </div>

            {/* KITAB */}
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-700" />

                <h3 className="font-bold text-slate-900">
                  Kitab Track
                </h3>
              </div>

              <select
                name="kitabLevelId"
                value={form.kitabLevelId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
              >
                <option value="">
                  No Kitab Registration
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
          </div>
        </section>

        {/* SPONSORSHIP */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-5">
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

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 cursor-pointer">
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
            disabled={loading}
            className="flex items-center gap-3 rounded-2xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            <Save className="h-5 w-5" />

            {loading
              ? "Registering..."
              : "Register Student"}
          </button>
        </div>
      </form>
    </main>
  )
}
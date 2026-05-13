"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BadgeCheck,
  Building2,
  Edit3,
  Filter,
  HandCoins,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"

type Sponsor = {
  id: string
  name: string
  type: "INDIVIDUAL" | "ORGANIZATION" | "FOUNDATION" | "FAMILY" | "OTHER"
  phone: string | null
  email: string | null
  notes: string | null
  status: "ACTIVE" | "INACTIVE"
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  name: "",
  type: "INDIVIDUAL" as Sponsor["type"],
  phone: "",
  email: "",
  notes: "",
  status: "ACTIVE" as Sponsor["status"],
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  async function loadSponsors() {
    setLoading(true)

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (typeFilter) params.set("type", typeFilter)
    if (statusFilter) params.set("status", statusFilter)

    const res = await fetch(`/api/admin/sponsors?${params.toString()}`)
    const data = await res.json()

    setSponsors(data)
    setLoading(false)
  }

  useEffect(() => {
    loadSponsors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter, statusFilter])

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function startEdit(sponsor: Sponsor) {
    setEditingId(sponsor.id)
    setForm({
      name: sponsor.name,
      type: sponsor.type,
      phone: sponsor.phone || "",
      email: sponsor.email || "",
      notes: sponsor.notes || "",
      status: sponsor.status,
    })
    setShowForm(true)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingId
        ? `/api/admin/sponsors/${editingId}`
        : "/api/admin/sponsors"

      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        alert(data?.error || "Failed to save sponsor")
        return
      }

      setShowForm(false)
      setForm(emptyForm)
      setEditingId(null)
      await loadSponsors()
      alert(editingId ? "Sponsor updated" : "Sponsor created")
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function deleteSponsor(id: string) {
    const confirmed = confirm("Delete this sponsor?")
    if (!confirmed) return

    const res = await fetch(`/api/admin/sponsors/${id}`, {
      method: "DELETE",
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      alert(data?.error || "Failed to delete sponsor")
      return
    }

    await loadSponsors()
  }

  const activeCount = useMemo(
    () => sponsors.filter((s) => s.status === "ACTIVE").length,
    [sponsors]
  )

  return (
    <main className="space-y-6 p-4 text-slate-900 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Sponsors
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Manage student sponsors, organizations, and funding partners.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <HandCoins className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {sponsors.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <BadgeCheck className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {activeCount}
                  </h2>
                </div>
              </div>
            </div>

            <button
              onClick={startCreate}
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-4 font-bold text-white transition hover:bg-emerald-800 sm:col-span-1"
            >
              <Plus className="h-5 w-5" />
              Add Sponsor
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Types</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="ORGANIZATION">Organization</option>
            <option value="FOUNDATION">Foundation</option>
            <option value="FAMILY">Family</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
          Loading sponsors...
        </div>
      ) : sponsors.length === 0 ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Building2 className="h-10 w-10 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No Sponsors</h2>
          <p className="mt-2 text-slate-600">
            Add your first sponsor to start assigning sponsored students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                      <Building2 className="h-8 w-8" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black">{sponsor.name}</h2>
                      <p className="text-emerald-50">{sponsor.type}</p>
                    </div>
                  </div>

                  <div>
                    {sponsor.status === "ACTIVE" ? (
                      <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                        Active
                      </div>
                    ) : (
                      <div className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950">
                        Inactive
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="font-bold text-slate-900">
                      {sponsor.phone || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="font-bold text-slate-900">
                      {sponsor.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Notes</span>
                  </div>
                  <p className="leading-7 text-slate-700">
                    {sponsor.notes || "No notes"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    onClick={() => startEdit(sponsor)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <Edit3 className="h-5 w-5" />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteSponsor(sponsor.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-bold text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingId ? "Edit Sponsor" : "Add Sponsor"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create or update sponsor details
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Sponsor Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Sponsor Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="ORGANIZATION">Organization</option>
                    <option value="FOUNDATION">Foundation</option>
                    <option value="FAMILY">Family</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                >
                  <Plus className="h-5 w-5" />
                  {saving ? "Saving..." : editingId ? "Update Sponsor" : "Create Sponsor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
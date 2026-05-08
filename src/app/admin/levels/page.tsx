"use client"

import { useEffect, useState } from "react"

export default function LevelsPage() {

  const [levels, setLevels] = useState<any[]>([])

  const [form, setForm] = useState({
    name: "",
    trackType: "QURAN",
    levelOrder: "",
    description: ""
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  async function loadLevels() {

    const res = await fetch(
      "/api/admin/levels"
    )

    const data = await res.json()

    setLevels(data)
  }

  useEffect(() => {
    loadLevels()
  }, [])

  async function handleSubmit(e: any) {

    e.preventDefault()

    const method = editingId
      ? "PUT"
      : "POST"

    const url = editingId
      ? `/api/admin/levels/${editingId}`
      : "/api/admin/levels"

    const res = await fetch(url, {

      method,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(form)
    })

    if (res.ok) {

      setForm({
        name: "",
        trackType: "QURAN",
        levelOrder: "",
        description: ""
      })

      setEditingId(null)

      loadLevels()
    }
  }

  async function deleteLevel(id: string) {

    const confirmed = confirm(
      "Delete this level?"
    )

    if (!confirmed) return

    const res = await fetch(
      `/api/admin/levels/${id}`,
      {
        method: "DELETE"
      }
    )

    if (res.ok) {
      loadLevels()
    }
  }

  function editLevel(level: any) {

    setEditingId(level.id)

    setForm({
      name: level.name,
      trackType: level.trackType,
      levelOrder: String(level.levelOrder),
      description: level.description || ""
    })
  }

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold">
        Level Management
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="border rounded p-4 space-y-4"
      >

        <input
          placeholder="Level Name"
          className="border p-2 rounded w-full"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <select
          className="border p-2 rounded w-full"
          value={form.trackType}
          onChange={(e) =>
            setForm({
              ...form,
              trackType: e.target.value
            })
          }
        >

          <option value="QURAN">
            Quran
          </option>

          <option value="KITAB">
            Kitab
          </option>

        </select>

        <input
          type="number"
          placeholder="Level Order"
          className="border p-2 rounded w-full"
          value={form.levelOrder}
          onChange={(e) =>
            setForm({
              ...form,
              levelOrder: e.target.value
            })
          }
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded w-full"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />

        <button
          className="bg-black text-white px-4 py-2 rounded"
        >
          {editingId
            ? "Update Level"
            : "Create Level"}
        </button>

      </form>

      {/* LEVEL LIST */}
      <div className="space-y-6">

        {/* QURAN */}
        <div>

          <h2 className="text-2xl font-bold mb-4">
            Quran Levels
          </h2>

          <div className="space-y-3">

            {levels
              .filter(
                (l) => l.trackType === "QURAN"
              )
              .map((level) => (

                <div
                  key={level.id}
                  className="border rounded p-4 flex justify-between items-start"
                >

                  <div>

                    <h3 className="font-bold">
                      {level.name}
                    </h3>

                    <p>
                      Order: {level.levelOrder}
                    </p>

                    {level.description && (
                      <p className="text-sm mt-2">
                        {level.description}
                      </p>
                    )}

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        editLevel(level)
                      }
                      className="border px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteLevel(level.id)
                      }
                      className="border px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

          </div>

        </div>

        {/* KITAB */}
        <div>

          <h2 className="text-2xl font-bold mb-4">
            Kitab Levels
          </h2>

          <div className="space-y-3">

            {levels
              .filter(
                (l) => l.trackType === "KITAB"
              )
              .map((level) => (

                <div
                  key={level.id}
                  className="border rounded p-4 flex justify-between items-start"
                >

                  <div>

                    <h3 className="font-bold">
                      {level.name}
                    </h3>

                    <p>
                      Order: {level.levelOrder}
                    </p>

                    {level.description && (
                      <p className="text-sm mt-2">
                        {level.description}
                      </p>
                    )}

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        editLevel(level)
                      }
                      className="border px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteLevel(level.id)
                      }
                      className="border px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

          </div>

        </div>

      </div>

    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import {
  X,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react"

type Attendance = {
  id: string
  status: "PRESENT" | "ABSENT"
  date: string
}

export default function AttendanceModal({
  studentId,
  open,
  onClose,
}: {
  studentId: string
  open: boolean
  onClose: () => void
}) {
  const [data, setData] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    const fetchData = async () => {
      setLoading(true)
      const res = await fetch(
        `/api/admin/students/${studentId}/attendance`
      )
      const json = await res.json()
      setData(json)
      setLoading(false)
    }

    fetchData()
  }, [open, studentId])

  if (!open) return null

  const present = data.filter((a) => a.status === "PRESENT").length
  const absent = data.filter((a) => a.status === "ABSENT").length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-900" />
            <h2 className="text-xl font-bold">Attendance History</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-4">
            Present: <span className="font-bold">{present}</span>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            Absent: <span className="font-bold">{absent}</span>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[400px] space-y-3 overflow-y-auto">
          {loading && (
            <div className="text-slate-500">Loading...</div>
          )}

          {!loading && data.length === 0 && (
            <div className="text-slate-500">
              No attendance records
            </div>
          )}

          {data.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-2xl border bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                {a.status === "PRESENT" ? (
                  <CheckCircle2 className="text-emerald-700" />
                ) : (
                  <XCircle className="text-rose-600" />
                )}

                <div className="font-semibold">
                  {a.status}
                </div>
              </div>

              <div className="text-sm text-slate-500">
                {new Date(a.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4">

        <Link
          href="/admin/pending"
          className="border p-4 rounded"
        >
          Pending Students
        </Link>

        <Link
          href="/admin/students"
          className="border p-4 rounded"
        >
          Active Students
        </Link>

        <Link
          href="/admin/attendance"
          className="border p-4 rounded"
        >
          Attendance
        </Link>

        <Link
          href="/admin/lessons"
          className="border p-4 rounded"
        >
          Lessons
        </Link>
        <Link
          href="/admin/levels"
          className="border p-4 rounded"
        >
          Levels
        </Link>

      </div>
    </div>
  )
}
"use client"

import Link from "next/link"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  Layers3,
  CheckCircle2,
  GraduationCap,
  LogOut,
  ScrollText,
  MoonStar,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  UserPlus,
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [studentsOpen, setStudentsOpen] = useState(true)

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[#f7f7f2] text-slate-900">
      {/* Mobile top strip */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-emerald-900/10 bg-white px-4 py-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-amber-400/30 bg-white">
            <Image
              src="/ifada-logo.png"
              alt="Ifada Qirat"
              fill
              className="object-contain p-1"
            />
          </div>

          <div>
            <div className="text-sm font-black text-emerald-900">
              ኢፋዳ የቁርዓን ማዕከል
            </div>
            <div className="text-xs text-slate-500">Admin Dashboard</div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-sm"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-screen">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-[300px] flex-col border-r border-emerald-900/10 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar header */}
          <div className="border-b border-emerald-900/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-amber-400/30 bg-white shadow-md">
                  <Image
                    src="/ifada-logo.png"
                    alt="Ifada Qirat"
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div>
                  <div className="text-lg font-black leading-tight text-emerald-900">
                    ኢፋዳ የቁርዓን ማዕከል
                  </div>
                  <div className="text-sm font-bold text-amber-600">
                    Ifada Qirat Center
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MoonStar className="h-3 w-3" />
                    የኢፋዳ ቂርዓት ማዕከል ተማሪዎች
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 lg:hidden"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sidebar navigation */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Main Navigation
            </div>

            <nav className="space-y-2">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
                  isActive("/admin") && pathname === "/admin"
                    ? "bg-emerald-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    isActive("/admin") && pathname === "/admin"
                      ? "bg-white/10"
                      : "bg-emerald-50 group-hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="font-bold">Dashboard</span>
              </Link>

              {/* Students dropdown */}
              <div className="rounded-3xl border border-emerald-900/10 bg-slate-50 p-2">
                <button
                  onClick={() => setStudentsOpen(!studentsOpen)}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-900 text-white">
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="font-bold text-slate-900">Students</div>
                      <div className="text-xs text-slate-500">
                        Manage all students
                      </div>
                    </div>
                  </div>

                  {studentsOpen ? (
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  )}
                </button>

                {studentsOpen && (
                  <div className="mt-2 space-y-1 pl-2">
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        pathname === "/register"
                          ? "bg-white text-emerald-900"
                          : "text-slate-700 hover:bg-white"
                      }`}
                    >
                      <UserPlus className="h-4 w-4 text-emerald-900" />
                      Register Student
                    </Link>

                    <Link
                      href="/admin/students"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        pathname.startsWith("/admin/students")
                          ? "bg-white text-emerald-900"
                          : "text-slate-700 hover:bg-white"
                      }`}
                    >
                      <Users className="h-4 w-4 text-emerald-900" />
                      Active Students
                    </Link>

                    <Link
                      href="/admin/pending"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        pathname === "/admin/pending"
                          ? "bg-white text-emerald-900"
                          : "text-slate-700 hover:bg-white"
                      }`}
                    >
                      <ClipboardCheck className="h-4 w-4 text-amber-600" />
                      Pending Students
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/admin/attendance"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
                  pathname.startsWith("/admin/attendance")
                    ? "bg-emerald-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    pathname.startsWith("/admin/attendance")
                      ? "bg-white/10"
                      : "bg-emerald-50 group-hover:bg-white/10"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="font-bold">Attendance</span>
              </Link>

              <Link
                href="/admin/lessons"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
                  pathname.startsWith("/admin/lessons")
                    ? "bg-emerald-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    pathname.startsWith("/admin/lessons")
                      ? "bg-white/10"
                      : "bg-emerald-50 group-hover:bg-white/10"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-bold">Lessons</span>
              </Link>

              <Link
                href="/admin/levels"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
                  pathname.startsWith("/admin/levels")
                    ? "bg-emerald-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    pathname.startsWith("/admin/levels")
                      ? "bg-white/10"
                      : "bg-emerald-50 group-hover:bg-white/10"
                  }`}
                >
                  <Layers3 className="h-5 w-5" />
                </div>
                <span className="font-bold">Levels</span>
              </Link>

              <Link
                href="/admin/promotions"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
                  pathname.startsWith("/admin/promotions")
                    ? "bg-emerald-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    pathname.startsWith("/admin/promotions")
                      ? "bg-white/10"
                      : "bg-emerald-50 group-hover:bg-white/10"
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-bold">Promotions</span>
              </Link>
            </nav>
          </div>

          {/* Sidebar footer */}
          {/* <div className="p-5">
            <div className="rounded-[28px] bg-gradient-to-br from-emerald-900 to-emerald-700 p-5 text-white shadow-xl">
              <div className="inline-flex rounded-full bg-white/10 p-3">
                <ScrollText className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-black">Knowledge & Discipline</h3>

              <p className="mt-2 text-sm leading-7 text-emerald-100">
                Manage Quran, Kitab, attendance, lessons, and student progress beautifully.
              </p>

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-emerald-900 transition hover:bg-amber-400 hover:text-white">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div> */}
        </aside>

        {/* Content area */}
        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
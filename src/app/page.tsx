// import Link from "next/link"
// import Image from "next/image"
// import { prisma } from "@/lib/prisma"

// export const dynamic = "force-dynamic"

// export default async function HomePage() {
//   const now = new Date()
//   const startOfDay = new Date(now)
//   startOfDay.setHours(0, 0, 0, 0)

//   const endOfDay = new Date(now)
//   endOfDay.setHours(23, 59, 59, 999)

//   const [
//     activeStudents,
//     pendingStudents,
//     totalLevels,
//     totalLessons,
//     todayAttendance,
//     quranStudents,
//     kitabStudents,
//     recentStudents,
//     recentLessons,
//   ] = await Promise.all([
//     prisma.user.count({
//       where: { role: "STUDENT", status: "ACTIVE" },
//     }),
//     prisma.user.count({
//       where: { role: "STUDENT", status: "PENDING" },
//     }),
//     prisma.level.count(),
//     prisma.lesson.count(),
//     prisma.attendance.count({
//       where: {
//         date: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//     }),
//     prisma.user.count({
//       where: {
//         role: "STUDENT",
//         status: "ACTIVE",
//         studentLevels: {
//           some: { trackType: "QURAN" },
//         },
//       },
//     }),
//     prisma.user.count({
//       where: {
//         role: "STUDENT",
//         status: "ACTIVE",
//         studentLevels: {
//           some: { trackType: "KITAB" },
//         },
//       },
//     }),
//     prisma.user.findMany({
//       where: {
//         role: "STUDENT",
//         status: "ACTIVE",
//       },
//       include: {
//         studentLevels: {
//           include: {
//             level: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: 6,
//     }),
//     prisma.lesson.findMany({
//       include: {
//         student: {
//           select: {
//             fullName: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "desc",
//       },
//       take: 6,
//     }),
//   ])

//   const stats = [
//     { label: "Active Students", value: activeStudents.toString(), accent: "text-emerald-900" },
//     { label: "Pending Approvals", value: pendingStudents.toString(), accent: "text-amber-600" },
//     { label: "Quran Students", value: quranStudents.toString(), accent: "text-emerald-900" },
//     { label: "Kitab Students", value: kitabStudents.toString(), accent: "text-amber-600" },
//     { label: "Total Levels", value: totalLevels.toString(), accent: "text-emerald-900" },
//     { label: "Lessons Recorded", value: totalLessons.toString(), accent: "text-amber-600" },
//   ]

//   return (
//     <main className="min-h-screen bg-[#f7f8f4] text-slate-900">
//       <section className="relative overflow-hidden bg-white">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,101,52,0.10),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(217,164,74,0.12),_transparent_30%)]" />
//         <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
//           <div>
//             <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm">
//               <span className="text-amber-500">★</span>
//               Madrasa Management System
//             </div>

//             <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
//               Manage Your Madrasa
//               <span className="block text-emerald-900">with Excellence</span>
//             </h1>

//             <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
//               A complete solution to manage Quran students, Kitab students,
//               attendance, lessons, levels, promotions, and reports in one place.
//             </p>

//             <div className="mt-10 flex flex-wrap gap-4">
//               <Link
//                 href="/admin/students"
//                 className="rounded-2xl bg-emerald-900 px-6 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-800"
//               >
//                 Go to Dashboard
//               </Link>

//               <Link
//                 href="/register"
//                 className="rounded-2xl border border-emerald-900/25 bg-white px-6 py-4 font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
//               >
//                 Register Student
//               </Link>
//             </div>

//             <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
//               {stats.slice(0, 6).map((item) => (
//                 <div
//                   key={item.label}
//                   className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm"
//                 >
//                   <div className={`text-2xl font-black ${item.accent}`}>
//                     {item.value}
//                   </div>
//                   <div className="mt-1 text-sm text-slate-600">{item.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative">
//             <div className="relative overflow-hidden rounded-[32px] border border-emerald-900/10 bg-white shadow-2xl">
//               <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="relative h-11 w-11 overflow-hidden rounded-full border border-amber-500/20">
//                     <Image
//                       src="/ifada-logo.png"
//                       alt="Ifada Qirat Center"
//                       fill
//                       className="object-contain p-1"
//                     />
//                   </div>

//                   <div>
//                     <div className="text-sm font-bold text-emerald-900">
//                       IFADA QIRAT CENTER
//                     </div>
//                     <div className="text-xs text-slate-500">
//                       Dashboard Preview
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
//                   Live
//                 </div>
//               </div>

//               <div className="grid gap-4 p-5 sm:grid-cols-2">
//                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
//                   <div className="text-sm text-slate-500">Active Students</div>
//                   <div className="mt-2 text-3xl font-black text-emerald-900">
//                     {activeStudents}
//                   </div>
//                 </div>

//                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
//                   <div className="text-sm text-slate-500">Pending Approvals</div>
//                   <div className="mt-2 text-3xl font-black text-amber-600">
//                     {pendingStudents}
//                   </div>
//                 </div>

//                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
//                   <div className="text-sm text-slate-500">Lessons Recorded</div>
//                   <div className="mt-2 text-3xl font-black text-emerald-900">
//                     {totalLessons}
//                   </div>
//                 </div>

//                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
//                   <div className="text-sm text-slate-500">Attendance Today</div>
//                   <div className="mt-2 text-3xl font-black text-amber-600">
//                     {todayAttendance}
//                   </div>
//                 </div>
//               </div>

//               <div className="px-5 pb-5">
//                 <div className="rounded-3xl border border-slate-200 bg-white p-5">
//                   <div className="mb-4 flex items-center justify-between">
//                     <h2 className="font-bold text-slate-900">Recent Lessons</h2>
//                     <span className="text-xs font-semibold text-emerald-900">
//                       Quran & Kitab
//                     </span>
//                   </div>

//                   <div className="space-y-3">
//                     {recentLessons.map((lesson) => (
//                       <div
//                         key={lesson.id}
//                         className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
//                       >
//                         <div>
//                           <div className="font-semibold text-slate-900">
//                             {lesson.student.fullName}
//                           </div>
//                           <div className="text-sm text-slate-500">
//                             {lesson.content}
//                           </div>
//                         </div>

//                         <div
//                           className={`rounded-full px-3 py-1 text-xs font-bold ${
//                             lesson.trackType === "QURAN"
//                               ? "bg-emerald-100 text-emerald-900"
//                               : "bg-amber-100 text-amber-700"
//                           }`}
//                         >
//                           {lesson.trackType}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
//         <div className="max-w-2xl">
//           <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
//             Everything Your Madrasa Needs
//           </h2>
//           <p className="mt-4 text-lg text-slate-600">
//             Built for Quran and Kitab education with a clean workflow for daily management.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//           {[
//             {
//               title: "Student Registration",
//               text: "Students apply and choose Quran and Kitab levels during registration.",
//             },
//             {
//               title: "Level Management",
//               text: "Create, edit, and organize Quran and Kitab levels with ease.",
//             },
//             {
//               title: "Attendance Tracking",
//               text: "Mark attendance daily and filter by track, level, or student.",
//             },
//             {
//               title: "Lesson Recording",
//               text: "Record Quran ayahs, Kitab chapters, homework, and notes.",
//             },
//             {
//               title: "Student Promotion",
//               text: "Promote students between levels while preserving history.",
//             },
//             {
//               title: "Admin Dashboard",
//               text: "Manage pending students, active students, attendance, and lessons.",
//             },
//           ].map((feature) => (
//             <div
//               key={feature.title}
//               className="rounded-[28px] border border-emerald-900/10 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
//             >
//               <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-700" />
//               <h3 className="text-xl font-bold">{feature.title}</h3>
//               <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="border-y border-emerald-900/10 bg-white">
//         <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
//           <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
//             <div className="max-w-2xl">
//               <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
//                 Recent Students
//               </h2>
//               <p className="mt-4 text-lg text-slate-600">
//                 Live student data from your system.
//               </p>
//             </div>

//             <Link
//               href="/admin/students"
//               className="inline-flex h-fit rounded-2xl bg-emerald-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
//             >
//               View All Students
//             </Link>
//           </div>

//           <div className="mt-10 grid gap-5 lg:grid-cols-2">
//             {recentStudents.map((student) => {
//               const quranLevel = student.studentLevels.find(
//                 (sl) => sl.trackType === "QURAN"
//               )
//               const kitabLevel = student.studentLevels.find(
//                 (sl) => sl.trackType === "KITAB"
//               )

//               return (
//                 <div
//                   key={student.id}
//                   className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm"
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <div>
//                       <h3 className="text-xl font-bold text-slate-900">
//                         {student.fullName}
//                       </h3>
//                       <p className="mt-1 text-sm text-slate-500">{student.email}</p>
//                       <p className="text-sm text-slate-500">{student.phone}</p>
//                     </div>

//                     <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
//                       {student.status}
//                     </div>
//                   </div>

//                   <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                     <div className="rounded-2xl bg-white p-4">
//                       <div className="text-xs font-semibold uppercase text-slate-500">
//                         Quran Level
//                       </div>
//                       <div className="mt-1 font-bold text-emerald-900">
//                         {quranLevel?.level?.name || "Not assigned"}
//                       </div>
//                     </div>

//                     <div className="rounded-2xl bg-white p-4">
//                       <div className="text-xs font-semibold uppercase text-slate-500">
//                         Kitab Level
//                       </div>
//                       <div className="mt-1 font-bold text-amber-600">
//                         {kitabLevel?.level?.name || "Not assigned"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </section>

//       <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
//         <div className="rounded-[36px] bg-emerald-900 px-8 py-12 text-white shadow-2xl lg:px-14">
//           <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
//                 <span className="text-amber-400">◆</span>
//                 Knowledge is Light
//               </div>

//               <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
//                 Empowering Islamic education through organization and technology.
//               </h2>

//               <p className="mt-4 max-w-2xl text-lg leading-8 text-emerald-50/85">
//                 Ifada Qirat Center helps you manage Quran and Kitab learning in one place,
//                 from registration to attendance to promotions.
//               </p>
//             </div>

//             <div className="rounded-[28px] bg-white p-6 text-slate-900 shadow-lg">
//               <div className="flex items-center gap-4">
//                 <div className="relative h-16 w-16 overflow-hidden rounded-full border border-amber-500/20">
//                   <Image
//                     src="/ifada-logo.png"
//                     alt="Ifada Qirat Center"
//                     fill
//                     className="object-contain p-1"
//                   />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-emerald-900">
//                     IFADA QIRAT CENTER
//                   </div>
//                   <div className="text-sm text-slate-500">
//                     Building better students, building better Ummah.
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 gap-4">
//                 <div className="rounded-2xl bg-slate-50 p-4">
//                   <div className="text-sm text-slate-500">Students</div>
//                   <div className="mt-1 text-2xl font-black text-emerald-900">
//                     {activeStudents}
//                   </div>
//                 </div>
//                 <div className="rounded-2xl bg-slate-50 p-4">
//                   <div className="text-sm text-slate-500">Attendance</div>
//                   <div className="mt-1 text-2xl font-black text-amber-600">
//                     {todayAttendance}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
//         <div className="rounded-[32px] border border-emerald-900/10 bg-white p-8 text-center shadow-sm">
//           <h2 className="text-3xl font-black tracking-tight">
//             Start managing your madrasa better
//           </h2>
//           <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
//             Organize Quran students, Kitab students, attendance, lessons, and promotions in one modern platform.
//           </p>

//           <div className="mt-8 flex flex-wrap justify-center gap-4">
//             <Link
//               href="/register"
//               className="rounded-2xl bg-emerald-900 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
//             >
//               Register Student
//             </Link>

//             <Link
//               href="/admin/students"
//               className="rounded-2xl border border-emerald-900/20 bg-white px-6 py-4 font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
//             >
//               Open Dashboard
//             </Link>
//           </div>
//         </div>
//       </section>

//       <footer className="border-t border-emerald-900/10 bg-white">
//         <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
//           <p>© {new Date().getFullYear()} Ifada Qirat Center</p>
//           <p>Developed by <a href="https://github.com/abdulrahmanm">Abivmsul</a></p>
//         </div>
//       </footer>
//     </main>
//   )
// }

// src/app/page.tsx

import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  GraduationCap,
  Users,
  ClipboardCheck,
  Layers3,
  Sparkles,
  ArrowRight,
  BookMarked,
  Building,
  ScrollText,
} from "lucide-react"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [
    activeStudents,
    pendingStudents,
    totalLevels,
    totalLessons,
    totalAttendance,
    recentStudents,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
      },
    }),

    prisma.user.count({
      where: {
        role: "STUDENT",
        status: "PENDING",
      },
    }),

    prisma.level.count(),

    prisma.lesson.count(),

    prisma.attendance.count(),

    prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      include: {
        studentLevels: {
          include: {
            level: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ])

  const stats = [
    {
      title: "Active Students",
      value: activeStudents,
      icon: Users,
      color: "text-emerald-900",
      bg: "bg-emerald-50",
    },
    {
      title: "Pending Approvals",
      value: pendingStudents,
      icon: ClipboardCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Levels",
      value: totalLevels,
      icon: Layers3,
      color: "text-emerald-900",
      bg: "bg-emerald-50",
    },
    {
      title: "Lessons",
      value: totalLessons,
      icon: BookOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  const features = [
    {
      title: "የቁርአን ክትትል",
      text: "የቁርአን ሂፍዝን፣ የተጅዊድ ትምህርቶችን እና የተማሪዎችን የቁርአን እድገት በቀላሉ ይከታተሉ።",
      icon: BookMarked,
    },
    {
      title: "የኪታብ ትምህርት",
      text: "የኪታብ ትምህርቶችን በየደረጃው ያደራጁ፤ የተማሪዎችንም የትምህርት ለውጥ ይከታተሉ።",
      icon: ScrollText,
    },
    {
      title: "Attendance",
      text: "Rየተማሪዎችን የዕለት ተዕለት የትምህርት ክትትል ይመዝግቡ፤ እንዲሁም በየፈርጁ የተከፋፈሉ ሪፖርቶች",
      icon: ClipboardCheck,
    },
    {
      title: "የተማሪዎች ደረጃ እድገት",
      text: "ተማሪዎችን ከቁርአን ወደ ኪታብ እንዲሁም በተለያዩ የትምህርት ደረጃዎች መካከል ያለምንም እንክፋት ያሸጋግሩ።",
      icon: GraduationCap,
    },
    {
      title: "Lesson Recording",
      text: "የትምህርት ማስታወሻዎችን፣ የተሸፈኑ ገጾችን እና አጠቃላይ የትምህርት ሂደቱን ታሪክ በአንድ ቦታ ያስቀምጡ።",
      icon: BookOpen,
    },
    {
      title: "Islamic Environment",
      text: "ለኢስላማዊ የትምህርት ማእከላት ተብሎ ለየት ባለ ሁኔታ የተነደፈ",
      icon: Building,
    },
  ]

  return (
    <main className="min-h-screen bg-[#f7f7f2]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('/pattern.png')]" />

        {/* Glow */}
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-200 blur-3xl opacity-30" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-amber-200 blur-3xl opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                IFADA QIRAT CENTER
              </div>

              <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl">
                የኢፋዳ ቂርዓት ማዕከል
                <span className="block text-emerald-900">
                  Management System
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                የቁርአን ተማሪዎችን፣ የኪታብ ትምህርቶችን፣ የትምህርት ክትትልን፣ የቀጥታ ስርጭቶችን እና የደረጃ እድገቶችን በአንድ ማራኪ ሲስተም ለማስተዳደር
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-6 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-800"
                >
                  ተማሪዎችን ይመዝግቡ
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/admin/students"
                  className="rounded-2xl border border-emerald-900/15 bg-white px-6 py-4 font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
                >
                  Open Dashboard
                </Link>
              </div>

              {/* STATS */}
              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon

                  return (
                    <div
                      key={stat.title}
                      className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}
                      >
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>

                      <div className={`mt-4 text-3xl font-black ${stat.color}`}>
                        {stat.value}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        {stat.title}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-emerald-900 to-emerald-700 blur-3xl opacity-20" />

              <div className="relative overflow-hidden rounded-[40px] border border-emerald-900/10 bg-white shadow-2xl">
                <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/20 bg-white">
                      <Image
                        src="/ifada-logo.png"
                        alt="Ifada"
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div>
                      <div className="text-xl font-black">
                        IFADA QIRAT CENTER
                      </div>
                      <div className="text-sm text-emerald-100">
                        Quran & Kitab Education
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="rounded-3xl bg-emerald-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-500">
                          Total Students
                        </div>
                        <div className="mt-1 text-4xl font-black text-emerald-900">
                          {activeStudents}
                        </div>
                      </div>

                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                        <Users className="h-8 w-8 text-emerald-900" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <BookOpen className="h-8 w-8 text-emerald-900" />

                      <div className="mt-4 text-2xl font-black text-slate-900">
                        {totalLessons}
                      </div>

                      <div className="text-sm text-slate-500">
                        Lessons Recorded
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 p-5">
                      <ClipboardCheck className="h-8 w-8 text-amber-600" />

                      <div className="mt-4 text-2xl font-black text-slate-900">
                        {totalAttendance}
                      </div>

                      <div className="text-sm text-slate-500">
                        Attendance Entries
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-bold text-slate-900">
                        Recent Students
                      </div>

                      <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                        Live Data
                      </div>
                    </div>

                    <div className="space-y-3">
                      {recentStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">
                              {student.fullName}
                            </div>

                            <div className="text-sm text-slate-500">
                              {student.email}
                            </div>
                          </div>

                          <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                            {student.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900">
            <Building className="h-4 w-4" />
            Built For Islamic Education
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900">
             ለኢፋዳ ቂርዓት ማእከል የሚያስፈልጉ ነገሮች ሁሉ በሙሉ
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
           የቁርአን ተማሪዎችን፣ የኪታብ ትምህርቶችን፣ የትምህርት ክትትልን፣ ትምህርቶችን እና የደረጃ እድገቶችን ለማስተዳደር በሚያምር ሁኔታ የተነደፉ መተግበሪያዎች
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="group rounded-[32px] border border-emerald-900/10 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-700 text-white shadow-lg">
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {feature.text}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-emerald-900 py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Modern Islamic Education
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            Organize Your Madrasa Better
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-100">
            From Quran memorization to Kitab progression,
            manage every student efficiently with a beautiful Islamic experience.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-2xl bg-amber-500 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-amber-400"
            >
              Register Student
            </Link>

            <Link
              href="/admin/students"
              className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
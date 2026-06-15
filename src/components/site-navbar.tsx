// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"

// const navLinks = [
//   { href: "/", label: "Home" },
//   { href: "/#about", label: "About Us" },
//   { href: "/#features", label: "Features" },
//   { href: "/admin", label: "Dashboard" },
//   { href: "/#contact", label: "Contact" },
// ]

// export default function SiteNavbar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
//         <Link href="/" className="flex items-center gap-3">
//           <div className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-500/30 bg-white shadow-sm">
//             <Image
//               src="/ifada-logo.png"
//               alt="Ifada Qirat Center"
//               fill
//               className="object-contain p-1"
//               priority
//             />
//           </div>

//           <div className="leading-tight">
//             <div className="text-sm font-bold tracking-wide text-emerald-900">
//               ኢፋዳ የቁርዓን ማዕከል
//             </div>
//             <div className="text-xs font-medium text-amber-600">
//                 Ifada Qirat Center
//             </div>
//           </div>
//         </Link>

//         <nav className="hidden items-center gap-8 lg:flex">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="text-sm font-semibold text-slate-700 transition hover:text-emerald-900"
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="hidden items-center gap-3 lg:flex">
//           <Link
//             href="/register"
//             className="rounded-xl border border-emerald-900/20 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-900/40 hover:bg-emerald-50"
//           >
//             Register Student
//           </Link>

//           <Link
//             href="/admin"
//             className="rounded-xl bg-emerald-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
//           >
//             Admin Dashboard
//           </Link>
//         </div>

//         <button
//           className="rounded-xl border border-emerald-900/15 bg-white px-3 py-2 text-emerald-900 shadow-sm lg:hidden"
//           onClick={() => setOpen((v) => !v)}
//           aria-label="Toggle menu"
//         >
//           {open ? "✕" : "☰"}
//         </button>
//       </div>

//       {open && (
//         <div className="border-t border-emerald-900/10 bg-white lg:hidden">
//           <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setOpen(false)}
//                 className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
//               >
//                 {link.label}
//               </Link>
//             ))}

//             <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
//               <Link
//                 href="/register"
//                 onClick={() => setOpen(false)}
//                 className="rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-center text-sm font-semibold text-emerald-900"
//               >
//                 Register Student
//               </Link>

//               <Link
//                 href="/admin"
//                 onClick={() => setOpen(false)}
//                 className="rounded-xl bg-emerald-900 px-4 py-3 text-center text-sm font-semibold text-white"
//               >
//                 Admin Dashboard
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }


"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#features", label: "Features" },
  { href: "/admin", label: "Dashboard" },
  { href: "/#contact", label: "Contact" },
]

export default function SiteNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/register" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-500/30 bg-white shadow-sm">
            <Image
              src="/ifada-logo.png"
              alt="Ifada Qirat Center"
              fill
              className="object-contain p-1"
              priority
            />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-bold tracking-wide text-emerald-900">
              ኢፋዳ የቁርዓን ማዕከል
            </div>
            <div className="text-xs font-medium text-amber-600">
                Ifada Qirat Center
            </div>
          </div>
        </Link>

        {/* <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-900"
            >
              {link.label}
            </Link>
          ))}
        </nav> */}

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/register"
            className="rounded-xl border border-emerald-900/20 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-900/40 hover:bg-emerald-50"
          >
             Student Register
          </Link>

          {/* <Link
            href="/admin"
            className="rounded-xl bg-emerald-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Admin Dashboard
          </Link> */}
        </div>

        <button
          className="rounded-xl border border-emerald-900/15 bg-white px-3 py-2 text-emerald-900 shadow-sm lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-emerald-900/10 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {/* {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
              >
                {link.label}
              </Link>
            ))} */}

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-center text-sm font-semibold text-emerald-900"
              >
                Student Register
              </Link>

              {/* <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-emerald-900 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Admin Dashboard
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
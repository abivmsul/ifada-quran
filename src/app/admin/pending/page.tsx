// // "use client"

// // import { useEffect, useState } from "react"

// // export default function PendingPage() {
// //   const [students, setStudents] = useState<any[]>([])

// //   async function load() {
// //     const res = await fetch("/api/admin/pending")
// //     const data = await res.json()
// //     setStudents(data)
// //   }

// //   useEffect(() => {
// //     load()
// //   }, [])

// // async function approve(userId: string) {
// //   const res = await fetch("/api/admin/approve", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json"
// //     },
// //     body: JSON.stringify({ userId })
// //   })

// //   const data = await res.json()

// //   if (!res.ok) {
// //     alert(data.error)
// //   } else {
// //     alert(`Approved!\nTemporary Password: ${data.tempPassword}`)
// //     load()
// //   }
// // }

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-xl font-bold mb-4">Pending Students</h1>

// //       {students.map((s) => (
// //         <div key={s.id} className="border p-4 mb-3">
// //           <p><strong>{s.fullName}</strong></p>
// //           <p>{s.email}</p>
// //           <p>{s.phone}</p>

// //           <div className="mt-2">
// //             <strong>Requested Levels:</strong>
// //             {s.requestedLevels.map((rl: any) => (
// //               <div key={rl.id}>
// //                 {rl.trackType} - {rl.level.name}
// //               </div>
// //             ))}
// //           </div>

// //           <button
// //             onClick={() => approve(s.id)}
// //             className="mt-3 border px-3 py-1"
// //           >
// //             Approve
// //           </button>
// //         </div>
// //       ))}
// //     </div>
// //   )
// // }


// import { getCurrentUser } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import ClientPage from "./clientPage"

// export default async function Page() {
//   const user = await getCurrentUser()

//   if (!user || user.role !== "ADMIN") {
//     redirect("/login")
//   }

//   return <ClientPage />
// }

"use client"

import { useEffect, useState } from "react"

export default function PendingPage() {
  const [students, setStudents] = useState<any[]>([])

  async function load() {
    const res = await fetch("/api/admin/pending")
    const data = await res.json()
    setStudents(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function approve(userId: string) {
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
    } else {
      alert(`Approved!\nPassword: ${data.tempPassword}`)
      load()
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Pending Students
      </h1>

      {students.map((s) => (
        <div key={s.id} className="border p-4 mb-4">
          <p><strong>{s.fullName}</strong></p>
          <p>{s.email}</p>
          <p>{s.phone}</p>

          <button
            onClick={() => approve(s.id)}
            className="border px-3 py-1 mt-2"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  )
}
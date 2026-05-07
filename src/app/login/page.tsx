"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.target)

    const email = form.get("email") as string
    const password = form.get("password") as string

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = "/dashboard"
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Login</h2>

      <input name="email" placeholder="Email" className="border p-2 w-full" />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full" />

      <button disabled={loading} className="border px-4 py-2">
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  )
}
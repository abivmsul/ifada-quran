import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { authUserId: user.id }
  })

  return dbUser
}
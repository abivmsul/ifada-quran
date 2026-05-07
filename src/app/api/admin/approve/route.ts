import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getCurrentUser } from "@/lib/auth"
export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

     const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { requestedLevels: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.status !== "PENDING") {
      return NextResponse.json({ error: "Already processed" }, { status: 400 })
    }

    // 🔐 Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8)

    // 🔥 Create user silently (NO EMAIL)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: tempPassword,
      email_confirm: true // no confirmation needed
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const authUserId = data.user?.id

    // 🔁 Transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          status: "ACTIVE",
          authUserId
        }
      }),

      ...user.requestedLevels.map((rl) =>
        prisma.studentLevel.create({
          data: {
            studentId: userId,
            levelId: rl.levelId,
            trackType: rl.trackType
          }
        })
      )
    ])

    return NextResponse.json({
      success: true,
      tempPassword // 👈 show admin (important!)
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Approval failed" }, { status: 500 })
  }
}
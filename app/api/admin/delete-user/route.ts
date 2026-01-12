import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const deleteUserSchema = z.object({
  userId: z.string(),
})

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Optional: Add admin check here
    // const adminUser = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    // })
    // if (!adminUser.isAdmin) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const body = await req.json()
    const { userId } = deleteUserSchema.parse(body)

    // Fetch user with their vote to get the candidateId before deletion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vote: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If the user has voted, we need to decrement the candidate's vote count
    if (user.vote) {
      await prisma.$transaction([
        // Delete the vote (this will cascade delete due to schema)
        prisma.vote.delete({
          where: { id: user.vote.id },
        }),
        // Decrement the candidate's vote count
        prisma.candidate.update({
          where: { id: user.vote.candidateId },
          data: { voteCount: { decrement: 1 } },
        }),
        // Delete the user (accounts and sessions will cascade delete)
        prisma.user.delete({
          where: { id: userId },
        }),
      ])
    } else {
      // If the user hasn't voted, just delete the user
      await prisma.user.delete({
        where: { id: userId },
      })
    }

    return NextResponse.json(
      { message: "User and associated data deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Delete user error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

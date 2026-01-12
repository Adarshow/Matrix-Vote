import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
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

    // Get all candidates
    const candidates = await prisma.candidate.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
    })

    // Update each candidate's voteCount to match actual votes
    const updates = candidates.map((candidate) =>
      prisma.candidate.update({
        where: { id: candidate.id },
        data: { voteCount: candidate._count.votes },
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json(
      {
        message: "Vote counts synchronized successfully",
        updated: candidates.map((c) => ({
          id: c.id,
          name: c.name,
          oldCount: c.voteCount,
          newCount: c._count.votes,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Sync vote counts error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

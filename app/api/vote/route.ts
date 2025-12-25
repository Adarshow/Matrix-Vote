import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const voteSchema = z.object({
  candidateId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { candidateId } = voteSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vote: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.hasVoted || user.vote) {
      return NextResponse.json(
        { error: "You have already voted" },
        { status: 400 }
      )
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    })

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      )
    }

    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId: user.id,
          candidateId: candidateId,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { hasVoted: true },
      }),
      prisma.candidate.update({
        where: { id: candidateId },
        data: { voteCount: { increment: 1 } },
      }),
    ])

    return NextResponse.json(
      { message: "Vote recorded successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Vote error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vote: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      hasVoted: user.hasVoted,
      vote: user.vote,
    })
  } catch (error) {
    console.error("Check vote error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

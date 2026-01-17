import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key")

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get total counts
    const totalUsers = await prisma.user.count()
    const totalCandidates = await prisma.candidate.count({
      where: { isArchived: false },
    })
    const totalVotes = await prisma.vote.count()
    const totalVoters = await prisma.user.count({
      where: { hasVoted: true },
    })

    // Get candidate stats
    const candidates = await prisma.candidate.findMany({
      where: { isArchived: false },
      select: {
        id: true,
        name: true,
        voteCount: true,
        image: true,
      },
      orderBy: { voteCount: "desc" },
    })

    // Get recent votes
    const recentVotes = await prisma.vote.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            linkedinUrl: true,
          },
        },
      },
    })

    // Get voting trend (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const votes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { createdAt: "asc" },
    })

    // Group votes by date for chart
    const votesPerDay: { [key: string]: number } = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      votesPerDay[dateKey] = 0
    }

    votes.forEach((vote) => {
      const dateKey = new Date(vote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (votesPerDay[dateKey] !== undefined) {
        votesPerDay[dateKey]++
      }
    })

    // Get voter demographics
    const votersWithProvider = await prisma.user.groupBy({
      by: ["provider"],
      where: { hasVoted: true },
      _count: true,
    })

    const analytics = {
      overview: {
        totalUsers,
        totalCandidates,
        totalVotes,
        totalVoters,
        participationRate:
          totalUsers > 0 ? ((totalVoters / totalUsers) * 100).toFixed(1) : "0",
      },
      candidates,
      recentVotes,
      votingTrend: votesPerDay,
      voterDemographics: votersWithProvider,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

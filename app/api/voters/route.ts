import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const voters = await prisma.user.findMany({
      where: { 
        hasVoted: true,
        vote: {
          isNot: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        linkedinUrl: true,
        vote: {
          select: {
            createdAt: true,
            candidate: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { vote: { createdAt: "desc" } },
    })

    return NextResponse.json(voters)
  } catch (error) {
    console.error("Voters fetch error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

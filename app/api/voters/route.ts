import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic" 

export async function GET() {
  try {
    const voters = await prisma.user.findMany({
      where: { 
        hasVoted: true,
        vote: {
          isNot: null,
        },
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
      orderBy: {
        vote: {
          createdAt: "desc",
        },
      },
    })

    return NextResponse.json(voters, {
      headers: {
        "Cache-Control": "no-store", 
      },
    })
  } catch (error) {
    console.error("Voters fetch error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

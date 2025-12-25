import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { voteCount: "desc" },
    })

    return NextResponse.json(candidates)
  } catch (error) {
    console.error("Candidates fetch error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

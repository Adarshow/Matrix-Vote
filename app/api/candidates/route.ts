import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic" 

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      where: { isArchived: false },
      orderBy: { voteCount: "desc" },
    })

    return NextResponse.json(candidates, {
      headers: {
        "Cache-Control": "no-store", 
      },
    })
  } catch (error) {
    console.error("Candidates fetch error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

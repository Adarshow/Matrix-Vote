import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key"
)

async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token) return null
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload
  } catch (error) {
    return null
  }
}

// GET - Get voting settings
export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.votingSettings.findFirst()
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.votingSettings.create({
        data: {},
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Get voting settings error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT - Update voting settings
export async function PUT(request: NextRequest) {
  const admin = await verifyAdmin(request)

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { votingDeadline } = body

    let settings = await prisma.votingSettings.findFirst()

    if (!settings) {
      settings = await prisma.votingSettings.create({
        data: {
          votingDeadline: votingDeadline ? new Date(votingDeadline) : null,
        },
      })
    } else {
      settings = await prisma.votingSettings.update({
        where: { id: settings.id },
        data: {
          votingDeadline: votingDeadline ? new Date(votingDeadline) : null,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Update voting settings error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

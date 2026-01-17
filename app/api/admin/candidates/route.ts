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

// GET all candidates
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const showArchived = searchParams.get("archived") === "true"

    const candidates = await prisma.candidate.findMany({
      where: showArchived ? { isArchived: true } : { isArchived: false },
      include: {
        votes: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(candidates)
  } catch (error) {
    console.error("Fetch candidates error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// POST - Create new candidate
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, image, bio, linkedinUrl } = body

    if (!name || !image || !bio || !linkedinUrl) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        image,
        bio,
        linkedinUrl,
      },
    })

    return NextResponse.json(candidate, { status: 201 })
  } catch (error) {
    console.error("Create candidate error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT - Update candidate
export async function PUT(request: NextRequest) {
  const admin = await verifyAdmin(request)

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, image, bio, linkedinUrl, restore } = body

    if (!id) {
      return NextResponse.json(
        { error: "Candidate ID is required" },
        { status: 400 }
      )
    }

    // If restoring from archive
    if (restore) {
      const candidate = await prisma.candidate.update({
        where: { id },
        data: {
          isArchived: false,
          archivedAt: null,
        },
      })
      return NextResponse.json(candidate)
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
        ...(bio && { bio }),
        ...(linkedinUrl && { linkedinUrl }),
      },
    })

    return NextResponse.json(candidate)
  } catch (error) {
    console.error("Update candidate error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// DELETE - Archive candidate (soft delete) or permanently delete
export async function DELETE(request: NextRequest) {
  const admin = await verifyAdmin(request)

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const permanent = searchParams.get("permanent") === "true"

    if (!id) {
      return NextResponse.json(
        { error: "Candidate ID is required" },
        { status: 400 }
      )
    }

    if (permanent) {
      // Permanent delete - remove from database
      await prisma.candidate.delete({
        where: { id },
      })
    } else {
      // Archive instead of delete (soft delete)
      await prisma.candidate.update({
        where: { id },
        data: { 
          isArchived: true,
          archivedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete candidate error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateLinkedInSchema = z.object({
  linkedinUrl: z
    .string()
    .min(1, "LinkedIn profile URL is required")
    .url("Invalid URL format")
    .refine(
      (url) => url.includes("linkedin.com/in/"),
      "Please enter a valid LinkedIn profile URL (must contain linkedin.com/in/)"
    ),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      console.error("Unauthorized: No session or email found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = updateLinkedInSchema.parse(body)

    console.log(`Updating LinkedIn URL for user: ${session.user.email}`)

    // Update user's LinkedIn URL
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { linkedinUrl: validatedData.linkedinUrl },
    })

    console.log(`Successfully updated LinkedIn URL for user: ${session.user.email}`)

    return NextResponse.json({
      success: true,
      linkedinUrl: updatedUser.linkedinUrl,
    })
  } catch (error: any) {
    console.error("Error updating LinkedIn URL:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Failed to update LinkedIn URL" },
      { status: 500 }
    )
  }
}

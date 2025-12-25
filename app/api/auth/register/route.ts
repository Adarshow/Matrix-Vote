import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, linkedinUrl } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData: any = {
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
    }

    if (linkedinUrl) {
      userData.linkedinUrl = linkedinUrl
    }

    const user = await prisma.user.create({
      data: userData,
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

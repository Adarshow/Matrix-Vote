import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { prisma } from "@/lib/prisma"

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with 10-minute expiration
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    })

    // Configure nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    // Verify SMTP connection
    try {
      await transporter.verify()
      console.log("SMTP connection verified successfully")
    } catch (verifyError: any) {
      console.error("SMTP verification failed:", verifyError)
      return NextResponse.json(
        { error: `SMTP connection failed: ${verifyError.message}` },
        { status: 500 }
      )
    }

    // Send OTP email
    console.log(`Sending OTP to ${email}...`)
    await transporter.sendMail({
      from: `"Matrix Vote" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Matrix Vote Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Matrix Vote</h1>
          </div>
          <div style="background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for registering with Matrix Vote. To complete your registration, please use the following One-Time Password (OTP):
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              This OTP will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} White Matrix. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    console.log(`OTP sent successfully to ${email}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error: any) {
    console.error("Send OTP error:", error)
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    )
  }
}

// Export the OTP store for verification
export { otpStore }

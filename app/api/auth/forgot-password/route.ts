import nodemailer from "nodemailer"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: "If an account exists with this email, a password reset link will be sent" }, { status: 200 })
    }

    // Create transporter using Gmail's free SMTP server
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    // Generate a simple token (in production, use a proper token with expiry)
    const resetToken = Buffer.from(email + Date.now()).toString('base64')

    // Send email
    await transporter.sendMail({
      from: `"Matrix Vote" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Matrix Vote - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password for your Matrix Vote account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6B7280; word-break: break-all;">${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}</p>
          <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">© ${new Date().getFullYear()} Matrix Vote. All rights reserved.</p>
        </div>
      `,
      text: `Hello,\n\nYou have requested to reset your password for your Matrix Vote account.\n\nClick the link below to reset your password:\n${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}\n\nIf you didn't request this password reset, please ignore this email.\n\n© ${new Date().getFullYear()} Matrix Vote. All rights reserved.`,
    })

    return NextResponse.json({ message: "If an account exists with this email, a password reset link will be sent" }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { otpStore } from "../send-otp/route"

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      )
    }

    // Get stored OTP
    const storedOtpData = otpStore.get(email)

    if (!storedOtpData) {
      return NextResponse.json(
        { error: "OTP not found or expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email)
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 400 }
      )
    }

    // OTP is valid, remove it from store
    otpStore.delete(email)

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    })
  } catch (error: any) {
    console.error("Verify OTP error:", error)
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    )
  }
}

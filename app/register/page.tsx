"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    linkedinUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      // Step 1: Send OTP
      console.log('Sending OTP to:', formData.email)
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      })

      const otpData = await otpResponse.json()
      console.log('OTP Response:', otpData)

      if (!otpResponse.ok) {
        console.error('OTP sending failed:', otpData)
        setError(otpData.error || "Failed to send OTP")
        setLoading(false)
        return
      }

      // Move to OTP verification step
      console.log('OTP sent successfully, moving to verification step')
      setOtpStep(true)
      setLoading(false)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Step 2: Verify OTP
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        setError(verifyData.error || "Invalid OTP")
        setLoading(false)
        return
      }

      // Step 3: Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          linkedinUrl: formData.linkedinUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError("")
    setOtp("")

    try {
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      })

      const otpData = await otpResponse.json()

      if (!otpResponse.ok) {
        setError(otpData.error || "Failed to resend OTP")
      }
    } catch (error) {
      setError("Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "linkedin") => {
    setLoading(true)
    try {
      await signIn(provider, { callbackUrl: "/vote" })
    } catch (error) {
      setError("OAuth sign in failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-lg transform rotate-12"></div>
          <div className="absolute top-40 left-32 w-48 h-48 border border-white rounded-lg transform -rotate-6"></div>
          <div className="absolute top-60 left-16 w-56 h-56 border border-white rounded-lg transform rotate-3"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 mb-6 flex items-center justify-center">
              <Image
                src="/Matrix_vote_logo.png"
                alt="Matrix Vote Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Join<br />Matrix Vote! 🚀
          </h1>
          
          <p className="text-lg text-blue-100 leading-relaxed max-w-md">
            Create your account in seconds and start participating in secure and transparent voting. Your voice matters!
          </p>
          
          <div className="absolute bottom-8 left-16 text-sm text-blue-200">
            © {new Date().getFullYear()} Matrix Vote. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900">
        {/* Mobile Header */}
        <div className="lg:hidden w-full px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src="/Matrix_vote_logo.png"
                  alt="Matrix Vote Logo"
                  width={40}
                  height={40}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Matrix Vote
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Voting Platform</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Theme Toggle */}
        <div className="hidden lg:block absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Success!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your account has been created successfully. Redirecting to login...
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {otpStep ? "Verify Your Email" : "Create Account"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {otpStep ? (
                    <span>
                      We've sent a 6-digit OTP to{" "}
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {formData.email}
                      </span>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{" "}
                      <Link 
                        href="/login" 
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Login here
                      </Link>
                      , it's quick and easy!
                    </span>
                  )}
                </p>
              </div>

              {otpStep ? (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      disabled={loading}
                      maxLength={6}
                      className="w-full h-14 px-4 text-center text-2xl tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-0"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold rounded-lg transition-colors"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify & Create Account"}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setOtpStep(false)
                        setOtp("")
                        setError("")
                      }}
                      disabled={loading}
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      ← Change email
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Resend OTP
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={loading}
                        className="w-full h-12 px-4 border-0 border-b-2 border-gray-300 dark:border-gray-600 rounded-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-0 bg-transparent"
                      />
                    </div>

                    <div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={loading}
                        className="w-full h-12 px-4 border-0 border-b-2 border-gray-300 dark:border-gray-600 rounded-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-0 bg-transparent"
                      />
                    </div>

                    <div>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        placeholder="LinkedIn Profile URL"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        required
                        disabled={loading}
                        className="w-full h-12 px-4 border-0 border-b-2 border-gray-300 dark:border-gray-600 rounded-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-0 bg-transparent"
                      />
                    </div>

                    <div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password (min. 6 characters)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={loading}
                        className="w-full h-12 px-4 border-0 border-b-2 border-gray-300 dark:border-gray-600 rounded-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-0 bg-transparent"
                      />
                    </div>

                    <div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        disabled={loading}
                        className="w-full h-12 px-4 border-0 border-b-2 border-gray-300 dark:border-gray-600 rounded-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-0 bg-transparent"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold rounded-lg transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Sending OTP..." : "Continue"}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or sign up with</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOAuthSignIn("google")}
                        disabled={loading}
                        className="w-full h-12 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-semibold"
                      >
                        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign up with Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOAuthSignIn("linkedin")}
                        disabled={loading}
                        className="w-full h-12 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-semibold"
                      >
                        <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Sign up with LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

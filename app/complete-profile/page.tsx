"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CompleteProfile() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    // If user already has LinkedIn URL, redirect to vote page
    if (session.user?.linkedinUrl) {
      router.push("/vote")
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!linkedinUrl) {
      setError("LinkedIn profile URL is required")
      setLoading(false)
      return
    }

    if (!linkedinUrl.includes("linkedin.com/in/")) {
      setError("Please enter a valid LinkedIn profile URL (must contain linkedin.com/in/)")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/update-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      // Update session
      await update()
      
      // Redirect to vote page
      router.push("/vote")
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md bg-white shadow-sm border">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-semibold">Complete Your Profile</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Please provide your LinkedIn profile to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="text-sm font-medium">
                LinkedIn Profile <span className="text-red-600">*</span>
              </Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                required
                disabled={loading}
                autoFocus
                className="h-10"
              />
              <p className="text-xs text-gray-500">
                Required for voter verification
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10" 
              disabled={loading}
            >
              {loading ? "Saving..." : "Continue to Vote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

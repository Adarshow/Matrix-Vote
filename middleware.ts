import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { getToken } from "next-auth/jwt"

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key")

// Admin route protection
async function handleAdminRoutes(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Allow access to admin login page
  if (path === "/admin/login") {
    return NextResponse.next()
  }

  // Check for admin token
  const token = req.cookies.get("admin-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }
}

// Main middleware
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Handle admin routes separately
  if (path.startsWith("/admin")) {
    return handleAdminRoutes(req)
  }

  // Handle regular user routes with NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // If user is not authenticated and trying to access protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is authenticated
  if (token) {
    // Check if user has no LinkedIn URL and trying to access protected routes
    if (!token.linkedinUrl && (path === "/vote" || path === "/results")) {
      return NextResponse.redirect(new URL("/complete-profile", req.url))
    }
    
    // If user has LinkedIn URL and trying to access complete-profile, redirect to vote
    if (token.linkedinUrl && path === "/complete-profile") {
      return NextResponse.redirect(new URL("/vote", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/vote", "/results", "/complete-profile", "/admin/:path*"],
}

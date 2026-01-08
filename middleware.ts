import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

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
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/vote", "/results", "/complete-profile"],
}

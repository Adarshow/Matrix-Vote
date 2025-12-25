import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      linkedinUrl?: string | null
      provider?: string
    }
  }

  interface User {
    linkedinUrl?: string | null
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    linkedinUrl?: string | null
    provider?: string
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

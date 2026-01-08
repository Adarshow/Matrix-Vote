import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          linkedinUrl: null,
          provider: "google",
        }
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          linkedinUrl: profile.sub ? `https://linkedin.com/in/${profile.sub}` : null,
          provider: "linkedin",
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          linkedinUrl: user.linkedinUrl,
          provider: user.provider || undefined,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id
        token.linkedinUrl = user.linkedinUrl
        token.provider = account?.provider || "credentials"
      }
      
      // Refresh user data from database on every request to get updated linkedinUrl
      if (trigger === "update" || !token.linkedinUrl) {
        if (token.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, linkedinUrl: true, provider: true },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.linkedinUrl = dbUser.linkedinUrl
            token.provider = dbUser.provider || token.provider
          }
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.linkedinUrl = token.linkedinUrl as string | null
        session.user.provider = token.provider as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "linkedin") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || "" },
        })

        // Check if LinkedIn URL is already used by another account
        if (account.provider === "linkedin" && user.linkedinUrl) {
          const existingLinkedInUser = await prisma.user.findUnique({
            where: { linkedinUrl: user.linkedinUrl },
          })

          if (existingLinkedInUser && existingLinkedInUser.email !== user.email) {
            console.error(`LinkedIn URL already in use: ${user.linkedinUrl}`)
            return "/login?error=linkedin_already_linked"
          }
        }

        if (existingUser) {
          await prisma.user.update({
            where: { email: user.email || "" },
            data: {
              name: user.name,
              image: user.image,
              provider: account.provider,
              linkedinUrl:
                account.provider === "linkedin" && user.linkedinUrl
                  ? user.linkedinUrl
                  : existingUser.linkedinUrl,
            },
          })
        }
        // Always return true to create session - we'll handle redirects in middleware
      }
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user?.email) {
    // Fetch user to check if they have LinkedIn URL
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { linkedinUrl: true },
    })

    // If user doesn't have LinkedIn URL, redirect to complete profile
    if (!user?.linkedinUrl) {
      redirect("/complete-profile")
    }

    // User has LinkedIn URL, redirect to vote
    redirect("/vote")
  }

  redirect("/login")
}

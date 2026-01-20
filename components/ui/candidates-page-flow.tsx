"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileDropdown } from "@/components/ui/profile-dropdown"
import { InfiniteGridBackground } from "@/components/ui/infinite-grid-background"
import ShinyText from "@/components/ui/ShinyText"
import { Skeleton } from "@/components/ui/skeleton"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Users, Linkedin, ExternalLink, Vote } from "lucide-react"

interface Candidate {
  id: string
  name: string
  image: string
  bio: string
  linkedinUrl: string
  voteCount: number
}

interface CandidatesPageContentProps {
  className?: string
  logoSrc?: string
  companyName?: string
}

export const CandidatesPageContent = ({ 
  className, 
  logoSrc = "/logo.png",
  companyName = "Matrix Vote"
}: CandidatesPageContentProps) => {
  const { data: session, status } = useSession()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates", { cache: "no-store" })
      const data = await response.json()
      setCandidates(data)
    } catch (error) {
      console.error("Failed to fetch candidates:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <InfiniteGridBackground className={cn("", className)}>
        <div className="relative z-10 flex flex-col min-h-screen">
          <NavBar 
            leftItems={[
              { name: 'About', url: '/' },
              { name: 'Candidates', url: '/candidates' },
              { name: 'Vote', url: '/vote' },
              { name: 'Results', url: '/results' },
            ]}
            activeItem="Candidates"
            logoSrc={logoSrc}
            companyName={companyName}
            showAuthButtons={!session}
            rightItems={
              <>
                <ThemeToggle />
                {session && (
                  <ProfileDropdown
                    userName={session.user?.name || "User"}
                    userImage={session.user?.image || undefined}
                  />
                )}
              </>
            }
          />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-6xl space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </InfiniteGridBackground>
    )
  }

  return (
    <InfiniteGridBackground className={cn("", className)}>
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar 
          leftItems={[
            { name: 'About', url: '/' },
            { name: 'Candidates', url: '/candidates' },
            { name: 'Vote', url: '/vote' },
            { name: 'Results', url: '/results' },
          ]}
          activeItem="Candidates"
          logoSrc={logoSrc}
          companyName={companyName}
          showAuthButtons={!session}
          rightItems={
            <>
              <ThemeToggle />
              {session && (
                <ProfileDropdown
                  userName={session.user?.name || "User"}
                  userImage={session.user?.image || undefined}
                />
              )}
            </>
          }
        />

        <div className="flex-1 px-4 py-12 lg:py-16">
          <div className="container mx-auto max-w-7xl">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 pt-10"
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-4">
                <ShinyText
                  text="Meet Our"
                  speed={3}
                  delay={0}
                  spread={100}
                  className="block mb-2"
                  color="#b5b5b5"
                  shineColor="#ffffff"
                />
                <ShinyText
                  text="Candidates"
                  speed={3}
                  delay={1}
                  spread={100}
                  className="block"
                  color="#b5b5b5"
                  shineColor="#ffffff"
                />
              </h1>
              <p className="text-xl text-muted-foreground mt-6">
                Get to know the candidates running in this election
              </p>
            </motion.div>

            {/* Candidates Count Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12 max-w-3xl mx-auto"
            >
              <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  blur={0}
                  borderWidth={3}
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="border-0.75 relative flex flex-col md:flex-row items-center justify-center gap-6 overflow-hidden rounded-xl p-8 md:p-10 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl shadow-lg">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                      {candidates.length}
                    </p>
                    <p className="text-lg text-muted-foreground font-medium">
                      Talented Candidates Competing
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Candidates Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto"
            >
              {candidates.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No candidates available yet</p>
                </div>
              ) : (
                candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="min-h-[20rem] list-none"
                  >
                    <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                      <GlowingEffect
                        blur={0}
                        borderWidth={3}
                        spread={80}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                      />
                      <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Candidate Image */}
                          <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
                            <Image
                              src={candidate.image}
                              alt={candidate.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          {/* Candidate Info */}
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                              {candidate.name}
                            </h3>
                            
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3">
                              <Vote className="w-3 h-3 text-primary" />
                              <span className="text-xs font-bold text-primary">
                                Candidate
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                              {candidate.bio}
                            </p>
                          </div>

                          {/* LinkedIn Profile Link */}
                          <a
                            href={candidate.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span className="font-medium">View LinkedIn Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Info Footer */}
            {!session && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 max-w-2xl mx-auto"
              >
                <div className="backdrop-blur-sm bg-card/30 border border-border rounded-2xl p-6 text-center shadow-xl">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Ready to Vote?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sign in to cast your vote for your preferred candidate
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </InfiniteGridBackground>
  )
}

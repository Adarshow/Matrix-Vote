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
import { CompactCountdown } from "@/components/compact-countdown"
import { Users, Linkedin, ExternalLink, Vote, TrendingUp, Activity } from "lucide-react"

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
  const [votingDeadline, setVotingDeadline] = useState<string | null>(null)

  useEffect(() => {
    fetchCandidates()
    fetchVotingDeadline()
  }, [])

  const fetchVotingDeadline = async () => {
    try {
      const response = await fetch('/api/admin/voting-settings')
      if (response.ok) {
        const data = await response.json()
        if (data.votingDeadline) {
          setVotingDeadline(data.votingDeadline)
        }
      }
    } catch (error) {
      console.error('Failed to fetch voting deadline:', error)
    }
  }

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
                {votingDeadline && <CompactCountdown deadline={votingDeadline} />}
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
              {votingDeadline && <CompactCountdown deadline={votingDeadline} />}
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
              className="text-center mb-8 lg:mb-12 pt-10"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4">
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
              <p className="text-base sm:text-xl text-muted-foreground mt-4 sm:mt-6 px-4">
                Get to know the candidates running in this election. Review their profiles, backgrounds, and professional achievements before casting your vote.
              </p>
            </motion.div>

            {/* Stats Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 lg:mb-12 max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="backdrop-blur-sm bg-card/30 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl mx-auto mb-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{candidates.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Candidates</p>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl mx-auto mb-2">
                    <Vote className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{candidates.reduce((sum, c) => sum + c.voteCount, 0)}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Votes</p>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{Math.max(...candidates.map(c => c.voteCount), 0)}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Leading Votes</p>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl mx-auto mb-2">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">Live</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Status</p>
                </div>
              </div>
            </motion.div>

            {/* Candidates Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto"
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
                    className="min-h-fit list-none"
                  >
                    <div className="relative h-full rounded-xl border p-2 sm:rounded-2xl sm:p-2.5">
                      <GlowingEffect
                        blur={0}
                        borderWidth={2.5}
                        spread={70}
                        glow={true}
                        disabled={false}
                        proximity={56}
                        inactiveZone={0.01}
                      />
                      <div className="border-0.75 relative flex h-full flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-5 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                        <div className="flex flex-col items-center text-center space-y-3">
                          {/* Candidate Image */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                            <Image
                              src={candidate.image}
                              alt={candidate.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          {/* Candidate Info */}
                          <div className="w-full">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                              {candidate.name}
                            </h3>
                            
                            <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full">
                                <Vote className="w-3 h-3 text-primary" />
                                <span className="text-xs font-bold text-primary">Candidate</span>
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full">
                                <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-bold text-green-600 dark:text-green-400">{candidate.voteCount} votes</span>
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                              {candidate.bio}
                            </p>
                          </div>

                          {/* LinkedIn Profile Link */}
                          <a
                            href={candidate.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-primary transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span>View Profile</span>
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

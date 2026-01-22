"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { InfiniteGridBackground } from "@/components/ui/infinite-grid-background"
import ShinyText from "@/components/ui/ShinyText"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileDropdown } from "@/components/ui/profile-dropdown"
import { CompactCountdown } from "@/components/compact-countdown"
import { Trophy, Users, Vote, BarChart3, Linkedin, TrendingUp, Activity, Clock, ExternalLink } from "lucide-react"

interface Candidate {
  id: string
  name: string
  image: string
  bio: string
  linkedinUrl: string
  voteCount: number
}

interface Voter {
  id: string
  name: string
  email: string
  image: string | null
  linkedinUrl: string | null
  vote: {
    createdAt: string
    candidate: {
      name: string
    }
  }
}

interface ResultsPageContentProps {
  className?: string
  logoSrc?: string
  companyName?: string
}

export const ResultsPageContent = ({ 
  className, 
  logoSrc = "/logo.png",
  companyName = "Matrix Vote"
}: ResultsPageContentProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(true)
  const [votingDeadline, setVotingDeadline] = useState<string | null>(null)
  const [votingClosed, setVotingClosed] = useState(false)

  // Dynamic navbar items - Results page only accessible when logged in and voted (CASE 3)
  const getNavLeftItems = () => {
    return [
      { name: "About", url: "/about" },
      { name: "Candidates", url: "/candidates" },
      { name: "Results", url: "/results" },
    ];
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
      const interval = setInterval(fetchData, 5000)
      return () => clearInterval(interval)
    }
  }, [status])

  const fetchData = async () => {
    try {
      const [candidatesRes, votersRes, settingsRes] = await Promise.all([
        fetch("/api/candidates", { cache: "no-store" }),
        fetch("/api/voters", { cache: "no-store" }),
        fetch("/api/admin/voting-settings", { cache: "no-store" }),
      ])

      const candidatesData = await candidatesRes.json()
      const votersData = await votersRes.json()
      const settingsData = await settingsRes.json()

      setCandidates(candidatesData)
      setVoters(votersData)
      
      setVotingDeadline(settingsData.votingDeadline)
      if (settingsData.votingDeadline) {
        const deadline = new Date(settingsData.votingDeadline)
        if (deadline <= new Date()) {
          setVotingClosed(true)
        }
      } else {
        setVotingClosed(false)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0)

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`
    return `${Math.floor(diffInSeconds / 86400)} day ago`
  }

  const getProgressBarColor = (index: number) => {
    const colors = [
      "from-green-400 to-yellow-500",
      "from-blue-400 to-purple-500",
      "from-orange-400 to-red-500",
      "from-pink-400 to-purple-500",
      "from-cyan-400 to-blue-500"
    ]
    return colors[index % colors.length]
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-gray-500",
      "bg-green-500",
      "bg-pink-500"
    ]
    return colors[index % colors.length]
  }

  if (status === "loading" || loading) {
    return (
      <InfiniteGridBackground className={cn("", className)}>
        <div className="relative z-10 flex flex-col min-h-screen">
          <NavBar 
            leftItems={getNavLeftItems()}
            activeItem="Results"
            logoSrc={logoSrc}
            companyName={companyName}
            showAuthButtons={false}
            rightItems={
              <>
                {votingDeadline && <CompactCountdown deadline={votingDeadline} />}
                <ThemeToggle />
                <ProfileDropdown 
                  userName={session?.user?.name}
                  userImage={session?.user?.image}
                  userEmail={session?.user?.email}
                />
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

  const maxVotes = candidates.length > 0 ? Math.max(...candidates.map(c => c.voteCount)) : 0
  const winners = candidates.filter(c => c.voteCount === maxVotes && maxVotes > 0)
  const isTie = winners.length > 1
  const winner = winners.length === 1 ? winners[0] : null

  return (
    <InfiniteGridBackground className={cn("", className)}>
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar 
          leftItems={getNavLeftItems()}
          activeItem="Results"
          logoSrc={logoSrc}
          companyName={companyName}
          showAuthButtons={false}
          rightItems={
            <>
              {votingDeadline && <CompactCountdown deadline={votingDeadline} />}
              <ThemeToggle />
              <ProfileDropdown 
                userName={session?.user?.name}
                userImage={session?.user?.image}
                userEmail={session?.user?.email}
              />
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
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-4 leading-[1.2] pb-2">
                <ShinyText
                  text="Voting"
                  speed={3}
                  delay={0}
                  spread={100}
                  className="block mb-2 leading-[1.2]"
                  color="#b5b5b5"
                  shineColor="#ffffff"
                />
                <ShinyText
                  text="Results"
                  speed={3}
                  delay={1}
                  spread={100}
                  className="block leading-[1.2]"
                  color="#b5b5b5"
                  shineColor="#ffffff"
                />
              </h1>
              <p className="text-xl text-muted-foreground mt-6">
                Real-time voting analytics and live leaderboard
              </p>
            </motion.div>

            {/* Winner Spotlight */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12 max-w-4xl mx-auto"
            >
              <div className="backdrop-blur-sm bg-card/30 border border-border rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Winner Spotlight</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Leading</span>
                  </div>
                </div>

                {isTie ? (
                  <div className="text-center py-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {winners.slice(0, 3).map((w, idx) => (
                        <div key={w.id} className={`relative ${idx === 1 ? 'z-20 scale-110' : idx === 0 ? 'z-10' : 'z-0'}`}>
                          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
                            <Image
                              src={w.image}
                              alt={w.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-3">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="text-lg font-bold text-primary">It's a Tie!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {winners.length} candidates are tied with {maxVotes} vote{maxVotes !== 1 ? 's' : ''} each
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {winners.map((w) => (
                        <span key={w.id} className="px-3 py-1 backdrop-blur-sm bg-card/50 border border-border rounded-full text-sm font-medium text-foreground">
                          {w.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : winner && winner.voteCount > 0 ? (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                      <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-amber-400 shadow-xl">
                        <Image
                          src={winner.image}
                          alt={winner.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 mb-1.5">
                        <h3 className="text-xl font-bold text-foreground truncate">{winner.name}</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100/20 border border-amber-400/30 rounded-full">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span className="text-xs font-bold text-amber-500">#1</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-1">{winner.bio}</p>
                      <button
                        onClick={() => window.open(winner.linkedinUrl, "_blank")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        View Profile
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No votes cast yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Candidates Ranking */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              <div className="lg:col-span-2 w-full">
                <div className="backdrop-blur-sm bg-card/30 border border-border rounded-2xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      Candidates Ranking
                    </h2>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {candidates.length} Candidates
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {candidates.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No candidates available</p>
                      </div>
                    ) : (
                      candidates.map((candidate, index) => {
                        const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0
                        return (
                          <motion.div 
                            key={candidate.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            className="group relative backdrop-blur-sm bg-card/50 border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                          >
                            {index === 0 && (
                              <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 ${
                                  index === 0 ? 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 shadow-lg shadow-yellow-500/50' : 
                                  index === 1 ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-lg shadow-gray-500/50' : 
                                  index === 2 ? 'bg-gradient-to-br from-orange-400 via-amber-600 to-orange-700 shadow-lg shadow-orange-500/50' : 
                                  'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md'
                                } rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-white text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110`}>
                                  #{index + 1}
                                </div>
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden ring-2 ring-primary/20 shadow-md flex-shrink-0">
                                  <Image
                                    src={candidate.image}
                                    alt={candidate.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-base sm:text-lg text-foreground truncate">{candidate.name}</h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{candidate.bio}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                                <button
                                  onClick={() => window.open(candidate.linkedinUrl, "_blank")}
                                  className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 hover:bg-primary hover:text-white rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group/btn hover:shadow-lg"
                                >
                                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover/btn:text-white transition-colors" />
                                </button>
                                <div className="flex-shrink-0 text-right min-w-[60px] sm:min-w-[80px]">
                                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                                    {candidate.voteCount.toLocaleString()}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                                    votes
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="font-medium text-muted-foreground">Vote Share</span>
                                <span className="font-bold text-foreground">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="relative w-full h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getProgressBarColor(index)} transition-all duration-700 ease-out`}
                                  style={{ width: `${percentage}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Live Activity */}
              <div className="lg:col-span-1">
                <div className="backdrop-blur-sm bg-card/30 border border-border rounded-2xl p-4 sm:p-6 shadow-xl lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      Live Activity
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  {voters.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">No activity yet</p>
                      <p className="text-xs text-muted-foreground">Votes will appear here in real-time</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-2">
                      {voters.slice(0, 10).map((voter, index) => {
                        if (!voter.vote || !voter.vote.candidate) return null
                        
                        const formatDateTime = (dateString: string) => {
                          const date = new Date(dateString)
                          return date.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        }
                        
                        const handleVoterClick = () => {
                          if (voter.linkedinUrl) {
                            window.open(voter.linkedinUrl, '_blank')
                          }
                        }
                        
                        return (
                          <motion.div 
                            key={voter.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                            onClick={handleVoterClick}
                            className={`group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm bg-card/50 border border-border hover:border-primary/30 transition-all duration-300 ${
                              voter.linkedinUrl ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : 'cursor-default'
                            }`}
                          >
                            <div className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold overflow-hidden shadow-md ${getAvatarColor(index)} ring-2 ring-border transition-transform duration-300 group-hover:scale-110`}>
                              {voter.image ? (
                                <Image
                                  src={voter.image}
                                  alt={voter.name || "User"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-sm sm:text-base">{(voter.name || voter.email).charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                                {voter.name || voter.email.split('@')[0]}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                {formatDateTime(voter.vote.createdAt)}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 sm:gap-1">
                              <div className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-0.5 sm:gap-1">
                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span className="hidden xs:inline">{formatTimeAgo(voter.vote.createdAt)}</span>
                              </div>
                              {voter.linkedinUrl && (
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/10 group-hover:bg-primary rounded-md sm:rounded-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                                  <Linkedin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary group-hover:text-white" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </InfiniteGridBackground>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, Trophy, Users, Vote, BarChart3, Linkedin, TrendingUp, Activity, Clock } from "lucide-react"

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

export default function ResultsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(true)

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
      const [candidatesRes, votersRes] = await Promise.all([
         fetch("/api/candidates", { cache: "no-store" }),
         fetch("/api/voters", { cache: "no-store" }),
      ])

      const candidatesData = await candidatesRes.json()
      const votersData = await votersRes.json()

      setCandidates(candidatesData)
      setVoters(votersData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0)
  const totalParticipants = voters.length

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 mb-8" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  const winner = candidates.length > 0 ? candidates[0] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Matrix Vote
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Voting Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-100/80 dark:bg-green-900/30 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">Live Updates</span>
              </div>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
              {session?.user?.image && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 ring-2 ring-white dark:ring-gray-800 shadow-lg hover:ring-4 transition-all duration-300">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Stats Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Clock className="w-4 w-4" />
              Real-time voting analytics and insights
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Vote className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full">
                  <TrendingUp className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">Live</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                {totalVotes.toLocaleString()}
              </div>
              <div className="text-blue-100 text-sm font-medium">Total Votes Cast</div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full">
                  <Activity className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">Active</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                {candidates.length.toLocaleString()}
              </div>
              <div className="text-emerald-100 text-sm font-medium">Total Candidates</div>
            </CardContent>
          </Card>

          <Card className="group lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/50 dark:via-orange-950/50 dark:to-yellow-950/50 border-amber-200/50 dark:border-amber-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 dark:from-amber-600/10 dark:to-orange-600/10"></div>
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Winner Spotlight</CardTitle>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-full border border-purple-200 dark:border-purple-800">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Leading</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              {winner && winner.voteCount > 0 ? (
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white ring-4 ring-amber-400 shadow-xl">
                      <Image
                        src={winner.image}
                        alt={winner.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{winner.name}</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                        <Trophy className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300">#1</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">{winner.bio}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={() => window.open(winner.linkedinUrl, "_blank")}
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No votes cast yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    Candidates Ranking
                  </CardTitle>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {candidates.length} Candidates
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {candidates.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No candidates available</p>
                  </div>
                ) : (
                  candidates.map((candidate, index) => {
                    const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0
                    return (
                      <div 
                        key={candidate.id} 
                        className="group relative bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-800/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <Trophy className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`relative w-14 h-14 ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 shadow-lg shadow-yellow-500/50' : 
                            index === 1 ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-lg shadow-gray-500/50' : 
                            index === 2 ? 'bg-gradient-to-br from-orange-400 via-amber-600 to-orange-700 shadow-lg shadow-orange-500/50' : 
                            'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md'
                          } rounded-2xl flex items-center justify-center font-bold text-white text-xl transition-transform duration-300 group-hover:scale-110`}>
                            #{index + 1}
                          </div>
                          <div className="flex-1 flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-md">
                              <Image
                                src={candidate.image}
                                alt={candidate.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{candidate.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{candidate.bio}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(candidate.linkedinUrl, "_blank")}
                            className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group/btn hover:shadow-lg"
                          >
                            <Linkedin className="w-5 h-5 text-blue-600 group-hover/btn:text-white dark:text-blue-400 transition-colors" />
                          </button>
                          <div className="flex-shrink-0 text-right min-w-[80px]">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {candidate.voteCount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              votes
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Vote Share</span>
                            <span className="font-bold text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getProgressBarColor(index)} transition-all duration-700 ease-out shadow-md`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            >
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 sticky top-24">
              <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Live Activity
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {voters.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">No activity yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Votes will appear here in real-time</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {voters.slice(0, 10).map((voter, index) => {
                      if (!voter.vote || !voter.vote.candidate) {
                        return null
                      }
                      
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
                        <div 
                          key={voter.id} 
                          onClick={handleVoterClick}
                          className={`group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700/30 dark:to-transparent hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 dark:hover:to-transparent transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 ${
                            voter.linkedinUrl ? 'cursor-pointer' : 'cursor-default'
                          }`}
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden shadow-md ${getAvatarColor(index)} ring-2 ring-white dark:ring-gray-800 transition-transform duration-300 group-hover:scale-110`}>
                            {voter.image ? (
                              <Image
                                src={voter.image}
                                alt={voter.name || "User"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-base">{(voter.name || voter.email).charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {voter.name || voter.email.split('@')[0]}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {formatDateTime(voter.vote.createdAt)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(voter.vote.createdAt)}
                            </div>
                            {voter.linkedinUrl && (
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                                <Linkedin className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

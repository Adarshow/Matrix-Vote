"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { CountdownTimer } from "@/components/countdown-timer"
import { LogOut, ExternalLink, CheckCircle2, Linkedin, Vote, Users, Activity, TrendingUp } from "lucide-react"

interface Candidate {
  id: string
  name: string
  image: string
  bio: string
  linkedinUrl: string
  voteCount: number
}

export default function VotePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [voting, setVoting] = useState(false)
  const [votingDeadline, setVotingDeadline] = useState<string | null>(null)
  const [votingClosed, setVotingClosed] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
  }, [status])

  const fetchData = async () => {
    try {
      const [candidatesRes, voteStatusRes, settingsRes] = await Promise.all([
        fetch("/api/candidates", { cache: "no-store" }),
        fetch("/api/vote", { cache: "no-store" }),
        fetch("/api/admin/voting-settings", { cache: "no-store" }),
      ])

      const candidatesData = await candidatesRes.json()
      const voteStatusData = await voteStatusRes.json()
      const settingsData = await settingsRes.json()

      setCandidates(candidatesData)
      setHasVoted(voteStatusData.hasVoted)
      
      // Always update deadline state, even if null
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

  const handleVoteClick = (candidate: Candidate) => {
    if (votingClosed) {
      alert("Voting has closed!")
      return
    }
    setSelectedCandidate(candidate)
    setShowConfirmDialog(true)
  }

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return

    setVoting(true)
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: selectedCandidate.id }),
      })

      if (response.ok) {
        setHasVoted(true)
        setShowConfirmDialog(false)
        await fetchData()
        router.push("/results")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to record vote")
      }
    } catch (error) {
      console.error("Vote error:", error)
      alert("Failed to record vote")
    } finally {
      setVoting(false)
    }
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0)

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

  if (hasVoted) {
    router.push("/results")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {/* Header with Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-11 h-11 flex items-center justify-center">
                <Image
                  src="/Matrix_vote_logo.png"
                  alt="Matrix Vote Logo"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Matrix Vote
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Voting Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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

      {/* Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Title Section with Stats */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <Vote className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              Cast Your Vote
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Hello, <span className="text-gray-900 dark:text-white font-semibold">{session?.user?.name}</span>! 
              Select your preferred candidate below.
            </p>
          </div>

          {/* Countdown Timer */}
          {votingDeadline && !votingClosed && (
            <div className="mb-8">
              <CountdownTimer 
                deadline={votingDeadline} 
                onExpire={() => setVotingClosed(true)}
              />
            </div>
          )}

          {votingClosed && (
            <div className="mb-8 backdrop-blur-xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 rounded-2xl p-6 shadow-xl">
              <p className="text-center text-red-600 dark:text-red-400 font-semibold">
                Voting has closed. Thank you for your participation!
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="pt-6 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Vote className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-xl rounded-full">
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Live</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {totalVotes.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm font-medium">Total Votes</div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="pt-6 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-xl rounded-full">
                    <Activity className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Active</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {candidates.length}
                </div>
                <div className="text-emerald-100 text-sm font-medium">Candidates</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {candidates.map((candidate, index) => (
            <Card 
              key={candidate.id}
              className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:ring-indigo-400 dark:group-hover:ring-indigo-600 transition-all duration-300">
                      <Image
                        src={candidate.image}
                        alt={candidate.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-center text-xl font-bold text-gray-900 dark:text-white">
                  {candidate.name}
                </CardTitle>
                
                <CardDescription className="text-center text-sm">
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        {candidate.voteCount} {candidate.voteCount === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0 relative z-10">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed min-h-[60px]">
                  {candidate.bio}
                </p>

                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="font-medium">View LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Button
                  onClick={() => handleVoteClick(candidate)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 font-semibold"
                  disabled={hasVoted || votingClosed}
                >
                  <Vote className="w-4 h-4 mr-2" />
                  {votingClosed ? "Voting Closed" : hasVoted ? "Already Voted" : `Vote for ${candidate.name.split(' ')[0]}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Secure Voting System
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your vote is encrypted and can only be cast once. All votes are recorded securely.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
              Confirm Your Vote
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              You are about to vote for{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {selectedCandidate?.name}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-400/50 dark:ring-indigo-600/50 shadow-2xl">
                  <Image
                    src={selectedCandidate.image}
                    alt={selectedCandidate.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                  {selectedCandidate.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {selectedCandidate.bio}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                  <Vote className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {selectedCandidate.voteCount} votes currently
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={voting}
              className="w-full sm:w-auto border-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmVote}
              disabled={voting}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {voting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting Vote...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Vote
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

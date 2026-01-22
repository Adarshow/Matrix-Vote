"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { InfiniteGridBackground } from "@/components/ui/infinite-grid-background";
import ShinyText from "@/components/ui/ShinyText";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { CompactCountdown } from "@/components/compact-countdown";
import { LogOut, ExternalLink, CheckCircle2, Linkedin, Vote, Users, Activity, TrendingUp } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  image: string;
  bio: string;
  linkedinUrl: string;
  voteCount: number;
}

interface VotePageContentProps {
  className?: string;
  logoSrc?: string;
  companyName?: string;
}

export const VotePageContent = ({ 
  className, 
  logoSrc = "/logo.png",
  companyName = "Matrix Vote"
}: VotePageContentProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votingDeadline, setVotingDeadline] = useState<string | null>(null);
  const [votingClosed, setVotingClosed] = useState(false);

  // Dynamic navbar items - Vote page only accessible when logged in and not voted (CASE 2)
  const getNavLeftItems = () => {
    return [
      { name: "About", url: "/about" },
      { name: "Candidates", url: "/candidates" },
      { name: "Vote", url: "/vote" },
    ];
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  // Check voting deadline and redirect if closed
  useEffect(() => {
    if (votingDeadline && votingClosed) {
      router.push("/results");
    }
  }, [votingDeadline, votingClosed, router]);

  const fetchData = async () => {
    try {
      const [candidatesRes, voteStatusRes, settingsRes] = await Promise.all([
        fetch("/api/candidates", { cache: "no-store" }),
        fetch("/api/vote", { cache: "no-store" }),
        fetch("/api/admin/voting-settings", { cache: "no-store" }),
      ]);

      const candidatesData = await candidatesRes.json();
      const voteStatusData = await voteStatusRes.json();
      const settingsData = await settingsRes.json();

      setCandidates(candidatesData);
      setHasVoted(voteStatusData.hasVoted);
      
      setVotingDeadline(settingsData.votingDeadline);
      if (settingsData.votingDeadline) {
        const deadline = new Date(settingsData.votingDeadline);
        if (deadline <= new Date()) {
          setVotingClosed(true);
        } else {
          setVotingClosed(false); // Allow voting if deadline extended
        }
      } else {
        setVotingClosed(false); // No deadline = vote anytime
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (candidate: Candidate) => {
    if (votingClosed) {
      alert("Voting has closed!");
      return;
    }
    setSelectedCandidate(candidate);
    setShowConfirmDialog(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    setVoting(true);
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: selectedCandidate.id }),
      });

      if (response.ok) {
        setHasVoted(true);
        setShowConfirmDialog(false);
        await fetchData();
        router.push("/results");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to record vote");
      }
    } catch (error) {
      console.error("Vote error:", error);
      alert("Failed to record vote");
    } finally {
      setVoting(false);
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  if (status === "loading" || loading) {
    return (
      <InfiniteGridBackground className={cn("", className)}>
        <div className="relative z-10 flex flex-col min-h-screen">
          <NavBar 
            leftItems={getNavLeftItems()}
            activeItem="Vote"
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
    );
  }

  if (hasVoted) {
    router.push("/results");
    return null;
  }

  return (
    <InfiniteGridBackground className={cn("", className)}>
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar 
          leftItems={getNavLeftItems()}
          activeItem="Vote"
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

              <h1 className="text-5xl lg:text-7xl font-extrabold mb-4">
                <ShinyText
                  text="Cast Your "
                  speed={3}
                  delay={0}
                  spread={100}
                  className="inline-block"
                  color="#b5b5b5"
                  shineColor="#ffffff"
                />
                <ShinyText
                  text="Vote"
                  speed={3}
                  delay={1}
                  spread={100}
                  className="inline-block"
                  color="#b5b5b5"
                  shineColor="#ffffff"
                />
              </h1>
              <p className="text-xl text-muted-foreground mt-6">
                Hello, <span className="text-foreground font-semibold">{session?.user?.name}</span>! 
                Select your preferred candidate below.
              </p>
            </motion.div>

            {/* Candidates Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="backdrop-blur-sm bg-card/30 border border-border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
                      <Image
                        src={candidate.image}
                        alt={candidate.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {candidate.name}
                      </h3>
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3">
                        <span className="text-xs font-bold text-primary">
                          {candidate.voteCount} {candidate.voteCount === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                        {candidate.bio}
                      </p>
                    </div>

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

                    <ShinyButton
                      onClick={() => handleVoteClick(candidate)}
                      className="w-full"
                      disabled={hasVoted || votingClosed}
                    >
                      <Vote className="w-4 h-4" />
                      {votingClosed ? "Voting Closed" : hasVoted ? "Already Voted" : `Vote for ${candidate.name.split(' ')[0]}`}
                    </ShinyButton>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer Note */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="backdrop-blur-sm bg-card/30 border border-border rounded-2xl p-6 text-center shadow-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-semibold text-foreground">
                    Secure Voting System
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your vote is encrypted and can only be cast once. All votes are recorded securely.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md backdrop-blur-xl bg-card/95 border border-border">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-foreground">
              Confirm Your Vote
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              You are about to vote for{" "}
              <span className="font-bold text-primary">
                {selectedCandidate?.name}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl">
                <Image
                  src={selectedCandidate.image}
                  alt={selectedCandidate.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-foreground mb-1">
                  {selectedCandidate.name}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedCandidate.bio}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Vote className="w-3 h-3 text-primary" />
                  <span className="text-xs font-bold text-primary">
                    {selectedCandidate.voteCount} votes currently
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowConfirmDialog(false)}
              disabled={voting}
              className="w-full sm:w-auto px-6 py-2 border-2 border-border rounded-full hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <ShinyButton
              onClick={handleConfirmVote}
              disabled={voting}
              className="w-full sm:w-auto"
            >
              {voting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Vote...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Vote
                </>
              )}
            </ShinyButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </InfiniteGridBackground>
  );
};

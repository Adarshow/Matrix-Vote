"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavBar } from "./tubelight-navbar";
import { InfiniteGridBackground } from "./infinite-grid-background";
import ShinyText from "./ShinyText";
import { ShinyButton } from "./shiny-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CompactCountdown } from "@/components/compact-countdown";

interface CompleteProfilePageProps {
  className?: string;
  logoSrc?: string;
  companyName?: string;
}

export const CompleteProfilePage = ({ 
  className, 
  logoSrc = "/logo.png",
  companyName = "Matrix Vote"
}: CompleteProfilePageProps) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [votingDeadline, setVotingDeadline] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotingDeadline = async () => {
      try {
        const response = await fetch('/api/admin/voting-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.votingDeadline) {
            setVotingDeadline(data.votingDeadline);
          }
        }
      } catch (error) {
        console.error('Failed to fetch voting deadline:', error);
      }
    };
    fetchVotingDeadline();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    if (status === "authenticated" && session?.user?.linkedinUrl) {
      router.push("/vote");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!linkedinUrl.trim()) {
      setError("LinkedIn profile URL is required");
      setLoading(false);
      return;
    }

    if (!linkedinUrl.includes("linkedin.com/in/")) {
      setError("Please enter a valid LinkedIn profile URL (must contain linkedin.com/in/)");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/update-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl: linkedinUrl.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      await update();
      
      setTimeout(() => {
        router.push("/vote");
      }, 500);
    } catch (error: any) {
      console.error("Error updating LinkedIn URL:", error);
      setError(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <InfiniteGridBackground className={cn("", className)}>
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xl text-muted-foreground">Loading...</p>
          </motion.div>
        </div>
      </InfiniteGridBackground>
    );
  }

  return (
    <InfiniteGridBackground className={cn("", className)}>
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar 
          leftItems={[
            { name: 'About', url: '/about' },
            { name: 'Candidates', url: '/candidates' },
            { name: 'Login', url: '/login' },
            { name: 'Register', url: '/register' },
          ]}
          logoSrc={logoSrc}
          companyName={companyName}
          showAuthButtons={false}
          rightItems={
            <>
              {votingDeadline && <CompactCountdown deadline={votingDeadline} />}
              <ThemeToggle />
            </>
          }
        />

        <div className="flex flex-1 flex-col lg:flex-row items-center justify-center px-4 lg:px-0 pt-20 lg:pt-0">
          {/* Left Side - Logo and Shiny Text */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16 py-12 lg:py-0">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 text-center lg:text-left max-w-xl"
            >
              {/* Large Company Logo */}
              <div className="flex justify-center lg:justify-start">
                <Image 
                  src={logoSrc} 
                  alt={companyName}
                  width={200}
                  height={200}
                  className="w-32 h-32 lg:w-48 lg:h-48 object-contain"
                  priority
                />
              </div>
              
              {/* Large Bold Text with ShinyText */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                  <ShinyText
                    text="One Last Step!"
                    speed={2}
                    delay={0}
                    spread={100}
                    className="block mb-2"
                    color="hsl(var(--foreground))"
                    shineColor="#b5b5b5"
                  />
                  <ShinyText
                    text="Verify Identity"
                    speed={2}
                    delay={1}
                    spread={100}
                    className="block"
                    color="hsl(var(--foreground))"
                    shineColor="#b5b5b5"
                  />
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-light">
                  Verify your professional identity through LinkedIn
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Secure & Private</h3>
                    <p className="text-sm text-muted-foreground">Your information is encrypted and never shared</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">One-Time Verification</h3>
                    <p className="text-sm text-muted-foreground">Only needed once to access voting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Professional Network</h3>
                    <p className="text-sm text-muted-foreground">Ensures authentic voter participation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Complete Profile Form */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:py-0 lg:pt-24">
            <div className="w-full max-w-md">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold text-foreground">
                    Verify Your LinkedIn Profile
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Hello <span className="font-semibold text-primary">{session?.user?.name || "there"}</span>! 👋
                    <br />
                    Please provide your LinkedIn profile URL
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-sm text-red-500 flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <input 
                      type="url"
                      placeholder="https://linkedin.com/in/your-username"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      autoFocus
                      className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Example: https://linkedin.com/in/john-doe
                  </p>

                  <ShinyButton 
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Verifying..." : "Complete Profile & Start Voting"}
                  </ShinyButton>
                </form>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-foreground mb-1">Why LinkedIn?</p>
                      <p className="text-muted-foreground">
                        LinkedIn verification helps us maintain a secure voting environment by confirming your professional identity, preventing duplicate votes, and ensuring fair participation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Protected by enterprise-grade security</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </InfiniteGridBackground>
  );
};

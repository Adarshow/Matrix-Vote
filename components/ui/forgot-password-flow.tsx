"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NavBar } from "./tubelight-navbar";
import { InfiniteGridBackground } from "./infinite-grid-background";
import ShinyText from "./ShinyText";
import { ShinyButton } from "./shiny-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CompactCountdown } from "@/components/compact-countdown";

interface ForgotPasswordPageProps {
  className?: string;
  logoSrc?: string;
  companyName?: string;
}

export const ForgotPasswordPage = ({ 
  className, 
  logoSrc = "/logo.png",
  companyName = "Matrix Vote"
}: ForgotPasswordPageProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <InfiniteGridBackground className={cn("", className)}>
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 max-w-md px-4"
          >
            <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-foreground">Email Sent!</h2>
            <p className="text-xl text-muted-foreground">
              Check your inbox for password reset instructions.
            </p>
            <Link href="/login">
              <button className="mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Back to Login
              </button>
            </Link>
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
            { name: 'About', url: '/' },
            { name: 'Candidates', url: '/candidates' },
            { name: 'Results', url: '/results' },
          ]}
          logoSrc={logoSrc}
          companyName={companyName}
          showAuthButtons={true}
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
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                  <ShinyText
                    text="Forgot"
                    speed={2}
                    delay={0}
                    spread={100}
                    className="block mb-2"
                    color="hsl(var(--foreground))"
                    shineColor="#b5b5b5"
                  />
                  <ShinyText
                    text="Password?"
                    speed={2}
                    delay={1}
                    spread={100}
                    className="block"
                    color="hsl(var(--foreground))"
                    shineColor="#b5b5b5"
                  />
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-light">
                  No worries, we'll send you reset instructions
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:py-0 lg:pt-24">
            <div className="w-full max-w-md">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold text-foreground">Reset Password</h2>
                  <p className="text-base text-muted-foreground">
                    Enter your email to receive reset instructions
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                    required
                    disabled={loading}
                  />

                  <ShinyButton 
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </ShinyButton>
                </form>

                <div className="pt-2 text-center">
                  <p className="text-muted-foreground text-sm">
                    Remember your password?{" "}
                    <Link href="/login" className="text-foreground hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </InfiniteGridBackground>
  );
};

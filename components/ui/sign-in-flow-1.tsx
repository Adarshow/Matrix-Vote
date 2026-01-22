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

interface SignInPageProps {
  className?: string;
  onEmailPasswordSubmit?: (email: string, password: string) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  onLinkedInSignIn?: () => Promise<void>;
  logoSrc?: string;
  companyName?: string;
  error?: string;
}

export const SignInPage = ({ 
  className, 
  onEmailPasswordSubmit,
  onGoogleSignIn,
  onLinkedInSignIn,
  logoSrc = "/logo.png",
  companyName = "Matrix Vote",
  error
}: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  const [votingDeadline, setVotingDeadline] = useState<string | null>(null)

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
  
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      
      try {
        if (onEmailPasswordSubmit) {
          await onEmailPasswordSubmit(email, password);
        }
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (onGoogleSignIn) {
        await onGoogleSignIn();
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setLoading(true);
    try {
      if (onLinkedInSignIn) {
        await onLinkedInSignIn();
      }
    } catch (error) {
      console.error("LinkedIn sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

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
          activeItem="Login"
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
                    text="Welcome to"
                    speed={2}
                    delay={0}
                    spread={100}
                    className="block mb-2"
                    color="hsl(var(--foreground))"
                    shineColor="#b5b5b5"
                  />
                  <ShinyText
                    text={companyName}
                    speed={2}
                    delay={1}
                    spread={100}
                    className="block"
                    color="hsl(var(--foreground))"
                    shineColor="#b5b5b5"
                  />
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-light">
                  Cast your vote and make your voice heard
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:py-0 lg:pt-24">
            <div className="w-full max-w-md">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold text-foreground">Sign In</h2>
                  <p className="text-base text-muted-foreground">Choose your preferred sign-in method</p>
                </div>
                
                <div className="space-y-4">
                  {/* Google Sign In */}
                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="backdrop-blur-sm w-full flex items-center justify-center gap-3 bg-card/50 hover:bg-card/70 text-foreground border border-border rounded-full py-3 px-4 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  
                  {/* LinkedIn Sign In */}
                  <button 
                    onClick={handleLinkedInSignIn}
                    disabled={loading}
                    className="backdrop-blur-sm w-full flex items-center justify-center gap-3 bg-card/50 hover:bg-card/70 text-foreground border border-border rounded-full py-3 px-4 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>Continue with LinkedIn</span>
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-muted-foreground text-sm">or</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {error}
                      </p>
                    </div>
                  )}
                  
                  {/* Email/Password Form */}
                  <form onSubmit={handleEmailPasswordSubmit} className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                    />
                    <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                    />
                    
                    {/* Forgot Password Link */}
                    <div className="text-right">
                      <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    
                    <ShinyButton 
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </ShinyButton>
                  </form>
                  
                  {/* Sign Up Link */}
                  <div className="pt-2">
                    <p className="text-muted-foreground text-sm text-center">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-foreground hover:underline font-medium">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>
                
                {/*<p className="text-xs text-muted-foreground pt-4 text-center">
                  By signing in, you agree to our <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms</Link> and <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
                </p>*/}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </InfiniteGridBackground>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavBar } from "./tubelight-navbar";
import { InfiniteGridBackground } from "./infinite-grid-background";
import ShinyText from "./ShinyText";
import { ShinyButton } from "./shiny-button";

interface SignUpPageProps {
  className?: string;
  logoSrc?: string;
  companyName?: string;
}

export const SignUpPage = ({ 
  className, 
  logoSrc = "/logo.png",
  companyName = "Matrix Vote"
}: SignUpPageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    linkedinUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        setError(otpData.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setOtpStep(true);
      setLoading(false);
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          linkedinUrl: formData.linkedinUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setOtp("");

    try {
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        setError(otpData.error || "Failed to resend OTP");
      }
    } catch (error) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/vote" });
    } catch (error) {
      setError("Google sign-in failed");
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setLoading(true);
    try {
      await signIn("linkedin", { callbackUrl: "/vote" });
    } catch (error) {
      setError("LinkedIn sign-in failed");
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
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-foreground">Success!</h2>
            <p className="text-xl text-muted-foreground">
              Your account has been created successfully. Redirecting to login...
            </p>
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
                    text="Join -"
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
                  Create your account and make your voice heard
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Register Form */}
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
                    {otpStep ? "Verify Your Email" : "Create Account"}
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {otpStep ? (
                      <span>
                        We've sent a 6-digit OTP to{" "}
                        <span className="font-semibold text-primary">
                          {formData.email}
                        </span>
                      </span>
                    ) : (
                      <span>
                        Already have an account?{" "}
                        <Link href="/login" className="text-foreground hover:underline font-medium">
                          Sign in
                        </Link>
                      </span>
                    )}
                  </p>
                </div>

                {otpStep ? (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <input 
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 text-center text-2xl tracking-widest focus:outline-none focus:border-primary/50 bg-card/30 placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                    />

                    {error && (
                      <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <ShinyButton 
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full"
                    >
                      {loading ? "Verifying..." : "Verify & Create Account"}
                    </ShinyButton>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(false);
                          setOtp("");
                          setError("");
                        }}
                        disabled={loading}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ← Change email
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-primary hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Google Sign Up */}
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
                      <span>Sign up with Google</span>
                    </button>
                    
                    {/* LinkedIn Sign Up */}
                    <button 
                      onClick={handleLinkedInSignIn}
                      disabled={loading}
                      className="backdrop-blur-sm w-full flex items-center justify-center gap-3 bg-card/50 hover:bg-card/70 text-foreground border border-border rounded-full py-3 px-4 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span>Sign up with LinkedIn</span>
                    </button>
                    
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-muted-foreground text-sm">or</span>
                      <div className="h-px bg-border flex-1" />
                    </div>
                    
                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input 
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                        required
                        disabled={loading}
                      />
                      <input 
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                        required
                        disabled={loading}
                      />
                      <input 
                        type="url"
                        placeholder="LinkedIn Profile URL"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                        required
                        disabled={loading}
                      />
                      <input 
                        type="password"
                        placeholder="Password (min. 6 characters)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                        required
                        disabled={loading}
                      />
                      <input 
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                        required
                        disabled={loading}
                      />

                      {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                      )}

                      <ShinyButton 
                        type="submit"
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? "Sending OTP..." : "Continue"}
                      </ShinyButton>
                    </form>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground pt-4 text-center">
                  By signing up, you agree to our <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms</Link> and <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </InfiniteGridBackground>
  );
};

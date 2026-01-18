"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { InfiniteGridBackground } from "./infinite-grid-background";
import ShinyText from "./ShinyText";
import { Mail, Lock, AlertCircle } from "lucide-react";

interface AdminLoginPageProps {
  className?: string;
  logoSrc?: string;
  companyName?: string;
}

export const AdminLoginPage = ({ 
  className, 
  logoSrc = "/logo.png",
  companyName = "Matrix Vote"
}: AdminLoginPageProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InfiniteGridBackground className={cn("", className)}>
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Simple top bar with back button */}
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm bg-card/30 border border-border rounded-full px-4 py-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to main site
          </button>
        </div>

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
                    text="Admin"
                    speed={3}
                    delay={0}
                    spread={100}
                    className="block mb-2"
                    color="hsl(var(--foreground))"
                    shineColor="hsl(var(--primary))"
                  />
                  <ShinyText
                    text="Portal"
                    speed={3}
                    delay={1}
                    spread={100}
                    className="block"
                    color="hsl(var(--foreground))"
                    shineColor="hsl(var(--primary))"
                  />
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-light">
                  Secure access to the admin dashboard
                </p>
              </div>

              {/* Security Notice */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Secure Access</h3>
                    <p className="text-sm text-muted-foreground">Protected by enterprise-grade security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">All Access Logged</h3>
                    <p className="text-sm text-muted-foreground">Authorized personnel only</p>
                  </div>
                </div>
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
                  <h2 className="text-3xl font-bold text-foreground">Admin Sign In</h2>
                  <p className="text-base text-muted-foreground">
                    Enter your admin credentials to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full backdrop-blur-sm text-foreground border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 text-left bg-card/30 placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-primary text-primary-foreground font-medium py-3 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Authorized personnel only. All access is logged and monitored for security purposes.
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

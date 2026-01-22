"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vote, Users, Clock, Shield, CheckCircle, XCircle, Calendar, Trophy, Linkedin } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ThemeToggle } from "../theme-toggle";
import { CompactCountdown } from "@/components/compact-countdown";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useSession } from "next-auth/react";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import ShinyText from "@/components/ui/ShinyText";

interface VotingSettings {
  votingDeadline: string | null;
  allowVotingExtension: boolean;
}

export default function AboutPageFlow() {
  const { data: session, status } = useSession();
  const [votingSettings, setVotingSettings] = useState<VotingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsResponse = await fetch("/api/admin/voting-settings");
        if (settingsResponse.ok) {
          const data = await settingsResponse.json();
          setVotingSettings(data);
        }

        // Check if user has voted (only if authenticated)
        if (status === "authenticated") {
          const voteResponse = await fetch("/api/vote", { cache: "no-store" });
          if (voteResponse.ok) {
            const voteData = await voteResponse.json();
            setHasVoted(voteData.hasVoted);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchData();
    }
  }, [status]);

  // Dynamic navbar items based on auth state and vote status
  const getNavLeftItems = () => {
    if (status === "unauthenticated") {
      // CASE 1: Not logged in
      return [
        { name: "About", url: "/about" },
        { name: "Candidates", url: "/candidates" },
        { name: "Login", url: "/login" },
        { name: "Register", url: "/register" },
      ];
    } else if (status === "authenticated" && !hasVoted) {
      // CASE 2: Logged in but not voted
      return [
        { name: "About", url: "/about" },
        { name: "Candidates", url: "/candidates" },
        { name: "Vote", url: "/vote" },
      ];
    } else {
      // CASE 3: Logged in and voted
      return [
        { name: "About", url: "/about" },
        { name: "Candidates", url: "/candidates" },
        { name: "Results", url: "/results" },
      ];
    }
  };

  const navLeftItems = getNavLeftItems();

  const navRightItems = (
    <>
      {votingSettings?.votingDeadline && (
        <CompactCountdown deadline={votingSettings.votingDeadline} />
      )}
      <ThemeToggle />
      {session && (
        <ProfileDropdown
          userName={session.user?.name || "User"}
          userImage={session.user?.image || undefined}
          userEmail={session.user?.email || undefined}
        />
      )}
    </>
  );

  if (loading || status === "loading") {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-secondary/5">
        <NavBar
          leftItems={navLeftItems}
          rightItems={<ThemeToggle />}
          companyName="Matrix Vote"
          showAuthButtons={false}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <NavBar 
        leftItems={navLeftItems} 
        rightItems={navRightItems}
        companyName="Matrix Vote"
        activeItem="About"
        showAuthButtons={false}
      />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20 pt-14"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <ShinyText
                text="Transparent & Secure "
                speed={3}
                delay={0}
                spread={100}
                className="inline-block"
                color="#b5b5b5"
                shineColor="#ffffff"
              />
              <ShinyText
                text="Voting Platform"
                speed={3}
                delay={1}
                spread={100}
                className="inline-block"
                color="#b5b5b5"
                shineColor="#ffffff"
              />
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A modern, user-friendly platform designed to make democratic voting accessible, 
              transparent, and secure for everyone.
            </p>
          </motion.div>

          {/* What is White Matrix Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 sm:mb-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-xl border p-2 sm:rounded-2xl sm:p-2.5">
              <GlowingEffect
                blur={0}
                borderWidth={2.5}
                spread={70}
                glow={true}
                disabled={false}
                proximity={56}
                inactiveZone={0.01}
              />
              <div className="border-0.75 relative backdrop-blur-sm bg-card/30 rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-10 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What is Matrix Vote?</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Matrix Vote is a cutting-edge online voting platform that brings democracy into the digital age. 
                  Our platform enables organizations, communities, and groups to conduct fair, transparent, and 
                  secure elections with real-time results and comprehensive analytics.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Built with modern web technologies, Matrix Vote ensures that every vote counts, every voice 
                  is heard, and every election is conducted with the highest standards of integrity and transparency.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Voting Procedure Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12 sm:mb-16 max-w-5xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Voting Procedure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: Users,
                  title: "1. Register & Login",
                  description: "Create an account using your email or sign in with Google. Complete your profile with LinkedIn URL to participate.",
                  color: "from-blue-500/20 to-blue-600/10",
                  iconColor: "text-blue-600 dark:text-blue-400"
                },
                {
                  icon: Users,
                  title: "2. Browse Candidates",
                  description: "View all candidates on the Candidates page. Read their bios, check their LinkedIn profiles, and make an informed decision.",
                  color: "from-purple-500/20 to-purple-600/10",
                  iconColor: "text-purple-600 dark:text-purple-400"
                },
                {
                  icon: Vote,
                  title: "3. Cast Your Vote",
                  description: "Navigate to the Vote page, select your preferred candidate, and submit your vote. You can only vote once per election.",
                  color: "from-green-500/20 to-green-600/10",
                  iconColor: "text-green-600 dark:text-green-400"
                },
                {
                  icon: Trophy,
                  title: "4. View Results",
                  description: "After voting, check the Results page to see real-time rankings, winner spotlight, and live voting activity.",
                  color: "from-orange-500/20 to-orange-600/10",
                  iconColor: "text-orange-600 dark:text-orange-400"
                },
              ].map((step, index) => (
                <div key={index} className="relative rounded-xl border p-2 sm:rounded-2xl sm:p-2.5">
                  <GlowingEffect
                    blur={0}
                    borderWidth={2.5}
                    spread={70}
                    glow={true}
                    disabled={false}
                    proximity={56}
                    inactiveZone={0.01}
                  />
                  <div className="border-0.75 relative backdrop-blur-sm bg-card/30 rounded-lg sm:rounded-xl p-5 sm:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl mb-4`}>
                      <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Voting Rules Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 sm:mb-16 max-w-5xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Voting Rules & Guidelines
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle,
                  title: "One Vote Per Person",
                  description: "Each registered user can cast only one vote per election. Your vote is final and cannot be changed.",
                  type: "success"
                },
                {
                  icon: Shield,
                  title: "Secure",
                  description: "Your vote is secure. We protect your privacy while ensuring election integrity.",
                  type: "success"
                },
                {
                  icon: Calendar,
                  title: "Voting Deadline",
                  description: "All votes must be submitted before the voting deadline. Extensions may be granted by administrators.",
                  type: "warning"
                },
                {
                  icon: Linkedin,
                  title: "Complete Profile Required",
                  description: "You must complete your profile with a valid LinkedIn URL before you can cast your vote.",
                  type: "warning"
                },
                {
                  icon: XCircle,
                  title: "No Multiple Accounts",
                  description: "Creating multiple accounts to cast multiple votes is strictly prohibited and may result in disqualification.",
                  type: "error"
                },
                {
                  icon: Clock,
                  title: "Real-Time Results",
                  description: "Results are updated in real-time. You can view the current standings on the Results page after voting.",
                  type: "success"
                },
              ].map((rule, index) => (
                <div key={index} className="relative rounded-xl border p-2 sm:rounded-xl sm:p-2">
                  <GlowingEffect
                    blur={0}
                    borderWidth={2.5}
                    spread={70}
                    glow={true}
                    disabled={false}
                    proximity={56}
                    inactiveZone={0.01}
                  />
                  <div className="border-0.75 relative backdrop-blur-sm bg-card/30 rounded-lg sm:rounded-lg p-4 sm:p-5 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${
                        rule.type === 'success' ? 'bg-gradient-to-br from-green-500/20 to-green-600/10' :
                        rule.type === 'warning' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10' :
                        'bg-gradient-to-br from-red-500/20 to-red-600/10'
                      }`}>
                        <rule.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          rule.type === 'success' ? 'text-green-600 dark:text-green-400' :
                          rule.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{rule.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{rule.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12 sm:mb-16 max-w-5xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Shield, title: "Secure Authentication", description: "Google OAuth and email-based login with OTP verification" },
                { icon: Vote, title: "One-Click Voting", description: "Simple and intuitive voting interface for seamless experience" },
                { icon: Trophy, title: "Real-Time Results", description: "Live leaderboards and instant result updates" },
                { icon: Users, title: "Candidate Profiles", description: "Detailed candidate information with LinkedIn integration" },
                { icon: Clock, title: "Voting Deadlines", description: "Automated deadline management with extension support" },
                { icon: CheckCircle, title: "Transparent Process", description: "Complete voting activity logs and audit trails" },
              ].map((feature, index) => (
                <div key={index} className="relative rounded-xl border p-2 sm:rounded-2xl sm:p-2.5">
                  <GlowingEffect
                    blur={0}
                    borderWidth={2.5}
                    spread={70}
                    glow={true}
                    disabled={false}
                    proximity={56}
                    inactiveZone={0.01}
                  />
                  <div className="border-0.75 relative backdrop-blur-sm bg-card/30 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mx-auto mb-3">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="relative rounded-xl border p-2 sm:rounded-2xl sm:p-2.5">
              <GlowingEffect
                blur={0}
                borderWidth={2.5}
                spread={70}
                glow={true}
                disabled={false}
                proximity={56}
                inactiveZone={0.01}
              />
              <div className="border-0.75 relative backdrop-blur-sm bg-card/30 rounded-lg sm:rounded-xl p-8 sm:p-10 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Ready to Make Your Voice Heard?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                  Join thousands of voters who trust White Matrix for secure and transparent elections. 
                  Register now and participate in shaping the future.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href="/register"
                    className="px-6 sm:px-8 py-3 sm:py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold text-sm sm:text-base transition-colors shadow-lg hover:shadow-xl"
                  >
                    Register Now
                  </a>
                  <a
                    href="/vote"
                    className="px-6 sm:px-8 py-3 sm:py-3.5 bg-card/50 hover:bg-card/70 border border-border text-foreground rounded-full font-semibold text-sm sm:text-base transition-colors"
                  >
                    View Candidates
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

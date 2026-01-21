"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface CountdownTimerProps {
  deadline: string
  onExpire?: () => void
}

export function CountdownTimer({ deadline, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline).getTime() - new Date().getTime()

      if (difference <= 0) {
        setExpired(true)
        if (onExpire) onExpire()
        return null
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline, onExpire])

  if (expired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3"
      >
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          variant="white"
        />
        <div className="border-0.75 relative overflow-hidden rounded-xl p-6 md:p-8 dark:shadow-[0px_0px_27px_0px_#2D2D2D] bg-gradient-to-r from-red-500/10 to-rose-500/10">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">
                Voting Has Closed
              </h3>
              <p className="text-sm text-muted-foreground">
                Thank you for your participation!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!timeLeft) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3"
    >
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="border-0.75 relative overflow-hidden rounded-xl p-6 md:p-8 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        <div className="flex flex-col items-center gap-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Clock className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              Voting Closes In
            </h3>
          </div>

          {/* Countdown Grid */}
          <div className="grid grid-cols-4 gap-3 md:gap-4 w-full max-w-md">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>

          {/* Footer Message */}
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            Make sure to cast your vote before time runs out!
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface TimeUnitProps {
  value: number
  label: string
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center shadow-lg">
        <span className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider mt-2">
        {label}
      </span>
    </div>
  )
}

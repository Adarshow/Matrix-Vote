"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface CompactCountdownProps {
  deadline: string
  onExpire?: () => void
}

export function CompactCountdown({ deadline, onExpire }: CompactCountdownProps) {
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
      <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 flex items-center gap-2">
        <Clock className="w-3 h-3 text-red-500 animate-pulse" />
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
          Voting Closed
        </span>
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="backdrop-blur-sm bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <Clock className="w-3 h-3 text-primary animate-pulse" />
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span className="text-foreground">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-foreground">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-foreground">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-foreground">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

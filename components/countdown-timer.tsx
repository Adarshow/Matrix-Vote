"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

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
      <div className="backdrop-blur-xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 rounded-xl p-3 shadow-lg animate-pulse">
        <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold">Voting has closed</span>
        </div>
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 border border-blue-500/20 dark:border-blue-500/30 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        <h3 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Voting Closes In
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-2 mb-1 shadow-md">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {timeLeft.days}
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Days</span>
        </div>
        <div className="text-center">
          <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-2 mb-1 shadow-md">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {timeLeft.hours}
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Hours</span>
        </div>
        <div className="text-center">
          <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-2 mb-1 shadow-md">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {timeLeft.minutes}
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Mins</span>
        </div>
        <div className="text-center">
          <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-2 mb-1 shadow-md">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {timeLeft.seconds}
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Secs</span>
        </div>
      </div>
    </div>
  )
}

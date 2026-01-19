"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileDropdownProps {
  userName?: string | null
  userImage?: string | null
  userEmail?: string | null
  className?: string
}

export function ProfileDropdown({ 
  userName, 
  userImage, 
  userEmail,
  className 
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all duration-200 hover:scale-105"
      >
        {userImage && !imageError ? (
          <Image
            src={userImage}
            alt={userName || "User"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
                {userImage && !imageError ? (
                  <Image
                    src={userImage}
                    alt={userName || "User"}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userName || "User"}
                </p>
                {userEmail && (
                  <p className="text-xs text-white/60 truncate">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}

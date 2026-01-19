"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavItem {
  name: string
  url: string
}

interface NavBarProps {
  leftItems?: NavItem[]
  logoSrc?: string
  companyName?: string
  showAuthButtons?: boolean
  rightItems?: React.ReactNode
  activeItem?: string
  className?: string
}

export function NavBar({ 
  leftItems = [], 
  logoSrc = "/logo.png",
  companyName = "Company",
  showAuthButtons = true,
  rightItems,
  activeItem,
  className 
}: NavBarProps) {
  const [activeTab, setActiveTab] = useState(activeItem || leftItems[0]?.name || "")

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4 pt-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-6 bg-black/40 border border-white/10 backdrop-blur-lg py-3 px-6 rounded-full shadow-lg">
        {/* Left Side - Navigation Items */}
        <div className="flex items-center gap-2">
          {leftItems.map((item) => {
            const isActive = activeTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-sm font-medium px-4 py-2 rounded-full transition-colors",
                  "text-white/70 hover:text-white",
                  isActive && "text-white",
                )}
              >
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-white/10 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                      <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Center - Logo */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image
              src={logoSrc}
              alt={`${companyName} Logo`}
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-white font-semibold hidden sm:inline">{companyName}</span>
        </div>

        {/* Right Side - Auth Buttons */}
        {rightItems ? (
          <div className="flex items-center gap-2">
            {rightItems}
          </div>
        ) : showAuthButtons ? (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium border border-white/20 bg-white/5 text-white rounded-full hover:bg-white/10 transition-colors">
                Login
              </button>
            </Link>
            <Link href="/register">
              <div className="relative group">
                <div className="absolute inset-0 -m-1 rounded-full bg-white/20 opacity-40 filter blur-md pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-lg"></div>
                <button className="relative z-10 px-4 py-2 text-sm font-semibold text-black bg-gradient-to-br from-white to-gray-200 rounded-full hover:from-gray-100 hover:to-gray-300 transition-all duration-200">
                  Sign Up
                </button>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}

"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { motion, useAnimation, useInView } from "framer-motion"

interface BoxRevealProps {
  /** The content to be revealed */
  children: React.ReactNode
  /** Color of the reveal box */
  boxColor?: string
  /** Duration of the animation in seconds */
  duration?: number
  /** Delay before animation starts in seconds */
  delay?: number
  /** Optional className for styling the container */
  className?: string
  /** Optional className for styling the content */
  contentClassName?: string
  /** Whether to start animation when element comes into view */
  startOnView?: boolean
}

export function BoxReveal({
  children,
  boxColor = "#000000",
  duration = 0.7,
  delay = 0,
  className,
  contentClassName,
  startOnView = true,
}: BoxRevealProps) {
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })
  const [hasAnimated, setHasAnimated] = useState(false)

  // Animation sequence
  useEffect(() => {
    const sequence = async () => {
      // If startOnView is enabled and element isn't in view yet, don't animate
      if (startOnView && !isInView) return
      
      // Start animation sequence
      await controls.start({
        scaleX: 1,
        transition: { duration: duration * 0.6, delay, ease: "easeInOut" },
      })
      
      await controls.start({
        left: "100%",
        transition: { duration: duration * 0.4, ease: "easeInOut" },
      })
      
      // Reset when animation completes (for potential reruns)
      controls.start({
        left: 0,
        scaleX: 0,
        transition: { duration: 0 },
      })
      
      setHasAnimated(true)
    }
    
    sequence()
  }, [controls, duration, delay, isInView, startOnView])

  return (
    <div 
      ref={containerRef} 
      className={cn("relative overflow-hidden", className || "")}
    >
      {/* The colored box that animates */}
      <motion.div
        initial={{ scaleX: 0, left: 0 }}
        animate={controls}
        style={{ 
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          transformOrigin: "left",
          backgroundColor: boxColor,
          zIndex: 10
        }}
      />
      
      {/* The content to be revealed */}
      <div 
        className={cn(
          "opacity-0 transition-opacity duration-300", 
          hasAnimated ? "opacity-100" : "",
          contentClassName || ""
        )}
      >
        {children}
      </div>
    </div>
  )
}
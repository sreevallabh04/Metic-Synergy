"use client"

import type React from "react"
import { cn } from "../../lib/utils"
import { AnimatePresence, motion, type MotionProps } from "framer-motion"
import { useEffect, useRef, useState } from "react"

type AnimationType = "blurInUp" | "blurInDown" | "blurIn"
type AnimationBy = "character" | "word" | "line"

interface TextAnimateProps extends MotionProps {
  /** The text content to be animated */
  children: string
  /** Optional className for styling */
  className?: string
  /** Animation type to apply */
  animation?: AnimationType
  /** How to split the text for animation */
  by?: AnimationBy
  /** Duration of the animation in milliseconds */
  duration?: number
  /** Delay before animation starts in milliseconds */
  delay?: number
  /** Component to render as - defaults to div */
  as?: React.ElementType
  /** Whether to animate only once */
  once?: boolean
  /** Whether to start animation when element comes into view */
  startOnView?: boolean
}

// Helper to split text by the chosen method
const splitText = (text: string, by: AnimationBy): string[] => {
  switch (by) {
    case "word":
      return text.split(/\s+/).filter(Boolean)
    case "character":
      return text.split("")
    case "line":
      return [text]
    default:
      return text.split("")
  }
}

// Animation variants for different animation types
const getAnimationVariants = (animation: AnimationType) => {
  switch (animation) {
    case "blurInUp":
      return {
        hidden: { 
          opacity: 0, 
          y: 20, 
          filter: "blur(10px)" 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          transition: { 
            type: "spring",
            damping: 12
          }
        }
      }
    case "blurInDown":
      return {
        hidden: { 
          opacity: 0, 
          y: -20, 
          filter: "blur(10px)" 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          transition: { 
            type: "spring",
            damping: 12
          }
        }
      }
    case "blurIn":
    default:
      return {
        hidden: { 
          opacity: 0, 
          filter: "blur(10px)" 
        },
        visible: { 
          opacity: 1, 
          filter: "blur(0px)",
          transition: { 
            type: "spring",
            damping: 12
          }
        }
      }
  }
}

export function TextAnimate({
  children,
  className,
  animation = "blurIn",
  by = "character",
  duration = 800,
  delay = 0,
  as: Component = "div",
  once = false,
  startOnView = true,
  ...props
}: TextAnimateProps) {
  const MotionComponent = motion(Component)
  const elementRef = useRef<HTMLElement>(null)
  const [shouldAnimate, setShouldAnimate] = useState(!startOnView)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Handle animation start based on view or delay
  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setShouldAnimate(true)
      }, delay)
      return () => clearTimeout(startTimeout)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setTimeout(() => {
            setShouldAnimate(true)
            if (once) setHasAnimated(true)
          }, delay)
        } else if (!entry.isIntersecting && !once) {
          setShouldAnimate(false)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay, startOnView, once, hasAnimated])

  const textFragments = splitText(children, by)
  const animationVariants = getAnimationVariants(animation)
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: duration / (textFragments.length * 10),
        delayChildren: 0
      }
    }
  }
  
  return (
    <MotionComponent
      ref={elementRef}
      className={cn("overflow-hidden", className || "")}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={container}
      {...props}
    >
      <AnimatePresence>
        {textFragments.map((fragment, index) => (
          <motion.span
            key={`${fragment}-${index}`}
            variants={animationVariants}
            className={cn(
              by === "character" ? "inline-block" : "",
              by === "word" ? "inline-block mr-2" : "",
              by === "line" ? "block" : ""
            )}
          >
            {fragment}
            {by === "word" && index < textFragments.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </AnimatePresence>
    </MotionComponent>
  )
}
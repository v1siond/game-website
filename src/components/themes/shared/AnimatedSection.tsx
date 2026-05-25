'use client'

import { useRef, useState, useEffect } from 'react'
import { useInViewTrigger } from '@/hooks/useScrollAnimation'

type RevealAnimation =
  | 'fade-in'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'chase-left'    // Character chases from left, drops section
  | 'chase-right'   // Character chases from right, drops section
  | 'portal-in'     // Section emerges from portal
  | 'shatter-in'    // Section shatters into view
  | 'paint-in'      // Section painted in with brush stroke
  | 'glitch-in'     // Section glitches into existence

interface AnimatedSectionProps {
  children: React.ReactNode
  animation?: RevealAnimation
  delay?: number
  duration?: number
  className?: string
  characterElement?: React.ReactNode // Optional character for chase animations
  onReveal?: () => void
}

export function AnimatedSection({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 800,
  className = '',
  characterElement,
  onReveal,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.2 })
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showCharacter, setShowCharacter] = useState(false)

  useEffect(() => {
    if (hasEntered && !animationComplete) {
      // For chase animations, show character first
      if (animation.startsWith('chase')) {
        setShowCharacter(true)
        // Character runs across, then section appears
        setTimeout(() => {
          setAnimationComplete(true)
          onReveal?.()
        }, delay + duration * 0.6)
        // Hide character after animation
        setTimeout(() => {
          setShowCharacter(false)
        }, delay + duration)
      } else {
        setTimeout(() => {
          setAnimationComplete(true)
          onReveal?.()
        }, delay)
      }
    }
  }, [hasEntered, animationComplete, animation, delay, duration, onReveal])

  const getAnimationStyles = (): React.CSSProperties => {
    const baseTransition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

    if (!hasEntered) {
      // Initial hidden state
      switch (animation) {
        case 'slide-left':
        case 'chase-left':
          return { opacity: 0, transform: 'translateX(-100px)', transition: baseTransition }
        case 'slide-right':
        case 'chase-right':
          return { opacity: 0, transform: 'translateX(100px)', transition: baseTransition }
        case 'slide-up':
          return { opacity: 0, transform: 'translateY(50px)', transition: baseTransition }
        case 'portal-in':
          return { opacity: 0, transform: 'scale(0) rotate(180deg)', transition: baseTransition }
        case 'shatter-in':
          return { opacity: 0, transform: 'scale(1.5)', filter: 'blur(10px)', transition: baseTransition }
        case 'paint-in':
          return { opacity: 0, clipPath: 'inset(0 100% 0 0)', transition: baseTransition }
        case 'glitch-in':
          return { opacity: 0, transform: 'skewX(20deg) translateX(-20px)', transition: baseTransition }
        default:
          return { opacity: 0, transition: baseTransition }
      }
    }

    // Revealed state
    if (animationComplete || !animation.startsWith('chase')) {
      return {
        opacity: 1,
        transform: 'translateX(0) translateY(0) scale(1) rotate(0deg) skewX(0deg)',
        filter: 'blur(0)',
        clipPath: 'inset(0 0 0 0)',
        transition: baseTransition,
        transitionDelay: `${delay}ms`,
      }
    }

    // Chase animation - waiting for character
    return { opacity: 0, transition: baseTransition }
  }

  const getCharacterAnimation = (): React.CSSProperties => {
    if (!showCharacter) {
      return { opacity: 0 }
    }

    const isLeft = animation === 'chase-left'
    return {
      position: 'absolute' as const,
      [isLeft ? 'left' : 'right']: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      animation: `${isLeft ? 'chase-run-left' : 'chase-run-right'} ${duration}ms ease-out forwards`,
      zIndex: 100,
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Character for chase animations */}
      {characterElement && showCharacter && (
        <div style={getCharacterAnimation()}>
          {characterElement}
        </div>
      )}

      {/* Main content */}
      <div style={getAnimationStyles()}>
        {children}
      </div>
    </div>
  )
}

// Content overlay for better readability
export function ContentOverlay({
  children,
  className = '',
  opacity = 0.7,
}: {
  children: React.ReactNode
  className?: string
  opacity?: number
}) {
  return (
    <div className={`relative z-10 ${className}`}>
      <div
        className="absolute inset-0 -z-10 rounded-lg"
        style={{
          background: `rgba(0, 0, 0, ${opacity})`,
          backdropFilter: 'blur(2px)',
        }}
      />
      {children}
    </div>
  )
}

// Global chase animation styles - add to theme's style jsx
export const chaseAnimationStyles = `
  @keyframes chase-run-left {
    0% { left: -100px; opacity: 0; }
    10% { left: -50px; opacity: 1; }
    80% { left: calc(100% + 50px); opacity: 1; }
    100% { left: calc(100% + 100px); opacity: 0; }
  }
  @keyframes chase-run-right {
    0% { right: -100px; opacity: 0; }
    10% { right: -50px; opacity: 1; }
    80% { right: calc(100% + 50px); opacity: 1; }
    100% { right: calc(100% + 100px); opacity: 0; }
  }
`

export default AnimatedSection

'use client'

import { useState, useEffect, memo, ReactNode, useRef } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { FixedCombatLayer, COMBAT_IN_VIEW, moveAndFade } from './fixedCombat'
import { KnightCharacter } from './KnightCharacter'
import { BattleBug } from './BattleReveal'

// ============================================
// BUG ATTACK REVEAL ANIMATION
// ============================================

interface BugPullRevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

type AnimationPhase =
  | 'idle'
  | 'alex-enters'
  | 'bug-appears'
  | 'bug-hits'
  | 'alex-blocks'
  | 'attack-stance'
  | 'complete'

const ATTACK_TIMING = {
  'alex-enters': 0,
  'bug-appears': 400,
  'bug-hits': 700,
  'alex-blocks': 1000,
  'attack-stance': 1400,
  'complete': 1900,
}

/** Alex's pose: `track` is his x across the layer, `self` his offset from it, by his own width. */
interface AlexPose {
  track: string
  self: string
  opacity: number
  timing?: string
}

const ALEX_POSES: Record<AnimationPhase, AlexPose> = {
  'idle': { track: '45%', self: '-50%', opacity: 0 },
  'alex-enters': { track: '45%', self: '-50%', opacity: 1, timing: '400ms ease-out' },
  'bug-appears': { track: '45%', self: '-50%', opacity: 1 },
  'bug-hits': { track: '40%', self: '-50%', opacity: 1, timing: '150ms ease-out' },
  'alex-blocks': { track: '8%', self: '0', opacity: 1, timing: '250ms cubic-bezier(0.34, 1.56, 0.64, 1)' },
  'attack-stance': { track: '15%', self: '0', opacity: 1, timing: '200ms ease-out' },
  'complete': { track: '15%', self: '0', opacity: 1, timing: '200ms ease-out' },
}

/** The bug's pose: `track` is its x from the layer's right edge (negative is inward). */
interface BugPose {
  track: string
  transform: string
  opacity: number
  timing?: string
  float?: boolean
}

const BUG_POSES: Record<AnimationPhase, BugPose> = {
  'idle': { track: '180px', transform: 'translateY(0)', opacity: 0 },
  'alex-enters': { track: '180px', transform: 'translateY(0)', opacity: 0 },
  'bug-appears': { track: '-2%', transform: 'translateY(0)', opacity: 1, timing: '350ms ease-out' },
  'bug-hits': {
    track: '-5%',
    transform: 'translateX(-20px) translateY(-8px) rotate(-8deg)',
    opacity: 1,
    timing: '150ms ease-out',
  },
  'alex-blocks': { track: '-3%', transform: 'translateY(0) rotate(0deg)', opacity: 1, timing: '200ms ease-out' },
  'attack-stance': { track: '-16%', transform: 'translateY(-70px)', opacity: 1, timing: '400ms ease-out', float: true },
  'complete': { track: '-16%', transform: 'translateY(-70px)', opacity: 1, timing: '400ms ease-out', float: true },
}

const BUG_FLOAT = 'bugFloat 1.5s ease-in-out infinite'
const SHADOW_TIMING = '400ms ease-out'

export const BugPullReveal = memo(function BugPullReveal({
  children,
  triggered,
  className = '',
}: BugPullRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [legPhase, setLegPhase] = useState(0)
  const hasAnimated = useRef(false)
  // continuous in-view so the fixed Alex/bug fade out once we scroll past the section
  const { ref: stageRef, inView } = useSectionTrigger(COMBAT_IN_VIEW)

  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return

    let rafId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time
      const speed = phase === 'bug-hits' ? 0.015 : phase === 'attack-stance' ? 0.003 : 0.006
      setLegPhase(prev => (prev + delta * speed) % 1)
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [phase])

  useEffect(() => {
    if (!triggered || hasAnimated.current) {
      if (!triggered && !hasAnimated.current) {
        setPhase('idle')
      }
      return
    }

    hasAnimated.current = true
    setPhase('alex-enters')

    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase('bug-appears'), ATTACK_TIMING['bug-appears']))
    timers.push(setTimeout(() => setPhase('bug-hits'), ATTACK_TIMING['bug-hits']))
    timers.push(setTimeout(() => setPhase('alex-blocks'), ATTACK_TIMING['alex-blocks']))
    timers.push(setTimeout(() => setPhase('attack-stance'), ATTACK_TIMING['attack-stance']))
    timers.push(setTimeout(() => setPhase('complete'), ATTACK_TIMING['complete']))

    return () => timers.forEach(t => clearTimeout(t))
  }, [triggered])

  // Each figure rides a full-width track inside the fixed layer. The track's translateX in percent
  // resolves against the layer's width, so it places the figure as left or right would, on the compositor.
  const alex = ALEX_POSES[phase]
  const bug = BUG_POSES[phase]
  const isFloating = bug.float === true
  const alexTrackStyle: React.CSSProperties = {
    transform: `translateX(${alex.track})`,
    transition: alex.timing && `transform ${alex.timing}`,
  }
  const alexStyle: React.CSSProperties = {
    transform: `translateX(${alex.self})`,
    opacity: alex.opacity,
    transition: alex.timing && moveAndFade(alex.timing),
  }
  const bugTrackStyle: React.CSSProperties = {
    transform: `translateX(${bug.track})`,
    transition: bug.timing && `transform ${bug.timing}`,
  }
  const bugStyle: React.CSSProperties = {
    transform: bug.transform,
    opacity: bug.opacity,
    transition: bug.timing && moveAndFade(bug.timing),
    animation: isFloating ? BUG_FLOAT : undefined,
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
      case 'alex-enters':
        return { transform: 'translateX(100%)', opacity: 0 }
      case 'bug-appears':
        return {
          transform: 'translateX(55%)',
          opacity: 0.7,
          transition: moveAndFade('350ms ease-out')
        }
      case 'bug-hits':
        return {
          transform: 'translateX(15%)',
          opacity: 0.95,
          transition: moveAndFade('300ms ease-out')
        }
      case 'alex-blocks':
      case 'attack-stance':
      case 'complete':
        return {
          transform: 'translateX(0)',
          opacity: 1,
          transition: moveAndFade('250ms cubic-bezier(0.34, 1.56, 0.64, 1)')
        }
      default:
        return { transform: 'translateX(0)', opacity: 1 }
    }
  }

  const showBug = phase !== 'idle' && phase !== 'alex-enters'
  const showAlex = phase !== 'idle'

  return (
    <div ref={stageRef} className={`relative w-full ${className}`} style={{ minHeight: '280px' }}>
      {/* Alex (knight) + bug pinned to the viewport bottom; only the content scrolls */}
      {(showAlex || showBug) && (
        <FixedCombatLayer inView={inView}>
          {showAlex && (
            <div className="absolute inset-x-0 bottom-[15%] z-10 pointer-events-none" style={alexTrackStyle}>
              <div className="absolute left-0 bottom-0" style={alexStyle}>
                <KnightCharacter scale={1.5} facingDirection="right" breathing={phase === 'complete'} />
              </div>
            </div>
          )}

          {showBug && (
            <>
              <div
                className="absolute inset-x-0 bottom-[15%] pointer-events-none"
                style={{ transform: `translateX(${bug.track})`, transition: `transform ${SHADOW_TIMING}` }}
              >
                <div
                  className="absolute right-0 bottom-0"
                  style={{
                    transform: isFloating ? 'translateY(60px)' : 'translateY(40px)',
                    opacity: bug.opacity,
                    transition: moveAndFade(SHADOW_TIMING),
                    animation: isFloating ? BUG_FLOAT : undefined,
                  }}
                >
                  {/* drawn at the floating size and scaled from its bottom right corner, so it grows
                      up and to the left like a box anchored to the right and bottom */}
                  <div
                    className="rounded-full origin-bottom-right"
                    style={{
                      width: 100,
                      height: 20,
                      background: 'radial-gradient(ellipse, rgba(15,10,26,0.6) 0%, transparent 70%)',
                      transform: isFloating ? 'translateX(20px)' : 'translateX(20px) scale(0.8)',
                      transition: `transform ${SHADOW_TIMING}`,
                    }}
                  />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-[15%] z-30 pointer-events-none" style={bugTrackStyle}>
                <div className="absolute right-0 bottom-0" style={bugStyle}>
                  <BattleBug size={140} legPhase={legPhase} antennaPhase={legPhase * 1.3} />
                </div>
              </div>
            </>
          )}
        </FixedCombatLayer>
      )}

      <div className="relative z-20" style={getContentStyle()}>
        {children}
      </div>

      <style>{`
        @keyframes bugFloat {
          0%, 100% { transform: translateY(-70px); }
          50% { transform: translateY(-85px); }
        }
      `}</style>
    </div>
  )
})

import type { CSSProperties, ReactNode } from 'react'
import { Plank } from './crateArt'
import { PORTAL } from './palette'
import bursts from './burst.module.css'

// A crate breaking the way the time travel platformer breaks them (Warped, named in code only): the box
// is gone in a frame, its planks fly out spinning and fall, and what it held pops up out of the spot.
// Four planks per burst, each on its own path (--dx, --dy, --spin), one play off the parent's key.

const FLIGHT = [
  { dx: '-150%', dy: '-140%', spin: '-240deg' },
  { dx: '140%', dy: '-170%', spin: '260deg' },
  { dx: '-120%', dy: '-40%', spin: '-160deg' },
  { dx: '160%', dy: '-60%', spin: '200deg' },
] as const

const TONE: Record<'wood' | 'tnt' | 'nitro' | 'metal', string> = {
  wood: PORTAL.PLANK,
  tnt: PORTAL.TNT,
  nitro: PORTAL.NITRO,
  metal: PORTAL.METAL,
}

export type BurstTone = keyof typeof TONE

/** The flying planks, laid over the crate's box; plays once on mount. */
export function Planks({ tone = 'wood' }: { tone?: BurstTone }) {
  return (
    <span className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {FLIGHT.map(({ dx, dy, spin }) => (
        <span key={dx} className={`absolute left-[30%] top-[40%] h-[16%] w-[40%] ${bursts.plank}`} style={{ '--dx': dx, '--dy': dy, '--spin': spin } as CSSProperties}>
          <Plank tone={TONE[tone]} className="h-full w-full" />
        </span>
      ))}
    </span>
  )
}

/** What a crate held, popping up out of it with an overshoot and then hanging there. */
export function PopUp({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`pointer-events-none absolute ${bursts.pop} ${className}`}>{children}</span>
}

/** The white ring of a blast, for TNT, nitro and the body slam's shockwave. */
export function Blast({ tone = 'tnt' }: { tone?: 'tnt' | 'nitro' | 'slam' }) {
  return <span className={`pointer-events-none absolute inset-[-30%] z-10 rounded-full ${bursts.blast} ${bursts[tone]}`} aria-hidden="true" />
}

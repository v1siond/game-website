'use client'

import type { ReactNode } from 'react'
import type { Profession } from '@/contexts/ProfessionContext'
import { Bandicoot } from './bandicoot'
import { PORTAL } from './palette'
import ride from './vehicles.module.css'

// The rides of the time travel platformer's eras (Warped, named in code only, research
// 2026-10-21-w4-neon-portals): the baby T rex he rides through the prehistoric levels, the motorbike of
// the future city road and the jet ski of the Arabian harbour. Each is drawn facing right in a box twice
// his width (viewBox -40 -12 160 124), with his seat at his hips, so he sits on it in the ride pose with
// his own sprite laid over the middle half. The legs, the wheels or the spray loop while it moves;
// a still ride (reduced motion, a preview) holds its first frame.

export type Vehicle = 'rex' | 'bike' | 'jetski'

const INK = PORTAL.VOID

function Rex() {
  return (
    <>
      <path d="M8 84 Q-20 80 -38 96 Q-14 94 10 96 Z" fill="#6cc04a" stroke={INK} strokeWidth="2" />
      <g className={ride.legBack}>
        <path d="M20 92 L14 108 H26" fill="none" stroke="#3f8a2a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <ellipse cx="40" cy="88" rx="34" ry="16" fill="#6cc04a" stroke={INK} strokeWidth="2" />
      <path d="M14 82 Q40 96 70 82" fill="none" stroke="#f2d84a" strokeWidth="5" opacity="0.8" />
      <g className={ride.legFront}>
        <path d="M56 94 L62 108 H74" fill="none" stroke="#4fa83a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M66 80 Q78 66 90 60" fill="none" stroke="#6cc04a" strokeWidth="14" strokeLinecap="round" />
      <path d="M80 50 Q96 38 116 48 L118 62 Q104 70 86 68 Q76 62 80 50 Z" fill="#6cc04a" stroke={INK} strokeWidth="2" />
      <path d="M92 64 L96 60 L100 64 L104 60 L108 64" fill="none" stroke={PORTAL.WHITE} strokeWidth="2" />
      <circle cx="96" cy="50" r="5" fill={PORTAL.WHITE} stroke={INK} strokeWidth="1.5" />
      <circle cx="97.5" cy="50.5" r="2.2" fill={INK} />
      <path d="M74 84 l6 6 M70 86 l4 7" stroke="#3f8a2a" strokeWidth="3" strokeLinecap="round" />
    </>
  )
}

function Wheel({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 100)`}>
      <circle r="13" fill={INK} />
      <g className={ride.wheel}>
        <circle r="8" fill="none" stroke={PORTAL.TEAL} strokeWidth="2.5" />
        <path d="M-8 0 H8 M0 -8 V8" stroke={PORTAL.TEAL} strokeWidth="2" />
      </g>
    </g>
  )
}

function Bike() {
  return (
    <>
      <path d="M-30 96 H-8" stroke={PORTAL.VIOLET} strokeWidth="4" strokeLinecap="round" className={ride.trail} />
      <Wheel x={-6} />
      <Wheel x={96} />
      <path d="M-6 100 L20 82 H64 L96 100" fill="none" stroke={PORTAL.METAL_DARK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M14 78 Q40 70 70 74 L86 84 Q60 94 18 92 Z" fill="#c03a8a" stroke={INK} strokeWidth="2" />
      <path d="M22 78 H54" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M70 74 L66 56 L74 54" fill="none" stroke={PORTAL.METAL} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M84 82 L98 80" stroke={PORTAL.GOLD} strokeWidth="5" strokeLinecap="round" />
    </>
  )
}

function JetSki() {
  return (
    <>
      <g className={ride.spray} fill={PORTAL.WHITE} opacity="0.85">
        <circle cx="-22" cy="98" r="5" />
        <circle cx="-32" cy="92" r="4" />
        <circle cx="-14" cy="90" r="3" />
      </g>
      <path d="M-16 92 H112 Q104 108 84 108 H-8 Z" fill="#f2d84a" stroke={INK} strokeWidth="2" />
      <path d="M-12 96 H108" stroke="#c03a1a" strokeWidth="3" />
      <path d="M12 82 Q40 74 60 80 L58 92 H14 Z" fill="#1446b8" stroke={INK} strokeWidth="2" />
      <path d="M62 92 L70 64 L78 62" fill="none" stroke={PORTAL.METAL} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-40 110 H120" stroke={PORTAL.TEAL} strokeWidth="3" opacity="0.7" />
    </>
  )
}

const ART: Record<Vehicle, () => ReactNode> = { rex: Rex, bike: Bike, jetski: JetSki }

interface RideProps {
  vehicle: Vehicle
  profession: Profession
  /** Holds the ride and him on their first frame. */
  still?: boolean
  /** Off once he has hopped down and the ride goes on alone. */
  rider?: boolean
  /** Sizing and position; the ride is positioned (relative or absolute) by the caller. */
  className: string
}

/** Him seated on one of the eras' rides. */
export function Ride({ vehicle, profession, still = false, rider = true, className }: RideProps) {
  const Art = ART[vehicle]
  return (
    <span className={`block aspect-[160/124] ${ride.ride} ${still ? ride.still : ''} ${className}`} aria-hidden="true">
      <svg viewBox="-40 -12 160 124" className="absolute inset-0 h-full w-full overflow-visible" focusable="false">
        <Art />
      </svg>
      {rider && (
        <span className="absolute left-1/4 top-[5%] block h-full w-1/2">
          <Bandicoot profession={profession} pose="ride" frame={still ? 0 : undefined} className="h-full w-full" />
        </span>
      )}
    </span>
  )
}

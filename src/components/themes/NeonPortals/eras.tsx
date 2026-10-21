import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'

// The time periods the warp room's level portals preview (the time travel platformer, Warped, named in
// code only), each a small scene in a 200 by 120 box that a portal's round hologram shows before you step
// in: the period's sky, its landmark on the horizon, the path in front.
//   future       a neon city at night, towers with lit windows, a hover lane
//   arabian      domes and a minaret under a crescent moon, a flying carpet
//   wall         the great wall winding over green hills at sunrise
//   egypt        pyramids and a sphinx under a white sun, dunes
//   medieval     a castle on a crag over a swamp, a stormy sky
//   prehistoric  a smoking volcano behind palms, a trail of stepping stones
//   underwater   light shafts, seaweed, bubbles and a sunken wreck
//   highway      a desert road at dusk running to the horizon, dashes and cactus
// The era's own colours live here (ERA_TONE), the only place that draws them; the frame and the common
// colours come from the palette. The scenes are still: the portal that frames one turns it.

export type Era = 'future' | 'arabian' | 'wall' | 'egypt' | 'medieval' | 'prehistoric' | 'underwater' | 'highway'

interface Tone {
  skyTop: string
  skyLow: string
  far: string
  near: string
  accent: string
}

const ERA_TONE: Record<Era, Tone> = {
  future: { skyTop: '#060a2a', skyLow: '#3b1d7a', far: '#1d2a6b', near: '#0d1440', accent: '#3fe0d0' },
  arabian: { skyTop: '#0e1a4a', skyLow: '#6a3a8f', far: '#d9a85a', near: '#8f5a2c', accent: '#ffe08a' },
  wall: { skyTop: '#ff9d5c', skyLow: '#ffe2a1', far: '#4f9a4a', near: '#2f6b2e', accent: '#c9b28a' },
  egypt: { skyTop: '#4fa6e8', skyLow: '#ffe7b0', far: '#e3b360', near: '#c48a3a', accent: '#fff4c8' },
  medieval: { skyTop: '#28304a', skyLow: '#5f6e7a', far: '#3c4a3e', near: '#24331f', accent: '#9aa7b0' },
  prehistoric: { skyTop: '#ff7a3a', skyLow: '#ffcf7a', far: '#5a3a2a', near: '#2f6b2e', accent: '#ff4a1a' },
  underwater: { skyTop: '#0a5a8a', skyLow: '#05243f', far: '#0d7a8a', near: '#1f8f4a', accent: '#9ff3ff' },
  highway: { skyTop: '#3a1d5c', skyLow: '#ff8a4a', far: '#a8542a', near: '#3a2a3a', accent: '#ffd23f' },
}

const LANDMARK: Record<Era, (tone: Tone) => ReactNode> = {
  future: (t) => (
    <>
      {[
        [14, 40, 18],
        [36, 22, 14],
        [54, 48, 20],
        [80, 14, 16],
        [100, 34, 22],
        [126, 20, 14],
        [144, 44, 18],
        [166, 26, 20],
      ].map(([x, top, w]) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={96 - top} fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
          {[0, 1, 2, 3].map((row) => (
            <rect key={row} x={x + 3} y={top + 6 + row * 12} width={w - 6} height="3" fill={row % 2 ? t.accent : PORTAL.VIOLET} opacity="0.8" />
          ))}
        </g>
      ))}
      <path d="M0 74 Q100 60 200 74" fill="none" stroke={t.accent} strokeWidth="2" strokeDasharray="6 4" />
      <ellipse cx="62" cy="66" rx="10" ry="3" fill={PORTAL.CRYSTAL} />
    </>
  ),
  arabian: (t) => (
    <>
      <path d="M150 20 A12 12 0 1 0 162 34 A9 9 0 1 1 150 20 Z" fill={t.accent} />
      <path d="M20 96 V62 H70 V96 Z M24 62 Q45 30 66 62 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M90 96 V44 H98 V96 Z M88 44 Q94 28 100 44 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M110 96 V70 H180 V96 Z M118 70 Q145 40 172 70 Z" fill={t.near} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M40 40 Q60 34 80 40 L76 44 Q60 40 44 44 Z" fill={PORTAL.FRUIT_RED} stroke={PORTAL.VOID} strokeWidth="0.8" />
    </>
  ),
  wall: (t) => (
    <>
      <circle cx="160" cy="34" r="14" fill="#fff4c8" />
      <path d="M0 80 Q40 50 80 70 Q120 40 160 62 Q180 56 200 60 V120 H0 Z" fill={t.far} />
      <path d="M0 86 Q40 58 80 76 Q120 48 160 68 Q182 62 200 66" fill="none" stroke={t.accent} strokeWidth="8" />
      <path d="M0 86 Q40 58 80 76 Q120 48 160 68 Q182 62 200 66" fill="none" stroke={PORTAL.VOID} strokeWidth="1" strokeDasharray="3 5" transform="translate(0 -5)" />
      <rect x="76" y="56" width="10" height="16" fill={t.accent} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M74 56 H88 L81 49 Z" fill={PORTAL.FRUIT_RED} />
    </>
  ),
  egypt: (t) => (
    <>
      <circle cx="40" cy="30" r="13" fill={t.accent} />
      <path d="M70 92 L110 36 L150 92 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M110 36 L150 92 H124 Z" fill={t.near} />
      <path d="M140 92 L166 56 L192 92 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M20 92 V76 Q24 66 32 68 L36 76 H52 V92 Z" fill={t.near} stroke={PORTAL.VOID} strokeWidth="1" />
    </>
  ),
  medieval: (t) => (
    <>
      <path d="M118 18 L112 34 L120 32 L114 48" fill="none" stroke={PORTAL.GOLD} strokeWidth="1.6" />
      <path d="M40 90 L60 50 L100 46 L120 90 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M62 50 V26 H72 V50 Z M86 46 V30 H96 V46 Z" fill={t.accent} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M60 26 H74 L67 16 Z M84 30 H98 L91 20 Z" fill={PORTAL.FRUIT_DEEP} />
      <rect x="64" y="34" width="4" height="5" fill={PORTAL.GOLD} />
      <ellipse cx="100" cy="100" rx="110" ry="12" fill="#3f5a3a" opacity="0.9" />
    </>
  ),
  prehistoric: (t) => (
    <>
      <path d="M60 96 L96 30 H112 L148 96 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M96 30 Q104 40 112 30 L106 46 L102 40 Z" fill={t.accent} />
      <ellipse cx="104" cy="18" rx="12" ry="7" fill={PORTAL.STONE_LIT} opacity="0.8" />
      {[24, 172].map((x) => (
        <g key={x}>
          <path d={`M${x} 96 Q${x + 2} 70 ${x - 2} 48`} fill="none" stroke={PORTAL.BAND} strokeWidth="3" />
          <path d={`M${x - 2} 48 Q${x - 18} 44 ${x - 24} 54 M${x - 2} 48 Q${x + 14} 42 ${x + 22} 52 M${x - 2} 48 Q${x - 6} 36 ${x - 16} 34`} fill="none" stroke={t.near} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  underwater: (t) => (
    <>
      {[30, 90, 150].map((x) => (
        <path key={x} d={`M${x} 0 L${x + 20} 0 L${x + 40} 120 L${x + 10} 120 Z`} fill={t.accent} opacity="0.12" />
      ))}
      <path d="M110 96 L130 70 L180 74 L172 96 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M140 72 V44 M140 48 H156" stroke={PORTAL.BAND} strokeWidth="2" />
      {[16, 40, 64].map((x) => (
        <path key={x} d={`M${x} 100 Q${x - 6} 80 ${x} 64 Q${x + 6} 50 ${x} 36`} fill="none" stroke={t.near} strokeWidth="4" strokeLinecap="round" />
      ))}
      {[
        [86, 60, 3],
        [92, 44, 2],
        [84, 30, 4],
      ].map(([x, y, r]) => (
        <circle key={y} cx={x} cy={y} r={r} fill="none" stroke={t.accent} strokeWidth="1" />
      ))}
    </>
  ),
  highway: (t) => (
    <>
      <circle cx="100" cy="64" r="20" fill={t.accent} opacity="0.85" />
      <path d="M0 70 H200 V120 H0 Z" fill={t.far} />
      <path d="M86 70 L114 70 L180 120 L20 120 Z" fill={t.near} />
      {[78, 92, 110].map((y, i) => (
        <rect key={y} x={98 - i * 1.6} y={y} width={4 + i * 3.2} height={3 + i * 2} fill={t.accent} />
      ))}
      <path d="M30 90 V70 M30 78 H22 V72 M30 82 H38 V74" fill="none" stroke="#2f6b2e" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
}

// The ground the path runs on, coloured per era; the underwater floor and the highway draw their own.
const GROUND: Partial<Record<Era, true>> = { future: true, arabian: true, wall: true, egypt: true, medieval: true, prehistoric: true }

export function EraScene({ era, className = '' }: { era: Era; className?: string }) {
  const tone = ERA_TONE[era]
  const sky = `npe-sky-${era}`

  return (
    <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone.skyTop} />
          <stop offset="1" stopColor={tone.skyLow} />
        </linearGradient>
      </defs>
      <rect width="200" height="120" fill={`url(#${sky})`} />
      {LANDMARK[era](tone)}
      {GROUND[era] && (
        <>
          <path d="M0 96 H200 V120 H0 Z" fill={tone.near} />
          <path d="M80 96 H120 L140 120 H60 Z" fill={PORTAL.PLANK_DARK} opacity="0.75" />
        </>
      )}
    </svg>
  )
}

/** The era each profession's level button warps to. */
export const PROFESSION_ERA: Record<Profession, Era> = { engineer: 'future', drummer: 'arabian', fighter: 'wall' }

/** The eras the jobs' level portals cycle through, in order. */
export const LEVEL_ERAS: readonly Era[] = ['egypt', 'medieval', 'prehistoric', 'underwater', 'highway', 'wall', 'arabian', 'future']

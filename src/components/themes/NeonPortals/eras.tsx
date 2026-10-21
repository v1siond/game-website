import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'

// The time periods the warp room's level portals preview (the time travel platformer, Warped, named in
// code only), each a small scene in a 200 by 120 box that a portal's round hologram shows before you step
// in: the period's sky, its landmark on the horizon, the path in front.
//   future       a purple night city, towers banded in neon, a hover lane
//   arabian      domes and a minaret under a crescent moon, a flying carpet
//   wall         the grey stone wall with red banners winding over bright green hills
//   egypt        painted orange and red pillars before a pyramid under a white sun
//   medieval     golden hills, a castle with blue cone roofs and a purple harlequin tent
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
  future: { skyTop: '#12043a', skyLow: '#6a1f9a', far: '#2a1666', near: '#160a3e', accent: '#3fe0ff' },
  arabian: { skyTop: '#0e1a4a', skyLow: '#6a3a8f', far: '#d9a85a', near: '#8f5a2c', accent: '#ffe08a' },
  wall: { skyTop: '#5fb0ff', skyLow: '#d8f0ff', far: '#5cc23a', near: '#2f8a22', accent: '#9a9a90' },
  egypt: { skyTop: '#3f8fe0', skyLow: '#ffd98a', far: '#f08a2a', near: '#c0461a', accent: '#fff4c8' },
  medieval: { skyTop: '#4fa0f0', skyLow: '#ffe9a8', far: '#e8b43a', near: '#b07a1a', accent: '#2f5ad8' },
  prehistoric: { skyTop: '#ff7a3a', skyLow: '#ffcf7a', far: '#5a3a2a', near: '#2f6b2e', accent: '#ff4a1a' },
  underwater: { skyTop: '#0b4a5e', skyLow: '#031a26', far: '#0d6a6a', near: '#1f8a5a', accent: '#9ff3ff' },
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
            <rect key={row} x={x + 3} y={top + 6 + row * 12} width={w - 6} height="3" fill={row % 2 ? t.accent : PORTAL.CRYSTAL} opacity="0.9" />
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
      <path d="M0 78 Q40 52 80 70 Q120 42 160 62 Q180 56 200 60 V120 H0 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M0 86 Q40 58 80 76 Q120 48 160 68 Q182 62 200 66" fill="none" stroke={PORTAL.VOID} strokeWidth="11" />
      <path d="M0 86 Q40 58 80 76 Q120 48 160 68 Q182 62 200 66" fill="none" stroke={t.accent} strokeWidth="8" />
      <path d="M0 81 Q40 53 80 71 Q120 43 160 63 Q182 57 200 61" fill="none" stroke={PORTAL.STONE_DARK} strokeWidth="3" strokeDasharray="4 4" />
      {[
        [34, 60],
        [116, 50],
      ].map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="14" height="18" fill={t.accent} stroke={PORTAL.VOID} strokeWidth="1" />
          <path d={`M${x - 2} ${y} H${x + 16} L${x + 7} ${y - 8} Z`} fill={PORTAL.FRUIT_RED} stroke={PORTAL.VOID} strokeWidth="1" />
          <path d={`M${x + 7} ${y - 8} V${y - 20} H${x + 17} V${y - 13} H${x + 7}`} fill={PORTAL.TNT} stroke={PORTAL.VOID} strokeWidth="0.8" />
        </g>
      ))}
    </>
  ),
  egypt: (t) => (
    <>
      <circle cx="40" cy="26" r="12" fill={t.accent} />
      <path d="M90 92 L130 40 L170 92 Z" fill={PORTAL.GOLD} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M130 40 L170 92 H146 Z" fill={PORTAL.BRASS_DARK} opacity="0.6" />
      {[18, 46, 74].map((x) => (
        <g key={x}>
          <rect x={x} y="40" width="16" height="56" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
          <path d={`M${x} 52 H${x + 16} M${x} 70 H${x + 16}`} stroke={t.near} strokeWidth="4" />
          <path d={`M${x + 4} 60 H${x + 12}`} stroke={PORTAL.TEAL_DEEP} strokeWidth="3" />
          <rect x={x - 3} y="34" width="22" height="6" fill={t.near} stroke={PORTAL.VOID} strokeWidth="1" />
        </g>
      ))}
    </>
  ),
  medieval: (t) => (
    <>
      <path d="M0 76 Q50 54 100 70 Q150 50 200 66 V120 H0 Z" fill={t.far} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M112 70 V40 H158 V70 Z" fill={PORTAL.STONE_LIT} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M106 40 V24 H118 V40 Z M152 40 V24 H164 V40 Z M128 40 V18 H142 V40 Z" fill={PORTAL.STONE_LIT} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M104 24 H120 L112 8 Z M150 24 H166 L158 8 Z M126 18 H144 L135 0 Z" fill={t.accent} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M130 70 V58 Q135 52 140 58 V70 Z" fill={PORTAL.VOID} />
      <path d="M20 92 L44 62 L68 92 Z" fill={PORTAL.VIOLET} stroke={PORTAL.VOID} strokeWidth="1" />
      <path d="M44 62 L32 77 L44 92 L56 77 Z" fill={PORTAL.GOLD} opacity="0.85" />
      <path d="M44 62 V54 L52 57 L44 60" fill={PORTAL.FRUIT_RED} stroke={PORTAL.VOID} strokeWidth="0.6" />
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

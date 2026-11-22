import { useId, type SVGProps } from 'react'
import { BRASS, CHROME, INK, RUBBER, SHELTER_YELLOW, STEEL, STEEL_EDGE, STEEL_LIGHT } from './palette'

// The shelter's round cog door, drawn in depth, for the hero's stage (scenes.tsx), where it stands rolled
// aside from the opening and rolls a little further on its track as the page moves on.

const TEETH = 12

// The cog outline: twelve square teeth round a 180 unit disc, in a 400 by 400 box.
const COG = Array.from({ length: TEETH }, (_, tooth) => {
  const step = (Math.PI * 2) / TEETH
  const at = (angle: number, radius: number) => `${(200 + Math.cos(angle) * radius).toFixed(1)} ${(200 + Math.sin(angle) * radius).toFixed(1)}`
  const start = tooth * step
  return `${tooth === 0 ? 'M' : 'L'}${at(start, 178)} L${at(start + step * 0.12, 196)} L${at(start + step * 0.42, 196)} L${at(start + step * 0.54, 178)} L${at(start + step, 178)}`
}).join(' ').concat(' Z')

/** The door itself, drawn in depth: cog rim, hazard ring, the recessed face with its plates, the hub wheel. */
export function DoorArt(svg: SVGProps<SVGSVGElement>) {
  const id = `atomic-door${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const face = `${id}-face`
  const rim = `${id}-rim`
  const hazard = `${id}-hazard`
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false" {...svg}>
      <defs>
        <radialGradient id={face} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={STEEL_EDGE} />
          <stop offset="55%" stopColor={STEEL_LIGHT} />
          <stop offset="100%" stopColor={STEEL} />
        </radialGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={CHROME} />
          <stop offset="45%" stopColor={STEEL_LIGHT} />
          <stop offset="100%" stopColor={RUBBER} />
        </linearGradient>
        <pattern id={hazard} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="24" height="24" fill={INK} />
          <rect width="12" height="24" fill={SHELTER_YELLOW} />
        </pattern>
      </defs>
      <path d={COG} fill={`url(#${rim})`} stroke={RUBBER} strokeWidth="3" />
      <circle cx="200" cy="200" r="168" fill={`url(#${hazard})`} />
      <circle cx="200" cy="200" r="150" fill={`url(#${face})`} stroke={RUBBER} strokeWidth="4" />
      {/* the face's welded plates and their rivets */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 200)`}>
          <path d="M200 58 L200 128" stroke={RUBBER} strokeWidth="3" opacity="0.6" />
          <circle cx="200" cy="66" r="4" fill={CHROME} stroke={RUBBER} strokeWidth="1.5" />
          <circle cx="200" cy="112" r="3" fill={CHROME} stroke={RUBBER} strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="200" cy="200" r="96" fill="none" stroke={RUBBER} strokeWidth="5" opacity="0.55" />
      <circle cx="200" cy="200" r="92" fill="none" stroke={STEEL_EDGE} strokeWidth="2" />
      {/* the hub wheel the piston turns: rim, four spokes, the brass centre */}
      <circle cx="200" cy="200" r="58" fill="none" stroke={CHROME} strokeWidth="9" />
      {[0, 45, 90, 135].map((angle) => (
        <rect key={angle} x="194" y="140" width="12" height="120" rx="4" fill={STEEL_EDGE} stroke={RUBBER} strokeWidth="2" transform={`rotate(${angle} 200 200)`} />
      ))}
      <circle cx="200" cy="200" r="22" fill={BRASS} stroke={RUBBER} strokeWidth="3" />
      <circle cx="193" cy="193" r="7" fill={SHELTER_YELLOW} opacity="0.6" />
    </svg>
  )
}

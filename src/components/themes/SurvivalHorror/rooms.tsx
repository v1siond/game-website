import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { Survivor, type SurvivorPose } from './survivor'
import { SH } from './palette'
import horror from './horror.module.css'

// His three professions as rooms of the house, each one fixed camera frame (600 by 260) with its own lamp,
// and him at work in it; what he works at stands in front of him, the way a pre-rendered room puts its props
// over the character:
// - System Engineer: the security room, a wall of monitors and the console he types at.
// - Musician: the music room, his kit in front of him under one hanging lamp.
// - Martial Artist: the basement gym, the heavy bag on its chain that swings with every kick.
// Animated per room: him, one screen's flicker or the cymbal or the bag, the bulb's sway.

interface RoomArt {
  back: ReactNode
  front: ReactNode
  at: { x: number; y: number }
}

const MONITORS = [0, 1, 2, 3, 4, 5].map((index) => ({ x: 340 + (index % 3) * 76, y: 40 + Math.floor(index / 3) * 62 }))

function Monitor({ x, y, flicker }: { x: number; y: number; flicker: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={68} height={54} rx={4} fill={SH.gunmetal} />
      <rect x={x + 6} y={y + 6} width={56} height={40} rx={6} fill={SH.monitor} />
      <rect x={x + 6} y={y + 6} width={56} height={40} rx={6} fill={SH.fine} opacity={0.16} className={flicker ? horror.screenFlicker : ''} />
      <path d={`M${x + 12} ${y + 18} H${x + 40} M${x + 12} ${y + 26} H${x + 50} M${x + 12} ${y + 34} H${x + 30}`} stroke={SH.fine} strokeWidth={1.4} opacity={0.6} />
    </g>
  )
}

const ROOMS: Record<Profession, RoomArt> = {
  engineer: {
    back: (
      <>
        <rect width={600} height={210} fill={SH.shadow} />
        <rect x={326} y={28} width={244} height={142} fill={SH.void} />
        {MONITORS.map((monitor, index) => (
          <Monitor key={index} x={monitor.x} y={monitor.y} flicker={index === 4} />
        ))}
        <path d="M40 30 H300 M40 50 H300" stroke={SH.sepia} strokeWidth={4} opacity={0.6} />
        <path d="M60 30 V0 M120 30 V0" stroke={SH.ash} strokeWidth={1.4} />
        <rect y={210} width={600} height={50} fill={SH.panel} />
        <path d="M0 214 H600" stroke={SH.sepia} strokeWidth={2} />
      </>
    ),
    front: (
      <>
        {/* the console desk in front of him, its keyboard lit by the screens */}
        <path d="M150 168 H420 L430 232 H140 Z" fill={SH.wood} />
        <rect x={150} y={164} width={270} height={8} fill={SH.sepia} />
        <rect x={250} y={156} width={64} height={10} rx={1} fill={SH.gunmetal} />
        <rect x={252} y={158} width={60} height={6} fill={SH.fine} opacity={0.25} />
        <path d="M140 232 H430" stroke={SH.void} strokeWidth={3} />
        <path d="M420 200 Q470 230 520 214 Q560 204 600 226" stroke={SH.void} strokeWidth={3} fill="none" />
      </>
    ),
    at: { x: 200, y: 214 },
  },
  drummer: {
    back: (
      <>
        <rect width={600} height={210} fill={SH.panel} />
        <path d="M0 0 Q40 110 20 210 H0 Z M600 0 Q560 110 580 210 H600 Z" fill={SH.leather} />
        <path d="M20 0 Q50 100 34 210 M580 0 Q550 100 566 210" stroke={SH.void} strokeWidth={2} opacity={0.5} fill="none" />
        {/* an upright piano against the back wall */}
        <rect x={420} y={110} width={130} height={100} fill={SH.void} />
        <rect x={426} y={150} width={118} height={8} fill={SH.ivory} opacity={0.7} />
        <rect y={210} width={600} height={50} fill={SH.paper} />
        <g className={horror.bulb}>
          <line x1={290} y1={0} x2={290} y2={46} stroke={SH.ash} strokeWidth={1.2} />
          <path d="M276 56 Q290 40 304 56 Z" fill={SH.brass} />
          <circle cx={290} cy={58} r={4} fill={SH.flame} />
          <circle cx={290} cy={58} r={30} fill={SH.flame} opacity={0.08} />
        </g>
      </>
    ),
    front: (
      <>
        {/* the kit: bass drum, two toms, the snare, the floor tom, the hi-hat and a crash */}
        <line x1={190} y1={232} x2={210} y2={120} stroke={SH.steel} strokeWidth={2} />
        <g className={horror.cymbal}>
          <ellipse cx={210} cy={120} rx={30} ry={5} fill={SH.brass} />
        </g>
        <line x1={420} y1={232} x2={414} y2={150} stroke={SH.steel} strokeWidth={2} />
        <ellipse cx={414} cy={150} rx={22} ry={4} fill={SH.brass} />
        <ellipse cx={414} cy={155} rx={22} ry={4} fill={SH.brass} opacity={0.8} />
        <circle cx={300} cy={194} r={40} fill={SH.leather} />
        <circle cx={300} cy={194} r={33} fill={SH.cream} />
        <circle cx={300} cy={194} r={33} fill="none" stroke={SH.brass} strokeWidth={3} />
        <ellipse cx={264} cy={148} rx={20} ry={13} fill={SH.leather} />
        <ellipse cx={264} cy={142} rx={20} ry={6} fill={SH.cream} />
        <ellipse cx={334} cy={148} rx={20} ry={13} fill={SH.leather} />
        <ellipse cx={334} cy={142} rx={20} ry={6} fill={SH.cream} />
        <rect x={360} y={174} width={46} height={56} fill={SH.leather} />
        <ellipse cx={383} cy={174} rx={23} ry={6} fill={SH.cream} />
        <ellipse cx={224} cy={180} rx={24} ry={8} fill={SH.steel} />
        <ellipse cx={224} cy={176} rx={24} ry={6} fill={SH.cream} />
        <path d="M206 186 L198 232 M242 186 L250 232" stroke={SH.steel} strokeWidth={2} />
      </>
    ),
    at: { x: 278, y: 222 },
  },
  fighter: {
    back: (
      <>
        <rect width={600} height={210} fill={SH.void} />
        <path d="M0 40 H600 M0 54 H600" stroke={SH.rust} strokeWidth={6} opacity={0.6} />
        <path d="M80 54 V210 M520 54 V210" stroke={SH.rust} strokeWidth={5} opacity={0.5} />
        <rect y={210} width={600} height={50} fill={SH.olive} opacity={0.6} />
        <rect x={120} y={210} width={360} height={30} fill={SH.leather} opacity={0.5} />
        <g className={horror.bulb}>
          <line x1={200} y1={0} x2={200} y2={70} stroke={SH.ash} strokeWidth={1.2} />
          <circle cx={200} cy={76} r={5} fill={SH.flame} />
          <circle cx={200} cy={76} r={40} fill={SH.flame} opacity={0.1} />
        </g>
      </>
    ),
    front: (
      <g className={horror.heavyBag}>
        <line x1={356} y1={0} x2={356} y2={70} stroke={SH.steel} strokeWidth={2} strokeDasharray="4 2" />
        <rect x={334} y={70} width={44} height={120} rx={14} fill={SH.leather} />
        <rect x={334} y={88} width={44} height={6} fill={SH.void} opacity={0.4} />
        <rect x={334} y={164} width={44} height={6} fill={SH.void} opacity={0.4} />
        <rect x={340} y={76} width={8} height={104} rx={4} fill={SH.rust} opacity={0.6} />
      </g>
    ),
    at: { x: 250, y: 226 },
  },
}

export function ProfessionRoom({ profession, pose = 'act' }: { profession: Profession; pose?: SurvivorPose }) {
  const room = ROOMS[profession]

  return (
    <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      {room.back}
      <Survivor profession={profession} pose={pose} place={{ x: room.at.x, y: room.at.y, height: 128 }} />
      {room.front}
    </svg>
  )
}

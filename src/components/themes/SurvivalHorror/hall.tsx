'use client'

import { useEffect, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { NameWords } from '@/components/cv/NameWords'
import { Survivor, type SurvivorPose } from './survivor'
import { ENTRANCE_MS } from './door'
import { CVLink, HeroAction, PortfolioLink } from './actions'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// The hero: the main hall of the house at night, seen from one high fixed camera the way the genre frames a
// room. The page opens on the door (./door); once it has passed through, he walks in from the left, stops
// under the chandelier and raises the handgun, and from then on the laser sight follows the visitor's
// pointer. His name and title are typed onto the file card under the hall. setTimeout phases, once on mount;
// reduced motion and the World Select preview start on the last frame.
//
// Animated: him (his parts), the walk in, the chandelier's sway, the light pool, the typing cover.

type HallPhase = 'door' | 'enter' | 'ready'

const ENTER_MS = 1400

const POSE: Record<HallPhase, SurvivorPose> = { door: 'walk', enter: 'walk', ready: 'aim' }

const WALKED: Record<HallPhase, string> = {
  door: horror.hallOffstage,
  enter: horror.hallWalkIn,
  ready: '',
}

// The checker floor in perspective, eight rows from the back wall (y 196) to the bottom of the frame.
const FLOOR_ROWS = 8
const FLOOR_COLS = 12
const rowY = (row: number) => 196 + (300 - 196) * (row / FLOOR_ROWS) ** 1.4
const colX = (col: number, y: number) => {
  const spread = 0.62 + 0.38 * ((y - 196) / 104)
  return 300 + (col - FLOOR_COLS / 2) * (640 / FLOOR_COLS) * spread
}
const FLOOR_TILES = Array.from({ length: FLOOR_ROWS * FLOOR_COLS }, (_, index) => {
  const row = Math.floor(index / FLOOR_COLS)
  const col = index % FLOOR_COLS
  const top = rowY(row)
  const bottom = rowY(row + 1)
  return {
    key: index,
    dark: (row + col) % 2 === 0,
    d: `M${colX(col, top)} ${top} L${colX(col + 1, top)} ${top} L${colX(col + 1, bottom)} ${bottom} L${colX(col, bottom)} ${bottom} Z`,
  }
}).filter((tile) => tile.dark)

const POSTS = Array.from({ length: 23 }, (_, index) => 70 + index * 20)
const STEPS = Array.from({ length: 9 }, (_, index) => index)

function Window({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 140 V54 Q${x + 22} 30 ${x + 44} 54 V140 Z`} fill={SH.moon} opacity={0.18} />
      <path d={`M${x} 140 V54 Q${x + 22} 30 ${x + 44} 54 V140 Z M${x + 22} 40 V140 M${x} 92 H${x + 44}`} fill="none" stroke={SH.sepia} strokeWidth={3} />
      <path d={`M${x + 4} 140 L${x - 30} 196 H${x + 20} L${x + 40} 140 Z`} fill={SH.moon} opacity={0.06} />
    </g>
  )
}

function Hall({ profession, phase }: { profession: Profession; phase: HallPhase }) {
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sh-hall-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SH.void} />
          <stop offset="60%" stopColor={SH.panel} />
          <stop offset="100%" stopColor={SH.paper} />
        </linearGradient>
        <radialGradient id="sh-hall-pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={SH.flame} stopOpacity={0.34} />
          <stop offset="100%" stopColor={SH.flame} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="sh-hall-rug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SH.leather} />
          <stop offset="100%" stopColor={SH.rust} />
        </linearGradient>
      </defs>
      <rect width={600} height={196} fill="url(#sh-hall-wall)" />
      <Window x={36} />
      <Window x={520} />
      {/* the double doors at the back, under the balcony */}
      <rect x={262} y={128} width={76} height={68} fill={SH.void} />
      <rect x={266} y={132} width={33} height={64} fill={SH.wood} />
      <rect x={301} y={132} width={33} height={64} fill={SH.wood} />
      <circle cx={296} cy={166} r={1.8} fill={SH.brass} />
      <circle cx={304} cy={166} r={1.8} fill={SH.brass} />
      {/* the balcony and its banister */}
      <rect x={60} y={104} width={480} height={10} fill={SH.wood} />
      <rect x={60} y={86} width={480} height={4} fill={SH.wood} />
      {POSTS.map((x) => (
        <rect key={x} x={x} y={90} width={3} height={14} fill={SH.sepia} />
      ))}
      {/* the twin staircase down each side */}
      {STEPS.map((step) => (
        <g key={step}>
          <rect x={60 + step * 10} y={114 + step * 9} width={70} height={9} fill={step % 2 ? SH.sepia : SH.wood} />
          <rect x={470 - step * 10} y={114 + step * 9} width={70} height={9} fill={step % 2 ? SH.sepia : SH.wood} />
        </g>
      ))}
      <path d="M60 104 L150 196 M540 104 L450 196" stroke={SH.brass} strokeWidth={2} opacity={0.6} />
      {/* the floor */}
      <rect y={196} width={600} height={104} fill={SH.shadow} />
      {FLOOR_TILES.map((tile) => (
        <path key={tile.key} d={tile.d} fill={SH.sepia} opacity={0.55} />
      ))}
      <path d="M262 196 L338 196 L380 300 L220 300 Z" fill="url(#sh-hall-rug)" opacity={0.75} />
      <ellipse cx={300} cy={250} rx={170} ry={46} fill="url(#sh-hall-pool)" className={horror.hallPool} />
      {/* the chandelier on its chain */}
      <g className={horror.chandelier}>
        <line x1={300} y1={0} x2={300} y2={44} stroke={SH.ash} strokeWidth={1.4} />
        <path d="M270 52 Q300 70 330 52 L326 48 Q300 60 274 48 Z" fill={SH.brass} />
        {[274, 286, 300, 314, 326].map((x) => (
          <g key={x}>
            <rect x={x - 1.2} y={40} width={2.4} height={9} fill={SH.cream} />
            <ellipse cx={x} cy={37} rx={1.6} ry={3} fill={SH.flame} />
          </g>
        ))}
        <circle cx={300} cy={46} r={26} fill={SH.flame} opacity={0.08} />
      </g>
      <g className={`${horror.hallWalker} ${WALKED[phase]}`}>
        <Survivor profession={profession} pose={POSE[phase]} place={{ x: 236, y: 268, height: 118 }} />
      </g>
    </svg>
  )
}

const TYPED = (shown: boolean) => (shown ? horror.typeIn : '')

export function HallHero({ profession }: { profession: Profession }) {
  const { navigation, horror: words } = useLabels()
  const preview = usePreview()
  const [phase, setPhase] = useState<HallPhase>('door')

  useEffect(() => {
    if (preview || prefersReducedMotion()) {
      setPhase('ready')
      return
    }
    const timers = [
      window.setTimeout(() => setPhase('enter'), ENTRANCE_MS - 200),
      window.setTimeout(() => setPhase('ready'), ENTRANCE_MS - 200 + ENTER_MS),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [preview])

  const shown = phase === 'ready'

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <div className={`relative h-[46vh] min-h-[260px] max-h-[480px] overflow-hidden border-2 border-[color:var(--sh-sepia)] ${horror.cameraFrame}`}>
            <Hall profession={profession} phase={phase} />
          </div>
          <p className={`mt-2 text-center text-sm italic text-[color:var(--sh-fog)] ${look.typed}`}>{words.aimHint}</p>

          <div className={`relative mx-auto mt-6 max-w-4xl p-6 ${look.panel}`}>
            <div className="relative overflow-hidden">
              <h1 className={`text-[clamp(1.5rem,7vw,2.25rem)] uppercase tracking-[0.15em] text-[color:var(--sh-ivory)] ${look.typed}`}>
                <NameWords name={name} />
              </h1>
              <span className={`${horror.typeCover} ${TYPED(shown)}`} aria-hidden="true" />
            </div>
            <p className="mt-3 text-base text-[color:var(--sh-cream)]">{headline}</p>
            <p className={`mt-2 text-sm italic text-[color:var(--sh-brass)] ${look.typed}`}>{tagline}</p>
            <p className="mt-2 text-sm text-[color:var(--sh-cream)]">{line}</p>
            <nav className="mt-5 flex flex-wrap items-center gap-3" aria-label={navigation.contactAndCv}>
              {actions.map((action) => (
                <HeroAction key={action.id} action={action} />
              ))}
              <CVLink />
              <PortfolioLink />
            </nav>
          </div>
        </div>
      )}
    />
  )
}

'use client'

import { useEffect, useId, useMemo, useRef, type AnimationEvent, type ReactNode } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import Wardrobe from '@/components/worlds/Wardrobe'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useOnChange } from '@/hooks/useOnChange'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import { PROFESSION_ORDER, type Profession } from '@/lib/cv/professions'
import { staggerAt } from '../shared/stagger'
import { ContactActions } from './actions'
import { BODY, FACE } from './cards'
import { Character, type Place } from './character'
import { HERO_TIMING, type Pose } from './choreography'
import { ERA, OUTFIT_LOOK, PORTAL, type Era } from './palette'
import { PAD_COLOURS, ProfessionPads } from './pads'
import { Tally } from './tally'
import css from './hero.module.css'

// The hero: the hub of the time machine at night (research part 1 [33][39], part 4 [27][28]). His name
// sits on the title plate with the riveted clock ring glowing behind its left edge [23], the switch under
// it; beside them, the round hub platform floats over a dark sea with its arc of three glossy pads, red,
// blue and gold, and the glass sphere over the picked pad shows that profession's room in miniature,
// wrapped in blue white arcs. He stands on the picked pad at a third of the scene's height.
//
// Once per page load the platform rises, the pads light in turn, he beams onto his pad and the ring
// glows, within 3 s (HERO_TIMING). A pick sends him hopping to the new pad while the sphere moves over
// it and swaps its room. When the pointer rests on the scene 1.5 s he scratches his head, at most once
// every 8 s, on a pointer device only. His poses run on the shared pose sequence: the beam, then rest,
// with the hop and the scratch as moves, each ended by its own timing animation (hero.module.css).
//
// Animated: the platform, the pads (one class), the beam, the ring, the sphere's arcs, him.
// Reduced motion: the finished hub, him standing on his pad, no entrance.

type HeroMove = 'beam' | 'rest' | 'hop' | 'scratch'

const POSE_OF: Record<HeroMove, Pose> = { beam: 'idle', rest: 'idle', hop: 'hop', scratch: 'scratch' }

const ENTRANCE: readonly HeroMove[] = ['beam']

// The pads' places on the platform, in the scene's 480 by 300 units, as the hub's shallow arc.
const PAD_AT: Record<Profession, { x: number; y: number }> = {
  drummer: { x: 128, y: 230 },
  engineer: { x: 240, y: 246 },
  fighter: { x: 352, y: 230 },
}

// He stands a third of the scene's height (100 of 300) with his feet on the pad.
const FIGURE_PLACE: Place = { x: -30, y: -102, width: 60, height: 100 }

const { platform, pads, beam, ring, hopMs, swapMs, scratch } = HERO_TIMING

const TIMING = {
  '--platform-ms': platform.ms,
  '--pads-at': pads.at,
  '--pad-step': pads.step,
  '--pad-ms': pads.ms,
  '--beam-at': beam.at,
  '--beam-ms': beam.ms,
  '--ring-at': ring.at,
  '--ring-ms': ring.ms,
  '--hop-ms': hopMs,
  '--swap-ms': swapMs,
  '--scratch-ms': scratch.ms,
}

const STARS = [
  [36, 30],
  [92, 64],
  [150, 22],
  [212, 48],
  [300, 18],
  [362, 58],
  [430, 34],
  [458, 92],
  [20, 110],
  [404, 128],
] as const

/** Each profession's room seen through the sphere, drawn round the sphere's centre: the future city with its
 *  neon ring, the Arabian night with two lamps, the prehistoric rocks with the lava's glow. */
const ROOMS: Record<Profession, ReactNode> = {
  engineer: (
    <g>
      <rect x={-60} y={-60} width={120} height={120} fill={ERA.future.towerDark} />
      <ellipse cx={0} cy={-14} rx={40} ry={11} fill="none" stroke={ERA.future.neonPink} strokeWidth={3.4} />
      {[
        [-44, -6, 16, 66],
        [-24, -28, 18, 88],
        [-2, -12, 16, 72],
        [18, -36, 20, 96],
        [40, -4, 16, 64],
      ].map(([x, y, w, h]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} fill={ERA.future.tower} stroke={PORTAL.INK} strokeWidth={1.4} />
          <path d={`M${x + 4} ${y + 8} h3 m4 0 h3 M${x + 4} ${y + 18} h3 m4 0 h3 M${x + 4} ${y + 28} h3`} stroke={ERA.future.window} strokeWidth={2.4} />
        </g>
      ))}
      <ellipse cx={0} cy={-14} rx={40} ry={11} fill="none" stroke={ERA.future.neonTeal} strokeWidth={1.4} strokeDasharray="6 8" />
    </g>
  ),
  drummer: (
    <g>
      <rect x={-60} y={-60} width={120} height={120} fill={ERA.arabian.domeDark} />
      <path d="M-60 30 V8 H-30 V-4 Q-14 -34 2 -4 V8 H24 V-20 H32 V8 H60 V60 H-60 Z" fill={ERA.arabian.dome} stroke={PORTAL.INK} strokeWidth={1.4} />
      <path d="M-14 -4 Q-6 -22 2 -4 Z" fill={ERA.arabian.wall} />
      {[-38, 40].map((x) => (
        <g key={x}>
          <path d={`M${x} -16 V-4`} stroke={PORTAL.INK} strokeWidth={1.6} />
          <circle cx={x} cy={2} r={9} fill={ERA.arabian.lamp} opacity={0.35} />
          <ellipse cx={x} cy={2} rx={4.4} ry={5.6} fill={ERA.arabian.lamp} stroke={PORTAL.INK} strokeWidth={1.4} />
          <circle cx={x} cy={2} r={1.8} fill={ERA.arabian.lampCore} />
        </g>
      ))}
      <path d="M30 -38 A9 9 0 1 0 38 -26 A7 7 0 1 1 30 -38 Z" fill={PORTAL.LAMP} />
    </g>
  ),
  fighter: (
    <g>
      <rect x={-60} y={-60} width={120} height={120} fill={ERA.prehistoric.rockLight} />
      <path d="M-30 30 L-6 -26 L4 -22 L28 30 Z" fill={ERA.prehistoric.rock} stroke={PORTAL.INK} strokeWidth={1.4} />
      <ellipse cx={-1} cy={-24} rx={8} ry={4} fill={ERA.prehistoric.lava} />
      <path d="M-2 -24 Q-10 -6 -8 30 M2 -22 Q8 0 14 30" fill="none" stroke={ERA.prehistoric.lava} strokeWidth={3} />
      <ellipse cx={0} cy={44} rx={60} ry={18} fill={ERA.prehistoric.lava} opacity={0.5} />
      <path d="M-60 60 V26 L-44 18 L-34 30 L-20 24 V60 Z M60 60 V22 L46 14 L34 28 L20 26 V60 Z" fill={ERA.prehistoric.rock} stroke={PORTAL.INK} strokeWidth={1.4} />
      <path d="M-50 26 q4 -12 10 -14 M-46 28 q8 -8 14 -6" fill="none" stroke={ERA.prehistoric.fern} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
}

/** The glass sphere over the picked pad: the room inside, the glass shine and the electric arcs round it. */
function Sphere({ profession }: { profession: Profession }) {
  const id = useId()
  const clip = `${id}-clip`
  const shine = `${id}-shine`
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <circle r={56} />
        </clipPath>
        <radialGradient id={shine} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={PORTAL.WHITE} stopOpacity={0.55} />
          <stop offset="45%" stopColor={PORTAL.ARC} stopOpacity={0.12} />
          <stop offset="100%" stopColor={PORTAL.GLASS} stopOpacity={0.5} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <g key={profession} className={css.room}>
          {ROOMS[profession]}
        </g>
      </g>
      <circle r={56} fill={`url(#${shine})`} stroke={PORTAL.ARC} strokeWidth={3} />
      <path d="M-30 -36 Q-12 -50 12 -48" fill="none" stroke={PORTAL.WHITE} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      <g key={`arcs-${profession}`} className={css.arcs} fill="none" stroke={PORTAL.ARC} strokeWidth={2.4} strokeLinejoin="round">
        <polyline points="-62,-14 -70,-4 -60,2 -72,14 -64,22" />
        <polyline points="60,-24 72,-16 62,-8 74,4 66,10" />
        <polyline points="-20,60 -12,70 -4,62 6,72 14,64" />
      </g>
    </g>
  )
}

/** The hub platform with its arc of pads; `picked` is lit brighter and ringed. */
function Platform({ picked }: { picked: Profession }) {
  return (
    <g className={css.platform}>
      <ellipse cx={240} cy={252} rx={222} ry={46} fill={PORTAL.FLOOR_DARK} stroke={PORTAL.INK} strokeWidth={3} />
      <ellipse cx={240} cy={238} rx={222} ry={44} fill={PORTAL.FLOOR} stroke={PORTAL.INK} strokeWidth={3} />
      <ellipse cx={240} cy={238} rx={196} ry={36} fill="none" stroke={PORTAL.FLOOR_DARK} strokeWidth={2} strokeDasharray="2 14" strokeLinecap="round" />
      {PROFESSION_ORDER.map((profession, index) => {
        const { x, y } = PAD_AT[profession]
        const { lit, deep } = PAD_COLOURS[profession]
        return (
          <g key={profession} className={`${css.pad} ${staggerAt(index)}`} data-picked={profession === picked}>
            <ellipse cx={x} cy={y + 6} rx={46} ry={14} fill={deep} stroke={PORTAL.INK} strokeWidth={3} />
            <ellipse className={css.padLit} cx={x} cy={y} rx={41} ry={12} fill={lit} stroke={PORTAL.INK} strokeWidth={2.4} />
            <path d={`M${x - 24} ${y - 4} Q${x - 6} ${y - 11} ${x + 16} ${y - 8}`} fill="none" stroke={PORTAL.WHITE} strokeWidth={3} strokeLinecap="round" opacity={0.75} />
            <ellipse className={css.padRing} cx={x} cy={y} rx={50} ry={16} fill="none" stroke={PORTAL.GOLD} strokeWidth={2.4} />
          </g>
        )
      })}
    </g>
  )
}

/** The riveted clock ring of the title screen, its ticks and its blue glow, behind the plate's edge. */
function ClockRing() {
  return (
    <svg viewBox="0 0 120 120" className={`pointer-events-none absolute -left-12 top-1/2 h-44 w-44 -translate-y-1/2 sm:-left-16 sm:h-56 sm:w-56 ${css.ring}`} aria-hidden="true" focusable="false">
      <circle className={css.ringGlow} cx={60} cy={60} r={52} fill="none" stroke={PORTAL.BLUE} strokeWidth={12} opacity={0.35} />
      <circle cx={60} cy={60} r={50} fill="none" stroke={PORTAL.IRON_DARK} strokeWidth={10} />
      <circle cx={60} cy={60} r={50} fill="none" stroke={PORTAL.IRON} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, hour) => (
        <path key={hour} d="M60 13 V21" stroke={PORTAL.INK} strokeWidth={hour % 3 === 0 ? 3.4 : 1.8} transform={`rotate(${hour * 30} 60 60)`} />
      ))}
      {Array.from({ length: 8 }, (_, rivet) => (
        <circle key={rivet} cx={60} cy={5} r={2} fill={PORTAL.IRON_FACE} stroke={PORTAL.INK} strokeWidth={1} transform={`rotate(${rivet * 45 + 22.5} 60 60)`} />
      ))}
    </svg>
  )
}

/** He scratches his head once the pointer has rested on the scene, at most once every 8 s. */
function useHeadScratch(enabled: boolean, scratchNow: () => void) {
  const timer = useRef(0)
  const last = useRef(-scratch.everyMs)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const rest = () => {
    window.clearTimeout(timer.current)
    if (!enabled) return
    timer.current = window.setTimeout(() => {
      const now = performance.now()
      if (now - last.current < scratch.everyMs) return
      last.current = now
      scratchNow()
    }, scratch.restMs)
  }
  const leave = () => window.clearTimeout(timer.current)
  return { onPointerMove: rest, onPointerLeave: leave }
}

function HubScene({ still }: { still: boolean }) {
  const { active } = useProfession()
  const hover = useMediaQuery('(hover: hover)')
  const figure = usePoseSequence<HeroMove>({ entrance: ENTRANCE, rest: 'rest', still: 'rest' })
  const move: HeroMove = still ? 'rest' : figure.pose
  const pointer = useHeadScratch(hover && !still, () => figure.play('scratch'))
  useOnChange(active, () => figure.play('hop'))

  const onMoveEnd = (event: AnimationEvent<SVGGElement>) => {
    if (event.target !== event.currentTarget) return
    figure.advance()
  }

  return (
    <div className={`relative h-[42vh] max-h-[460px] min-h-[240px] overflow-hidden rounded-2xl border-[3px] border-[color:var(--np-seam)] ${css.scene}`} {...pointer}>
      <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        {STARS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.6} fill={PORTAL.STAR} />
        ))}
        <rect x={0} y={232} width={480} height={68} fill={PORTAL.SEA} />
        <path d="M0 250 Q60 244 120 250 T240 250 T360 250 T480 250 M20 274 Q90 268 160 274 T300 274 T460 274" fill="none" stroke={PORTAL.SEA_LIGHT} strokeWidth={2} />
        <Platform picked={active} />
        <g className={css.follow}>
          <g className={css.sphere}>
            <Sphere profession={active} />
          </g>
          <rect className={css.beam} x={-26} y={-300} width={52} height={300} fill={PORTAL.ARC} />
          <g data-worlds-figure="">
            <g className={css.figure} data-move={move} onAnimationEnd={onMoveEnd}>
              <Character profession={active} pose={POSE_OF[move]} place={FIGURE_PLACE} />
            </g>
          </g>
        </g>
      </svg>
      <Wardrobe look={OUTFIT_LOOK} className={`absolute bottom-2 right-2 z-10 ${FACE}`} />
    </div>
  )
}

export function HubHero() {
  const { active } = useProfession()
  const { navigation } = useLabels()
  const { ref } = useZoneStage<Era>('hub')
  const still = useReducedMotion()
  const vars = useMemo(() => cssVars({ ...TIMING, '--pad-x': PAD_AT[active].x, '--pad-y': PAD_AT[active].y }), [active])

  return (
    <section ref={ref} data-worlds-hero="" data-still={still || undefined} className={`relative mx-auto max-w-6xl px-4 pb-10 pt-20 sm:px-6 ${css.hero}`} style={vars}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:grid-rows-[auto_1fr]">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="relative md:col-start-1 md:row-start-1">
              <ClockRing />
              <div className="relative rounded-2xl border-4 border-[color:var(--np-ink)] bg-[color:var(--np-panel)] p-5 shadow-[0_6px_0_var(--np-ink)] sm:p-6">
                <h1 className={`${FACE} ${css.name} text-[clamp(2.2rem,7vw,3.6rem)] uppercase leading-none tracking-wide text-[color:var(--np-gold)]`}>
                  <NameWords name={name} />
                </h1>
                <p className={`${BODY} mt-3 text-lg font-bold text-[color:var(--np-white)]`}>{headline}</p>
                <p className={`${BODY} mt-2 text-base text-[color:var(--np-muted)]`}>{tagline}</p>
                <p className={`${BODY} mt-3 text-base text-[color:var(--np-white)]`}>{line}</p>
                <nav className="mt-5 flex flex-wrap gap-3" aria-label={navigation.contactAndCv}>
                  <ContactActions actions={actions} />
                </nav>
                <Tally className="mt-5" />
              </div>
            </div>
          )}
        />
        <div className="md:col-start-2 md:row-span-2 md:row-start-1">
          <HubScene still={still} />
        </div>
        <ProfessionPads className="md:col-start-1 md:row-start-2" />
      </div>
    </section>
  )
}

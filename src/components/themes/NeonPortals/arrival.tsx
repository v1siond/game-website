'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { NameWords } from '@/components/cv/NameWords'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import type { Profession } from '@/lib/cv/professions'
import { Bandicoot, type BandicootPose } from './bandicoot'
import { Blast, Planks, PopUp } from './burst'
import { CVLink, DemoLink, HeroActions } from './buttons'
import { CrateArt } from './crateArt'
import { PORTAL } from './palette'
import { Fruit, MaskFace } from './pickups'
import { MaskCompanion } from './scoreBar'
import { useScore } from './score'
import stage from './arrival.module.css'
import ui from './warped.module.css'

// The recruiter first screen as his arrival in the time machine (the hub of the time travel platformer,
// Warped, named in code only): the time machine's central hub under its great clock ring, a beam comes
// down, he forms inside it spinning, drops onto the pad with a squash, and the name lands in the logo's
// fat yellow capitals letter by letter. A question crate and a mask crate sit on the pad beside him, as the game leaves them by the
// start of a level: clicking him, or the Spin button, plays his tornado spin and breaks both; the
// question crate spills fruit into the counter and the mask crate gives the first mask, which then
// floats beside him all the way down the page. His eyes follow the pointer.
//
//   beam   0ms     the light column drops onto the pad, its rings turning
//   form   450ms   he appears in the beam, thin and spinning, and widens
//   land   950ms   off the beam onto the pad with a squash and stretch
//   title  1300ms  the letters drop in 45 ms apart; the rest slides up
//   ready  after the last letter: he idles with his shimmy
//
// Pattern: setTimeout phases, each a data-phase value the CSS keys on. The resting frame is the plain
// style, so 'ready', reduced motion and a World Select preview show it with no animation.

type Phase = 'wait' | 'beam' | 'form' | 'land' | 'title' | 'ready'

const LETTER_MS = 45
const SPIN_MS = 1000
const ARRIVAL_FRUIT = 5

const phasesFor = (letters: number): ReadonlyArray<readonly [Phase, number]> => [
  ['beam', 0],
  ['form', 450],
  ['land', 950],
  ['title', 1300],
  ['ready', 1300 + 500 + letters * LETTER_MS],
]

function useArrival(letters: number) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1, rootMargin: '0px' })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const [phase, setPhase] = useState<Phase>('wait')
  const skip = reduced || preview

  useEffect(() => {
    if (skip) {
      setPhase('ready')
      return
    }
    if (!triggered) return
    const timers = phasesFor(letters).map(([next, at]) => window.setTimeout(() => setPhase((now) => (now === 'ready' ? now : next)), at))
    return () => timers.forEach(window.clearTimeout)
  }, [triggered, skip, letters])

  return { ref, phase }
}

/** His tornado spin and the two crates it breaks once. */
function useSpin() {
  const { addFruit, addMask } = useScore()
  const [spinning, setSpinning] = useState(false)
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    if (!spinning) return
    const timer = window.setTimeout(() => setSpinning(false), SPIN_MS)
    return () => window.clearTimeout(timer)
  }, [spinning])

  const spin = () => {
    setSpinning(true)
    if (broken) return
    setBroken(true)
    addFruit(ARRIVAL_FRUIT)
    addMask('arrival')
  }

  return { spinning, broken, spin }
}

// The stars over the hub, fixed points in the 400 by 320 box.
const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [24, 22, 1.4], [70, 60, 1], [112, 18, 1.2], [300, 26, 1.4], [352, 70, 1], [380, 20, 1.2], [46, 120, 1], [366, 136, 1.2], [150, 46, 0.9], [262, 52, 0.9],
]

// The clock ring's numbers, at the twelve, four and eight o'clock marks, as on the game's logo ring.
const RING_NUMBERS: ReadonlyArray<readonly [string, number]> = [
  ['1', 0],
  ['2', 120],
  ['3', 240],
]

/** The hourglass in its wooden frame, standing on the floor at the left. */
function Hourglass() {
  return (
    <g>
      <rect x="40" y="132" width="52" height="8" rx="3" fill={PORTAL.PLANK} stroke={PORTAL.VOID} strokeWidth="2" />
      <rect x="40" y="214" width="52" height="8" rx="3" fill={PORTAL.PLANK} stroke={PORTAL.VOID} strokeWidth="2" />
      <path d="M46 140 V214 M86 140 V214" stroke={PORTAL.PLANK_DARK} strokeWidth="5" />
      <path d="M50 140 H82 Q82 168 68 177 Q82 186 82 214 H50 Q50 186 64 177 Q50 168 50 140 Z" fill="url(#npa-glass)" stroke={PORTAL.VOID} strokeWidth="2" />
      <path d="M56 206 Q66 194 76 206 Z M60 156 H72 L66 166 Z" fill={PORTAL.GOLD} />
      <path d="M54 146 Q54 160 60 166" fill="none" stroke={PORTAL.WHITE} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
    </g>
  )
}

/** The electric pylon on the right: a copper coil drum and three white bulbs on a rod. */
function Pylon() {
  return (
    <g>
      <rect x="318" y="170" width="44" height="52" rx="8" fill={PORTAL.ORANGE_DEEP} stroke={PORTAL.VOID} strokeWidth="2" />
      {[180, 192, 204].map((y) => (
        <path key={y} d={`M320 ${y} H360`} stroke={PORTAL.BRASS} strokeWidth="3" />
      ))}
      <rect x="337" y="92" width="6" height="80" fill={PORTAL.METAL_DARK} stroke={PORTAL.VOID} strokeWidth="1.5" />
      {[100, 124, 148].map((y) => (
        <g key={y}>
          <circle cx="340" cy={y} r="9" fill={PORTAL.WHITE} stroke={PORTAL.VOID} strokeWidth="2" />
          <circle cx="337" cy={y - 3} r="3" fill={PORTAL.TEAL} opacity="0.8" />
        </g>
      ))}
      <path d="M352 96 L362 104 L356 108 L368 118" fill="none" stroke={PORTAL.TEAL} strokeWidth="2" strokeLinejoin="round" />
    </g>
  )
}

/**
 * The time machine's central hub, as the game shows it: a round riveted metal floor with a yellow dotted
 * track, the great clock ring with its rivets, numbers and lightning behind, the hourglass and the
 * electric pylon either side, all under the navy night; the pad he lands on is the room's white topped
 * pedestal on its grey ring.
 */
function Chamber() {
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="npa-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PORTAL.VOID} />
          <stop offset="0.7" stopColor={PORTAL.NIGHT} />
          <stop offset="1" stopColor={PORTAL.HAZE} />
        </linearGradient>
        <radialGradient id="npa-pad" cx="0.5" cy="0.35" r="0.65">
          <stop offset="0" stopColor={PORTAL.WHITE} />
          <stop offset="0.6" stopColor={PORTAL.PLATINUM} />
          <stop offset="1" stopColor={PORTAL.METAL} />
        </radialGradient>
        <radialGradient id="npa-floor" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor={PORTAL.STONE_LIT} />
          <stop offset="1" stopColor={PORTAL.STONE_DARK} />
        </radialGradient>
        <linearGradient id="npa-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PORTAL.PAD_LIT} />
          <stop offset="1" stopColor={PORTAL.PAD} />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#npa-wall)" />
      <g className={stage.back}>
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={PORTAL.WHITE} />
        ))}
        <circle cx="200" cy="118" r="98" fill="none" stroke={PORTAL.VOID} strokeWidth="26" />
        <circle cx="200" cy="118" r="98" fill="none" stroke={PORTAL.NITRO_DARK} strokeWidth="20" />
        <circle cx="200" cy="118" r="104" fill="none" stroke={PORTAL.PAD} strokeWidth="6" />
        <circle cx="200" cy="118" r="90" fill="none" stroke={PORTAL.TEAL} strokeWidth="2" opacity="0.8" />
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={i} cx="200" cy="20" r="2.2" fill={PORTAL.PLATINUM} stroke={PORTAL.VOID} strokeWidth="0.8" transform={`rotate(${i * 15} 200 118)`} />
        ))}
        {RING_NUMBERS.map(([number, angle]) => (
          <text
            key={number}
            x="200"
            y="126"
            transform={`rotate(${angle} 200 118) translate(0 -98)`}
            textAnchor="middle"
            className={stage.ringNumber}
            fontSize="22"
            fill={PORTAL.TITLE}
            stroke={PORTAL.TITLE_EDGE}
            strokeWidth="2"
            paintOrder="stroke"
          >
            {number}
          </text>
        ))}
        {[60, 180, 300].map((angle) => (
          <path key={angle} d="M196 6 L206 18 L200 20 L208 32" fill="none" stroke={PORTAL.GOLD} strokeWidth="3" strokeLinejoin="round" transform={`rotate(${angle} 200 118)`} />
        ))}
        <circle cx="200" cy="118" r="76" fill={PORTAL.CHAMBER} opacity="0.55" />
        <Hourglass />
        <Pylon />
        <ellipse cx="200" cy="300" rx="260" ry="78" fill={PORTAL.VOID} />
        <ellipse cx="200" cy="294" rx="250" ry="70" fill="url(#npa-floor)" />
        <ellipse cx="200" cy="292" rx="196" ry="50" fill="none" stroke={PORTAL.GOLD} strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
      </g>
      <ellipse cx="200" cy="272" rx="120" ry="27" fill={PORTAL.VOID} />
      <ellipse cx="200" cy="268" rx="116" ry="24" fill={PORTAL.PAD_RING} />
      <ellipse cx="200" cy="262" rx="100" ry="19" fill="url(#npa-pad)" stroke={PORTAL.VOID} strokeWidth="2.5" />
      <ellipse cx="186" cy="257" rx="52" ry="6" fill={PORTAL.WHITE} opacity="0.7" />
    </svg>
  )
}

/** A crate on the pad, until the spin breaks it and it gives what it held. */
function PadCrate({ kind, broken, prize, place }: { kind: 'question' | 'mask'; broken: boolean; prize: ReactNode; place: string }) {
  return (
    <div className={`absolute ${place}`} aria-hidden="true">
      {broken ? (
        <>
          <Planks />
          <PopUp className="inset-x-[15%] top-[-30%] h-[70%]">{prize}</PopUp>
        </>
      ) : (
        <CrateArt kind={kind} className={`h-full w-full ${stage.crateBob}`} />
      )}
    </div>
  )
}

function Stage({ profession, nav }: { profession: Profession; nav: { spin: string; hint: string } }) {
  const { spinning, broken, spin } = useSpin()
  const pose: BandicootPose = spinning ? 'spin' : 'idle'

  return (
    <div>
      <div className={`relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] border-[3px] border-[color:var(--np-void)] ${stage.frame}`}>
        <Chamber />
        <div className={`absolute bottom-[14%] left-1/2 h-[86%] w-[26%] -translate-x-1/2 ${stage.beam}`} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`absolute inset-x-0 h-[10%] rounded-[50%] border-4 border-[color:var(--np-teal)] ${stage.ring}`} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <PadCrate kind="question" broken={broken} place="bottom-[12%] left-[13%] h-[19%] w-[15%]" prize={<Fruit className="h-full w-full" />} />
        <PadCrate kind="mask" broken={broken} place="bottom-[12%] right-[13%] h-[19%] w-[15%]" prize={<MaskFace className="h-full w-full" feathers={2} />} />
        <button
          type="button"
          tabIndex={-1}
          onClick={spin}
          aria-label={nav.spin}
          className={`absolute bottom-[11%] left-1/2 h-[58%] w-[30%] -translate-x-1/2 cursor-pointer focus:outline-none`}
        >
          <span className={`relative block h-full w-full ${stage.landing}`}>
            {spinning && <Blast tone="slam" />}
            <Bandicoot profession={profession} pose={pose} className="h-full w-full" />
            <MaskCompanion />
          </span>
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={spin} className={`${ui.button} ${ui.lit}`}>
          {nav.spin}
        </button>
        <p className="text-base text-[color:var(--np-muted)]">{nav.hint}</p>
      </div>
    </div>
  )
}

/**
 * The name as letters that drop in one by one; NameWords keeps each word unbreakable, so the line only
 * breaks between words, and counts the letters across the whole name so the drop runs on.
 */
function TitleLetters({ name }: { name: string }) {
  return (
    <span aria-hidden="true">
      <NameWords
        name={name}
        wordClassName="inline-block"
        letter={(letter, i) => (
          <span className={`inline-block ${stage.letter}`} style={{ '--i': i } as CSSProperties}>
            {letter}
          </span>
        )}
      />
    </span>
  )
}

export function Arrival({ profession }: { profession: Profession }) {
  const { navigation, warp } = useLabels()

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <ArrivalLayout
          name={name}
          headline={headline}
          tagline={tagline}
          line={line}
          profession={profession}
          nav={navigation.contactAndCv}
          spin={{ spin: warp.spin, hint: warp.arrivalHint }}
          actions={<HeroActions actions={actions} />}
        />
      )}
    />
  )
}

interface ArrivalLayoutProps {
  name: string
  headline: string
  tagline: string
  line: string
  profession: Profession
  nav: string
  spin: { spin: string; hint: string }
  actions: ReactNode
}

function ArrivalLayout({ name, headline, tagline, line, profession, nav, spin, actions }: ArrivalLayoutProps) {
  const { ref, phase } = useArrival(name.length)

  return (
    <div ref={ref} data-phase={phase} className={`mx-auto grid max-w-6xl items-center gap-8 px-4 pt-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${stage.arrival}`}>
      <div className="order-2 lg:order-1">
        <h1 className={`text-[clamp(2.25rem,1.25rem+4vw,4.25rem)] leading-[1.1] ${ui.title}`}>
          <span className="sr-only">{name}</span>
          <TitleLetters name={name} />
        </h1>
        <div className={stage.afterTitle}>
          <p className={`mt-5 inline-block rounded-full border-[3px] border-[color:var(--np-void)] bg-[color:var(--np-orange)] px-4 pb-1 pt-1.5 text-lg uppercase text-[color:var(--np-void)] ${ui.chunk}`}>{headline}</p>
          <p className="mt-4 text-lg text-[color:var(--np-white)]">{tagline}</p>
          <p className="mt-2 text-base text-[color:var(--np-muted)]">{line}</p>
          <nav className="mt-6 flex flex-wrap items-center gap-3" aria-label={nav}>
            {actions}
            <CVLink />
            <DemoLink />
          </nav>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <Stage profession={profession} nav={spin} />
      </div>
    </div>
  )
}

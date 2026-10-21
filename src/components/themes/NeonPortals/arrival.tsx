'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
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
// Warped, named in code only): a warp pad under a ring of teal light, a beam comes down, he forms inside
// it spinning, drops onto the pad with a squash, and the name lands in chunky orange capitals letter by
// letter. A question crate and a mask crate sit on the pad beside him, as the game leaves them by the
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

/** The time machine chamber: plated walls, two light pillars, the clock ring and the warp pad. */
function Chamber() {
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="npa-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PORTAL.VOID} />
          <stop offset="1" stopColor={PORTAL.PLATE} />
        </linearGradient>
        <radialGradient id="npa-pad" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor={PORTAL.TEAL} />
          <stop offset="0.5" stopColor={PORTAL.TEAL_DEEP} />
          <stop offset="1" stopColor={PORTAL.STONE_DARK} />
        </radialGradient>
      </defs>
      <rect width="400" height="320" fill="url(#npa-wall)" />
      <g className={stage.back}>
        <circle cx="200" cy="120" r="96" fill="none" stroke={PORTAL.BRASS_DARK} strokeWidth="14" />
        <circle cx="200" cy="120" r="96" fill="none" stroke={PORTAL.BRASS} strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="197" y="28" width="6" height="16" fill={PORTAL.TEAL} transform={`rotate(${i * 30} 200 120)`} />
        ))}
        <circle cx="200" cy="120" r="74" fill={PORTAL.CHAMBER} opacity="0.7" />
        {[
          [44, 40],
          [338, 40],
        ].map(([x]) => (
          <g key={x}>
            <rect x={x} y="30" width="18" height="240" rx="6" fill={PORTAL.PLATE_LIT} stroke={PORTAL.VOID} strokeWidth="2" />
            <rect x={x + 6} y="42" width="6" height="216" rx="3" fill={PORTAL.TEAL} opacity="0.8" />
          </g>
        ))}
        <path d="M0 250 H400 V320 H0 Z" fill={PORTAL.STONE_DARK} />
        {[80, 160, 240, 320].map((x) => (
          <path key={x} d={`M${x} 250 L${(x - 200) * 1.8 + 200} 320`} stroke={PORTAL.SEAM} strokeWidth="2" />
        ))}
      </g>
      <ellipse cx="200" cy="270" rx="120" ry="26" fill={PORTAL.BRASS_DARK} />
      <ellipse cx="200" cy="264" rx="112" ry="22" fill="url(#npa-pad)" stroke={PORTAL.BRASS} strokeWidth="3" />
      <ellipse cx="200" cy="264" rx="70" ry="13" fill="none" stroke={PORTAL.TEAL} strokeWidth="2" strokeDasharray="8 6" />
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
      <div className={`relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] border-4 border-[color:var(--np-plate)] ${stage.frame}`}>
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

/** The name as letters that drop in one by one; a space keeps its width. */
function TitleLetters({ name }: { name: string }) {
  return (
    <span aria-hidden="true">
      {[...name].map((letter, i) => (
        <span key={`${letter}-${i}`} className={`inline-block ${stage.letter}`} style={{ '--i': i } as CSSProperties}>
          {letter === ' ' ? ' ' : letter}
        </span>
      ))}
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
        <h1 className={`text-4xl leading-none sm:text-6xl ${ui.display}`}>
          <span className="sr-only">{name}</span>
          <TitleLetters name={name} />
        </h1>
        <div className={stage.afterTitle}>
          <p className="mt-5 inline-block rounded-lg bg-[color:var(--np-orange)] px-3 py-1 text-lg font-black uppercase tracking-wide text-[color:var(--np-void)]">{headline}</p>
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

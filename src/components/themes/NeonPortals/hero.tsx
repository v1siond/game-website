'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import type { Profession } from '@/lib/cv/professions'
import { CVLink, DemoLink, HeroActions } from './actions'
import { Fruit, Swirl } from './art'
import { HeroCharacter } from './character'
import { PORTAL } from './palette'
import world from './world.module.css'

// The recruiter first screen, entered the way the platformer's corridor levels open: the camera looks
// down a temple corridor and he runs out of the warp at its far end straight at the screen, past the
// fruit on the path, jumps, lands with a squash, and the title card bounces in letter by letter.
//
//   run    0ms     out of the far portal, small, bobbing on every stride as he grows toward the camera
//   jump   1300ms  one hop off the path, the fruit he passed fly past the camera
//   land   1650ms  squash flat, stretch tall, settle (the game's cartoon landing)
//   title  1850ms  the name drops in letter by letter with an overshoot, 45 ms apart; the rest slides up
//   ready  after the last letter: everything rests on its last frame
//
// Pattern: setTimeout phases, each a data-phase value the CSS keys its keyframes on (transform and
// opacity only). The resting frame is the default style, so 'ready', reduced motion and a World Select
// preview all show it with no animation. The corridor leans to the pointer (--mx, --my on the root):
// walls one way, the far portal the other, so the depth reads.

type Phase = 'wait' | 'run' | 'jump' | 'land' | 'title' | 'ready'

const LETTER_MS = 45

const phasesFor = (letters: number): ReadonlyArray<readonly [Phase, number]> => [
  ['run', 0],
  ['jump', 1300],
  ['land', 1650],
  ['title', 1850],
  ['ready', 1850 + 600 + letters * LETTER_MS],
]

function useRunPhase(letters: number) {
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

// Fruit on the path at three depths, each flying past the camera on the jump.
const PATH_FRUIT = [
  { place: 'left-[44%] top-[58%] h-5 w-5', i: 0 },
  { place: 'left-[54%] top-[64%] h-7 w-7', i: 1 },
  { place: 'left-[38%] top-[72%] h-9 w-9', i: 2 },
  { place: 'left-[60%] top-[80%] h-11 w-11', i: 3 },
]

const TORCHES = [
  { x: 60, y: 92 },
  { x: 340, y: 92 },
  { x: 118, y: 108 },
  { x: 282, y: 108 },
]

/** The corridor in one point perspective: stone walls, a tiled path, vines over the top, a warp far off. */
function Corridor() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="np-corridor-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PORTAL.VOID} />
          <stop offset="1" stopColor={PORTAL.HAZE} />
        </linearGradient>
        <linearGradient id="np-corridor-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PORTAL.STONE_DARK} />
          <stop offset="1" stopColor={PORTAL.STONE} />
        </linearGradient>
        <linearGradient id="np-wall-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PORTAL.STONE_DARK} />
          <stop offset="1" stopColor={PORTAL.STONE} />
        </linearGradient>
        <linearGradient id="np-wall-right" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor={PORTAL.STONE_DARK} />
          <stop offset="1" stopColor={PORTAL.STONE} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#np-corridor-sky)" />
      <g className={world.far}>
        <rect x="150" y="80" width="100" height="84" fill={PORTAL.NIGHT} />
        <foreignObject x="168" y="92" width="64" height="64">
          <Swirl tone="VIOLET" className="h-full w-full" arms={world.swirlSlow} />
        </foreignObject>
      </g>
      <g className={world.walls}>
        <path d="M0 0 L150 80 L150 164 L0 240 Z" fill="url(#np-wall-left)" />
        <path d="M400 0 L250 80 L250 164 L400 240 Z" fill="url(#np-wall-right)" />
        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <line x1={150 * t} y1={80 * t} x2={150 * t} y2={240 - 76 * t} stroke={PORTAL.STONE_DARK} strokeWidth="2" />
            <line x1={400 - 150 * t} y1={80 * t} x2={400 - 150 * t} y2={240 - 76 * t} stroke={PORTAL.STONE_DARK} strokeWidth="2" />
          </g>
        ))}
        <path d="M0 240 L150 164 L250 164 L400 240 Z" fill="url(#np-corridor-floor)" />
        {[176, 192, 214].map((y) => (
          <line key={y} x1={150 - (y - 164) * 1.97} y1={y} x2={250 + (y - 164) * 1.97} y2={y} stroke={PORTAL.STONE_DARK} strokeWidth="1.5" />
        ))}
        {[-1, -0.33, 0.33, 1].map((k) => (
          <line key={k} x1={200 + k * 50} y1="164" x2={200 + k * 200} y2="240" stroke={PORTAL.STONE_DARK} strokeWidth="1.5" />
        ))}
        {TORCHES.map(({ x, y }) => (
          <g key={x}>
            <rect x={x - 3} y={y} width="6" height="14" fill={PORTAL.BAND} />
            <ellipse cx={x} cy={y - 4} rx="6" ry="9" fill={PORTAL.ORANGE} />
            <ellipse cx={x} cy={y - 2} rx="3" ry="5" fill={PORTAL.GOLD} />
          </g>
        ))}
        <path d="M0 0 H400 V14 Q360 30 330 12 Q300 34 260 10 Q230 28 200 12 Q170 30 140 10 Q100 34 70 12 Q40 30 0 14 Z" fill="#1f6b2a" />
        <path d="M30 10 Q34 50 26 70 M90 12 Q96 40 88 56 M320 12 Q312 44 322 64 M372 10 Q366 36 374 52" stroke="#2f8f3a" strokeWidth="3" fill="none" />
      </g>
    </svg>
  )
}

function RunStage({ profession }: { profession: Profession }) {
  return (
    <div className={`relative aspect-[5/3] w-full overflow-hidden rounded-2xl border-4 border-[color:var(--np-stone-dark)] ${world.stageFrame}`} aria-hidden="true">
      <Corridor />
      {PATH_FRUIT.map(({ place, i }) => (
        <div key={place} className={`absolute ${place} ${world.pathFruit}`} style={{ '--i': i } as CSSProperties}>
          <Fruit className="h-full w-full" />
        </div>
      ))}
      <div className={`absolute bottom-[4%] left-1/2 h-[62%] w-[26%] -translate-x-1/2 ${world.runnerTrack}`}>
        <div className={`h-full w-full ${world.runner}`}>
          <HeroCharacter profession={profession} className="h-full w-full" />
        </div>
      </div>
      <div className={`absolute bottom-[3%] left-1/2 h-[5%] w-[22%] -translate-x-1/2 rounded-[50%] bg-[color:var(--np-void)]/50 ${world.runnerShadow}`} />
    </div>
  )
}

/** The name as letters that drop in one by one; a space keeps its width. */
function TitleLetters({ name }: { name: string }) {
  return (
    <span aria-hidden="true">
      {[...name].map((letter, i) => (
        <span key={`${letter}-${i}`} className={`inline-block ${world.letter}`} style={{ '--i': i } as CSSProperties}>
          {letter === ' ' ? ' ' : letter}
        </span>
      ))}
    </span>
  )
}

export function RunInHero({ profession }: { profession: Profession }) {
  const { navigation } = useLabels()

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => <RunInLayout name={name} headline={headline} tagline={tagline} line={line} profession={profession} nav={navigation.contactAndCv} actions={<HeroActions actions={actions} />} />}
    />
  )
}

interface RunInLayoutProps {
  name: string
  headline: string
  tagline: string
  line: string
  profession: Profession
  nav: string
  actions: ReactNode
}

function RunInLayout({ name, headline, tagline, line, profession, nav, actions }: RunInLayoutProps) {
  const { ref, phase } = useRunPhase(name.length)

  return (
    <div ref={ref} data-phase={phase} className={`mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${world.hero}`}>
      <div className="order-2 lg:order-1">
        <h1 className={`text-4xl leading-none sm:text-6xl ${world.title}`}>
          <span className="sr-only">{name}</span>
          <TitleLetters name={name} />
        </h1>
        <div className={world.afterTitle}>
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
        <RunStage profession={profession} />
      </div>
    </div>
  )
}

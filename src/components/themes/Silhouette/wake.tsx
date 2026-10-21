'use client'

import { useEffect, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { NameWords } from '@/components/cv/NameWords'
import { HeroCharacter, type SpritePose } from './character'
import { Layer, pinePath } from './depth'
import { GROUND, Sky, Soft } from './places'
import { CVLink, HeroActions, PlayLink } from './actions'
import { SHADE, SKY, TYPEWRITER } from './palette'
import shade from './shade.module.css'

// The hero: he wakes at the edge of the forest, the way a silhouette platformer opens. The page starts
// black; an iris of light opens on the forest (four planes, ./depth); he lies in the grass, pushes up onto
// his hands and stands; then his name and title fade in as a silent film intertitle above the scene and
// the contact actions below it. setTimeout phases, once on mount; reduced motion and the World Select
// preview start on the last frame. The layers lean to the pointer the whole time.
//
// Animated: the iris and the black, his parts, the rope, four layer leans, the two text blocks.

type WakePhase = 'dark' | 'iris' | 'rise' | 'title' | 'done'

const WAKE_AT: ReadonlyArray<readonly [WakePhase, number]> = [
  ['iris', 80],
  ['rise', 1150],
  ['title', 1600],
  ['done', 2500],
]

const POSE: Record<WakePhase, SpritePose> = {
  dark: 'lie',
  iris: 'lie',
  rise: 'rise',
  title: 'rise',
  done: 'idle',
}

const SHOWN: Record<WakePhase, boolean> = { dark: false, iris: false, rise: false, title: true, done: true }

const DAWN = SKY.dawn
const FAR_PINES = [24, 66, 104, 160, 214, 380, 432, 470, 520, 566]

function Forest({ profession, pose }: { profession: Profession; pose: SpritePose }) {
  return (
    <>
      <Sky light={DAWN}>
        <div className="absolute left-[55%] top-[30%] h-48 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--sh-dawn-rim),transparent)] opacity-40" />
      </Sky>
      <Layer depth="far">
        {FAR_PINES.map((x, index) => (
          <path key={x} d={pinePath(x, 60 + (index % 4) * 18, 170)} fill={DAWN.far} opacity={0.75} />
        ))}
        <path d="M0 172 Q150 160 300 168 T600 166 V200 H0 Z" fill={DAWN.far} />
      </Layer>
      <Layer depth="mid">
        <path d="M60 0 H78 V180 H58 Q66 120 60 0 Z" fill={DAWN.mid} />
        <path d="M70 40 Q86 70 82 110 M66 60 Q52 90 58 128" stroke={DAWN.mid} strokeWidth={1.4} fill="none" />
        <path d="M486 0 H512 V180 H484 Q494 110 486 0 Z" fill={DAWN.mid} />
        <path d="M498 30 Q470 64 478 120 M506 50 Q530 92 520 140" stroke={DAWN.mid} strokeWidth={1.4} fill="none" />
        <path d="M150 0 H160 V180 H148 Z" fill={DAWN.mid} opacity={0.7} />
      </Layer>
      <Layer depth="plane">
        <path d={GROUND} fill={SHADE.black} />
        <path d="M352 178 Q356 164 380 162 H452 Q462 164 462 172 L460 180 H352 Z" fill={SHADE.black} />
        <path d="M380 162 L374 150 M420 162 L428 146" stroke={SHADE.black} strokeWidth={2} />
        <g className={shade.ropeSway}>
          <line x1={300} y1={0} x2={300} y2={120} stroke={SHADE.black} strokeWidth={1.6} />
          <circle cx={300} cy={122} r={2.2} fill={SHADE.black} />
        </g>
        <HeroCharacter profession={profession} pose={pose} place={{ x: 228, y: 180, height: 54 }} />
      </Layer>
      <Layer depth="near">
        <Soft d="M0 0 H120 Q80 20 60 46 Q30 70 0 76 Z" />
        <Soft d="M0 200 L0 132 L10 170 L20 120 L30 168 L40 140 L50 176 L62 150 L68 200 Z" />
        <Soft d="M600 200 L600 120 L588 168 L578 132 L566 172 L556 148 L546 200 Z" />
      </Layer>
    </>
  )
}

function Iris({ phase }: { phase: WakePhase }) {
  const open = phase !== 'dark'
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${phase === 'done' ? 'hidden' : ''}`} aria-hidden="true">
      <div className={`absolute inset-0 bg-[color:var(--sh-black)] ${open ? `opacity-0 ${shade.irisBlack}` : 'opacity-100'}`} />
      <div className={`${shade.iris} ${open ? shade.irisOpen : ''}`} />
    </div>
  )
}

const TEXT_SHOWN = (shown: boolean) => (shown ? `opacity-100 ${shade.titleIn}` : 'translate-y-2 opacity-0')

export function WakeHero({ profession }: { profession: Profession }) {
  const { navigation } = useLabels()
  const preview = usePreview()
  const [phase, setPhase] = useState<WakePhase>('dark')

  useEffect(() => {
    if (preview || prefersReducedMotion()) {
      setPhase('done')
      return
    }
    const timers = WAKE_AT.map(([next, at]) => window.setTimeout(() => setPhase(next), at))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [preview])

  const shown = SHOWN[phase]

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className="mx-auto max-w-6xl">
          <div className={`px-4 pb-6 pt-8 text-center sm:pt-12 ${TEXT_SHOWN(shown)}`}>
            <div className="mx-auto mb-4 h-px w-24 bg-[color:var(--sh-fog)]" aria-hidden="true" />
            <h1 className={`text-[clamp(1.5rem,7vw,2.25rem)] font-normal uppercase tracking-[0.3em] text-[color:var(--sh-heading)] sm:tracking-[0.45em] ${TYPEWRITER}`}>
              <NameWords name={name} />
            </h1>
            <p className="mt-3 text-sm tracking-[0.2em] text-[color:var(--sh-text)] sm:text-base">{headline}</p>
            <p className="mt-1 text-sm italic tracking-wider text-[color:var(--sh-muted)]">{tagline}</p>
            <div className="mx-auto mt-4 h-px w-24 bg-[color:var(--sh-fog)]" aria-hidden="true" />
          </div>

          <div className="relative h-[42vh] min-h-[240px] max-h-[460px] overflow-hidden border-y-2 border-[color:var(--sh-black)]">
            <Forest profession={profession} pose={POSE[phase]} />
            <Iris phase={phase} />
          </div>

          <div className={`flex flex-col items-center gap-4 px-4 pt-6 ${TEXT_SHOWN(shown)}`}>
            <p className="max-w-xl text-center text-sm tracking-wider text-[color:var(--sh-text)]">{line}</p>
            <nav className="flex flex-wrap items-center justify-center gap-3" aria-label={navigation.contactAndCv}>
              <HeroActions actions={actions} />
              <CVLink />
              <PlayLink />
            </nav>
          </div>
        </div>
      )}
    />
  )
}

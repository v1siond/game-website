'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Profession } from '@/lib/cv/professions'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { CVLink, DemoLink, HeroActions } from './buttons'
import type { Phase } from './figure'
import { HeroFigure } from './heroFigure'
import { PAD_ORDER } from './pads'
import { ERA_COLOURS, PORTAL } from './palette'
import { buildStage } from './stage'
import { useSceneWindow, useWorldEngine } from './world'
import css from './portals.module.css'

// The first screen: the warp room (stage.ts) with him on the picked pad (heroFigure.tsx), the three pads as
// the profession switch under it, the outfit plate on the stage's lower edge, and beside it (under it on a
// phone) his name in the logo's capitals and the copy on one dark plate.
//
// He arrives through the hero's phases, each a data-phase value the CSS and his figure key on:
//   beam   0 ms     the light column comes down on his pad
//   form   450 ms   he forms in it spinning (0.5 s)
//   land   950 ms   the squash on the pad (0.25 s)
//   title  1300 ms  the name's letters drop in 45 ms apart, the copy rises
//   ready  after the last letter: he breathes on his pad
// About 2.8 s for his name. Reduced motion and a World Select preview start at ready.

const OUTFIT_LOOK: WardrobeLook = { plate: PORTAL.ORANGE, text: PORTAL.VOID, ring: PORTAL.VOID }

const LETTER_MS = 45

const phasesFor = (letters: number): ReadonlyArray<readonly [Phase, number]> => [
  ['beam', 0],
  ['form', 450],
  ['land', 950],
  ['title', 1300],
  ['ready', 1300 + 500 + letters * LETTER_MS],
]

function useArrival(letters: number, still: boolean) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1, rootMargin: '0px' })
  const [phase, setPhase] = useState<Phase>('wait')

  useEffect(() => {
    if (still) {
      setPhase('ready')
      return
    }
    if (!triggered) return
    const timers = phasesFor(letters).map(([next, at]) => window.setTimeout(() => setPhase((now) => (now === 'ready' ? now : next)), at))
    return () => timers.forEach(window.clearTimeout)
  }, [triggered, still, letters])

  return { ref, phase }
}

const PAD_LOOK: Record<Profession, string> = {
  engineer: 'bg-[color:var(--np-pad-blue-deep)] text-[color:var(--np-white)]',
  drummer: 'bg-[color:var(--np-pad-red-deep)] text-[color:var(--np-white)]',
  fighter: 'bg-[color:var(--np-pad-gold)] text-[color:var(--np-void)]',
}

function PadButton({ option }: { option: ProfessionOption }) {
  const { professionFields } = useLabels()
  const { id, label, selected, optionProps } = option

  return (
    <button type="button" {...optionProps} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 ${css.pad} ${selected ? 'bg-[color:var(--np-panel)]' : ''}`}>
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full border-[3px] text-xl ${css.display} ${PAD_LOOK[id]} ${selected ? 'border-[color:var(--np-gold)]' : 'border-[color:var(--np-band)]'}`}
        aria-hidden="true"
      >
        {PAD_ORDER.indexOf(id) + 1}
      </span>
      <span className={`text-center text-sm leading-tight sm:text-base ${css.display} ${selected ? 'text-[color:var(--np-gold)]' : 'text-[color:var(--np-white)]'}`}>{label}</span>
      <span className="text-center text-sm text-[color:var(--np-muted)]">{professionFields[id]}</span>
    </button>
  )
}

function Stage({ profession, phase, still, spinLabel }: { profession: Profession; phase: Phase; still: boolean; spinLabel: string }) {
  const picked = useRef(profession)
  const { engine } = useWorldEngine()
  const make = useCallback(() => buildStage(() => picked.current), [])
  const windowRef = useSceneWindow<HTMLDivElement>(make)
  const sky = ERA_COLOURS.room

  useEffect(() => {
    picked.current = profession
    engine?.wake()
  }, [profession, engine])

  return (
    <div className="relative">
      <div
        ref={windowRef}
        className={`aspect-[5/4] w-full ${css.window}`}
        style={{ '--np-sky-top': sky.skyTop, '--np-sky-low': sky.skyLow } as CSSProperties}
        data-live={engine ? '' : undefined}
        aria-hidden="true"
      />
      <HeroFigure profession={profession} phase={phase} still={still} stage={windowRef} spinLabel={spinLabel} />
      <Wardrobe look={OUTFIT_LOOK} className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2" />
    </div>
  )
}

function TitleLetters({ name }: { name: string }) {
  return (
    <span aria-hidden="true">
      <NameWords
        name={name}
        wordClassName="inline-block"
        letter={(letter, i) => (
          <span className={css.letter} style={{ '--i': i } as CSSProperties}>
            {letter}
          </span>
        )}
      />
    </span>
  )
}

interface CopyProps {
  name: string
  headline: string
  tagline: string
  line: string
  nav: string
  actions: ReactNode
}

function Copy({ name, headline, tagline, line, nav, actions }: CopyProps) {
  return (
    <div>
      <h1 className={`text-[clamp(2.25rem,1.25rem+4vw,4.25rem)] leading-[1.1] ${css.title}`}>
        <span className="sr-only">{name}</span>
        <TitleLetters name={name} />
      </h1>
      <div className={`mt-6 p-5 sm:p-6 ${css.afterTitle} ${css.plate}`}>
        <p className={`inline-block px-4 pb-1 pt-1.5 text-lg ${css.chip}`}>{headline}</p>
        <p className="mt-4 text-lg text-[color:var(--np-white)]">{tagline}</p>
        <p className="mt-2 text-base text-[color:var(--np-muted)]">{line}</p>
        <nav className="mt-6 flex flex-wrap items-center gap-3" aria-label={nav}>
          {actions}
          <CVLink />
          <DemoLink />
        </nav>
      </div>
    </div>
  )
}

export function Arrival({ profession, still }: { profession: Profession; still: boolean }) {
  const { navigation, warp } = useLabels()

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <ArrivalLayout name={name} profession={profession} still={still} spinLabel={warp.spin} switchLabel={navigation.profession} selectionLabel={navigation.professionSelection}>
          <Copy name={name} headline={headline} tagline={tagline} line={line} nav={navigation.contactAndCv} actions={<HeroActions actions={actions} />} />
        </ArrivalLayout>
      )}
    />
  )
}

interface ArrivalLayoutProps {
  name: string
  profession: Profession
  still: boolean
  spinLabel: string
  switchLabel: string
  selectionLabel: string
  children: ReactNode
}

function ArrivalLayout({ name, profession, still, spinLabel, switchLabel, selectionLabel, children }: ArrivalLayoutProps) {
  const { ref, phase } = useArrival(name.length, still)

  return (
    <div ref={ref} data-phase={phase} data-worlds-hero="" className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-8 pt-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="order-2 lg:order-1">{children}</div>
      <div className="order-1 lg:order-2">
        <Stage profession={profession} phase={phase} still={still} spinLabel={spinLabel} />
        <section aria-label={selectionLabel} className="mt-10">
          <ProfessionSwitch className="flex items-stretch justify-center gap-2 sm:gap-4" label={switchLabel} renderOption={(option) => <PadButton option={option} />} />
        </section>
      </div>
    </div>
  )
}

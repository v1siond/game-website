'use client'

import { useCallback, useEffect, useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Profession } from '@/lib/cv/professions'
import { VaultSprite, type SpriteMotion } from './sprite'
import { SpeedRays } from './ink'
import { ContactActions, InkButton } from './buttons'
import { CEL } from './palette'
import cel from './cel.module.css'

// The hero entrance, the inked shooter's character intro card: he sprints in across the desert, leaps,
// the frame freezes mid leap in a two tone wash behind speed rays with the letterbox cut in on a slant,
// his name slams down (the stage shakes with it), the headline card and the tagline slide in under it
// as the card's subtitle, then the colour comes back, the bars pull away and he lands into his idle.
// It plays once, when the header first shows; a click on the stage, any key or the skip button ends it
// at once, and under reduced motion it is never played (every phase reached from the start).
//
// Each phase reached adds its data attribute to the header and the CSS starts that phase's motion off
// it (cel.module.css, "the freeze frame entrance"); data-done holds the end state.

type Phase = 'run' | 'leap' | 'freeze' | 'name' | 'title' | 'release' | 'done'

const TIMELINE: ReadonlyArray<readonly [Phase, number]> = [
  ['run', 0],
  ['leap', 520],
  ['freeze', 900],
  ['name', 1050],
  ['title', 1450],
  ['release', 2500],
  ['done', 2900],
]

const ALL_PHASES = new Set<Phase>(TIMELINE.map(([phase]) => phase))

// His pose per stretch of the entrance: running in, frozen mid leap, then once he lands his idle, or
// his profession's action (the turret, the drums, the kick) while the visitor points at him.
const spriteMotion = (reached: ReadonlySet<Phase>, acting: boolean): SpriteMotion => {
  if (reached.has('release')) return acting ? 'action' : 'idle'
  if (reached.has('leap')) return 'leap'
  return 'run'
}

const phaseFlags = (reached: ReadonlySet<Phase>) =>
  Object.fromEntries(TIMELINE.map(([phase]) => [`data-${phase}`, reached.has(phase) || undefined]))

const DUST = [0, 1, 2]

export function FreezeIntro({ profession, reduced }: { profession: Profession; reduced: boolean }) {
  const { hud, navigation } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.05, rootMargin: '0px' })
  const [reached, setReached] = useState<ReadonlySet<Phase>>(new Set())
  const done = reduced || reached.has('done')
  const shown = done ? ALL_PHASES : reached

  const [acting, setActing] = useState(false)
  const skip = useCallback(() => setReached(ALL_PHASES), [])

  useEffect(() => {
    if (!triggered || reduced) return
    const timers = TIMELINE.map(([phase, at]) =>
      window.setTimeout(() => setReached((current) => new Set(current).add(phase)), at),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [triggered, reduced])

  useEffect(() => {
    if (done || !triggered) return
    window.addEventListener('keydown', skip, { once: true })
    return () => window.removeEventListener('keydown', skip)
  }, [done, triggered, skip])

  return (
    <header ref={ref} className={`relative z-20 overflow-hidden ${cel.intro}`} onClick={done ? undefined : skip} {...phaseFlags(shown)}>
      <div className={`pointer-events-none absolute inset-0 ${cel.wash} bg-[var(--cel-dusk-high)] mix-blend-multiply`} aria-hidden="true" />
      <SpeedRays color={CEL.sun} className={`pointer-events-none absolute inset-0 h-full w-full ${cel.rays}`} />
      {/* the letterbox exists only while the entrance plays, so no part of its slant is left at rest */}
      {!done && (
        <>
          <div className={`pointer-events-none absolute inset-x-0 top-0 h-14 origin-left bg-[var(--cel-ink)] ${cel.barTop}`} aria-hidden="true" />
          <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 origin-left bg-[var(--cel-ink)] ${cel.barBottom}`} aria-hidden="true" />
        </>
      )}

      <div className={`relative mx-auto grid min-h-[86vh] max-w-6xl items-end gap-6 px-4 pb-20 pt-24 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center ${cel.shake}`}>
        {/* a pointer extra: pointing at him or clicking him plays his action, the same as each section shows */}
        <div
          className={`relative mx-auto h-64 w-40 sm:h-80 sm:w-48 ${cel.runner}`}
          onPointerEnter={() => setActing(true)}
          onPointerLeave={() => setActing(false)}
          onClick={() => setActing((now) => !now)}
          aria-hidden="true"
        >
          {DUST.map((index) => (
            <span
              key={index}
              className={`absolute bottom-0 left-2 h-6 w-6 rounded-full border-[3px] border-[var(--cel-ink)] bg-[var(--cel-dune)] ${cel.dust}`}
              style={{ ['--i' as string]: index }}
              aria-hidden="true"
            />
          ))}
          <div className={`h-full w-full ${cel.leap}`}>
            <VaultSprite profession={profession} motion={spriteMotion(shown, acting)} className="h-full w-full" />
          </div>
        </div>

        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="min-w-0">
              {/* the size runs with the viewport between 3rem and 6rem, so the longest word fits a 320px
                  screen and the whole name sits on one line from about 1024px; it only wraps between words */}
              <h1 className={`text-[clamp(3rem,2rem+5vw,6rem)] leading-none ${cel.display} ${cel.nameCard}`}>
                <span className={`inline-block ${cel.nameLetters}`}>
                  <NameWords name={name} />
                </span>
              </h1>
              <p className={`mt-5 inline-block px-4 py-2 text-lg font-bold ${cel.subtitleCard} ${cel.subtitle}`}>{headline}</p>
              <div className={cel.tagline}>
                <p className="mt-4 inline-block bg-[var(--cel-ink)] px-3 py-1 text-base font-bold italic text-[var(--cel-sun)]">{tagline}</p>
                <p className="mt-2 text-base font-bold">{line}</p>
              </div>
              <nav className={`mt-6 flex flex-wrap gap-3 ${cel.introActions}`} aria-label={navigation.contactAndCv}>
                <ContactActions actions={actions} />
              </nav>
            </div>
          )}
        />
      </div>

      {!done && (
        <InkButton tone="paper" className="absolute bottom-4 right-4 z-10" onClick={skip}>
          {hud.skipIntro}
        </InkButton>
      )}
      <div className={`pointer-events-none absolute inset-0 bg-[var(--cel-white)] ${cel.flash}`} aria-hidden="true" />
    </header>
  )
}

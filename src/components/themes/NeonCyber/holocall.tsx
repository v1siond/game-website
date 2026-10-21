'use client'

import type { CSSProperties } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { CVLink, HeroAction } from './actions'
import { MercSprite } from './merc'
import { panelHeadingId } from './hud'
import world from './world.module.css'

// Contact as an incoming call on the optics: when the section comes into view the call rings (two
// rings pulse out three times), then his portrait resolves line by line from the right, the way a call
// feed builds and he takes the scan pose, hand at the temple and the optic reticle locking on the
// caller. Email and LinkedIn are the two ways to answer; pointing at one kicks it out a step.

const PORTRAIT_LINES = [0, 1, 2, 3, 4, 5, 6, 7]

export function HoloCall({ profession }: { profession: Profession }) {
  const { cyber, sections, navigation } = useLabels()
  const { ref, triggered } = useSectionTrigger()

  return (
    <section ref={ref} className="relative z-20 px-4 py-16 sm:px-6" aria-labelledby={panelHeadingId(sections.contact)}>
      <h2 id={panelHeadingId(sections.contact)} className="sr-only">
        {sections.contact}
      </h2>
      <RecruiterHero
        render={({ name, line, actions }) => (
          <div className={`${world.panel} mx-auto max-w-2xl p-5 sm:p-8 ${triggered ? world.calling : world.waiting}`}>
            <p className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[color:var(--neon-hud)]">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-[color:var(--neon-hack)]" />
              </span>
              {cyber.incomingCall}
            </p>

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0" aria-hidden="true">
                {['0s', '0.7s'].map((at) => (
                  <span
                    key={at}
                    className={`${world.ring} absolute -inset-3 rounded-full border-2 border-[color:var(--neon-hack)]`}
                    style={{ '--ring-at': at } as CSSProperties}
                  />
                ))}
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-[color:var(--neon-data)] bg-[color:var(--neon-ink)]">
                  <MercSprite profession={profession} motion={triggered ? 'scan' : 'idle'} className="absolute left-1/2 top-2 h-auto w-28 -translate-x-1/2" />
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgba(94,242,255,0.14)_2px_3px)]" />
                  <div className="absolute inset-0 flex flex-col">
                    {PORTRAIT_LINES.map((i) => (
                      <span key={i} className={`${world.resolve} block flex-1 bg-[color:var(--neon-glass)]`} style={{ '--i': i } as CSSProperties} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <p className="text-2xl uppercase tracking-[0.12em] text-[color:var(--neon-ice)]">{name}</p>
                <p className="mt-2 text-sm text-[color:var(--neon-ash)]">{line}</p>
                <nav className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start" aria-label={navigation.contactAndCv}>
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} className={world.answer} />
                  ))}
                  <CVLink />
                </nav>
              </div>
            </div>
          </div>
        )}
      />
    </section>
  )
}

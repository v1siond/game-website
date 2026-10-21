'use client'

import { useEffect, useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { NameWords } from '@/components/cv/NameWords'
import { ENTRANCE_MS } from './door'
import { CVLink, HeroAction, PortfolioLink } from './actions'
import horror from './horror.module.css'
import look from './world.module.css'

// The hero's file card, over the main hall of the house behind the page (./stage, ./rooms): once the door
// (./door) has passed and he has walked into the hall, his name is typed onto the card. As the System
// Engineer he takes aim with the laser sight, which follows the visitor's pointer, and the hint under the
// card says so. One timer on mount; reduced motion and the World Select preview start typed.

const WALK_IN_MS = 1400

const TYPED = (shown: boolean) => (shown ? horror.typeIn : '')

export function HallHero({ profession }: { profession: Profession }) {
  const { navigation, horror: words } = useLabels()
  const preview = usePreview()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const wait = preview || prefersReducedMotion() ? 0 : ENTRANCE_MS - 200 + WALK_IN_MS
    const timer = window.setTimeout(() => setShown(true), wait)
    return () => window.clearTimeout(timer)
  }, [preview])

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <div className="h-[14vh]" aria-hidden="true" />
          {profession === 'engineer' && <p className={`mx-auto w-fit bg-[color:var(--sh-void)] px-3 py-1 text-center text-sm italic text-[color:var(--sh-fog)] ${look.typed}`}>{words.aimHint}</p>}

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

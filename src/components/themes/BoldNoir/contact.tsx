'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { headingId } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HitStar, RansomWord } from './backdrop'
import { CVLink, HeroAction } from './actions'
import world from './world.module.css'

// Contact as the second calling card: thrown in from the other side once the section is in view, it
// spins and lands crooked with the contact line and the actions on it. Each action kicks out on hover.
// Pattern: CSS only, one useSectionTrigger switch (data-on), the card's throw is a single keyframe.

const CONTACT_HEADING = headingId('noir', 'Contact')

export function DeliveredCard() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const { sections } = useLabels()

  return (
    <section
      ref={ref}
      data-on={triggered || undefined}
      aria-labelledby={CONTACT_HEADING}
      className={`relative z-20 mx-auto max-w-3xl px-4 py-16 ${world.stage}`}
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`relative px-6 pb-10 pt-12 sm:px-10 ${world.slab} ${world.delivered}`}>
            <HitStar className="absolute -left-6 -top-8 h-16 w-16" />
            <h2 id={CONTACT_HEADING} className="mb-4 text-4xl uppercase sm:text-5xl">
              <RansomWord text={sections.contact} />
            </h2>
            <p className={`mb-8 text-base text-[color:var(--noir-paper)] ${world.copy}`}>{line}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {actions.map((action) => (
                <span key={action.id} className={`inline-block ${world.kick}`}>
                  <HeroAction action={action} />
                </span>
              ))}
              <span className={`inline-block ${world.kick}`}>
                <CVLink />
              </span>
            </div>
          </div>
        )}
      />
    </section>
  )
}

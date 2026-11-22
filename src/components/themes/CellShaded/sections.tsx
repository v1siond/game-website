'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { aboutBlock } from '@/lib/cv/cvView'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { ORANGE_POINTS, Stage } from './stage'
import type { Zone } from './wasteland'
import { BountyBoard } from './bountyBoard'
import { SkillTree } from './skillTree'
import { LootDrops } from './lootDrops'
import { MakersPlates } from './badges'
import { BossCards } from './bossCards'
import { HeavyBag } from './heavyBag'
import { LootChest, SlamLanding } from './melee'
import cel from './cel.module.css'

// The picked profession's sections, each one a stage in the wasteland's day: About at noon, the bounty
// board, the skill tree and the services (plain papers under a fade) in the town's afternoon, the loot field, the makers' plates, the boss cards
// and the heavy bag at dusk. The respawn station closes the page at night (respawn.tsx). Two sections he
// hits himself (./melee): he lands on the about paper from a leap, and kicks open the chest the services
// come out of. The shared section plan picks which a profession shows and in which order.

/** The hour of the desert each section's stage hands the sky. */
const ZONE: Record<SectionId, Zone> = {
  about: 'noon',
  work: 'town',
  tech: 'town',
  services: 'town',
  projects: 'dusk',
  ventures: 'dusk',
  bands: 'dusk',
  muayThai: 'dusk',
}

// A section as its stage, titled from the labels in its hour of the day.
function Hour({ slot, children }: { slot: SectionSlot; children: ReactNode | ((on: boolean) => ReactNode) }) {
  const { sections: titles } = useLabels()
  return (
    <Stage title={titles[slot.titleKey]} zone={ZONE[slot.id]}>
      {children}
    </Stage>
  )
}

// One frame per section of the shared plan, which picks the ones a profession shows and their order.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { cards, about } = useLabels()
    const { education, languages, highlights } = aboutBlock(useCVData().professionalSummary)
    return (
      <Hour slot={slot}>
        <SlamLanding>
          <div className={`max-w-3xl p-5 sm:p-6 ${cel.paper}`}>
            <p className="max-w-prose text-base leading-relaxed">{slot.bio}</p>
            <div className="max-w-prose">
              <MarkedLines items={highlights} label={cards.keyAchievements} look={ORANGE_POINTS} />
              {education && (
                <p className="mt-4 text-base">
                  <span className="font-bold uppercase tracking-wider">{about.education}: </span>
                  {education}
                </p>
              )}
              {languages && (
                <p className="mt-1 text-base">
                  <span className="font-bold uppercase tracking-wider">{about.languages}: </span>
                  {languages}
                </p>
              )}
            </div>
          </div>
        </SlamLanding>
      </Hour>
    )
  },
  work: function WorkFrame({ slot }) {
    return (
      <Hour slot={slot}>
        <BountyBoard jobs={slot.jobs} />
      </Hour>
    )
  },
  tech: function TechFrame({ slot }) {
    return (
      <Hour slot={slot}>
        <SkillTree categories={slot.categories} />
      </Hour>
    )
  },
  services: function ServicesFrame({ slot }) {
    return (
      <Hour slot={slot}>
        <LootChest>
          <FadeInScene>
            <ul className={MASONRY_LIST}>
              {slot.services.map((service) => (
                <li key={service.id} className={`${MASONRY_ITEM} p-5 sm:p-6 ${cel.paper}`}>
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="mt-2 text-base leading-relaxed">{service.line}</p>
                </li>
              ))}
            </ul>
          </FadeInScene>
        </LootChest>
      </Hour>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    return (
      <Hour slot={slot}>
        <LootDrops projects={slot.projects} />
      </Hour>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    return (
      <Hour slot={slot}>
        <MakersPlates companies={slot.companies} />
      </Hour>
    )
  },
  bands: function BandsFrame({ slot }) {
    return (
      <Hour slot={slot}>
        <BossCards musician={slot.musician} bands={slot.bands} />
      </Hour>
    )
  },
  // The heavy bag throws its first hits off the stage's flag.
  muayThai: function MuayThaiFrame({ slot }) {
    return <Hour slot={slot}>{(on) => <HeavyBag martialArts={slot.martialArts} on={on} />}</Hour>
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)

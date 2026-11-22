'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { aboutBlock } from '@/lib/cv/cvView'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { drumsSince } from '@/lib/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { useZoneStage } from '@/hooks/useZoneStage'
import { atomicId } from './anchors'
import { QuestLog } from './quests'
import { Holotapes, Inventory } from './inventory'
import { TargetingSystem } from './targeting'
import { Radio } from './radio'
import { PerkChart } from './perks'
import { Fetch, LevelUp } from './events'
import { Loot } from './footlocker'
import { Dig } from './dig'
import { Spar } from './spar'
import { BeamedLog, BootedTube } from './repairs'
import { PlusRow } from './controls'
import type { Zone } from './journey'
import atomic from './atomic.module.css'
import j from './journey.module.css'

// The picked profession's sections, each one a stage: useSectionTrigger adds data-on once it scrolls
// into view and the CSS plays that section's own entrance off it (the quest cards power on like the
// tube). A moment with its own timers takes the on flag as a render prop: the tech stack's footlocker
// loot, the ventures' dig, the bands' radio dance and the Muay Thai spar. Every heading's id is atomicId of
// its title, the same the wrist terminal's section tabs jump to. The engineer's sections sit on the
// terminal's glass panels (the services as plain panels under a fade), the musician's on the radio,
// the fighter's on the printed perk chart. Two sections the dweller fixes himself (./repairs): he boots
// the services' dead tube on, and beams the quest log onto the glass from his wrist terminal. The shared
// plan picks which stages a profession shows and in which order.

// The title sits on its own glass plate: where a stage has no panel the wasteland's pale sky shows behind
// it, and phosphor on that sky reads under 2 to 1.
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={atomicId(title)} className={`mb-6 flex w-fit items-center gap-3 bg-atomic-glass px-3 py-1 text-2xl font-bold uppercase tracking-[0.2em] text-atomic-phosphor sm:text-3xl ${atomic.glow}`}>
      <span className="h-3 w-3 shrink-0 bg-atomic-phosphor" aria-hidden="true" />
      {title}
    </h2>
  )
}

interface StageProps {
  title: string
  zone: Zone
  className?: string
  // A moment that runs its own timers takes the stage's on flag as a render prop.
  children: ReactNode | ((on: boolean) => ReactNode)
}

function Stage({ title, zone, className = '', children }: StageProps) {
  const { ref, on } = useZoneStage(zone)

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={atomicId(title)} className={`mb-20 scroll-mt-24 ${atomic.stage} ${className}`}>
      <SectionTitle title={title} />
      {typeof children === 'function' ? children(on) : children}
    </section>
  )
}

// One line of the terminal's personnel record, the label in the dim phosphor capitals; an empty fact leaves no line.
function TerminalFact({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="font-bold uppercase tracking-widest text-atomic-phosphor-dim-text">{label}</dt>
      <dd className="text-atomic-ash">{value}</dd>
    </div>
  )
}

const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { sections: titles, cards, about } = useLabels()
    const { education, languages, highlights } = aboutBlock(useCVData().professionalSummary)
    return (
      <Stage title={titles[slot.titleKey]} zone="shelter" className={j.fetch}>
        <Fetch>
          <div className={`max-w-3xl p-5 sm:p-6 ${atomic.panel}`}>
            <p className="max-w-prose text-base leading-relaxed text-atomic-phosphor">{slot.bio}</p>
            {highlights.length > 0 && (
              <ul className="mt-4 max-w-prose space-y-1 border-t border-atomic-phosphor/30 pt-3" aria-label={cards.keyAchievements}>
                {highlights.map((highlight) => (
                  <PlusRow key={highlight}>{highlight}</PlusRow>
                ))}
              </ul>
            )}
            <dl className="mt-4 max-w-prose space-y-1 text-sm">
              <TerminalFact label={about.education} value={education} />
              <TerminalFact label={about.languages} value={languages} />
            </dl>
          </div>
        </Fetch>
      </Stage>
    )
  },
  work: function WorkFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles[slot.titleKey]} zone="wasteland" className={j.stamp}>
        <LevelUp job={slot.jobs[0]} />
        <BeamedLog>
          <QuestLog jobs={slot.jobs} />
        </BeamedLog>
      </Stage>
    )
  },
  tech: function TechFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles[slot.titleKey]} zone="wasteland" className={j.loot}>
        {(on) => (
          <Loot categories={slot.categories} on={on}>
            <Inventory categories={slot.categories} />
          </Loot>
        )}
      </Stage>
    )
  },
  services: function ServicesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles[slot.titleKey]} zone="wasteland">
        <FadeInScene>
          <BootedTube>
            <ul className={MASONRY_LIST}>
              {slot.services.map((service) => (
                <li key={service.id} className={`${MASONRY_ITEM} p-5 sm:p-6 ${atomic.panel}`}>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-atomic-phosphor">{service.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-atomic-phosphor">{service.line}</p>
                </li>
              ))}
            </ul>
          </BootedTube>
        </FadeInScene>
      </Stage>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles[slot.titleKey]} zone="wasteland" className={j.vats}>
        <TargetingSystem projects={slot.projects} />
      </Stage>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles[slot.titleKey]} zone="town" className={j.dig}>
        {(on) => (
          <Dig tapes={slot.companies.length} on={on}>
            {(dug) => <Holotapes companies={slot.companies} dug={dug} />}
          </Dig>
        )}
      </Stage>
    )
  },
  bands: function BandsFrame({ slot }) {
    const labels = useLabels()
    const { musician, bands } = slot
    return (
      <Stage title={labels.sections[slot.titleKey]} zone="town">
        {(on) => (
          <>
            <p className="mb-6 text-base text-atomic-yellow">{drumsSince(musician, labels.years)}</p>
            <Radio bands={bands} on={on} />
            <p className="mt-6 text-base italic text-atomic-phosphor-dim-text">{musician.line}</p>
          </>
        )}
      </Stage>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles[slot.titleKey]} zone="town">
        {(on) => (
          <Spar count={slot.martialArts.primary.achievements.length} on={on}>
            {({ shown, ring }) => <PerkChart martialArts={slot.martialArts} shown={shown} ring={ring} />}
          </Spar>
        )}
      </Stage>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)

'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { drumsSince } from '@/components/cv/sectionText'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
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
import type { Zone } from './journey'
import atomic from './atomic.module.css'
import j from './journey.module.css'

// The picked profession's sections, each one a stage: useSectionTrigger adds data-on once it scrolls
// into view and the CSS plays that section's own entrance off it (the quest cards power on like the
// tube). A moment with its own timers takes the on flag as a render prop: the tech stack's footlocker
// loot, the ventures' dig, the bands' radio dance and the Muay Thai spar. Every heading's id is atomicId of
// its title, the same the wrist terminal's section tabs jump to. The engineer's sections sit on the
// terminal's glass panels, the musician's on the radio, the fighter's on the printed perk chart.

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={atomicId(title)} className={`mb-6 flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.2em] text-atomic-phosphor sm:text-3xl ${atomic.glow}`}>
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

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections

  return (
    <>
      <Stage title={titles.about} zone="shelter" className={j.fetch}>
        <Fetch>
          <div className={`max-w-3xl p-5 sm:p-6 ${atomic.panel}`}>
            <p className="text-base leading-relaxed text-atomic-phosphor">{professionalSummary.bio}</p>
          </div>
        </Fetch>
      </Stage>

      {sections.jobs.length > 0 && (
        <Stage title={titles.workExperience} zone="wasteland" className={j.stamp}>
          <LevelUp job={sections.jobs[0]} />
          <QuestLog jobs={sections.jobs} />
        </Stage>
      )}

      <Stage title={titles.techStack} zone="wasteland" className={j.loot}>
        {(on) => (
          <Loot categories={sections.techStack} on={on}>
            <Inventory categories={sections.techStack} />
          </Loot>
        )}
      </Stage>

      {sections.projects.length > 0 && (
        <Stage title={titles.projects} zone="wasteland" className={j.vats}>
          <TargetingSystem projects={sections.projects} />
        </Stage>
      )}

      {sections.companies.length > 0 && (
        <Stage title={titles.ventures} zone="town" className={j.dig}>
          {(on) => (
            <Dig tapes={sections.companies.length} on={on}>
              {(dug) => <Holotapes companies={sections.companies} dug={dug} />}
            </Dig>
          )}
        </Stage>
      )}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <Stage title={labels.sections.bands} zone="town">
      {(on) => (
        <>
          <p className="mb-6 text-base text-atomic-yellow">{drumsSince(musician, labels.years)}</p>
          <Radio bands={bands} on={on} />
          <p className="mt-6 text-base italic text-atomic-phosphor-dim">{musician.line}</p>
        </>
      )}
    </Stage>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()

  return (
    <Stage title={labels.sections.muayThai} zone="town">
      {(on) => (
        <Spar count={sections.martialArts.primary.achievements.length} on={on}>
          {({ shown, ring }) => <PerkChart martialArts={sections.martialArts} shown={shown} ring={ring} />}
        </Spar>
      )}
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

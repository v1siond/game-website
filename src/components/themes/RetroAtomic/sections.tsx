'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { drumsSince } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { atomicId } from './anchors'
import { QuestLog } from './quests'
import { Holotapes, Inventory } from './inventory'
import { TargetingSystem } from './targeting'
import { Radio } from './radio'
import { PerkChart } from './perks'
import atomic from './atomic.module.css'

// The picked profession's sections, each one a stage: useSectionTrigger adds data-on once it scrolls
// into view and the CSS plays that section's own entrance off it (the quest cards power on like the
// tube, the perk cards flip in and their stars stamp down). Every heading's id is atomicId of its title,
// the same the wrist terminal's section tabs jump to. The engineer's sections sit on the terminal's
// glass panels, the musician's on the radio, the fighter's on the printed perk chart.

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={atomicId(title)} className={`mb-6 flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.2em] text-atomic-phosphor sm:text-3xl ${atomic.glow}`}>
      <span className="h-3 w-3 shrink-0 bg-atomic-phosphor" aria-hidden="true" />
      {title}
    </h2>
  )
}

function Stage({ title, children }: { title: string; children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger()

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={atomicId(title)} className={`mb-20 scroll-mt-24 ${atomic.stage}`}>
      <SectionTitle title={title} />
      {children}
    </section>
  )
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections

  return (
    <>
      <Stage title={titles.about}>
        <div className={`max-w-3xl p-5 sm:p-6 ${atomic.panel}`}>
          <p className="text-base leading-relaxed text-atomic-phosphor">{professionalSummary.bio}</p>
        </div>
      </Stage>

      {sections.jobs.length > 0 && (
        <Stage title={titles.workExperience}>
          <QuestLog jobs={sections.jobs} />
        </Stage>
      )}

      <Stage title={titles.techStack}>
        <Inventory categories={sections.techStack} />
      </Stage>

      {sections.projects.length > 0 && (
        <Stage title={titles.projects}>
          <TargetingSystem projects={sections.projects} />
        </Stage>
      )}

      {sections.companies.length > 0 && (
        <Stage title={titles.ventures}>
          <Holotapes companies={sections.companies} />
        </Stage>
      )}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <Stage title={labels.sections.bands}>
      <p className="mb-6 text-base text-atomic-yellow">{drumsSince(musician, labels.years)}</p>
      <Radio bands={bands} />
      <p className="mt-6 text-base italic text-atomic-phosphor-dim">{musician.line}</p>
    </Stage>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()

  return (
    <Stage title={labels.sections.muayThai}>
      <PerkChart martialArts={sections.martialArts} />
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

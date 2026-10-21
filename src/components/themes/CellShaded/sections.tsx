'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { useZoneStage } from '@/hooks/useZoneStage'
import { Stage, SectionTitle, celHeadingId } from './stage'
import type { Zone } from './wasteland'
import { BountyBoard } from './bountyBoard'
import { SkillTree } from './skillTree'
import { LootDrops } from './lootDrops'
import { MakersPlates } from './badges'
import { BossCards } from './bossCards'
import { HeavyBag } from './heavyBag'
import cel from './cel.module.css'

// The picked profession's sections, each one a stage in the wasteland's day: About at noon, the bounty
// board and the skill tree in the town's afternoon, the loot field, the makers' plates, the boss cards
// and the heavy bag at dusk. The respawn station closes the page at night (respawn.tsx).

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections

  return (
    <>
      <Stage title={titles.about} zone="noon">
        <div className={`max-w-3xl p-5 sm:p-6 ${cel.paper}`}>
          <p className="text-base leading-relaxed">{professionalSummary.bio}</p>
        </div>
      </Stage>

      {sections.jobs.length > 0 && (
        <Stage title={titles.workExperience} zone="town">
          <BountyBoard jobs={sections.jobs} />
        </Stage>
      )}

      {sections.techStack.length > 0 && (
        <Stage title={titles.techStack} zone="town">
          <SkillTree categories={sections.techStack} />
        </Stage>
      )}

      {sections.projects.length > 0 && (
        <Stage title={titles.projects} zone="dusk">
          <LootDrops projects={sections.projects} />
        </Stage>
      )}

      {sections.companies.length > 0 && (
        <Stage title={titles.ventures} zone="dusk">
          <MakersPlates companies={sections.companies} />
        </Stage>
      )}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const titles = useLabels().sections

  return (
    <Stage title={titles.bands} zone="dusk">
      <BossCards musician={sections.musician} bands={sections.bands} />
    </Stage>
  )
}

// The heavy bag needs the stage's flag to throw its first hits, so this stage is written out here.
export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const title = useLabels().sections.muayThai
  const { ref, on } = useZoneStage<Zone>('dusk')

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={celHeadingId(title)} className={`mb-24 scroll-mt-8 ${cel.stage}`}>
      <SectionTitle title={title} />
      <HeavyBag martialArts={sections.martialArts} on={on} />
    </section>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

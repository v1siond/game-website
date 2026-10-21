'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { Profession } from '@/lib/cv/professions'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { CompanyCard, TechCloud } from './cards'
import { BrassPanel, Chamber } from './plaque'
import { DiaryShelf } from './diary'
import { ResearchBoard } from './camera'
import { MarqueeRow } from './marquee'
import { PipeCircuit } from './circuit'

// The picked profession's sections, each a chamber one level deeper in the city (the plaque's gauge
// reads the depth). The short ones (about, the tech stack, ventures) fade in on a brass panel; the long
// lists are the city's own machines: the audio diaries for the jobs, the research camera board for the
// projects, the theatre marquees for the bands and the pipe works for the Muay Thai record.

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const labels = useLabels()

  return (
    <div className="space-y-20">
      <FadeInScene>
        <Chamber title={labels.sections.about} depth={0}>
          <BrassPanel>
            <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-[color:var(--deco-cream)]">{professionalSummary.bio}</p>
          </BrassPanel>
        </Chamber>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <Chamber title={labels.sections.workExperience} depth={1}>
          <DiaryShelf jobs={sections.jobs} />
        </Chamber>
      )}

      <FadeInScene>
        <Chamber title={labels.sections.techStack} depth={2}>
          <BrassPanel>
            <TechCloud categories={sections.techStack} />
          </BrassPanel>
        </Chamber>
      </FadeInScene>

      <Chamber title={labels.sections.projects} depth={3}>
        <ResearchBoard projects={sections.projects} />
      </Chamber>

      <FadeInScene>
        <Chamber title={labels.sections.ventures} depth={4}>
          <BrassPanel>
            <ul className="grid gap-5 md:grid-cols-3">
              {sections.companies.map((company) => (
                <li key={company.id}>
                  <CompanyCard company={company} />
                </li>
              ))}
            </ul>
          </BrassPanel>
        </Chamber>
      </FadeInScene>
    </div>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()

  return (
    <Chamber title={labels.sections.bands} depth={0}>
      <MarqueeRow bands={sections.bands} musician={sections.musician} />
    </Chamber>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()
  const { martialArts } = sections

  return (
    <Chamber title={labels.sections.muayThai} depth={0}>
      <h3 className="mb-8 text-center text-xl tracking-[0.1em] text-[color:var(--deco-gold-bright)] [font-family:var(--deco-display)]">{martialArts.primary.title}</h3>
      <PipeCircuit martialArts={martialArts} />
    </Chamber>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

/** How deep the closing posts chamber sits after each profession's own chambers. */
export const POSTS_DEPTH: Record<Profession, number> = {
  engineer: 5,
  drummer: 1,
  fighter: 1,
}

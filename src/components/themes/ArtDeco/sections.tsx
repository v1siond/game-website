'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { Profession } from '@/lib/cv/professions'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { TechCloud } from './cards'
import { PropagandaBanners } from './ventures'
import { BrassPanel, Chamber } from './plaque'
import { DiaryShelf } from './diary'
import { ResearchBoard } from './camera'
import { MarqueeRow } from './marquee'
import { TheatreStage } from './stage'
import { PoweredRoom } from './power'
import { GlassTunnel } from './tunnel'
import { HackedShutter } from './hack'
import { GuardianStreet } from './guardian'

// The picked profession's sections, each a chamber one level deeper in the city (the plaque's gauge
// reads the depth), and in each he or the city does something different: he powers the dark about room
// with the bolt, listens to the job diaries, walks the tech stack's glass tunnel, hacks the pipes that
// lift the projects shutter, pulls the cords that drop the ventures' propaganda banners; the guardian
// pair walks behind the band marquees; he fights on the theatre stage for the Muay Thai record.

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const labels = useLabels()

  return (
    <div className="space-y-20">
      <FadeInScene>
        <Chamber title={labels.sections.about} depth={0}>
          <PoweredRoom>
            <BrassPanel>
              <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-[color:var(--deco-cream)]">{professionalSummary.bio}</p>
            </BrassPanel>
          </PoweredRoom>
        </Chamber>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <Chamber title={labels.sections.workExperience} depth={1}>
          <DiaryShelf jobs={sections.jobs} />
        </Chamber>
      )}

      <FadeInScene>
        <Chamber title={labels.sections.techStack} depth={2}>
          <GlassTunnel>
            <TechCloud categories={sections.techStack} />
          </GlassTunnel>
        </Chamber>
      </FadeInScene>

      <Chamber title={labels.sections.projects} depth={3}>
        <HackedShutter>
          <ResearchBoard projects={sections.projects} />
        </HackedShutter>
      </Chamber>

      <FadeInScene>
        <Chamber title={labels.sections.ventures} depth={4}>
          <PropagandaBanners companies={sections.companies} />
        </Chamber>
      </FadeInScene>
    </div>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()

  return (
    <Chamber title={labels.sections.bands} depth={0}>
      <GuardianStreet>
        <MarqueeRow bands={sections.bands} musician={sections.musician} />
      </GuardianStreet>
    </Chamber>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()
  const { martialArts } = sections

  return (
    <Chamber title={labels.sections.muayThai} depth={0}>
      <h3 className="mb-8 text-center text-xl tracking-[0.1em] text-[color:var(--deco-gold-bright)] [font-family:var(--deco-display)]">{martialArts.primary.title}</h3>
      <TheatreStage martialArts={martialArts} />
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

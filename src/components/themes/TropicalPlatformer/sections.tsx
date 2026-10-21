'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import { TechBoard, VentureBoard } from './boards'
import { CannonRun } from './cannons'
import { Board, Level } from './levelSign'
import { CartRide } from './mineCart'
import { TargetRecord } from './target'
import { VineGrove } from './vines'
import look from './jungle.module.css'

// The picked profession's sections, each a level opened by its plank sign. The short ones (about, the
// tech stack, ventures) fade in on a board; the long ones are the jungle's own machines: the barrel
// cannons for the jobs, the hanging vines and the hidden letters for the projects, the mine cart for the
// bands and the end target for the Muay Thai record.

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <div className="space-y-24">
      <Level title={titles.about}>
        <FadeInScene>
          <Board>
            <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-[color:var(--tp-parchment)]">{professionalSummary.bio}</p>
          </Board>
        </FadeInScene>
      </Level>

      {sections.jobs.length > 0 && (
        <Level title={titles.workExperience}>
          <CannonRun jobs={sections.jobs} />
        </Level>
      )}

      <Level title={titles.techStack}>
        <FadeInScene>
          <Board>
            <TechBoard categories={sections.techStack} />
          </Board>
        </FadeInScene>
      </Level>

      {sections.projects.length > 0 && (
        <Level title={titles.projects}>
          <VineGrove projects={sections.projects} />
        </Level>
      )}

      {sections.companies.length > 0 && (
        <Level title={titles.ventures}>
          <FadeInScene>
            <VentureBoard companies={sections.companies} />
          </FadeInScene>
        </Level>
      )}
    </div>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { sections: titles } = useLabels()

  return (
    <Level title={titles.bands}>
      <CartRide bands={sections.bands} musician={sections.musician} />
    </Level>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { sections: titles } = useLabels()
  const { martialArts } = sections

  return (
    <Level title={titles.muayThai}>
      <h3 className={`mb-8 text-center text-xl text-[color:var(--tp-sun-gold)] ${look.display}`}>{martialArts.primary.title}</h3>
      <TargetRecord martialArts={martialArts} />
    </Level>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

/** The closing posts level, the same after every profession. */
export function PostsLevel() {
  const { sections, cards } = useLabels()

  return (
    <Level title={sections.posts}>
      <FadeInScene>
        <Board>
          <p className="py-4 text-center text-base italic text-[color:var(--tp-parchment)]">{cards.noPosts}</p>
        </Board>
      </FadeInScene>
    </Level>
  )
}

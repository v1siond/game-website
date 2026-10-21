'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import { TechBoard, VentureBoard } from './boards'
import { BrawlRecord } from './brawl'
import { CannonRun } from './cannons'
import { VineCrossing } from './crossing'
import { ElderYard } from './elder'
import { Board, Level } from './levelSign'
import { CartProjects } from './projects'
import { RhinoCharge } from './rhino'
import { GroundSlap } from './slap'
import { VineBands } from './vines'
import look from './jungle.module.css'

// The picked profession's sections, each a level opened by its plank sign and standing in its own scene,
// and each one a different thing he does with its content: about in the old timer's yard (a barrel
// cannon fires him in, the board unfolds, the old timer grumbles), the jobs as barrel cannons he blasts
// between collecting the letters of his name, the tech stack shaken by his ground slap, a vine crossing
// into the cave, the projects as stations of a mine cart ride, the ventures rammed by the rhino, the
// bands as hanging planks he swings between, and the Muay Thai record as a bout with the walking
// crocodiles. The posts level closes every profession on a plain board.

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <div className="space-y-24">
      <Level title={titles.about} scene="jungle">
        <ElderYard>
          <Board>
            <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-[color:var(--tp-parchment)]">{professionalSummary.bio}</p>
          </Board>
        </ElderYard>
      </Level>

      {sections.jobs.length > 0 && (
        <Level title={titles.workExperience} scene="treetop">
          <CannonRun jobs={sections.jobs} />
        </Level>
      )}

      <Level title={titles.techStack} scene="jungle">
        <GroundSlap>
          <TechBoard categories={sections.techStack} />
        </GroundSlap>
      </Level>

      {sections.projects.length > 0 && (
        <>
          <VineCrossing />
          <Level title={titles.projects} scene="cave">
            <CartProjects projects={sections.projects} />
          </Level>
        </>
      )}

      {sections.companies.length > 0 && (
        <Level title={titles.ventures} scene="jungle">
          <RhinoCharge>
            <VentureBoard companies={sections.companies} />
          </RhinoCharge>
        </Level>
      )}
    </div>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { sections: titles } = useLabels()

  return (
    <Level title={titles.bands} scene="vines">
      <VineBands bands={sections.bands} musician={sections.musician} />
    </Level>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { sections: titles } = useLabels()
  const { martialArts } = sections

  return (
    <Level title={titles.muayThai} scene="jungle">
      <h3 className={`mb-8 text-center text-xl text-[color:var(--tp-sun-gold)] ${look.display} ${look.caption}`}>{martialArts.primary.title}</h3>
      <BrawlRecord martialArts={martialArts} />
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
    <Level title={sections.posts} scene="dusk">
      <FadeInScene>
        <Board>
          <p className="py-4 text-center text-base italic text-[color:var(--tp-parchment)]">{cards.noPosts}</p>
        </Board>
      </FadeInScene>
    </Level>
  )
}

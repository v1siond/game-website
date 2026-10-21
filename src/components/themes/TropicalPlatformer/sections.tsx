'use client'

import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import { Crate, Crystal, Gem, Mango, TikiMask } from './icons'
import { CratePanel } from './panels'
import { CrateStackArt, JungleSceneArt, WarpPortalArt } from './art'
import { BandCard, ExperienceCard, ProjectCard, TechCrates, VentureCard } from './cards'
import { Lane, SceneItem } from './scenes'
import world from './world.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// Each profession's sections, and only those. About, Tech Stack and Ventures fade in; Experience,
// Projects, Bands and the Muay Thai record are island runs he crosses, each entry arriving as part of
// the level (a crate bursting open, a card swinging in on a vine).

const SECTION_WRAP = 'relative z-20 px-4 py-6 sm:px-6'
const COLUMN = 'mx-auto max-w-4xl'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <>
      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className={COLUMN}>
            <CratePanel title={titles.about} titleIcon={<TikiMask size={30} />} variant="lagoon">
              <p className="text-base leading-relaxed text-white">{professionalSummary.bio}</p>
            </CratePanel>
          </div>
        </div>
      </FadeInScene>

      <JungleSceneArt />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <div className={SECTION_WRAP}>
            <div className={COLUMN}>
              <Lane profession="engineer" zone="record" />
              <CratePanel title={titles.workExperience} titleIcon={<Crate size={28} variant="flag" />} variant="temple">
                <ul className="space-y-4">
                  {sections.jobs.map((entry) => (
                    <li key={entry.id}>
                      <SceneItem kind="crate">
                        <ExperienceCard entry={entry} />
                      </SceneItem>
                    </li>
                  ))}
                </ul>
              </CratePanel>
            </div>
          </div>
        </LevelScene>
      )}

      <CrateStackArt />

      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className={COLUMN}>
            <CratePanel title={titles.techStack} titleIcon={<Crate size={28} />} variant="wood">
              <TechCrates categories={sections.techStack} />
            </CratePanel>
          </div>
        </div>
      </FadeInScene>

      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className={COLUMN}>
            <Lane profession="engineer" zone="work" />
            <CratePanel title={titles.projects} titleIcon={<Crate size={32} variant="hazard" />} variant="hazard">
              <ProjectList
                projects={sections.projects}
                className="grid gap-x-4 gap-y-10 pt-6 md:grid-cols-2"
                renderProject={(slot) => (
                  <SceneItem kind="vine">
                    <ProjectCard {...slot} />
                  </SceneItem>
                )}
              />
            </CratePanel>
          </div>
        </div>
      </LevelScene>

      <WarpPortalArt profession="engineer" />

      {sections.companies.length > 0 && (
        <FadeInScene>
          <div className={SECTION_WRAP}>
            <div className={COLUMN}>
              <CratePanel title={titles.ventures} titleIcon={<Crystal size={28} />} variant="lagoon">
                <div className="grid gap-4 md:grid-cols-3">
                  {sections.companies.map((company) => (
                    <VentureCard key={company.id} company={company} />
                  ))}
                </div>
              </CratePanel>
            </div>
          </div>
        </FadeInScene>
      )}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections
  const { sections: titles, years } = useLabels()

  return (
    <>
      <JungleSceneArt />
      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className={COLUMN}>
            <Lane profession="drummer" zone="record" />
            <CratePanel title={titles.bands} titleIcon={<Gem size={26} color="purple" />} variant="leaf">
              <p className="mb-6 text-base text-white">
                {drumsSince(musician, years)}
              </p>
              <BandList
                bands={bands}
                className="grid gap-x-4 gap-y-10 pt-6 md:grid-cols-3"
                renderBand={(slot) => (
                  <SceneItem kind="vine">
                    <BandCard {...slot} />
                  </SceneItem>
                )}
              />
              <p className="mt-6 text-sm italic text-[var(--tp-lime)]">{musician.line}</p>
            </CratePanel>
          </div>
        </div>
      </LevelScene>
      <CrateStackArt />
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const { sections: titles } = useLabels()

  return (
    <>
      <CrateStackArt />
      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className={COLUMN}>
            <Lane profession="fighter" zone="record" />
            <CratePanel title={titles.muayThai} titleIcon={<Crate size={32} variant="hazard" />} variant="hazard">
              <h3 className={`mb-6 text-xl font-black text-white ${world.display} ${world.outlined}`}>{martialArts.primary.title}</h3>
              <MuayThaiRecord
                martialArts={martialArts}
                classNames={{
                  facts: 'mb-6 grid gap-4 sm:grid-cols-2',
                  fact: 'rounded-lg border-2 border-[var(--tp-sun)] bg-[#5c1a00] p-3',
                  term: 'text-sm font-black uppercase tracking-widest text-[var(--tp-sun)]',
                  value: 'mt-1 text-sm text-white',
                  achievements: 'space-y-2',
                  achievement: 'text-sm text-white',
                }}
                renderAchievement={(achievement) => (
                  <SceneItem kind="crate">
                    <p className="flex items-start gap-2 rounded-lg border-2 border-[var(--tp-sun)] bg-[var(--tp-wood-dark)] p-2">
                      <Mango size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{achievement}</span>
                    </p>
                  </SceneItem>
                )}
              />
            </CratePanel>
          </div>
        </div>
      </LevelScene>
      <WarpPortalArt profession="fighter" />
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

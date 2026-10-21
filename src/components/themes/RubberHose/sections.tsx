'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArtBreak, CurlBanner } from './art'
import { BandRecord, CompanyPoster, ExperienceCard, TechBubbleCloud, VintagePoster } from './cards'
import { SceneItem, Strip } from './scenes'
import world from './world.module.css'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Featured
// Work, Bands and the Muay Thai record are levels he crosses, each entry arriving as part of the level.
// The art breaks between them are a film leader, a sing along line and pie eyed balls.

const LEAD = `text-center text-base ${world.ink}`

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <section aria-labelledby="hose-about">
          <CurlBanner id="hose-about">About</CurlBanner>
          <p className={`mx-auto max-w-2xl leading-relaxed ${LEAD}`}>{professionalSummary.bio}</p>
        </section>
      </FadeInScene>

      <ArtBreak kind="filmLeader" />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <section aria-labelledby="hose-work-experience">
            <CurlBanner id="hose-work-experience">Work Experience</CurlBanner>
            <ul className="mx-auto max-w-3xl space-y-8">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="bounce">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </section>
        </LevelScene>
      )}

      <ArtBreak kind="singAlong" />

      <FadeInScene>
        <section aria-labelledby="hose-tech-stack">
          <CurlBanner id="hose-tech-stack">Tech Stack</CurlBanner>
          <div className={`mx-auto max-w-3xl p-6 ${world.poster} ${world.posterWide}`}>
            <TechBubbleCloud categories={sections.techStack} />
          </div>
        </section>
      </FadeInScene>

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <section aria-labelledby="hose-featured-work">
          <CurlBanner id="hose-featured-work">Featured Work</CurlBanner>
          <ProjectList
            projects={sections.projects}
            className="grid gap-8 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="unroll">
                <VintagePoster {...slot} />
              </SceneItem>
            )}
          />
        </section>
      </LevelScene>

      <ArtBreak kind="bouncingBalls" />

      <FadeInScene>
        <section aria-labelledby="hose-ventures">
          <CurlBanner id="hose-ventures">Ventures</CurlBanner>
          <ul className="grid gap-4 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <CompanyPoster company={company} />
              </li>
            ))}
          </ul>
        </section>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtBreak kind="singAlong" />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <section aria-labelledby="hose-bands">
          <CurlBanner id="hose-bands">Bands</CurlBanner>
          <p className={`mb-6 ${LEAD}`}>
            Drums since {musician.since}, {musician.yearsPlaying} years
          </p>
          <BandList
            bands={bands}
            className="grid gap-8 md:grid-cols-3"
            renderBand={(slot) => (
              <SceneItem kind="unroll">
                <BandRecord {...slot} />
              </SceneItem>
            )}
          />
          <p className={`mt-6 italic ${LEAD} ${world.red}`}>{musician.line}</p>
        </section>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtBreak kind="bouncingBalls" />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <section aria-labelledby="hose-muay-thai">
          <CurlBanner id="hose-muay-thai">Muay Thai</CurlBanner>
          <div className={`mx-auto max-w-3xl p-6 ${world.poster} ${world.posterWide}`}>
            <h3 className={`mb-6 text-center text-xl ${world.red} ${world.lettering}`}>{martialArts.primary.title}</h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid sm:grid-cols-2 gap-4 mb-6',
                fact: `p-3 ${world.fact}`,
                term: `text-sm tracking-widest uppercase ${world.red}`,
                value: `text-sm mt-1 ${world.ink}`,
                achievements: 'space-y-4',
                achievement: `text-sm ${world.ink}`,
              }}
              renderAchievement={(achievement) => (
                <SceneItem kind="bounce">
                  <p className={`flex items-start gap-2 p-4 ${world.titleCard}`}>
                    <span className={world.red} aria-hidden="true">
                      ★
                    </span>
                    <span>{achievement}</span>
                  </p>
                </SceneItem>
              )}
            />
          </div>
        </section>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

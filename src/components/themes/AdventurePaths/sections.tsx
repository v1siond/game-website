'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { MARIO_COLORS } from './palette'
import { Coin, FireFlower, GreenPipe, MarioSilhouette, Starman, SuperMushroom } from './icons'
import { CastleVictoryScene, MushroomKingdomScene, UndergroundScene } from './art'
import { CastlePanel, QuestionBlockPanel, UndergroundPanel } from './panels'
import { MarioDivider, PipeCard, ProjectCard, MusicCard, QuestEntry, TechInventory } from './cards'

export function EngineerLevels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="About" icon={<MarioSilhouette size={24} />}>
              <p className="text-sm leading-relaxed" style={{ color: MARIO_COLORS.groundDarkest }}>
                {professionalSummary.bio}
              </p>
            </QuestionBlockPanel>
          </section>
        </div>
      </div>

      <MushroomKingdomScene />

      {sections.jobs.length > 0 && (
        <div className="relative z-20 px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <section className="mb-8">
              <UndergroundPanel title="Work Experience" icon={<Coin size={24} />}>
                <div className="space-y-4">
                  {sections.jobs.map((entry) => (
                    <QuestEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              </UndergroundPanel>
            </section>
          </div>
        </div>
      )}

      <UndergroundScene />

      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="Tech Stack" icon={<FireFlower size={28} />}>
              <TechInventory categories={sections.techStack} />
            </QuestionBlockPanel>
          </section>

          <MarioDivider />

          <section className="mb-8">
            <CastlePanel title="Projects" icon={<Starman size={28} />}>
              <ProjectList
                projects={sections.projects}
                className="grid md:grid-cols-2 gap-4"
                renderProject={(slot) => <ProjectCard {...slot} />}
              />
            </CastlePanel>
          </section>
        </div>
      </div>

      <CastleVictoryScene />

      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="Ventures" icon={<GreenPipe height={28} width={24} />}>
              <div className="grid md:grid-cols-3 gap-4">
                {sections.companies.map((company) => (
                  <PipeCard key={company.id} company={company} />
                ))}
              </div>
            </QuestionBlockPanel>
          </section>
        </div>
      </div>
    </>
  )
}

export function MusicianLevel({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <MushroomKingdomScene />
      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="Bands" icon={<Starman size={28} />}>
              <p className="text-sm mb-4" style={{ color: MARIO_COLORS.groundDarkest }}>
                Drums since {musician.since}, {musician.yearsPlaying} years
              </p>
              <BandList
                bands={bands}
                className="grid md:grid-cols-2 gap-4"
                renderBand={(slot) => <MusicCard {...slot} />}
              />
              <p className="text-sm mt-4" style={{ color: MARIO_COLORS.groundDarkest }}>
                {musician.line}
              </p>
            </QuestionBlockPanel>
          </section>
        </div>
      </div>
    </>
  )
}

export function MartialArtistLevel({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <MushroomKingdomScene />
      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <UndergroundPanel title="Muay Thai" icon={<SuperMushroom size={28} />}>
              <h3 className="text-base font-bold text-white mb-4">{martialArts.primary.title}</h3>
              <MuayThaiRecord
                martialArts={martialArts}
                classNames={{
                  facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                  fact: 'p-3 rounded border-2 border-[#5A5A9A] bg-[#3A3A8A]',
                  term: 'text-sm font-bold tracking-wider text-[#FFD700] uppercase',
                  value: 'text-sm text-white mt-1',
                  achievements: 'space-y-1',
                  achievement: 'text-sm text-[#D8D8F8] flex items-start gap-2',
                }}
                renderAchievement={(achievement) => (
                  <>
                    <span className="text-[#FFD700]" aria-hidden="true">*</span>
                    <span>{achievement}</span>
                  </>
                )}
              />
            </UndergroundPanel>
          </section>
        </div>
      </div>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerLevels,
  drummer: MusicianLevel,
  fighter: MartialArtistLevel,
}

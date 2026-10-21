'use client'

import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useCVData } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { TERMINAL_AMBER, TERMINAL_TEXT, VAULT_YELLOW } from './palette'
import { PipBoyFrame, RustedPanel, VaultTecPanel, WornDocumentPanel } from './panels'
import { NukaColaArt, VaultTecArt, WastelandArt } from './art'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechStackTerminal } from './cards'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import { Lane, SceneItem } from './scenes'

// Each profession's sections, and only those. About, Tech Stack and Ventures fade in; Experience,
// Projects, Bands and the Muay Thai record are shelter levels he crosses, each entry arriving as part of
// the level.

export const SECTION_WRAP = 'relative z-20 py-6 px-4 md:px-6'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <WornDocumentPanel title="About">
              <p className="text-base leading-relaxed font-mono" style={{ color: TERMINAL_TEXT }}>
                {professionalSummary.bio}
              </p>
            </WornDocumentPanel>
          </div>
        </div>
      </FadeInScene>

      {/* ART: VAULT-TEC */}
      <VaultTecArt />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <div className={SECTION_WRAP}>
            <div className="max-w-4xl mx-auto">
              <Lane profession="engineer" zone="record" />
              <RustedPanel title="Work Experience">
                <ul className="space-y-4 pl-2">
                  {sections.jobs.map((entry) => (
                    <li key={entry.id}>
                      <SceneItem kind="file">
                        <ExperienceCard entry={entry} />
                      </SceneItem>
                    </li>
                  ))}
                </ul>
              </RustedPanel>
            </div>
          </div>
        </LevelScene>
      )}

      {/* ART: WASTELAND */}
      <WastelandArt />

      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <PipBoyFrame title="Tech Stack">
              <TechStackTerminal categories={sections.techStack} />
            </PipBoyFrame>
          </div>
        </div>
      </FadeInScene>

      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <Lane profession="engineer" zone="work" />
            <RustedPanel title="Projects">
              <ProjectList
                projects={sections.projects}
                className="grid md:grid-cols-2 gap-4"
                renderProject={(slot) => (
                  <SceneItem kind="screen">
                    <ProjectCard {...slot} />
                  </SceneItem>
                )}
              />
            </RustedPanel>
          </div>
        </div>
      </LevelScene>

      {/* ART: NUKA-COLA */}
      <NukaColaArt />

      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <VaultTecPanel title="Ventures">
              <div className="grid md:grid-cols-3 gap-4">
                {sections.companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </VaultTecPanel>
          </div>
        </div>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <NukaColaArt />
      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <Lane profession="drummer" zone="record" />
            <RustedPanel title="Bands">
              <p className="text-base mb-4 font-mono" style={{ color: TERMINAL_TEXT }}>
                Drums since {musician.since}, {musician.yearsPlaying} years
              </p>
              <BandList
                bands={bands}
                className="grid md:grid-cols-3 gap-4"
                renderBand={(slot) => (
                  <SceneItem kind="screen">
                    <BandCard {...slot} />
                  </SceneItem>
                )}
              />
              <p className="text-sm mt-4 italic font-mono" style={{ color: TERMINAL_AMBER }}>
                {musician.line}
              </p>
            </RustedPanel>
          </div>
        </div>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <WastelandArt />
      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <Lane profession="fighter" zone="record" />
            <PipBoyFrame title="Muay Thai">
              <h3 className="text-lg font-bold uppercase tracking-wide mb-4 font-mono" style={{ color: VAULT_YELLOW }}>
                {martialArts.primary.title}
              </h3>
              <MuayThaiRecord
                martialArts={martialArts}
                classNames={{
                  facts: 'grid md:grid-cols-2 gap-3 mb-5 font-mono',
                  fact: 'p-3 border border-[#14FF00]/30 bg-[#14FF00]/5',
                  term: 'text-sm tracking-wider uppercase text-[#FFD700]',
                  value: 'text-sm mt-1 text-[#14FF00]',
                  achievements: 'space-y-2 pl-2 font-mono',
                  achievement: 'text-sm text-[#14FF00]',
                }}
                renderAchievement={(achievement) => (
                  <SceneItem kind="file">
                    <p className="flex items-start gap-2 border border-[#14FF00]/30 bg-[#0a0a08] p-2">
                      <span className="text-[#FF9900]" aria-hidden="true">
                        +
                      </span>
                      <span>{achievement}</span>
                    </p>
                  </SceneItem>
                )}
              />
            </PipBoyFrame>
          </div>
        </div>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

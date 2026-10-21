'use client'

import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useCVData } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { TERMINAL_AMBER, TERMINAL_TEXT, VAULT_YELLOW } from './palette'
import { PipBoyFrame, RustedPanel, VaultTecPanel, WornDocumentPanel } from './panels'
import { NukaColaArt, VaultTecArt, WastelandArt } from './art'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechStackTerminal } from './cards'

// Each profession's sections, and only those.

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

export const SECTION_WRAP = 'relative z-20 py-6 px-4 md:px-6'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <div className={SECTION_WRAP}>
        <div className="max-w-4xl mx-auto">
          <WornDocumentPanel title="About">
            <p className="text-base leading-relaxed font-mono" style={{ color: TERMINAL_TEXT }}>
              {professionalSummary.bio}
            </p>
          </WornDocumentPanel>
        </div>
      </div>

      {/* ART: VAULT-TEC */}
      <VaultTecArt />

      {sections.jobs.length > 0 && (
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <RustedPanel title="Work Experience">
              <div className="space-y-4">
                {sections.jobs.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </RustedPanel>
          </div>
        </div>
      )}

      {/* ART: WASTELAND */}
      <WastelandArt />

      <div className={SECTION_WRAP}>
        <div className="max-w-4xl mx-auto">
          <PipBoyFrame title="Tech Stack">
            <TechStackTerminal categories={sections.techStack} />
          </PipBoyFrame>
        </div>
      </div>

      <div className={SECTION_WRAP}>
        <div className="max-w-4xl mx-auto">
          <RustedPanel title="Projects">
            <ProjectList
              projects={sections.projects}
              className="grid md:grid-cols-2 gap-4"
              renderProject={(slot) => <ProjectCard {...slot} />}
            />
          </RustedPanel>
        </div>
      </div>

      {/* ART: NUKA-COLA */}
      <NukaColaArt />

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
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <NukaColaArt />
      <div className={SECTION_WRAP}>
        <div className="max-w-4xl mx-auto">
          <RustedPanel title="Bands">
            <p className="text-base mb-4 font-mono" style={{ color: TERMINAL_TEXT }}>
              Drums since {musician.since}, {musician.yearsPlaying} years
            </p>
            <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandCard {...slot} />} />
            <p className="text-sm mt-4 italic font-mono" style={{ color: TERMINAL_AMBER }}>
              {musician.line}
            </p>
          </RustedPanel>
        </div>
      </div>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <WastelandArt />
      <div className={SECTION_WRAP}>
        <div className="max-w-4xl mx-auto">
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
                achievements: 'space-y-2 font-mono',
                achievement: 'text-sm flex items-start gap-2 text-[#14FF00]',
              }}
              renderAchievement={(achievement) => (
                <>
                  <span className="text-[#FF9900]" aria-hidden="true">+</span>
                  <span>{achievement}</span>
                </>
              )}
            />
          </PipBoyFrame>
        </div>
      </div>
    </>
  )
}

export function ProfessionDetails({ sections }: { sections: ProfessionSections }) {
  if (sections.profession === 'drummer') return <MusicianSections sections={sections} />
  if (sections.profession === 'fighter') return <MartialArtistSections sections={sections} />
  return <EngineerSections sections={sections} />
}

'use client'

import { useState } from 'react'
import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { RE, TEXTURES } from './palette'
import { ArtSectionHerbs, ArtSectionTypewriter, ArtSectionZombies } from './art'
import { BandCard, CompanyCard, ExperienceCard, ProjectFile, TechCloud } from './cards'
import { PANEL_HEADING, PaperPanel } from './panels'

function EngineerFiles({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const [openFiles, setOpenFiles] = useState<ReadonlySet<string>>(new Set())

  const toggleFile = (id: string) =>
    setOpenFiles((open) => {
      const next = new Set(open)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <>
      {/* 2. About Section - worn paper style with horror textures */}
      <PaperPanel label="About" texture={TEXTURES.wornPaper}>
        {/* Subtle blood corner stain */}
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-30 pointer-events-none"
          style={{ backgroundImage: TEXTURES.bloodStain }}
          aria-hidden="true"
        />
        <h2 className={PANEL_HEADING}>About</h2>
        <p className="text-sm leading-relaxed" style={{ color: RE.cream }}>
          {professionalSummary.bio}
        </p>
      </PaperPanel>

      {/* 3. ART SECTION - Zombie silhouettes with typewriter */}
      <ArtSectionZombies />

      {/* 4. Work Experience Section - scratched file folder */}
      {sections.jobs.length > 0 && (
        <PaperPanel label="Work Experience" texture={`${TEXTURES.scratches}, ${TEXTURES.wornPaper}`}>
          {/* Folder tab */}
          <div
            className="absolute -top-2 left-6 px-4 py-1 text-sm tracking-wider uppercase"
            style={{ background: RE.midBrown, color: RE.cream, borderRadius: '4px 4px 0 0' }}
            aria-hidden="true"
          >
            Personnel File
          </div>
          <h2 className={`${PANEL_HEADING} mt-2`}>Work Experience</h2>
          <div className="space-y-4">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </PaperPanel>
      )}

      {/* 5. ART SECTION - Blood splatter with typewriter */}
      <ArtSectionTypewriter />

      {/* 6. Tech Stack - inventory manifest with blood stains */}
      <PaperPanel label="Tech Stack" texture={`${TEXTURES.bloodStain}, ${TEXTURES.wornPaper}`}>
        {/* Claw marks across corner */}
        <div
          className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none"
          style={{ backgroundImage: TEXTURES.scratches, backgroundSize: '100% 100%' }}
          aria-hidden="true"
        />
        <h2 className={`${PANEL_HEADING} flex items-center gap-2`}>
          Tech Stack
          <span className="text-sm" style={{ color: RE.candlelight }}>
            [{sections.techStack.flatMap((category) => category.items).length} ITEMS]
          </span>
        </h2>
        <TechCloud categories={sections.techStack} />
      </PaperPanel>

      {/* 7. Projects - blood-stained research notes */}
      <PaperPanel label="Projects" texture={`${TEXTURES.scratches}, ${TEXTURES.wornPaper}`}>
        {/* Blood fingerprint smear */}
        <div
          className="absolute top-4 right-4 w-16 h-20 opacity-25 pointer-events-none"
          style={{ backgroundImage: TEXTURES.bloodStain, backgroundSize: '100% 100%' }}
          aria-hidden="true"
        />
        <h2 className={`${PANEL_HEADING} flex items-center gap-2`}>
          <span style={{ color: RE.rust }} aria-hidden="true">[CLASSIFIED]</span> Featured Work
        </h2>
        <ProjectList
          projects={sections.projects}
          className="space-y-2"
          renderProject={(slot) => (
            <ProjectFile slot={slot} isOpen={openFiles.has(slot.project.id)} onToggle={() => toggleFile(slot.project.id)} />
          )}
        />
      </PaperPanel>

      {/* 8. ART SECTION - Herb garden scene */}
      <ArtSectionHerbs />

      {/* 9. Ventures */}
      <PaperPanel label="Ventures" texture={TEXTURES.wornPaper}>
        {/* Stamp mark */}
        <div
          className="absolute top-3 right-3 text-sm px-2 py-1 rotate-[-8deg] opacity-60"
          style={{ border: `2px solid ${RE.rust}`, color: RE.rust }}
          aria-hidden="true"
        >
          APPROVED
        </div>
        <h2 className={PANEL_HEADING}>Ventures</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </PaperPanel>
    </>
  )
}

function MusicianFiles({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSectionZombies />

      <PaperPanel label="Bands" texture={`${TEXTURES.bloodStain}, ${TEXTURES.wornPaper}`}>
        {/* Musical note decoration */}
        <div className="absolute top-2 right-4 text-2xl opacity-20 pointer-events-none" style={{ color: RE.midBrown }} aria-hidden="true">
          ♪ ♫ ♩
        </div>
        <h2 className={PANEL_HEADING}>Bands</h2>
        <p className="text-sm mb-4" style={{ color: RE.cream }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandCard {...slot} />} />
        <p className="text-sm mt-4 italic" style={{ color: RE.cream }}>▸ {musician.line}</p>
      </PaperPanel>

      <ArtSectionHerbs />
    </>
  )
}

function MartialArtistFiles({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSectionTypewriter />

      <PaperPanel label="Muay Thai" texture={`${TEXTURES.scratches}, ${TEXTURES.wornPaper}`}>
        <h2 className={PANEL_HEADING}>Muay Thai</h2>
        <h3 className="text-base tracking-wider mb-4" style={{ color: RE.candlelight }}>{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-4',
            fact: 'p-3 bg-[#2a2018] border border-[#5c4a38]',
            term: 'text-sm tracking-wider uppercase text-[#c49050]',
            value: 'text-sm mt-1 text-[#d8c8a8]',
            achievements: 'space-y-1',
            achievement: 'text-sm flex items-start gap-2 text-[#d8c8a8]',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#c49050]" aria-hidden="true">▸</span>
              {achievement}
            </>
          )}
        />
      </PaperPanel>

      <ArtSectionHerbs />
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerFiles,
  drummer: MusicianFiles,
  fighter: MartialArtistFiles,
}

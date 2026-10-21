'use client'

import type { ReactNode } from 'react'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { PROFESSION_LABELS, type Profession } from '@/lib/cv/professions'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { useCVData } from '@/components/cv/CVDataProvider'
import { CompanyCard, BandCard, CyberPanel, ExperienceCard, ProjectCard, TechCategory } from './cards'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import { LevelStrip, SceneItem, TravelScene } from './scenes'

// The cyberware slot each profession's selector option shows.
export const PROFESSION_CYBERWARE: Record<Profession, 'chip' | 'jack' | 'arm'> = {
  drummer: 'jack',
  engineer: 'chip',
  fighter: 'arm',
}

// The selector's state line reads the profession the way the terminal would type it.
export const terminalName = (profession: Profession): string => PROFESSION_LABELS[profession].toUpperCase().replace(/\s+/g, '_')

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

// About, Tech Stack and Ventures fade in; the work sections are levels he crosses.
function FadeIn({ children }: { children: ReactNode }) {
  return <ScrollScene className="mb-8">{children}</ScrollScene>
}

export function EngineerPanels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary, companies } = useCVData()

  return (
    <>
      <FadeIn>
        <CyberPanel title="About" accent="yellow">
          <p className="text-sm text-white/80 leading-relaxed font-mono">{professionalSummary.bio}</p>
        </CyberPanel>
      </FadeIn>

      {sections.jobs.length > 0 && (
        <TravelScene>
          <LevelStrip profession="engineer" zone="record" />
          <CyberPanel title="Work Experience" accent="green">
            <ul className="space-y-4">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="terminal">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </CyberPanel>
        </TravelScene>
      )}

      <FadeIn>
        <CyberPanel title="Tech Stack" accent="cyan" megacorpStyle>
          {sections.techStack.map((category) => (
            <TechCategory key={category.id} category={category} />
          ))}
        </CyberPanel>
      </FadeIn>

      <TravelScene>
        <LevelStrip profession="engineer" zone="work" />
        <CyberPanel title="Projects" accent="magenta">
          <ProjectList
            projects={sections.projects}
            className="grid md:grid-cols-2 gap-4"
            renderProject={(slot) => (
              <SceneItem kind="billboard">
                <ProjectCard {...slot} />
              </SceneItem>
            )}
          />
        </CyberPanel>
      </TravelScene>

      <FadeIn>
        <CyberPanel title="Ventures" accent="magenta" megacorpStyle>
          <div className="grid md:grid-cols-3 gap-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </CyberPanel>
      </FadeIn>
    </>
  )
}

export function MusicianPanels({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <TravelScene>
      <LevelStrip profession="drummer" zone="record" />
      <CyberPanel title="Bands" accent="violet">
        <p className="text-sm text-white/80 font-mono mb-4">
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-2 gap-4"
          renderBand={(slot: BandSlot) => (
            <SceneItem kind="billboard">
              <BandCard {...slot} />
            </SceneItem>
          )}
        />
        <p className="text-sm text-white/80 font-mono mt-4">
          <span className="text-pink-400" aria-hidden="true">&gt; </span>
          {musician.line}
        </p>
      </CyberPanel>
    </TravelScene>
  )
}

export function MartialArtistPanels({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <TravelScene>
      <LevelStrip profession="fighter" zone="record" />
      <CyberPanel title="Muay Thai" accent="red">
        <h3 className="text-base text-pink-400 font-mono mb-4">{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-6',
            fact: 'p-3 border border-white/10 bg-white/5',
            term: 'text-sm tracking-wider text-cyan-400 font-mono uppercase',
            value: 'text-sm text-white/90 mt-1',
            achievements: 'space-y-3',
            achievement: 'text-sm text-yellow-300 font-mono',
          }}
          renderAchievement={(achievement) => (
            <SceneItem kind="billboard">
              <p className="p-3 bg-black/60">
                <span className="text-pink-400" aria-hidden="true">&gt; </span>
                {achievement}
              </p>
            </SceneItem>
          )}
        />
      </CyberPanel>
    </TravelScene>
  )
}

export function ProfessionPanels({ sections }: { sections: ProfessionSections }) {
  if (sections.profession === 'drummer') return <MusicianPanels sections={sections} />
  if (sections.profession === 'fighter') return <MartialArtistPanels sections={sections} />
  return <EngineerPanels sections={sections} />
}

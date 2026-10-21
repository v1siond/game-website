'use client'

import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { AboutLevel } from './about'
import { CoinRoom } from './coinRoom'
import { NoteBlockLevel } from './noteBlocks'
import { LedgeLevel } from './platforms'
import { ShellLevel } from './shell'
import { StompLevel } from './stomps'
import { SwitchPalaces } from './switches'

// Each profession's sections as levels of a side view course, and only those, each with its own thing
// he does: hit the ? block (about), jump the job ledges (experience), kick the shell through the bricks
// (tech stack), stomp the big switch and go down the pipe (projects), drop into the coin room
// (ventures), bounce on the note blocks (bands), stomp the foes in a chain (Muay Thai).

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  return (
    <>
      <AboutLevel profession="engineer" />
      {sections.jobs.length > 0 && <LedgeLevel jobs={sections.jobs} profession="engineer" />}
      <ShellLevel categories={sections.techStack} profession="engineer" />
      <SwitchPalaces projects={sections.projects} profession="engineer" />
      <CoinRoom companies={sections.companies} profession="engineer" />
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  return <NoteBlockLevel bands={sections.bands} musician={sections.musician} />
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  return <StompLevel martialArts={sections.martialArts} />
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

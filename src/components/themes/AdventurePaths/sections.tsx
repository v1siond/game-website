'use client'

import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { AboutLevel } from './about'
import { CoinRoom } from './coinRoom'
import { NoteBlockLevel } from './noteBlocks'
import { LedgeLevel } from './platforms'
import { ServicesLevel } from './services'
import { ShellLevel } from './shell'
import { StompLevel } from './stomps'
import { SwitchPalaces } from './switches'

// Each section as a level of a side view course, each with its own thing he does: hit the ? block
// (about), jump the job ledges (experience), kick the shell through the bricks (tech stack), read the
// services on plain cards, stomp the big switch and go down the pipe (projects), drop into the coin room
// (ventures), bounce on the note blocks (bands), stomp the foes in a chain (Muay Thai). The shared plan
// picks which levels a profession runs and in which order.

const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    return <AboutLevel bio={slot.bio} profession="engineer" />
  },
  work: function WorkFrame({ slot }) {
    return <LedgeLevel jobs={slot.jobs} profession="engineer" />
  },
  tech: function TechFrame({ slot }) {
    return <ShellLevel categories={slot.categories} profession="engineer" />
  },
  services: function ServicesFrame({ slot }) {
    return <ServicesLevel services={slot.services} />
  },
  projects: function ProjectsFrame({ slot }) {
    return <SwitchPalaces projects={slot.projects} profession="engineer" />
  },
  ventures: function VenturesFrame({ slot }) {
    return <CoinRoom companies={slot.companies} profession="engineer" />
  },
  bands: function BandsFrame({ slot }) {
    return <NoteBlockLevel bands={slot.bands} musician={slot.musician} />
  },
  muayThai: function MuayThaiFrame({ slot }) {
    return <StompLevel martialArts={slot.martialArts} />
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)

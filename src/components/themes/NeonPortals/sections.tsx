'use client'

import { useMemo } from 'react'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { BounceBoxLevel } from './bounceBoxes'
import { CheckpointLevel } from './checkpoints'
import { CountBoxLevel } from './countBox'
import { findTotal } from './finds'
import { GemLevel } from './gems'
import { IronBoxLevel } from './ironBox'
import { MaskLevel } from './masks'
import { SphereLevel } from './spheres'
import { TechBoxLevel } from './techBoxes'

// Each section as a level of the run, its set piece chosen from the shape of its data; each set piece names
// its own era for the backdrop. The shared plan picks which levels a profession runs and in which order.

const FRAMES: SectionFrames = {
  about: function AboutFrame() {
    return <CountBoxLevel />
  },
  work: function WorkFrame({ slot }) {
    return <CheckpointLevel jobs={slot.jobs} />
  },
  tech: function TechFrame({ slot }) {
    return <TechBoxLevel categories={slot.categories} />
  },
  services: function ServicesFrame({ slot }) {
    return <IronBoxLevel services={slot.services} />
  },
  projects: function ProjectsFrame({ slot }) {
    return <SphereLevel projects={slot.projects} />
  },
  ventures: function VenturesFrame({ slot }) {
    return <GemLevel companies={slot.companies} />
  },
  bands: function BandsFrame({ slot }) {
    return <BounceBoxLevel bands={slot.bands} musician={slot.musician} />
  },
  muayThai: function MuayThaiFrame({ slot }) {
    return <MaskLevel martialArts={slot.martialArts} />
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)

/** The tally's total for the active profession, the finds its sections hold, as the find counter's group. */
export function useFindTotals(): Readonly<Record<string, number>> {
  const { sections } = useWorldView()
  const { professionalSummary } = useCVData()
  return useMemo(() => ({ [sections.profession]: findTotal(sectionPlan(sections, professionalSummary.bio)) }), [sections, professionalSummary.bio])
}

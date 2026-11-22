'use client'

import { useMemo } from 'react'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useZoneStage } from '@/hooks/useZoneStage'
import { sectionPlan, type SectionId } from '@/lib/cv/sectionPlan'
import { CheckpointLevel } from './checkpoints'
import { CountBoxLevel } from './countBox'
import { findTotal } from './finds'
import type { Era } from './palette'
import { Region } from './stage'

// Each section as a level of the run, its set piece chosen from the shape of its data, and its era in the
// backdrop chosen for what it holds. The shared plan picks which levels a profession runs and in which order.

const ERA_OF: Record<SectionId, Era> = {
  about: 'hub',
  work: 'medieval',
  tech: 'tomb',
  services: 'wall',
  projects: 'future',
  ventures: 'underwater',
  bands: 'arabian',
  muayThai: 'prehistoric',
}

function Level({ id }: { id: SectionId }) {
  const { sections } = useLabels()
  const { ref, on } = useZoneStage<Era>(ERA_OF[id])
  const titles: Record<SectionId, string> = {
    about: sections.about,
    work: sections.workExperience,
    tech: sections.techStack,
    services: sections.services,
    projects: sections.projects,
    ventures: sections.ventures,
    bands: sections.bands,
    muayThai: sections.muayThai,
  }
  return (
    <Region title={titles[id]} stageRef={ref} on={on}>
      {null}
    </Region>
  )
}

const FRAMES: SectionFrames = {
  about: function AboutFrame() {
    return <CountBoxLevel />
  },
  work: function WorkFrame({ slot }) {
    return <CheckpointLevel jobs={slot.jobs} />
  },
  tech: () => <Level id="tech" />,
  services: () => <Level id="services" />,
  projects: () => <Level id="projects" />,
  ventures: () => <Level id="ventures" />,
  bands: () => <Level id="bands" />,
  muayThai: () => <Level id="muayThai" />,
}

export const SECTION_VIEWS = sectionViews(FRAMES)

/** The tally's total for the active profession, the finds its sections hold, as the find counter's group. */
export function useFindTotals(): Readonly<Record<string, number>> {
  const { sections } = useWorldView()
  const { professionalSummary } = useCVData()
  return useMemo(() => ({ [sections.profession]: findTotal(sectionPlan(sections, professionalSummary.bio)) }), [sections, professionalSummary.bio])
}

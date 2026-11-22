'use client'

import type { ReactNode } from 'react'
import { SectionCameo } from '../shared/SectionCameo'
import type { Profession } from '@/lib/cv/professions'
import { SurvivorSprite, type DecoMotion } from './sprite'
import a from './arrivals.module.css'

// Two sections he delivers himself, each the city's own way of moving a thing:
// - Telekinesis (services): he walks in, raises the plasmid hand, and the services plaque, sunk below
//   the chamber floor, floats up in the blue field, sets down and shakes once like heavy brass.
// - Spark (bands): he walks in with the snare and plays it; the first hit's plasmid spark jumps to the dark
//   marquee row, which jolts on the hits and comes up lit.
//
// Pattern: the shared SectionCameo plays walk, the act (zap or drum) and leave once the section is in
// view; every beat ends on the figure wrapper's own animationend, the act on a hold as long as his zap or
// his drum roll. The section's reaction is one CSS keyframe that starts with the act and ends at the
// section's own resting place and look (arrivals.module.css). Timing: walk 450 ms, zap 1300 ms (the plaque
// lifts from 150 to 1050 ms of it) or drum 1600 ms (the row jolts and lights from 120 to 900 ms), leave
// 500 ms. Reduced motion: no figure, the section rests in place from the start.

type Beat = 'walk' | 'act' | 'leave'

const BEATS: readonly Beat[] = ['walk', 'act', 'leave']

interface ArrivalProps {
  children: ReactNode
  profession: Profession
  act: Extract<DecoMotion, 'zap' | 'drum'>
  /** The section's reaction, a class of arrivals.module.css. */
  reaction: string
  /** The glow the act throws over the section while it plays. */
  glow: string
  /** Where he stands on the section: at its foot for the services, at its head over the long marquee grid. */
  place: 'top-0' | 'bottom-0'
}

function Arrival({ children, profession, act, reaction, glow, place }: ArrivalProps) {
  const survivor = (beat: Beat) => <SurvivorSprite profession={profession} motion={beat === 'act' ? act : 'walk'} className="h-full w-full" />

  return (
    <SectionCameo
      beats={BEATS}
      threshold={0.3}
      stage={a.stage}
      mark={{ 'data-act': act }}
      reaction={reaction}
      place={`left-0 h-36 w-24 ${place} ${a.figure}`}
      figure={survivor}
      prop={<span className={`pointer-events-none absolute inset-0 ${glow}`} aria-hidden="true" />}
    >
      {children}
    </SectionCameo>
  )
}

/** The services plaque, lifted into place by his telekinesis. */
export function Telekinesis({ children }: { children: ReactNode }) {
  return (
    <Arrival profession="engineer" act="zap" reaction={a.lift} glow={a.field} place="bottom-0">
      {children}
    </Arrival>
  )
}

/** The band marquees, lit by the spark of his snare. */
export function SparkedMarquees({ children }: { children: ReactNode }) {
  return (
    <Arrival profession="drummer" act="drum" reaction={a.jolt} glow={a.spark} place="top-0">
      {children}
    </Arrival>
  )
}

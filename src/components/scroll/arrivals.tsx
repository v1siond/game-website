'use client'

import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { LevelStrip, SceneEntry, type LevelZone, type StageLook } from './stage'
import scene from './heroScene.module.css'

// How a world's level and its entries come onto the page, built once: a world passes only its look.
//
// - worldLane: the world's strip for one profession, its stage picked from the world's stages and him
//   placed at the start of the track.
// - arrivalItem: one entry of a world's arrival kinds, each kind its frame and its motion class, wired to
//   the shared SceneEntry.

interface LaneLook {
  stages: Record<Profession, StageLook>
  Hero: (props: { profession: Profession; className: string }) => ReactNode
  // The world's height, frame and tempo for the strip.
  className: string
  // Where he stands on the track, and any motion of his own there.
  heroAt: string
}

export function worldLane({ stages, Hero, className, heroAt }: LaneLook) {
  return function Lane({ profession, zone }: { profession: Profession; zone: LevelZone }) {
    return (
      <LevelStrip
        stage={stages[profession]}
        zone={zone}
        className={className}
        hero={
          <div className={`absolute ${heroAt}`}>
            <Hero profession={profession} className={scene.hero} />
          </div>
        }
      />
    )
  }
}

export interface Arrival {
  // The world's frame the entry arrives in, drawn behind it; null for none.
  frame: ReactNode
  // The motion class the entry itself arrives with.
  arrival: string
}

export function arrivalItem<Kind extends string>(arrivals: Record<Kind, Arrival>) {
  return function SceneItem({ kind, children }: { kind: Kind; children: ReactNode }) {
    const { frame, arrival } = arrivals[kind]

    return (
      <SceneEntry frame={frame} arrival={arrival}>
        {children}
      </SceneEntry>
    )
  }
}

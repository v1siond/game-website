'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { GoldFrame, NeonSign } from './frames'
import { DECO_COLORS as C } from './palette'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import styles from './scenes.module.css'

// Art Deco's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position moves
// the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's level, pinned inside a shared LevelScene while its section scrolls by, in a
//   brass band like the trim of a city window.
// - SceneItem: one entry arriving as part of the level, on its own progress: a job surfaces through a
//   bulkhead that opens from its centre seam, a project, band or title swings in like a hung poster.
// - ContactScene: the profession's closing corner under a deco arch whose sunburst fans open behind
//   him, then the contact panel arrives.

export function Strip({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <LevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} h-28 border-y-2 border-[#D4AF37] bg-[#05101a] sm:h-40`}
      hero={
        <div className="absolute bottom-1 left-2">
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'bulkhead' | 'poster'

function BulkheadFrame() {
  return (
    <div
      className={`pointer-events-none absolute -inset-1.5 rounded-t-2xl border-2 border-[#B8860B] ${styles.bulkhead}`}
      aria-hidden="true"
    />
  )
}

function PosterFrame() {
  return (
    <div className={`pointer-events-none absolute -inset-1 ${styles.posterFrame}`} aria-hidden="true">
      <div className="absolute inset-0 border border-[#F0C850]/70" />
      <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#F0C850]" />
    </div>
  )
}

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; body: string }> = {
  bulkhead: { Frame: BulkheadFrame, body: styles.surface },
  poster: { Frame: PosterFrame, body: styles.poster },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { Frame, body } = ITEM_LOOK[kind]

  return (
    <SceneEntry frame={<Frame />} arrival={body}>
      {children}
    </SceneEntry>
  )
}

const SUN_RAYS = Array.from({ length: 13 }, (_, i) => -90 + i * 15)

// The fan of gold rays that opens behind his closing corner.
function Sunburst() {
  return (
    <svg viewBox="0 0 200 100" className={`absolute inset-x-0 bottom-0 h-full w-full ${styles.sunburst}`} aria-hidden="true" focusable="false">
      {SUN_RAYS.map((angle, i) => (
        <line
          key={angle}
          x1={100}
          y1={100}
          x2={100 + Math.sin((angle * Math.PI) / 180) * 110}
          y2={100 - Math.cos((angle * Math.PI) / 180) * 110}
          stroke={i % 2 ? C.brassDark : C.gold}
          strokeWidth={i % 2 ? 2 : 4}
          opacity={0.45}
        />
      ))}
    </svg>
  )
}

const CONTACT_HEADING = headingId('deco', 'Contact')

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div
          className={`relative h-44 overflow-hidden rounded-t-[5rem] border-2 border-[#D4AF37] bg-[#05101a] ${styles.tempo}`}
          aria-hidden="true"
        >
          <Sunburst />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#2a2210]" />
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={scene.arrive}>
            <GoldFrame>
              <div className="text-center sm:text-left">
                <h2 id={CONTACT_HEADING} className="mb-4 text-lg uppercase tracking-[0.25em]">
                  <NeonSign text="Contact" flicker delay="-3s" />
                </h2>
                <p className="mb-6 text-sm text-[#e8e0d0]">{line}</p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                </div>
              </div>
            </GoldFrame>
          </div>
        )}
      />
    </ContactStage>
  )
}

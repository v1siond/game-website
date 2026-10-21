'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { GreekKey } from './art'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import { PLAQUE } from './panels'
import { MYTH } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Mythic's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position moves
// the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's level, pinned inside a shared LevelScene while its section scrolls by,
//   framed in marble like a temple's frieze.
// - SceneItem: one entry arriving as part of the level, on its own progress: a job or a record line is
//   set up as a carved stele under a Greek key cut across it, a project or a band is painted on like a
//   vase frieze after a sweep of clay.
// - ContactScene: the temple's bronze doors swing open on the profession's closing corner, then the
//   contact panel arrives.

const FRAME = 'border-[3px] border-[color:var(--myth-marble)] bg-[var(--myth-sky)]'

export function Strip({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <LevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} h-28 sm:h-40 ${FRAME}`}
      hero={
        <div className="absolute bottom-1 left-2">
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'stele' | 'frieze'

function SteleFrame() {
  return (
    <div className={`pointer-events-none absolute -top-4 left-0 w-full ${styles.keyLine}`} aria-hidden="true">
      <GreekKey className="h-3 w-full" color={MYTH.gold} />
    </div>
  )
}

function FriezeFrame() {
  return <div className={`pointer-events-none absolute -inset-2 bg-[var(--myth-terracotta)] ${styles.clayBand}`} aria-hidden="true" />
}

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; body: string }> = {
  stele: { Frame: SteleFrame, body: styles.steleIn },
  frieze: { Frame: FriezeFrame, body: styles.friezeIn },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { Frame, body } = ITEM_LOOK[kind]

  return (
    <SceneEntry frame={<Frame />} arrival={body}>
      {children}
    </SceneEntry>
  )
}

// The temple front over the corner: the pediment, and the two bronze door leaves that swing open.
function TempleDoors() {
  return (
    <>
      <div className={`absolute inset-y-0 left-0 w-1/2 border-r border-[color:var(--myth-ink)] bg-[var(--myth-gold)] ${styles.doorLeft}`} />
      <div className={`absolute inset-y-0 right-0 w-1/2 border-l border-[color:var(--myth-ink)] bg-[var(--myth-gold)] ${styles.doorRight}`} />
    </>
  )
}

const CONTACT_HEADING = headingId('mythic', 'Contact')

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div aria-hidden="true">
          <svg viewBox="0 0 160 22" preserveAspectRatio="none" className="block h-6 w-full" focusable="false">
            <path d="M0 22 L80 1 L160 22 Z" fill={MYTH.marble} />
            <path d="M18 19 L80 5 L142 19 Z" fill={MYTH.terracotta} />
          </svg>
          <div className={`relative h-44 overflow-hidden ${FRAME} ${styles.tempo}`}>
            <div className="absolute inset-x-0 bottom-0 h-2 bg-[var(--myth-marble-shade)]" />
            <Corner />
            <TempleDoors />
          </div>
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={scene.arrive}>
            <div className={`relative px-6 pb-6 pt-10 ${world.slab}`}>
              <h2 id={CONTACT_HEADING} className={`absolute -top-5 left-6 ${PLAQUE}`}>
                Contact
              </h2>
              <p className="mb-6 text-base text-[color:var(--myth-ink)]">{line}</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
              </div>
            </div>
          </div>
        )}
      />
    </ContactStage>
  )
}

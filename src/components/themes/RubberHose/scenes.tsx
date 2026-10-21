'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { IrisRing } from './art'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import world from './world.module.css'
import styles from './scenes.module.css'

// Rubber Hose's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's level, pinned inside a shared LevelScene while its section scrolls by, in
//   the rounded ink frame of an old cartoon, opening on an iris in, him bouncing on every footfall.
// - SceneItem: one entry arriving as part of the level, on its own progress: a job or a record line
//   drops in as a title card and bounces to a stop over its shadow, a project or a band unrolls from
//   its paste board like a show poster.
// - ContactScene: the profession's closing corner closing on an iris out, then the contact panel arrives.

export function Strip({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <LevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} ${styles.frame} h-28 sm:h-40`}
      hero={
        <div className={`absolute bottom-1 left-2 ${styles.bob}`}>
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'bounce' | 'unroll'

function LandShadow() {
  return <div className={`pointer-events-none absolute inset-x-6 -bottom-2 h-3 rounded-full bg-[var(--hose-ink)] ${styles.landShadow}`} aria-hidden="true" />
}

function PasteBoard() {
  return <div className={`pointer-events-none absolute inset-x-2 -top-2 z-10 h-3 rounded-full bg-[var(--hose-ink)] ${styles.roller}`} aria-hidden="true" />
}

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; body: string }> = {
  bounce: { Frame: LandShadow, body: styles.bounceIn },
  unroll: { Frame: PasteBoard, body: styles.unroll },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { Frame, body } = ITEM_LOOK[kind]

  return (
    <SceneEntry frame={<Frame />} arrival={body}>
      {children}
    </SceneEntry>
  )
}

const CONTACT_HEADING = headingId('hose', 'Contact')

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div className={`relative h-44 overflow-hidden ${styles.frame} ${styles.tempo}`} aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[var(--hose-ink-soft)]" />
          <Corner />
          <IrisRing className={styles.irisOut} />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={scene.arrive}>
            <div className={`relative p-6 text-center sm:text-left ${world.titleCard}`}>
              <h2 id={CONTACT_HEADING} className={`mb-3 text-2xl uppercase ${world.lettering} ${world.dropText}`}>
                Contact
              </h2>
              <p className={`mb-6 text-base ${world.ink}`}>{line}</p>
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

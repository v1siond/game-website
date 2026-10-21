'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { ImpactBurst, SpeedLines } from './backdrop'
import { CEL } from './palette'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import world from './world.module.css'
import styles from './scenes.module.css'

// Cell Shaded's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's level, pinned inside a shared LevelScene while its section scrolls by, in a
//   thick ink frame like a wide comic panel.
// - SceneItem: one entry arriving as part of the level, on its own progress: a job or a record line
//   slams in as a new panel, a project or a band swipes in from the right trailing speed lines.
// - ContactScene: the profession's closing corner, an impact burst blowing open behind him, then the
//   contact panel arrives.

export function Strip({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <LevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} h-28 border-[5px] border-[#141414] bg-[#3fc4e8] sm:h-40 ${world.drop}`}
      hero={
        <div className="absolute bottom-1 left-2">
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'slam' | 'swipe'

function SlamFrame() {
  return <div className={`pointer-events-none absolute inset-0 bg-[#141414] ${styles.slamFrame}`} aria-hidden="true" />
}

function SwipeFrame() {
  return <SpeedLines className={`pointer-events-none absolute -left-6 top-1/4 h-1/2 w-12 ${styles.swipeLines}`} color={CEL.ink} />
}

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; body: string }> = {
  slam: { Frame: SlamFrame, body: styles.slam },
  swipe: { Frame: SwipeFrame, body: styles.swipe },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { Frame, body } = ITEM_LOOK[kind]

  return (
    <SceneEntry frame={<Frame />} arrival={body}>
      {children}
    </SceneEntry>
  )
}

const CONTACT_HEADING = headingId('cel', 'Contact')

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div className={`relative h-44 overflow-hidden border-[5px] border-[#141414] bg-[#3fc4e8] ${world.drop} ${styles.tempo}`} aria-hidden="true">
          <div className={`absolute -left-8 -top-10 h-64 w-64 ${styles.burstOpen}`}>
            <ImpactBurst fill={CEL.sun} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#2b2b33]" />
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={scene.arrive}>
            <div className={`relative p-6 ${world.panel}`}>
              <h2 id={CONTACT_HEADING} className={`mb-3 text-3xl uppercase tracking-wider ${world.lettering}`}>
                Contact
              </h2>
              <p className={`mb-6 text-base ${world.copy}`}>{line}</p>
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

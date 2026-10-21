'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip as SharedLevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PROFESSION_STAGES } from './professions'
import { CVLink, HeroAction } from './actions'
import styles from './scenes.module.css'

// Neon Cyber's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position moves
// the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - LevelStrip: the level pinned inside a shared LevelScene; he crosses it from the moment the section
//   enters to just before it leaves.
// - SceneItem: one entry arriving as part of the level, a terminal that boots or a billboard that lights.
// - ContactScene: the profession's closing corner, then the contact panel powers on.

export function LevelStrip({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <SharedLevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} h-28 border-y border-pink-500/60 bg-[#0a0512] sm:h-40`}
      hero={
        <div className="absolute bottom-1 left-2">
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'terminal' | 'billboard'

const ITEM_LOOK: Record<SceneItemKind, { frame: string; body: string }> = {
  terminal: {
    frame: 'border border-cyan-400',
    body: styles.bootScreen,
  },
  billboard: {
    frame: 'border-2 border-pink-500 shadow-[0_0_14px_#ff00ff80]',
    body: styles.billboardCopy,
  },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const look = ITEM_LOOK[kind]

  return (
    <SceneEntry
      frame={<div className={`pointer-events-none absolute -inset-1 ${styles.frameOn} ${look.frame}`} aria-hidden="true" />}
      arrival={look.body}
    >
      {children}
    </SceneEntry>
  )
}

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId="neon-contact-heading"
      corner={
        <div className={`relative h-44 overflow-hidden border border-cyan-400/60 bg-[#0a0512] ${styles.tempo}`} aria-hidden="true">
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`text-center sm:text-left ${scene.arrive}`}>
            <h2 id="neon-contact-heading" className="mb-3 font-mono text-xl tracking-wider text-cyan-400">
              Contact
            </h2>
            <p className="mb-6 font-mono text-sm text-pink-400">{line}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start">
              {actions.map((action) => (
                <HeroAction key={action.id} action={action} />
              ))}
              <CVLink />
            </div>
          </div>
        )}
      />
    </ContactStage>
  )
}

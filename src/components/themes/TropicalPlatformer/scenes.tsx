'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import { COLORS } from './palette'
import styles from './scenes.module.css'
import world from './world.module.css'

// Tropical Platformer's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll
// position moves the scene once only, and reduced motion or a World Select preview shows the final frame
// at once.
//
// - Lane: the island strip pinned inside a shared LevelScene while the section scrolls by; he runs it
//   over the section's whole height.
// - SceneItem: one entry arriving as part of the level, on its own progress as it enters the screen: a
//   job or record line bursts out of a crate, a project or band swings in on a vine.
// - ContactScene: the sun comes up and the palm fronds part to the profession's corner, then the panel.

export function Lane({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <LevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} h-32 rounded-lg border-4 border-[var(--tp-wood-dark)] sm:h-44`}
      hero={
        <div className="absolute bottom-3 left-2">
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'crate' | 'vine'

const CRATE_HALF = 'absolute inset-y-0 w-1/2 border-4 border-[var(--tp-wood-light)] bg-[var(--tp-wood)]'

function CrateHalves() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <div className={`${CRATE_HALF} left-0 rounded-l-lg ${world.planks} ${styles.crateLeft}`} />
      <div className={`${CRATE_HALF} right-0 rounded-r-lg ${world.planks} ${styles.crateRight}`} />
    </div>
  )
}

function Vine() {
  return <div className={`pointer-events-none absolute -top-6 left-1/2 h-6 w-1.5 rounded bg-[var(--tp-leaf-light)] ${styles.vine}`} aria-hidden="true" />
}

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; arrival: string }> = {
  crate: { Frame: CrateHalves, arrival: styles.popUp },
  vine: { Frame: Vine, arrival: styles.swingIn },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { Frame, arrival } = ITEM_LOOK[kind]

  return (
    <SceneEntry frame={<Frame />} arrival={arrival}>
      {children}
    </SceneEntry>
  )
}

// A broad palm frond hanging over his corner from the stalk at its top corner; `flip` mirrors it to the
// right side.
function Frond({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 120"
      preserveAspectRatio="none"
      className={`absolute top-0 h-full w-[60%] ${flip ? 'right-0 -scale-x-100' : 'left-0'}`}
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.frond}>
        <path d="M0 0 Q70 10 100 120 Q40 90 0 70 Z" fill={COLORS.leaf} />
        <path d="M0 0 Q60 30 92 112" stroke={COLORS.leafDark} strokeWidth={3} fill="none" />
        <path d="M14 10 L6 40 M30 20 L18 56 M46 36 L34 74 M62 56 L52 92" stroke={COLORS.leafLight} strokeWidth={2} />
      </g>
    </svg>
  )
}

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId="tropical-contact-heading"
      corner={
        <div
          className={`relative h-44 overflow-hidden rounded-lg border-4 border-[var(--tp-wood-dark)] bg-[var(--tp-lagoon)] ${styles.tempo}`}
          aria-hidden="true"
        >
          <div className={`absolute left-1/2 top-6 h-16 w-16 -translate-x-1/2 ${styles.sunrise}`}>
            <div className="h-full w-full rounded-full bg-[var(--tp-sun)]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-3 bg-[var(--tp-sand)]" />
          <Corner />
          <Frond />
          <Frond flip />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`text-center sm:text-left ${scene.arrive}`}>
            <h2 id="tropical-contact-heading" className={`mb-2 text-2xl font-black uppercase tracking-wider text-white ${world.display} ${world.outlined}`}>
              Contact
            </h2>
            <p className={`mb-6 text-lg text-white ${world.outlined}`}>{line}</p>
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

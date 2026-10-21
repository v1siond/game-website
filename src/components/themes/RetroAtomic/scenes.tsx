'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import { CHROME, STEEL_EDGE, STEEL_LIGHT, VAULT_BLUE_DARK, VAULT_YELLOW } from './palette'
import styles from './scenes.module.css'

// Retro Atomic's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position
// moves the scene once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Lane: the shelter strip pinned inside a shared LevelScene while the section scrolls by; he crosses
//   its three rooms over the section's whole height.
// - SceneItem: one entry arriving as part of the level, on its own progress as it enters the screen: a
//   job or record line feeds out of a terminal slot, a project or band powers on like a tube screen.
// - ContactScene: the round hatch turns and rolls aside to the profession's corner, then the panel.

export function Lane({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <LevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} h-32 border-y-2 border-[#5a5e50] bg-[#1a1a16] sm:h-44`}
      hero={
        <div className="absolute bottom-3 left-2">
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'file' | 'screen'

function TerminalSlot() {
  return <div className={`pointer-events-none absolute -left-2 inset-y-0 w-1 bg-[#14FF00] ${styles.slot}`} aria-hidden="true" />
}

function Phosphor() {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 border-2 border-[#14FF00] bg-[#14FF00]/20 ${styles.phosphor}`}
      aria-hidden="true"
    />
  )
}

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; arrival: string }> = {
  file: { Frame: TerminalSlot, arrival: styles.fileOut },
  screen: { Frame: Phosphor, arrival: styles.screenIn },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { Frame, arrival } = ITEM_LOOK[kind]

  return (
    <SceneEntry frame={<Frame />} arrival={arrival}>
      {children}
    </SceneEntry>
  )
}

// The round shelter hatch over his corner: the cog wheel turns, then the whole door rolls aside.
const COG_TEETH = Array.from({ length: 10 }, (_, i) => i * 36)

function RoundHatch() {
  return (
    <div className={`absolute inset-0 bg-[#23261f] ${styles.vaultDoor}`}>
      <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2" focusable="false">
        <g className={styles.cog}>
          {COG_TEETH.map((angle) => (
            <rect key={angle} x={45} y={0} width={10} height={12} fill={STEEL_EDGE} transform={`rotate(${angle} 50 50)`} />
          ))}
          <circle cx={50} cy={50} r={42} fill={VAULT_BLUE_DARK} stroke={STEEL_LIGHT} strokeWidth={3} />
          <circle cx={50} cy={50} r={30} fill="none" stroke={VAULT_YELLOW} strokeWidth={2} />
          <path d="M50 22 V78 M22 50 H78" stroke={CHROME} strokeWidth={3} />
          <circle cx={50} cy={50} r={7} fill={CHROME} />
        </g>
      </svg>
    </div>
  )
}

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId="atomic-contact-heading"
      corner={
        <div className={`relative h-44 overflow-hidden border-2 border-[#5a5e50] bg-[#1a1a16] ${styles.tempo}`} aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#3d4136]" />
          <Corner />
          <RoundHatch />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`text-center font-mono sm:text-left ${scene.arrive}`}>
            <h2 id="atomic-contact-heading" className="mb-2 text-lg font-bold uppercase tracking-widest text-[#FFD700]">
              Contact
            </h2>
            <p className="mb-6 text-sm text-[#14FF00]">{line}</p>
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

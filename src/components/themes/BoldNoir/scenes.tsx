'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ContactStage, LevelStrip, SceneEntry, type LevelZone } from '@/components/scroll/stage'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { RainStreaks } from './backdrop'
import { PROFESSION_STAGES } from './stages'
import { CVLink, HeroAction } from './actions'
import { CAPTION } from './panels'
import world from './world.module.css'
import styles from './scenes.module.css'

// Bold Noir's scroll scenes on the shared stage (src/components/scroll/stage.tsx): scroll position moves
// the scene, once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - Strip: the profession's level, pinned inside a shared LevelScene while its section scrolls by,
//   framed in the paper gutter line of a wide graphic novel panel.
// - SceneItem: one entry arriving as part of the level, on its own progress: a job or a record line is
//   cut in as a new panel behind a red gutter line, a project or a band drops in like a photograph
//   from the case file under a camera flash.
// - ContactScene: the profession's closing corner behind a window whose blinds tilt open and let the
//   light in, then the contact panel arrives.

export function Strip({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  return (
    <LevelStrip
      stage={PROFESSION_STAGES[profession]}
      zone={zone}
      className={`${styles.tempo} h-28 border-[3px] border-[#f2efe6] bg-[#161616] sm:h-40`}
      hero={
        <div className="absolute bottom-1 left-2">
          <HeroCharacter profession={profession} className={scene.hero} />
        </div>
      }
    />
  )
}

export type SceneItemKind = 'panel' | 'photo'

function PanelFrame() {
  return <div className={`pointer-events-none absolute -top-2 left-0 h-1 w-full bg-[#ff0033] ${styles.panelLine}`} aria-hidden="true" />
}

function PhotoFrame() {
  return <div className={`pointer-events-none absolute -inset-2 bg-[#f2efe6] ${styles.flash}`} aria-hidden="true" />
}

const ITEM_LOOK: Record<SceneItemKind, { Frame: () => ReactNode; body: string }> = {
  panel: { Frame: PanelFrame, body: styles.panelIn },
  photo: { Frame: PhotoFrame, body: styles.photoIn },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { Frame, body } = ITEM_LOOK[kind]

  return (
    <SceneEntry frame={<Frame />} arrival={body}>
      {children}
    </SceneEntry>
  )
}

// The window's slats in the corner's 160 by 100 box, the light between them tilting open.
const SLATS = [8, 22, 36, 50, 64, 78]

function OpeningBlinds() {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <g transform="skewY(-12) translate(0 20)">
        {SLATS.map((y) => (
          <rect key={y} x={-10} y={y} width={180} height={9} fill="#f2efe6" fillOpacity={0.14} className={styles.slat} />
        ))}
      </g>
    </svg>
  )
}

const CONTACT_HEADING = headingId('noir', 'Contact')

export function ContactScene({ profession }: { profession: Profession }) {
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <ContactStage
      headingId={CONTACT_HEADING}
      corner={
        <div className={`relative h-44 overflow-hidden border-[3px] border-[#f2efe6] bg-[#161616] ${styles.tempo}`} aria-hidden="true">
          <OpeningBlinds />
          <RainStreaks className="absolute inset-0 h-full w-full opacity-60" />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#2a2a2a]" />
          <Corner />
        </div>
      }
    >
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={scene.arrive}>
            <div className={`relative px-6 pb-6 pt-10 ${world.panel}`}>
              <h2 id={CONTACT_HEADING} className={`absolute -top-5 left-6 ${CAPTION}`}>
                Contact
              </h2>
              <p className={`mb-6 text-base text-[#d6d3cb] ${world.copy}`}>{line}</p>
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
